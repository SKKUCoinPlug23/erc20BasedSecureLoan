//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../libraries/openzeppelin-upgradeability/VersionedInitializable.sol";

import "../configuration/LendingBoardAddressesProvider.sol";
import "../configuration/LendingBoardParametersProvider.sol";
import "../tokenization/AToken.sol";
import "../libraries/CoreLibrary.sol";
import "../libraries/WadRayMath.sol";
import "../interfaces/IFeeProvider.sol";
import "./LendingBoardCore.sol";
import "./LendingBoardDataProvider.sol";
import "../interfaces/IPriceOracleGetter.sol";

// WIP 
import "../libraries/EthAddressLib.sol";

/**
* @title LendingPoolLiquidationManager contract
* @author Aave
* @notice Implements the liquidation function.
**/
contract LendingBoardLiquidationManager is ReentrancyGuard, VersionedInitializable {
    using SafeMath for uint256;
    using WadRayMath for uint256;
    using Address for address;

    LendingBoardAddressesProvider public addressesProvider;
    LendingBoardCore core;
    LendingBoardDataProvider dataProvider;
    LendingBoardParametersProvider parametersProvider;
    IFeeProvider feeProvider;
    address ethereumAddress;

    uint256 constant LIQUIDATION_CLOSE_FACTOR_PERCENT = 50;

    /**
    * @dev emitted when a borrow fee is liquidated
    * @param _collateral the address of the collateral being liquidated
    * @param _reserve the address of the reserve
    * @param _user the address of the user being liquidated
    * @param _feeLiquidated the total fee liquidated
    * @param _liquidatedCollateralForFee the amount of collateral received by the protocol in exchange for the fee
    * @param _timestamp the timestamp of the action
    **/
    event OriginationFeeLiquidated(
        address indexed _collateral,
        address indexed _reserve,
        address indexed _user,
        uint256 _feeLiquidated,
        uint256 _liquidatedCollateralForFee,
        uint256 _timestamp
    );

    /**
    * @dev emitted when a borrower is liquidated
    * @param _collateral the address of the collateral being liquidated
    * @param _reserve the address of the reserve
    * @param _user the address of the user being liquidated
    * @param _purchaseAmount the total amount liquidated
    * @param _liquidatedCollateralAmount the amount of collateral being liquidated
    * @param _accruedBorrowInterest the amount of interest accrued by the borrower since the last action
    * @param _liquidator the address of the liquidator
    * @param _receiveAToken true if the liquidator wants to receive aTokens, false otherwise
    * @param _timestamp the timestamp of the action
    **/
    event LiquidationCall(
        address indexed _collateral,
        address indexed _reserve,
        address indexed _user,
        uint256 _purchaseAmount,
        uint256 _liquidatedCollateralAmount,
        uint256 _accruedBorrowInterest,
        address _liquidator,
        bool _receiveAToken,
        uint256 _timestamp
    );

    enum LiquidationErrors {
        NO_ERROR,
        NO_COLLATERAL_AVAILABLE,
        COLLATERAL_CANNOT_BE_LIQUIDATED,
        CURRRENCY_NOT_BORROWED,
        HEALTH_FACTOR_ABOVE_THRESHOLD,
        NOT_ENOUGH_LIQUIDITY
    }

    struct LiquidationCallLocalVars {
        uint256 userCollateralBalance;
        uint256 userCompoundedBorrowBalance;
        uint256 borrowBalanceIncrease;
        uint256 maxPrincipalAmountToLiquidate;
        uint256 actualAmountToLiquidate;
        uint256 liquidationRatio;
        uint256 collateralPrice;
        uint256 principalCurrencyPrice;
        uint256 maxAmountCollateralToLiquidate;
        uint256 originationFee;
        uint256 feeLiquidated;
        uint256 liquidatedCollateralForFee;
        CoreLibrary.InterestRateMode borrowRateMode;
        uint256 userStableRate;
        bool isCollateralEnabled;
        bool healthFactorBelowThreshold;
    }


    // Originally No Initialize() function was implemented,,, WHy??
    // function initialize(LendingBoardAddressesProvider _addressesProvider) public initializer {
    //     addressesProvider = _addressesProvider;
    //     core = LendingBoardCore(addressesProvider.getLendingBoardCore());
    //     dataProvider = LendingBoardDataProvider(addressesProvider.getLendingBoardDataProvider());
    //     parametersProvider = LendingBoardParametersProvider(
    //         addressesProvider.getLendingBoardParametersProvider()
    //     );
    //     feeProvider = IFeeProvider(addressesProvider.getFeeProvider());
    //     ethereumAddress = EthAddressLib.ethAddress();
    // }

    /**
    * @dev as the contract extends the VersionedInitializable contract to match the state
    * of the LendingPool contract, the getRevision() function is needed.
    */
    function getRevision() override internal pure returns (uint256) {
        return 0;
    }

    /**
    * @dev users can invoke this function to liquidate an undercollateralized position.
    * @param _reserve the address of the collateral to liquidated
    * @param _reserve the address of the principal reserve
    * @param _user the address of the borrower
    * @param _purchaseAmount the amount of principal that the liquidator wants to repay
    * @param _receiveAToken true if the liquidators wants to receive the aTokens, false if
    * he wants to receive the underlying asset directly
    **/
    function liquidationCall(
        address _collateral,
        address _reserve,
        address _user,
        uint256 _purchaseAmount,
        bool _receiveAToken
    ) external payable returns (uint256, string memory) {
        // Usage of a memory struct of vars to avoid "Stack too deep" errors due to local variables
        LiquidationCallLocalVars memory vars;

        (, , , , , , , vars.healthFactorBelowThreshold) = dataProvider.calculateUserGlobalData(
            _user
        );

        if (!vars.healthFactorBelowThreshold) {
            return (
                uint256(LiquidationErrors.HEALTH_FACTOR_ABOVE_THRESHOLD),
                "Health factor is not below the threshold"
            );
        }

        vars.userCollateralBalance = core.getUserUnderlyingAssetBalance(_collateral, _user);

        //if _user hasn't deposited this specific collateral, nothing can be liquidated
        if (vars.userCollateralBalance == 0) {
            return (
                uint256(LiquidationErrors.NO_COLLATERAL_AVAILABLE),
                "Invalid collateral to liquidate"
            );
        }

        vars.isCollateralEnabled =
            core.isReserveUsageAsCollateralEnabled(_collateral) &&
            core.isUserUseReserveAsCollateralEnabled(_collateral, _user);

        //if _collateral isn't enabled as collateral by _user, it cannot be liquidated
        if (!vars.isCollateralEnabled) {
            return (
                uint256(LiquidationErrors.COLLATERAL_CANNOT_BE_LIQUIDATED),
                "The collateral chosen cannot be liquidated"
            );
        }

        //if the user hasn't borrowed the specific currency defined by _reserve, it cannot be liquidated
        (, vars.userCompoundedBorrowBalance, vars.borrowBalanceIncrease) = core
            .getUserBorrowBalances(_reserve, _user);

        if (vars.userCompoundedBorrowBalance == 0) {
            return (
                uint256(LiquidationErrors.CURRRENCY_NOT_BORROWED),
                "User did not borrow the specified currency"
            );
        }

        //all clear - calculate the max principal amount that can be liquidated
        vars.maxPrincipalAmountToLiquidate = vars
            .userCompoundedBorrowBalance
            .mul(LIQUIDATION_CLOSE_FACTOR_PERCENT)
            .div(100);

        vars.actualAmountToLiquidate = _purchaseAmount > vars.maxPrincipalAmountToLiquidate
            ? vars.maxPrincipalAmountToLiquidate
            : _purchaseAmount;

        (uint256 maxCollateralToLiquidate, uint256 principalAmountNeeded) = calculateAvailableCollateralToLiquidate(
            _collateral,
            _reserve,
            vars.actualAmountToLiquidate,
            vars.userCollateralBalance
        );

        vars.originationFee = core.getUserOriginationFee(_reserve, _user);

        //if there is a fee to liquidate, calculate the maximum amount of fee that can be liquidated
        if (vars.originationFee > 0) {
            (
                vars.liquidatedCollateralForFee,
                vars.feeLiquidated
            ) = calculateAvailableCollateralToLiquidate(
                _collateral,
                _reserve,
                vars.originationFee,
                vars.userCollateralBalance.sub(maxCollateralToLiquidate)
            );
        }

        //if principalAmountNeeded < vars.ActualAmountToLiquidate, there isn't enough
        //of _collateral to cover the actual amount that is being liquidated, hence we liquidate
        //a smaller amount

        if (principalAmountNeeded < vars.actualAmountToLiquidate) {
            vars.actualAmountToLiquidate = principalAmountNeeded;
        }

        //if liquidator reclaims the underlying asset, we make sure there is enough available collateral in the reserve
        if (!_receiveAToken) {
            uint256 currentAvailableCollateral = core.getReserveAvailableLiquidity(_collateral);
            if (currentAvailableCollateral < maxCollateralToLiquidate) {
                return (
                    uint256(LiquidationErrors.NOT_ENOUGH_LIQUIDITY),
                    "There isn't enough liquidity available to liquidate"
                );
            }
        }

        core.updateStateOnLiquidation(
            _reserve,
            _collateral,
            _user,
            vars.actualAmountToLiquidate,
            maxCollateralToLiquidate,
            vars.feeLiquidated,
            vars.liquidatedCollateralForFee,
            vars.borrowBalanceIncrease,
            _receiveAToken
        );

        AToken collateralAtoken = AToken(core.getReserveATokenAddress(_collateral));

        //if liquidator reclaims the aToken, he receives the equivalent atoken amount
        if (_receiveAToken) {
            collateralAtoken.transferOnLiquidation(_user, msg.sender, maxCollateralToLiquidate);
        } else {
            //otherwise receives the underlying asset
            //burn the equivalent amount of atoken
            collateralAtoken.burnOnLiquidation(_user, maxCollateralToLiquidate);
            core.transferToUser(_collateral, payable(msg.sender), maxCollateralToLiquidate);
        }

        //transfers the principal currency to the pool
        core.transferToReserve{value: msg.value}(_reserve, payable(msg.sender), vars.actualAmountToLiquidate);
        

        if (vars.feeLiquidated > 0) {
            //if there is enough collateral to liquidate the fee, first transfer burn an equivalent amount of
            //aTokens of the user
            collateralAtoken.burnOnLiquidation(_user, vars.liquidatedCollateralForFee);

            //then liquidate the fee by transferring it to the fee collection address
            core.liquidateFee(
                _collateral,
                vars.liquidatedCollateralForFee,
                addressesProvider.getTokenDistributor()
            );

            emit OriginationFeeLiquidated(
                _collateral,
                _reserve,
                _user,
                vars.feeLiquidated,
                vars.liquidatedCollateralForFee,
                //solium-disable-next-line
                block.timestamp
            );

        }
        emit LiquidationCall(
            _collateral,
            _reserve,
            _user,
            vars.actualAmountToLiquidate,
            maxCollateralToLiquidate,
            vars.borrowBalanceIncrease,
            msg.sender,
            _receiveAToken,
            //solium-disable-next-line
            block.timestamp
        );

        return (uint256(LiquidationErrors.NO_ERROR), "No errors");
    }

    function liquidationCallProposeMode(
        uint256 _proposalId,
        bool _isBorrowProposal,
        bool _receiveAToken
    ) external payable returns (uint256, string memory){

        // console.log("\x1b[43m%s\x1b[0m", "\n   => Liquidation Manager Start");
        
        LiquidationCallLocalVars memory vars;

        (
            bool proposalActive,
            address borrower,
            ,
            address reserveToReceive,
            uint256 amount,
            address reserveForCollateral,
            uint256 collateralAmount,
            ,
            ,
            ,
            uint256 serviceFee,
            ,
            ,
            bool isRepayed
        ) = dataProvider.getProposalData(_proposalId,_isBorrowProposal);

        // console.log("\x1b[43m%s\x1b[0m", "\n   => Liquidation Manager : getProposalData done");
        
        // !----- Currently Only Borrow Proposal Liquidation is allowd, later REAL borrower로 변경 요망 -----!
        // address borrower = proposer; 

        // WIP : The proposal should be !proposalActive && !repayed 
        require(!proposalActive && !isRepayed, "The Proposal should not be Activated && not be Repayed");

        // WIP Due Date 가 지난 시점에서의 Liquidation Situation도 고려해야

        // Check for Liquidation Availability
        vars.healthFactorBelowThreshold = dataProvider.getProposalLiquidationAvailability(_proposalId, _isBorrowProposal);

        // WIP : setting healthFactorBelowThreshold to TRUE for testing 
        vars.healthFactorBelowThreshold = true;

        if(!vars.healthFactorBelowThreshold){
            return (
                uint256(LiquidationErrors.HEALTH_FACTOR_ABOVE_THRESHOLD),
                "Proposal's Health factor is not below the threshold"
            );
        }

        // console.log("\x1b[43m%s\x1b[0m", "\n   => Liquidation Manager : Health Factor Threshold Checked");

        uint256 borrowerCollateralBalance = core.getUserUnderlyingAssetBalance(reserveForCollateral,borrower);

        // console.log("\x1b[43m%s %s\x1b[0m", "\n   => Liquidation Manager : borrowerCollateralBalance ",borrowerCollateralBalance);

        if (borrowerCollateralBalance == 0) {
            return (
                uint256(LiquidationErrors.NO_COLLATERAL_AVAILABLE),
                "Invalid collateral to liquidate"
            );
        }

        // console.log("\x1b[43m%s\x1b[0m", "\n   => Liquidation Manager :   Borrower Collateral Balance Checked");
        
        bool isCollateralEnabled =
            core.isReserveUsageAsCollateralEnabled(reserveForCollateral) &&
            core.isUserUseReserveAsCollateralEnabled(reserveForCollateral, borrower);

        if (!isCollateralEnabled) {
            return (
                uint256(LiquidationErrors.COLLATERAL_CANNOT_BE_LIQUIDATED),
                "The collateral chosen cannot be liquidated"
            );
        }

        // console.log("\x1b[43m%s\x1b[0m", "\n   => Liquidation Manager :  Collateral Enabled Checked");

        // WIP : 현재 Proposal Structure의 재조정이 이뤄지지 않은 상태이기에 Borrow Proposal의 경우에만 Liquidation이 이뤄지게 끔
        require(_isBorrowProposal, "!------Currently Only Borrow Proposals are available for Liquidation-------!");

        //if the user hasn't borrowed the specific currency defined by _reserve, it cannot be liquidated
        (, vars.userCompoundedBorrowBalance, vars.borrowBalanceIncrease) = core
            .getUserBorrowBalances(reserveToReceive, borrower);

        if (vars.userCompoundedBorrowBalance == 0) {
            return (
                uint256(LiquidationErrors.CURRRENCY_NOT_BORROWED),
                "User did not borrow the specified currency"
            );
        }

        // console.log("\x1b[43m%s\x1b[0m", "\n   => Liquidation Manager : Liquidation Conditions are Met");

        // now Liquidation Conditions are met
        
        // Proposal에 담보로 설정된 금액만 liquidate이 가능하기에 actualAmountToLiquidate을 따로 계산하지 않는다.
        vars.actualAmountToLiquidate = amount; // Borrow Asset Amount
        vars.userCollateralBalance = collateralAmount;
        
        // Borrow Asset Amount은 고정, Collateral in return depends on Borrow Asset Amount
        uint256 collateralToTransfer = calculateCollateraToReturn(
            reserveForCollateral,
            reserveToReceive,
            vars.actualAmountToLiquidate
        );

        // console.log("\x1b[43m%s\x1b[0m", "\n   => Liquidation Manager : collateralToTransfer calculation done");

        // Service Fee는 대출자산을 기준으로 계산됨
        vars.originationFee = serviceFee;

        vars.liquidatedCollateralForFee = calculateCollateraToReturn(
            reserveForCollateral,
            reserveToReceive,
            vars.originationFee
        );
        vars.feeLiquidated = vars.originationFee;

        // console.log("\x1b[43m%s\x1b[0m", "\n   => Liquidation Manager : liquidatedCollateralForFee calculation done");

        //if liquidator reclaims the underlying asset, we make sure there is enough available collateral in the reserve
        if (!_receiveAToken) {
            uint256 currentAvailableCollateral = core.getReserveAvailableLiquidity(reserveForCollateral);
            if (currentAvailableCollateral < collateralToTransfer) {
                return (
                    uint256(LiquidationErrors.NOT_ENOUGH_LIQUIDITY),
                    "There isn't enough liquidity available to liquidate"
                );
            }
        }
        
        core.updateStateOnLiquidation(
            reserveToReceive,
            reserveForCollateral,
            borrower,
            vars.actualAmountToLiquidate,
            collateralToTransfer,
            vars.feeLiquidated,
            vars.liquidatedCollateralForFee,
            vars.borrowBalanceIncrease,
            _receiveAToken
        );

        // console.log("\x1b[42m%s %s\x1b[0m", "\n   => Liquidation Manager :  vars.actualAmountToLiquidate",vars.actualAmountToLiquidate);
        
        // console.log("\x1b[42m%s %s\x1b[0m", "\n   => Liquidation Manager :  collateralToTransfer",collateralToTransfer);

        // console.log("\x1b[43m%s\x1b[0m", "\n   => Liquidation Manager : updateStateOnLiquidation done");

        AToken collateralAtoken = AToken(core.getReserveATokenAddress(reserveForCollateral));

        //if liquidator reclaims the aToken, he receives the equivalent atoken amount
        // Proposal Mode collects Borrower's Collateral AToken to LBCore contract, thus on Liquidation AToken should move from LBCore address

        address coreContractAddress = address(core);

        if (_receiveAToken) {
            collateralAtoken.transferOnLiquidation(coreContractAddress, msg.sender, collateralToTransfer);
            
        } else {
            //otherwise receives the underlying asset
            //burn the equivalent amount of atoken
            collateralAtoken.burnOnLiquidation(coreContractAddress, collateralToTransfer);
            core.transferToUser(reserveForCollateral, payable(msg.sender), collateralToTransfer);
        }

        // if (_receiveAToken) {
        //     collateralAtoken.transferOnLiquidation(borrower, msg.sender, collateralToTransfer);
        // } else {
        //     //otherwise receives the underlying asset
        //     //burn the equivalent amount of atoken
        //     collateralAtoken.burnOnLiquidation(borrower, collateralToTransfer);
        //     core.transferToUser(reserveForCollateral, payable(msg.sender), collateralToTransfer);
        // }

        //transfers the principal currency to the pool
        core.transferToReserve{value: msg.value}(reserveToReceive, payable(msg.sender), vars.actualAmountToLiquidate);
        
        collateralAtoken.burnOnLiquidation(borrower, vars.liquidatedCollateralForFee);

        //then liquidate the fee by transferring it to the fee collection address
        core.liquidateFee(
            reserveForCollateral,
            vars.liquidatedCollateralForFee,
            addressesProvider.getTokenDistributor()
        );

        emit OriginationFeeLiquidated(
            reserveForCollateral,
            reserveToReceive,
            borrower,
            vars.feeLiquidated,
            vars.liquidatedCollateralForFee,
            //solium-disable-next-line
            block.timestamp
        );

        emit LiquidationCall(
            reserveForCollateral,
            reserveToReceive,
            borrower,
            vars.actualAmountToLiquidate,
            collateralToTransfer,
            vars.borrowBalanceIncrease,
            msg.sender,
            _receiveAToken,
            //solium-disable-next-line
            block.timestamp
        );

        return (uint256(LiquidationErrors.NO_ERROR), "No errors");

    }

    struct AvailableCollateralToLiquidateLocalVars {
        uint256 userCompoundedBorrowBalance;
        uint256 liquidationBonus;
        uint256 collateralPrice;
        uint256 principalCurrencyPrice;
        uint256 maxAmountCollateralToLiquidate;
    }

    // /**
    // * @dev calculates how much of a specific collateral can be liquidated, given
    // * a certain amount of principal currency. This function needs to be called after
    // * all the checks to validate the liquidation have been performed, otherwise it might fail.
    // * @param _collateral the collateral to be liquidated
    // * @param _principal the principal currency to be liquidated
    // * @param _purchaseAmount the amount of principal being liquidated
    // * @param _userCollateralBalance the collatera balance for the specific _collateral asset of the user being liquidated
    // * @return the maximum amount that is possible to liquidated given all the liquidation constraints (user balance, close factor) and
    // * the purchase amount
    // **/
    function calculateAvailableCollateralToLiquidate(
        address _collateral,
        address _principal,
        uint256 _purchaseAmount,
        uint256 _userCollateralBalance
    ) internal view returns (uint256 collateralAmount, uint256 principalAmountNeeded) {
        collateralAmount = 0;
        principalAmountNeeded = 0;
        IPriceOracleGetter oracle = IPriceOracleGetter(addressesProvider.getPriceOracle());

        // Usage of a memory struct of vars to avoid "Stack too deep" errors due to local variables
        AvailableCollateralToLiquidateLocalVars memory vars;

        vars.collateralPrice = oracle.getAssetPrice(_collateral);
        vars.principalCurrencyPrice = oracle.getAssetPrice(_principal);
        vars.liquidationBonus = core.getReserveLiquidationBonus(_collateral);

        //this is the maximum possible amount of the selected collateral that can be liquidated, given the
        //max amount of principal currency that is available for liquidation.
        vars.maxAmountCollateralToLiquidate = vars
            .principalCurrencyPrice
            .mul(_purchaseAmount)
            .div(vars.collateralPrice)
            .mul(vars.liquidationBonus)
            .div(100);

        if (vars.maxAmountCollateralToLiquidate > _userCollateralBalance) {
            collateralAmount = _userCollateralBalance;
            principalAmountNeeded = vars
                .collateralPrice
                .mul(collateralAmount)
                .div(vars.principalCurrencyPrice)
                .mul(100)
                .div(vars.liquidationBonus);
        } else {
            collateralAmount = vars.maxAmountCollateralToLiquidate;
            principalAmountNeeded = _purchaseAmount;
        }

        return (collateralAmount, principalAmountNeeded);
    }

    // Propose Mode : Calculating Collateral Amount to transfer to Liquidator
    function calculateCollateraToReturn(
        address _collateral,
        address _principal,
        uint256 _purchaseAmount
    ) internal view returns (uint256 collateralAmount) {

        collateralAmount = 0;

        IPriceOracleGetter oracle = IPriceOracleGetter(addressesProvider.getPriceOracle());

        // Usage of a memory struct of vars to avoid "Stack too deep" errors due to local variables
        AvailableCollateralToLiquidateLocalVars memory vars;

        vars.collateralPrice = oracle.getAssetPrice(_collateral);
        vars.principalCurrencyPrice = oracle.getAssetPrice(_principal);
        vars.liquidationBonus = core.getReserveLiquidationBonus(_collateral);

        //this is the maximum possible amount of the selected collateral that can be liquidated, given the
        //max amount of principal currency that is available for liquidation.
        vars.maxAmountCollateralToLiquidate = vars
            .principalCurrencyPrice
            .mul(_purchaseAmount)
            .div(vars.collateralPrice)
            .mul(vars.liquidationBonus)
            .div(100);

        collateralAmount = vars.maxAmountCollateralToLiquidate;

        return (collateralAmount);
    }

}