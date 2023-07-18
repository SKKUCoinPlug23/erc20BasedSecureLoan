//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

// import "openzeppelin-solidity/contracts/math/SafeMath.sol"; // not needed
// import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
// import "openzeppelin-solidity/contracts/utils/Address.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
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
// import "../flashloan/interfaces/IFlashLoanReceiver.sol";
import "./LendingBoardCore.sol";
import "./LendingBoardDataProvider.sol";
import "./LendingBoardLiquidationManager.sol";
import "../libraries/EthAddressLib.sol";

// We import this library to be able to use console.log
import "hardhat/console.sol";

contract LendingBoardProposeMode is ReentrancyGuard,VersionedInitializable{
    using SafeMath for uint256;
    using WadRayMath for uint256;
    using Address for address;

    LendingBoardAddressesProvider public addressesProvider;
    LendingBoardCore public core;
    LendingBoardDataProvider public dataProvider;
    LendingBoardParametersProvider public parametersProvider;
    IFeeProvider feeProvider;

    //'indexed' : 하나의 event에 최대 3개의 indexed를 붙일 수 있다. indexed attr를 통해 fast filtering 가능해짐
    event Deposit(
        address indexed _reserve, 
        address indexed _user,
        uint256 _amount,
        uint256 _timestamp
    );
    
    event RedeemUnderlying(
        address indexed _reserve,
        address indexed _user,
        uint256 _amount,
        uint256 _timestamp
    );

    event Borrow(
        address indexed _reserve,
        address indexed _user,
        uint256 _amount,
        uint256 _borrowRateMode,
        uint256 _borrowRate,
        uint256 _originationFee,
        uint256 _borrowBalanceIncrease,
        uint256 _timestamp
    );

    event Repay(
        address indexed _reserve,
        address indexed _user,
        address indexed _repayer,
        uint256 _amountMinusFees,
        uint256 _fees,
        uint256 _borrowBalanceIncrease,
        uint256 _timestamp
    );

    /**
    * @dev emitted when a user enables a reserve as collateral
    * @param _reserve the address of the reserve
    * @param _user the address of the user
    **/
    event ReserveUsedAsCollateralEnabled(address indexed _reserve, address indexed _user);
    /**
    * @dev emitted when a user disables a reserve as collateral
    **/
    event ReserveUsedAsCollateralDisabled(address indexed _reserve, address indexed _user);

    // @dev emitted when a borrow fee is liquidated. ex) Even when Borrower repaid the loan, the fee could be unpaid => emitting a OriginaitionFeeLiquidated
    event OriginationFeeLiquidated(
        address indexed _collateral,
        address indexed _reserve,
        address indexed _user,
        uint256 _feeLiquidated,
        uint256 _liquidatedCollateralForFee,
        uint256 _timestamp
    );

    // @dev emitted when a borrower is liquidated
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

    // @dev functions affected by this modifier can only be invoked by the aToken.sol contract
    modifier onlyOverlyingAToken(address _reserve) {
        require(
            msg.sender == core.getReserveATokenAddress(_reserve),
            "The caller of this function can only be the aToken contract of this reserve"
        );
        _;
    }

    /**
    * @dev functions affected by this modifier can only be invoked if the reserve is active
    * @param _reserve the address of the reserve
    **/
    modifier onlyActiveReserve(address _reserve) {
        requireReserveActiveInternal(_reserve);
        _;
    }

    /**
    * @dev functions affected by this modifier can only be invoked if the reserve is not freezed.
    * A freezed reserve only allows redeems, repays, rebalances and liquidations.
    * @param _reserve the address of the reserve
    **/
    modifier onlyUnfreezedReserve(address _reserve) {
        requireReserveNotFreezedInternal(_reserve);
        _;
    }

    /**
    * @dev functions affected by this modifier can only be invoked if the provided _amount input parameter
    * is not zero.
    * @param _amount the amount provided
    **/

    modifier onlyAmountGreaterThanZero(uint256 _amount) {
        requireAmountGreaterThanZeroInternal(_amount);
        _;
    }

    uint256 public constant UINT_MAX_VALUE = type(uint256).max;

    uint256 public constant LENDINGPOOL_REVISION = 0x3;

    function getRevision() override internal pure returns (uint256) {
        return LENDINGPOOL_REVISION;
    }

    /**
    * @dev this function is invoked by the proxy contract when the LendingPool contract is added to the
    * AddressesProvider.
    * @param _addressesProvider the address of the LendingPoolAddressesProvider registry
    **/
    function initialize(LendingBoardAddressesProvider _addressesProvider) public initializer {
        addressesProvider = _addressesProvider;
        core = LendingBoardCore(addressesProvider.getLendingBoardCore());
        dataProvider = LendingBoardDataProvider(addressesProvider.getLendingBoardDataProvider());
        parametersProvider = LendingBoardParametersProvider(
            addressesProvider.getLendingBoardParametersProvider()
        );
        feeProvider = IFeeProvider(addressesProvider.getFeeProvider());
    }

    /**
    * @dev deposits The underlying asset into the reserve. A corresponding amount of the overlying asset (aTokens)
    * is minted.
    * @param _reserve the address of the reserve
    * @param _amount the amount to be deposited
    * @param _referralCode integrators are assigned a referral code and can potentially receive rewards.
    **/
    // WIP : Metamask와 같은 외부 Wallet에서 버튼을 통해 approve를 하게 되면 user는 deposit()을 통해 msg.value를 service에 deposit하게 된다.
    function deposit(address _reserve, uint256 _amount, uint16 _referralCode)
        external
        payable
        nonReentrant
        onlyAmountGreaterThanZero(_amount)
    {
    
        AToken aToken = AToken(core.getReserveATokenAddress(_reserve));

        bool isFirstDeposit = aToken.balanceOf(msg.sender) == 0; 

        core.updateStateOnDeposit(_reserve, msg.sender, _amount, isFirstDeposit);

        //minting AToken to user 1:1 with the specific exchange rate
        aToken.mintOnDeposit(msg.sender, _amount);

        // transfer to the core contract
        // core.transferToReserve.value(msg.value)(_reserve, msg.sender, _amount);
        address payable senderPayable = payable(msg.sender);
        core.transferToReserve{value: msg.value}(_reserve,senderPayable, _amount);

        //solium-disable-next-line security/no-block-members // Ethlint 예외처리 표기
        emit Deposit(_reserve, msg.sender, _amount, block.timestamp);
    }

    /**
    * @dev Redeems the underlying amount of assets requested by _user.
    * This function is executed by the overlying aToken contract in response to a redeem action.
    * @param _reserve the address of the reserve
    * @param _user the address of the user performing the action
    * @param _amount the underlying amount to be redeemed
    **/
    function redeemUnderlying(
        address _reserve,
        address payable _user,
        uint256 _amount,
        uint256 _aTokenBalanceAfterRedeem
    )
        external
        nonReentrant
        onlyOverlyingAToken(_reserve)
        onlyActiveReserve(_reserve)
        onlyAmountGreaterThanZero(_amount)
    {
        uint256 currentAvailableLiquidity = core.getReserveAvailableLiquidity(_reserve);
        require(
            currentAvailableLiquidity >= _amount,
            "There is not enough liquidity available to redeem"
        );

        core.updateStateOnRedeem(_reserve, _user, _amount, _aTokenBalanceAfterRedeem == 0);

        core.transferToUser(_reserve, _user, _amount);

        //solium-disable-next-line
        emit RedeemUnderlying(_reserve, _user, _amount, block.timestamp);

    }

    /**
    * @dev data structures for local computations in the borrow() method.
    */

    struct BorrowLocalVars {
        uint256 principalBorrowBalance;
        uint256 currentLtv;
        uint256 currentLiquidationThreshold;
        uint256 borrowFee;
        uint256 requestedBorrowAmountETH;
        uint256 amountOfCollateralNeededETH;
        uint256 userCollateralBalanceETH;
        uint256 userBorrowBalanceETH;
        uint256 userTotalFeesETH;
        uint256 borrowBalanceIncrease;
        uint256 currentReserveStableRate;
        uint256 availableLiquidity;
        uint256 reserveDecimals;
        uint256 finalUserBorrowRate;
        CoreLibrary.InterestRateMode rateMode;
        bool healthFactorBelowThreshold;
    }

    /**
    * @dev Allows users to borrow a specific amount of the reserve currency, provided that the borrower
    * already deposited enough collateral.
    * @param _reserve the address of the reserve
    * @param _amount the amount to be borrowed
    * @param _interestRateMode the interest rate mode at which the user wants to borrow. Can be 0 (STABLE) or 1 (VARIABLE)
    **/

    function borrow(
        address _reserve,
        uint256 _amount,
        uint256 _interestRateMode
    )
        external
        nonReentrant
        onlyActiveReserve(_reserve)
        onlyUnfreezedReserve(_reserve)
        onlyAmountGreaterThanZero(_amount)
    {
        // Usage of a memory struct of vars to avoid "Stack too deep" errors due to local variables
        BorrowLocalVars memory vars;

        //check that the reserve is enabled for borrowing
        require(core.isReserveBorrowingEnabled(_reserve), "Reserve is not enabled for borrowing");
        //validate interest rate mode
        require(
            uint256(CoreLibrary.InterestRateMode.VARIABLE) == _interestRateMode ||
                uint256(CoreLibrary.InterestRateMode.STABLE) == _interestRateMode,
            "Invalid interest rate mode selected"
        );

        //cast the rateMode to coreLibrary.interestRateMode
        vars.rateMode = CoreLibrary.InterestRateMode(_interestRateMode);

        //check that the amount is available in the reserve
        vars.availableLiquidity = core.getReserveAvailableLiquidity(_reserve);

        require(
            vars.availableLiquidity >= _amount,
            "There is not enough liquidity available in the reserve"
        );

        (
            ,
            vars.userCollateralBalanceETH,
            vars.userBorrowBalanceETH,
            vars.userTotalFeesETH,
            vars.currentLtv,
            vars.currentLiquidationThreshold,
            ,
            vars.healthFactorBelowThreshold
        ) = dataProvider.calculateUserGlobalData(msg.sender);

        require(vars.userCollateralBalanceETH > 0, "The collateral balance is 0");

        require(
            !vars.healthFactorBelowThreshold,
            "The borrower can already be liquidated so he cannot borrow more"
        );

        //calculating fees
        vars.borrowFee = feeProvider.calculateLoanOriginationFee(msg.sender, _amount);

        require(vars.borrowFee > 0, "The amount to borrow is too small");

        vars.amountOfCollateralNeededETH = dataProvider.calculateCollateralNeededInETH(
            _reserve,
            _amount,
            vars.borrowFee,
            vars.userBorrowBalanceETH,
            vars.userTotalFeesETH,
            vars.currentLtv
        );

        require(
            vars.amountOfCollateralNeededETH <= vars.userCollateralBalanceETH,
            "There is not enough collateral to cover a new borrow"
        );

        /**
        * Following conditions need to be met if the user is borrowing at a stable rate:
        * 1. Reserve must be enabled for stable rate borrowing
        * 2. Users cannot borrow from the reserve if their collateral is (mostly) the same currency
        *    they are borrowing, to prevent abuses.
        * 3. Users will be able to borrow only a relatively small, configurable amount of the total
        *    liquidity
        **/

        if (vars.rateMode == CoreLibrary.InterestRateMode.STABLE) {
            //check if the borrow mode is stable and if stable rate borrowing is enabled on this reserve
            require(
                core.isUserAllowedToBorrowAtStable(_reserve, msg.sender, _amount),
                "User cannot borrow the selected amount with a stable rate"
            );

            //calculate the max available loan size in stable rate mode as a percentage of the
            //available liquidity
            uint256 maxLoanPercent = parametersProvider.getMaxStableRateBorrowSizePercent();
            uint256 maxLoanSizeStable = vars.availableLiquidity.mul(maxLoanPercent).div(100);

            require(
                _amount <= maxLoanSizeStable,
                "User is trying to borrow too much liquidity at a stable rate"
            );
        }

        //all conditions passed - borrow is accepted
        (vars.finalUserBorrowRate, vars.borrowBalanceIncrease) = core.updateStateOnBorrow(
            _reserve,
            msg.sender,
            _amount,
            vars.borrowFee,
            vars.rateMode
        );

        //if we reached this point, we can transfer
        address payable senderPayable = payable(msg.sender);
        core.transferToUser(_reserve, senderPayable, _amount);

        emit Borrow(
            _reserve,
            msg.sender,
            _amount,
            _interestRateMode,
            vars.finalUserBorrowRate,
            vars.borrowFee,
            vars.borrowBalanceIncrease,
            //solium-disable-next-line
            block.timestamp
        );
    }

    /**
    * @notice repays a borrow on the specific reserve, for the specified amount (or for the whole amount, if uint256(-1) is specified).
    * @dev the target user is defined by _onBehalfOf. If there is no repayment on behalf of another account,
    * _onBehalfOf must be equal to msg.sender.
    * @param _reserve the address of the reserve on which the user borrowed
    * @param _amount the amount to repay, or uint256(-1) if the user wants to repay everything
    * @param _onBehalfOf the address for which msg.sender is repaying.
    **/

    struct RepayLocalVars {
        uint256 principalBorrowBalance;
        uint256 compoundedBorrowBalance;
        uint256 borrowBalanceIncrease;
        bool isETH;
        uint256 paybackAmount;
        uint256 paybackAmountMinusFees;
        uint256 currentStableRate;
        uint256 originationFee;
    }

    function repay(address _reserve, uint256 _amount, address payable _onBehalfOf)
        external
        payable
        nonReentrant
        onlyActiveReserve(_reserve)
        onlyAmountGreaterThanZero(_amount)
    {
        // Usage of a memory struct of vars to avoid "Stack too deep" errors due to local variables
        RepayLocalVars memory vars;

        (
            vars.principalBorrowBalance,
            vars.compoundedBorrowBalance,
            vars.borrowBalanceIncrease
        ) = core.getUserBorrowBalances(_reserve, _onBehalfOf);

        vars.originationFee = core.getUserOriginationFee(_reserve, _onBehalfOf);
        vars.isETH = EthAddressLib.ethAddress() == _reserve;

        require(vars.compoundedBorrowBalance > 0, "The user does not have any borrow pending");

        require(
            _amount != UINT_MAX_VALUE || msg.sender == _onBehalfOf,
            "To repay on behalf of an user an explicit amount to repay is needed."
        );

        //default to max amount
        // vars.paybackAmount = vars.compoundedBorrowBalance.add(vars.originationFee);
        vars.paybackAmount = vars.compoundedBorrowBalance + (vars.originationFee);

        if (_amount != UINT_MAX_VALUE && _amount < vars.paybackAmount) {
            vars.paybackAmount = _amount;
        }

        require(
            !vars.isETH || msg.value >= vars.paybackAmount,
            "Invalid msg.value sent for the repayment"
        );

        //if the amount is smaller than the origination fee, just transfer the amount to the fee destination address
        if (vars.paybackAmount <= vars.originationFee) {
            core.updateStateOnRepay(
                _reserve,
                _onBehalfOf,
                0,
                vars.paybackAmount,
                vars.borrowBalanceIncrease,
                false
            );

            // core.transferToFeeCollectionAddress.value(vars.isETH ? vars.paybackAmount : 0)(
            //     _reserve,
            //     _onBehalfOf,
            //     vars.paybackAmount,
            //     addressesProvider.getTokenDistributor()
            // );
            core.transferToFeeCollectionAddress{value:vars.isETH ? vars.paybackAmount : 0}(_reserve,
                _onBehalfOf,
                vars.paybackAmount,
                addressesProvider.getTokenDistributor()
            );

            emit Repay(
                _reserve,
                _onBehalfOf,
                msg.sender,
                0,
                vars.paybackAmount,
                vars.borrowBalanceIncrease,
                //solium-disable-next-line
                block.timestamp
            );
            return;
        }

        // vars.paybackAmountMinusFees = vars.paybackAmount.sub(vars.originationFee);
        vars.paybackAmountMinusFees = vars.paybackAmount - (vars.originationFee);

        core.updateStateOnRepay(
            _reserve,
            _onBehalfOf,
            vars.paybackAmountMinusFees,
            vars.originationFee,
            vars.borrowBalanceIncrease,
            vars.compoundedBorrowBalance == vars.paybackAmountMinusFees
        );

        address payable senderPayable = payable(msg.sender);

        //if the user didn't repay the origination fee, transfer the fee to the fee collection address
        if(vars.originationFee > 0) {
            // core.transferToFeeCollectionAddress.value(vars.isETH ? vars.originationFee : 0)(
            //     _reserve,
            //     msg.sender,
            //     vars.originationFee,
            //     addressesProvider.getTokenDistributor()
            // );
            core.transferToFeeCollectionAddress{value :vars.isETH ? vars.originationFee : 0}(
                _reserve,
                senderPayable,
                vars.originationFee,
                addressesProvider.getTokenDistributor()
            );
        }

        //sending the total msg.value if the transfer is ETH.
        //the transferToReserve() function will take care of sending the
        //excess ETH back to the caller
        // core.transferToReserve.value(vars.isETH ? msg.value.sub(vars.originationFee) : 0)(
        //     _reserve,
        //     msg.sender,
        //     vars.paybackAmountMinusFees
        // );
        core.transferToReserve{value:vars.isETH ? msg.value.sub(vars.originationFee) : 0}(
            _reserve,
            senderPayable,
            vars.paybackAmountMinusFees
        );

        emit Repay(
            _reserve,
            _onBehalfOf,
            msg.sender,
            vars.paybackAmountMinusFees,
            vars.originationFee,
            vars.borrowBalanceIncrease,
            //solium-disable-next-line
            block.timestamp
        );
    }

    /**
    * @dev allows depositors to enable or disable a specific deposit as collateral.
    * @param _reserve the address of the reserve
    * @param _useAsCollateral true if the user wants to user the deposit as collateral, false otherwise.
    **/
    function setUserUseReserveAsCollateral(address _reserve, bool _useAsCollateral)
        external
        nonReentrant
        onlyActiveReserve(_reserve)
        onlyUnfreezedReserve(_reserve)
    {
        uint256 underlyingBalance = core.getUserUnderlyingAssetBalance(_reserve, msg.sender);

        require(underlyingBalance > 0, "User does not have any liquidity deposited");

        require(
            dataProvider.balanceDecreaseAllowed(_reserve, msg.sender, underlyingBalance),
            "User deposit is already being used as collateral"
        );

        core.setUserUseReserveAsCollateral(_reserve, msg.sender, _useAsCollateral);

        if (_useAsCollateral) {
            emit ReserveUsedAsCollateralEnabled(_reserve, msg.sender);
        } else {
            emit ReserveUsedAsCollateralDisabled(_reserve, msg.sender);
        }
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
    ) external payable nonReentrant onlyActiveReserve(_reserve) onlyActiveReserve(_collateral) {
        address liquidationManager = addressesProvider.getLendingBoardLiquidationManager();

        //solium-disable-next-line
        (bool success, bytes memory result) = liquidationManager.delegatecall(
            abi.encodeWithSignature(
                "liquidationCall(address,address,address,uint256,bool)",
                _collateral,
                _reserve,
                _user,
                _purchaseAmount,
                _receiveAToken
            )
        );
        require(success, "Liquidation call failed");

        (uint256 returnCode, string memory returnMessage) = abi.decode(result, (uint256, string));

        if (returnCode != 0) {
            //error found
            revert(string(abi.encodePacked("Liquidation failed: ", returnMessage)));
        }
    }



    // WIP : borrowProposal, borrowProposalAccept, getBorrowProposal, lendProposal, lendProposalAccept, getLendProposal

    struct ProposalStructure {
        bool active;
        address proposer;
        address reserveToReceive;
        uint256 amount;
        address reserveForCollateral;
        uint256 interestRate;
        uint256 dueDate; // 추후에 enum으로 구분하여 1개월, 3개월, 6개월 이런식으로 정해서 input하게끔
        uint256 proposalDate;
        uint256 serviceFee;
        uint256 ltv;
    }

    struct BorrowProposal {
        bool active;
        address borrower;
        address reserveToBorrow;
        uint256 amount;
        address reserveForCollateral;
        uint256 interestRate;
        uint256 dueDate; // 추후에 enum으로 구분하여 1개월, 3개월, 6개월 이런식으로 정해서 input하게끔
        uint256 proposalDate;
        uint256 borrowFee;
        uint256 ltv;
    }

    event BorrowProposed (
        address indexed _reserveToBorrow,
        address indexed _borrowProposer,
        uint256 indexed _proposalId,
        uint256 _amount,
        address _reserveForCollateral,
        uint256 _interestRate,
        uint256 _originationFee,
        uint256 _dueDate,
        uint256 _timestamp
    );

    event ProposalAccepted(
        address indexed _reserveToReceive,
        address indexed _lender,
        address _reserveForCollateral,
        address  _borrower,
        uint256 indexed _proposalId,
        uint256 _amount,
        bool _isBorrowProposal,
        uint256 _originationFee,
        uint256 _timestamp
    );

    event BorrowAccepted (
        address indexed _reserveToLend,
        address indexed _lender,
        address  _borrower,
        uint256 indexed _proposalId,
        uint256 _amount,
        uint256 _originationFee,
        uint256 _timestamp
    );

    // List for borrowProposal structures
    // mapping(uint256 => BorrowProposal) internal borrowProposalList;
    mapping(uint256 => ProposalStructure) internal borrowProposalList;
    
    // Counting length for Iteration
    // uint256 public borrowProposalListCount = 0;

    function getUserReserveBalance(address _reserve, address _user) public view
    returns(uint256){
        uint256 userCurrentATokenBalance;
        uint256 userCurrentBorrowBalance;
        uint256 userCurrentAvailableReserveBalanceInWei;
        uint256 userCurrentAvailableReserveBalance;
        (
            userCurrentATokenBalance,
            userCurrentBorrowBalance,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
        ) = dataProvider.getUserReserveData(_reserve,_user);

        userCurrentAvailableReserveBalanceInWei = userCurrentATokenBalance - 
        userCurrentBorrowBalance;
        
        userCurrentAvailableReserveBalance = userCurrentAvailableReserveBalanceInWei.div(10 ** 18);

        return userCurrentAvailableReserveBalance;
    }


    function borrowProposal(
        address _reserveToBorrow, uint256 _amount, address _reserveForCollateral, uint256 _interestRate, uint256 _dueDate
    )
        external
        nonReentrant
        onlyActiveReserve(_reserveToBorrow)
        onlyUnfreezedReserve(_reserveToBorrow) //추후 _reserveForCollateral도 확인하여 진행
        onlyAmountGreaterThanZero(_amount)
    {
        CoreLibrary.ProposalStructure memory proposalVars;
        BorrowLocalVars memory borrowLocalVars;
        require(_interestRate > 0 && _interestRate < 100,"Invalid Interest Rate Input");
        require(_dueDate > block.timestamp, "Invalid Due Date Set");

        uint256 reserveDecimals = core.getReserveDecimals(_reserveToBorrow);

        IPriceOracleGetter oracle = IPriceOracleGetter(addressesProvider.getPriceOracle());

        require(core.isReserveBorrowingEnabled(_reserveToBorrow), "Reserve is not enabled for borrowing");
        //check that the amount is available in the reserve
        borrowLocalVars.availableLiquidity = core.getReserveAvailableLiquidity(_reserveToBorrow);

        require(
            borrowLocalVars.availableLiquidity >= _amount,
            "There is not enough liquidity available in the reserve to make a borrow proposal"
        );

        // Check User's _reserveForCollateral amount is enough for Lending
        // 아래 과정은 User의 전체 자산을 기반으로 한 Collateral을 check하고 있다. 
        // 우리의 서비스는 User가 _reserveForCollateral의 양이 충분한지만 확인하면 된다.
        // 해당 수치는 dataProvider.getUserReserveData 의 currentATokenBalance - currentBorrowBalance 으로 구하면 될듯하나 이부분은 Check을 받아야 함
        // 일단은 해당 과정을 생략한채 테스트 진행 23.07.06
        
        uint256 userCurrentAvailableCollateralBalance = getUserReserveBalance(_reserveToBorrow,msg.sender);

        uint256 borrowLTV;

        (
            borrowLTV,
            ,
            ,
            ,
            ,
            ,
            ,
        ) = dataProvider.getReserveConfigurationData(_reserveToBorrow);

        // amount가 parseEther로 들어가ㅏ기에 10^18로 나눠도 wei 단위로 표시됨
        uint256 requestedBorrowAmountInWei = oracle
            .getAssetPrice(_reserveToBorrow)
            .mul(_amount)
            .div(10 ** reserveDecimals); 
    
        console.log("   => LBPM :reserveDecimals for _reserveToBorrow : ",reserveDecimals);

        // 추후에 _fee 를 추가하여 계산한다.
        // uint256 requestedBorrowAmountETH = oracle
        //     .getAssetPrice(_reserveToBorrow)
        //     .mul(_amount.add(_fee))
        //     .div(10 ** reserveDecimals); 
        

        uint256 collateralNeededInWei = _amount
            .mul(requestedBorrowAmountInWei)
            .div(borrowLTV);
        
        uint256 collateralNeeded = collateralNeededInWei
            .div(oracle.getAssetPrice(_reserveForCollateral));
        
        console.log("   => LBPM : _amount, requestedBorrowAmountETH, borrowLTV ",_amount,requestedBorrowAmountInWei,borrowLTV);
        console.log("   => LBPM : ETH Needed for Borrow Proposal : ",collateralNeededInWei);
        console.log("   => LBPM : Collateral Needed for Borrow Proposal : ",collateralNeeded);
        require(userCurrentAvailableCollateralBalance >= collateralNeeded,"There is not enough collateral to cover a new borrow proposal");

        //calculating fees
        borrowLocalVars.borrowFee = feeProvider.calculateLoanOriginationFee(msg.sender, _amount);
        require(borrowLocalVars.borrowFee > 0, "The amount to borrow is too small");
        console.log("   => LBPM : Borrow Fee for this borrow proposal : ",borrowLocalVars.borrowFee);

        // If all conditions passed - Borrow Proposal Generated
        proposalVars.active = true;
        proposalVars.proposer = msg.sender;
        proposalVars.reserveToReceive = _reserveToBorrow;
        // borrower의 collateral이 ltv를 고려했을 때 충분한 양을 가지고 있는지 확인 => 부족하면 _amount를 줄이라는 메세지 emit => 위에서 확인
        proposalVars.amount = _amount;
        // valid한 reserveForCollateral인지 확인 => 위에서 확인
        proposalVars.reserveForCollateral = _reserveForCollateral;
        // interestRate이 0 이상 100 이하(or 서비스 책정 최대 이자율 이하인지) 확인
        proposalVars.interestRate = _interestRate;
        proposalVars.dueDate = _dueDate;
        proposalVars.proposalDate = block.timestamp;
        proposalVars.serviceFee = borrowLocalVars.borrowFee;
        // LTV는 System Set
        proposalVars.ltv = borrowLTV;

        uint256 proposalId = core.getBorrowProposalCount();
        core.incrementBorrowProposalCount(); // Borrow Proposal Count 증가
        // borrowProposalList[proposalId] = proposalVars;
        core.updateBorrowProposal(proposalId,proposalVars);

        emit BorrowProposed(
            _reserveToBorrow,
            msg.sender,
            proposalId,
            _amount,
            _reserveForCollateral,
            _interestRate,
            borrowLocalVars.borrowFee,
            _dueDate,
            //solium-disable-next-line
            block.timestamp
        );
    }

    // Lender의 입장에서 Borrower의 proposal을 Accept한 경우
    // msg.sender == Lender의 case
    function borrowProposalAccept(uint256 _proposalId) external {
        CoreLibrary.ProposalStructure memory borrowProposalVars;
        borrowProposalVars = core.getBorrowProposalFromCore(_proposalId);
        // Lender의 소유 reserve(토큰)이 borrowProposalList[_proposalId].reserveToBorrow 보다 많거나 같은지 확인
        require(borrowProposalVars.active == true, "Only Active Borrow Proposal can be Accepted");

        address reserveToBorrow = borrowProposalVars.reserveToReceive;
        uint256 amount = borrowProposalVars.amount;
        address borrower = borrowProposalVars.proposer;
        uint256 borrowFee = borrowProposalVars.serviceFee;

        proposalAcceptInternal(reserveToBorrow,amount,_proposalId,borrower,msg.sender,borrowFee,true);
        borrowProposalList[_proposalId].active = false;
    }
    
    function getBorrowProposal(uint256 _proposalId) 
        public
        view 
        returns(
            bool active,
            address borrower,
            address reserveToBorrow,
            uint256 amount,
            address reserveForCollateral,
            uint256 interestRate,
            uint256 dueDate,
            uint256 proposalDate,
            uint256 ltv
        )
    {   
            require(_proposalId >= 0 && _proposalId <= core.getBorrowProposalCount(), "Invalid _proposalId");

            CoreLibrary.ProposalStructure memory borrowProposalVars;
            borrowProposalVars = core.getBorrowProposalFromCore(_proposalId);

            active = borrowProposalVars.active;
            borrower = borrowProposalVars.proposer;
            reserveToBorrow = borrowProposalVars.reserveToReceive;
            amount = borrowProposalVars.amount;
            reserveForCollateral = borrowProposalVars.reserveForCollateral;
            interestRate = borrowProposalVars.interestRate;
            dueDate = borrowProposalVars.dueDate;
            proposalDate = borrowProposalVars.proposalDate;
            ltv = borrowProposalVars.ltv;
    }

    function getBorrowProposalList(uint256 _startIdx, uint256 _endIdx) 
        public
        view
        returns(
            CoreLibrary.ProposalStructure [] memory result // struct BorrowProposal array
        )
    {
        require(_startIdx >= 0,"Start Index should be larger than 0");
        require(_endIdx < core.getBorrowProposalCount(),"End Index over borrowProposalListCount");
        uint256 resultLength = _endIdx - _startIdx + 1;
        require(resultLength < 2000,"Maximum 2000 iteration per request");
        result = new CoreLibrary.ProposalStructure [] (resultLength);
        uint256 resultIndex = 0;
        for(uint256 i = _startIdx; i <= _endIdx; i++){
            result[resultIndex++] = core.getBorrowProposalFromCore(i);
        }
        return result;
    }

    struct LendProposal {
        bool active;
        address lender;
        address reserveToLend;
        uint256 amount;
        address reserveForCollateral;
        uint256 interestRate;
        uint256 dueDate; // 추후에 enum으로 구분하여 1개월, 3개월, 6개월 이런식으로 정해서 input하게끔
        uint256 proposalDate;
        uint256 lendFee;
        uint256 ltv;
    }

    struct LendLocalVars {
        uint256 principalBorrowBalance;
        uint256 currentLtv;
        uint256 currentLiquidationThreshold;
        uint256 lendFee;
        uint256 requestedBorrowAmountETH;
        uint256 amountOfCollateralNeededETH;
        uint256 userCollateralBalanceETH;
        uint256 userBorrowBalanceETH;
        uint256 userTotalFeesETH;
        uint256 borrowBalanceIncrease;
        uint256 currentReserveStableRate;
        uint256 availableLiquidity;
        uint256 reserveDecimals;
        bool healthFactorBelowThreshold;
    }

    event LendProposed (
        address indexed _reserveToLend,
        address indexed _lendProposer,
        uint256 indexed _proposalId,
        uint256 _amount,
        uint256 _interestRate,
        uint256 _originationFee,
        uint256 _dueDate,
        uint256 _proposalTimeStamp
    );


    event LendAccepted (
        address indexed _reserveToLend,
        address indexed _lender,
        address _borrower,
        uint256 indexed _proposalId,
        uint256 _amount,
        uint256 _originationFee,
        uint256 _timestamp
    );

    // event BorrowAccepted (
    //     address indexed _reserveToLend,
    //     address indexed _lender,
    //     address  _borrower,
    //     uint256 indexed _proposalId,
    //     uint256 _amount,
    //     uint256 _originationFee,
    //     uint256 _timestamp
    // );

    // List for borrowProposal structures
    mapping(uint256 => ProposalStructure) internal lendProposalList;

    function lendProposal(
        address _reserveToLend, uint256 _amount, address _reserveForCollateral, uint256 _interestRate, uint256 _dueDate
    )  
        external
        nonReentrant
        onlyActiveReserve(_reserveToLend)
        onlyUnfreezedReserve(_reserveToLend) //추후 _reserveForCollateral도 확인하여 진행
        onlyAmountGreaterThanZero(_amount)
    {
        CoreLibrary.ProposalStructure memory proposalVars;
        LendLocalVars memory lendLocarVars;
        require(_interestRate > 0 && _interestRate < 100,"Invalid Interest Rate Input");
        require(_dueDate > block.timestamp, "Invalid Due Date Set");

        uint256 reserveDecimals = core.getReserveDecimals(_reserveToLend);

        IPriceOracleGetter oracle = IPriceOracleGetter(addressesProvider.getPriceOracle());

        require(core.isReserveBorrowingEnabled(_reserveToLend), "Reserve is not enabled for borrowing");
        lendLocarVars.availableLiquidity = core.getReserveAvailableLiquidity(_reserveToLend);


        require(
            lendLocarVars.availableLiquidity >= _amount,
            "There is not enough liquidity available in the reserve to make a lend proposal"
        );
        
        uint256 userCurrentAvailableLendBalanceInWei = getUserReserveBalance(_reserveToLend,msg.sender).mul(10 ** 18);


        uint256 collateralLTV;

        (
            collateralLTV,
            ,
            ,
            ,
            ,
            ,
            ,
        ) = dataProvider.getReserveConfigurationData(_reserveForCollateral);

        uint256 requestedLendAmountInWei = oracle
            .getAssetPrice(_reserveToLend)
            .mul(_amount)
            .div(10 ** reserveDecimals); 

        console.log("   => LBPM : _amount, requestedLendAmountInWei, collateralLTV : ",_amount,requestedLendAmountInWei,collateralLTV);

        // Lemd하기에 충분한 balance를 가지고 있는지 확인한다.
        require(userCurrentAvailableLendBalanceInWei >= _amount,"There is not enough balance to lend in order to cover a new lend proposal");

        lendLocarVars.lendFee = feeProvider.calculateLoanOriginationFee(msg.sender, _amount);
        require(lendLocarVars.lendFee > 0, "The amount to borrow is too small");
        console.log("   => LBPM : Lend Fee for this lend proposal : ",lendLocarVars.lendFee);

        proposalVars.active = true;
        proposalVars.proposer = msg.sender;
        proposalVars.reserveToReceive = _reserveToLend;
        proposalVars.amount = _amount;
        proposalVars.reserveForCollateral = _reserveForCollateral;
        proposalVars.interestRate = _interestRate;        
        proposalVars.dueDate = _dueDate;
        proposalVars.proposalDate = block.timestamp;
        proposalVars.serviceFee = lendLocarVars.lendFee;
        proposalVars.ltv = collateralLTV; // LTV는 System Set

        uint proposalId = core.getLendProposalCount();
        core.incrementLendProposalCount();

        // lendProposalList[proposalId] = proposalVars;
        core.updateLendProposal(proposalId,proposalVars);

        emit LendProposed(
            _reserveToLend,
            msg.sender,
            proposalId,
            _amount,
            _interestRate,
            lendLocarVars.lendFee,
            _dueDate,
            block.timestamp
        );
    }

    // Borrower의 입장에서 Lender의 proposal을 Accept한 경우
    // msg.sender == Borrower
    function lendProposalAccept(uint256 _proposalId) external {
        CoreLibrary.ProposalStructure memory lendProposalVars;
        lendProposalVars = core.getLendProposalFromCore(_proposalId);
        // Lender의 소유 reserve(토큰)이 borrowProposalList[proposalId].reserveToBorrow 보다 많거나 같은지 확인
        require(lendProposalVars.active == true, "Only Active Borrow Proposal can be Accepted");
        address reserveToLend = lendProposalVars.reserveToReceive;
        uint256 amount = lendProposalVars.amount;
        address lender = lendProposalVars.proposer;
        uint256 lendFee = lendProposalVars.serviceFee;
        // Borrower가 곧 msg.sender이기에 parameter로 전달한다.
        proposalAcceptInternal(reserveToLend,amount,_proposalId,msg.sender,lender,lendFee,false);
        lendProposalList[_proposalId].active = false;
    }

    function getLendProposal(uint256 _proposalId) 
        public
        view 
        returns(
            bool active,
            address lender,
            address reserveToLend,
            uint256 amount,
            address reserveForCollateral,
            uint256 interestRate,
            uint256 dueDate,
            uint256 proposalDate,
            uint256 ltv
        )
    {   
            require(_proposalId >= 0 && _proposalId <= core.getLendProposalCount(), "Invalid _proposalId");

            CoreLibrary.ProposalStructure memory lendProposalVars;
            lendProposalVars = core.getLendProposalFromCore(_proposalId);

            active = lendProposalVars.active;
            lender = lendProposalVars.proposer;
            reserveToLend = lendProposalVars.reserveToReceive;
            amount = lendProposalVars.amount;
            reserveForCollateral = lendProposalVars.reserveForCollateral;
            interestRate = lendProposalVars.interestRate;
            dueDate = lendProposalVars.dueDate;
            proposalDate = lendProposalVars.proposalDate;
            ltv = lendProposalVars.ltv;
    }

    function getLendProposalList(uint256 startIdx, uint256 endIdx) 
        public
        view
        returns(
            CoreLibrary.ProposalStructure[] memory result // struct LendProposal array
        )
    {
        require(startIdx >= 0,"Start Index should be larger than 0");
        require(endIdx < core.getLendProposalCount(),"End Index exceeding LendProposalListCount");
        uint256 resultLength = endIdx - startIdx + 1;
        require(resultLength < 2000,"Maximum 2000 iteration per request");
        result = new CoreLibrary.ProposalStructure [] (resultLength);
        uint256 resultIndex = 0;
        for(uint256 i = startIdx; i <= endIdx; i++){
            result[resultIndex++] = core.getLendProposalFromCore(i);
        }
        return result;
    }

    function proposalAcceptInternal(
        address _reserve,
        uint256 _amount,
        uint256 _proposalId,
        address _borrower,
        address _lender,
        uint256 _serviceFee,
        bool _isBorrowProposal
    )
        internal
        nonReentrant
        onlyActiveReserve(_reserve)
        onlyUnfreezedReserve(_reserve)
        onlyAmountGreaterThanZero(_amount)    
    {

        // Borrower의 Collateral Service에게 transfer
        // NFT 채권 발행하여 Lender에게 transfer @김주헌
        // Input parameter _lender를 이용해서 
        address reserveForCollateral;

        // Borrow Proposal Accept Case
        if(_isBorrowProposal){ // Borrow의 경우 Borrow Proposer의 담보가 충분한지 확인

            // reserveForCollateral = borrowProposalList[_proposalId].reserveForCollateral;

            CoreLibrary.ProposalStructure memory borrowProposalFromCore = core.getLendProposalFromCore(_proposalId);
            reserveForCollateral = borrowProposalFromCore.reserveForCollateral;

            uint256 userCurrentAvailableReserveBalanceInWei = getUserReserveBalance(_reserve,msg.sender).mul(10 ** 18);

            console.log("   => LBPM : user Current Available Reserve Balance in Wei : ",userCurrentAvailableReserveBalanceInWei);

            require(userCurrentAvailableReserveBalanceInWei >= _amount,"Lender doesn't have enough Reserve Balance to Accept Borrow Proposal");


        } else { // Lend Proposal Accept Case
        
            // Lend의 경우 Lend Proposer의 Lend Amount가 충분한지 확인
            // reserveForCollateral = lendProposalList[_proposalId].reserveForCollateral;
            // uint256 collateralLtv = lendProposalList[_proposalId].ltv;

            CoreLibrary.ProposalStructure memory lendProposalFromCore = core.getLendProposalFromCore(_proposalId);

            reserveForCollateral = lendProposalFromCore.reserveForCollateral;
            uint256 collateralLtv = lendProposalFromCore.ltv;


            IPriceOracleGetter oracle = IPriceOracleGetter(addressesProvider.getPriceOracle());
            // amount가 parseEther로 들어가ㅏ기에 10^18로 나눠도 wei 단위로 표시됨
            uint256 collateralOraclePriceInWei = oracle
                .getAssetPrice(reserveForCollateral);
            uint256 userCollateralBalance = getUserReserveBalance(_reserve,msg.sender);
            uint256 userCollateralLtvAppliedValue = (userCollateralBalance)
                .mul(collateralLtv)
                .mul(collateralOraclePriceInWei)
                .div(10 ** 36);

            console.log("   => LBPM : collateralLtv : ",collateralLtv);
            console.log("   => LBPM : collateralOraclePriceInWei : ",collateralOraclePriceInWei);
            console.log("   => LBPM : userCollateralLtvAppliedValue : ",userCollateralLtvAppliedValue);

            uint256 borrowAssetPriceInWei = oracle
                .getAssetPrice(_reserve)
                .mul(_amount)
                .div(10 ** 18); // potential error points
            uint256 borrowAssetPriceInEth = borrowAssetPriceInWei
                .div(10 ** 18);
            console.log("   => LBPM : borrowAssetPriceInEth : ",borrowAssetPriceInEth);

            require(userCollateralLtvAppliedValue >= borrowAssetPriceInEth,"Borrower doesn't have enough collateral to accept Lend Proposal");

        }

        uint256 borrowBalanceIncreased; // WIP : Revision mandated
        console.log("   => LBPM : Service Fee : ", _serviceFee);

        // 임시로 생성한 CoreLibrary.setInterestRate() 함수 사용
        // CoreLibrary.UserReserveData storage user = usersReserveData[_user][_reserve];
        // CoreLibrary.setInterestRate(user,proposalInteresRate);

        (,borrowBalanceIncreased) = core.updateStateOnBorrowProposeMode(
            _reserve,
            _borrower,
            _amount,
            _serviceFee,
            CoreLibrary.InterestRateMode.STABLE,
            _isBorrowProposal,
            _proposalId 
        );
        console.log("   => LBPM : User Borrow Balance Increased : ",borrowBalanceIncreased);

        // Transfering the Token Borrow Proposer Desired
        address payable borrowerPayable = payable(_borrower);
        core.transferToUser(_reserve, borrowerPayable, _amount);

        // @김주헌 transferToUser 이후 Lender에게 채권 전달하는 프로세스 추가

        emit ProposalAccepted(
            _reserve,
            _lender,
            reserveForCollateral,
            _borrower,
            _proposalId,
            _amount,
            _isBorrowProposal,
            _serviceFee,
            block.timestamp
        );
        
    }


    /**
    * @dev accessory functions to fetch data from the core contract
    **/

    function getReserveConfigurationData(address _reserve)
        external
        view
        returns (
            uint256 ltv,
            uint256 liquidationThreshold,
            uint256 liquidationBonus,
            address interestRateStrategyAddress,
            bool usageAsCollateralEnabled,
            bool borrowingEnabled,
            bool stableBorrowRateEnabled,
            bool isActive
        )
    {
        return dataProvider.getReserveConfigurationData(_reserve);
    }

    function getReserveData(address _reserve)
        external
        view
        returns (
            uint256 totalLiquidity,
            uint256 availableLiquidity,
            uint256 totalBorrowsStable,
            uint256 totalBorrowsVariable,
            uint256 liquidityRate,
            uint256 variableBorrowRate,
            uint256 stableBorrowRate,
            uint256 averageStableBorrowRate,
            uint256 utilizationRate,
            uint256 liquidityIndex,
            uint256 variableBorrowIndex,
            address aTokenAddress,
            uint40 lastUpdateTimestamp
        )
    {
        return dataProvider.getReserveData(_reserve);
    }

    function getUserAccountData(address _user)
        external
        view
        returns (
            uint256 totalLiquidityETH,
            uint256 totalCollateralETH,
            uint256 totalBorrowsETH,
            uint256 totalFeesETH,
            uint256 availableBorrowsETH,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        )
    {
        return dataProvider.getUserAccountData(_user);
    }

    function getUserReserveData(address _reserve, address _user)
        external
        view
        returns (
            uint256 currentATokenBalance,
            uint256 currentBorrowBalance,
            uint256 principalBorrowBalance,
            uint256 borrowRateMode,
            uint256 borrowRate,
            uint256 liquidityRate,
            uint256 originationFee,
            uint256 variableBorrowIndex,
            uint256 lastUpdateTimestamp,
            bool usageAsCollateralEnabled
        )
    {
        return dataProvider.getUserReserveData(_reserve, _user);
    }

    function getReserves() external view returns (address[] memory) {
        return core.getReserves();
    }

    /**
    * @dev internal function to save on code size for the onlyActiveReserve modifier
    **/
    function requireReserveActiveInternal(address _reserve) internal view {
        require(core.getReserveIsActive(_reserve), "Action requires an active reserve");
    }

    /**
    * @notice internal function to save on code size for the onlyUnfreezedReserve modifier
    **/
    function requireReserveNotFreezedInternal(address _reserve) internal view {
        require(!core.getReserveIsFreezed(_reserve), "Action requires an unfreezed reserve");
    }

    /**
    * @notice internal function to save on code size for the onlyAmountGreaterThanZero modifier
    **/
    function requireAmountGreaterThanZeroInternal(uint256 _amount) internal pure {
        require(_amount > 0, "Amount must be greater than 0");
    }    


}