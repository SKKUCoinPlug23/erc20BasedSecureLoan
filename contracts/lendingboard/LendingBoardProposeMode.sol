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
// import "../flashloan/interfaces/IFlashLoanReceiver.sol";
import "./LendingBoardCore.sol";
import "./LendingBoardDataProvider.sol";
import "./LendingBoardLiquidationManager.sol";
import "../libraries/EthAddressLib.sol";

// We import this library to be able to use console.log
import "hardhat/console.sol";

// import for NFT Minting
import "./LendingBoardNFT.sol";

contract LendingBoardProposeMode is ReentrancyGuard,VersionedInitializable{
    using SafeMath for uint256;
    using WadRayMath for uint256;
    using Address for address;

    LendingBoardAddressesProvider public addressesProvider;
    LendingBoardCore public core;
    LendingBoardDataProvider public dataProvider;
    LendingBoardParametersProvider public parametersProvider;
    IFeeProvider feeProvider;
    LendingBoardNFT public nft;

    address zeroAddress = address(0);

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
        uint256 _paybackAmount,
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
        nft = LendingBoardNFT(addressesProvider.getLendingBoardNFT());
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

        // Maybe here to add the logic for checking collateral balance
        // getReserve 함수등으로 borrowbalance 가져와서 특정 collateral 비율 만큼은 
        // userReserve에서 제외한 상태에서 _amount 보다 큰 값을 redeem 하려고 하면 revert

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

    // function borrow() from Aave Protocol deleted

    struct RepayLocalVars {
        uint256 principalBorrowBalance;
        uint256 compoundedBorrowBalance;
        uint256 borrowBalanceIncrease;
        bool isETH;
        uint256 paybackAmount;
        uint256 paybackAmountMinusFees;
        uint256 currentStableRate;
        uint256 originationFee;
        address reserve;
    }

    function repay(uint256 _proposalId, bool _isBorrowProposal)
        external
        payable
        nonReentrant
    {
        RepayLocalVars memory vars;
        CoreLibrary.ProposalStructure memory proposalStructure;

        // // Get Borrow Proposal Structure
        // if (_isBorrowProposal) {
        //     proposalStructure = core.getBorrowProposalFromCore(_proposalId);
        // } else {
        //     proposalStructure = core.getLendProposalFromCore(_proposalId);
        //     // WIP : need validation like Borrow Proposal
        // }

        proposalStructure = core.getProposalFromCore(_proposalId,_isBorrowProposal);
        require(msg.sender == proposalStructure.borrower,"Currently Borrow Proposal Case is only possible for testing, later Proposal Structure Modification Required");

        // (
        //     ,
        //     ,
        //     vars.reserve,
        //     vars.principalBorrowBalance,
        //     address reserveForCollateral,
        //     ,
        //     uint256 interestRate,
        //     uint256 dueDate,
        //     ,
        //     vars.originationFee ,
        //     ,
        //     ,
            
        // ) = dataProvider.getProposalData(_proposalId,_isBorrowProposal);

        // Check reserve validity
        vars.reserve = proposalStructure.reserveToReceive;
        requireReserveActiveInternal(vars.reserve);

        // set repay local variables
        vars.principalBorrowBalance = proposalStructure.amount;
        vars.compoundedBorrowBalance = proposalStructure.amount.add(vars.principalBorrowBalance * proposalStructure.interestRate / 100);
        vars.borrowBalanceIncrease = vars.compoundedBorrowBalance.sub(vars.principalBorrowBalance);

        // vars.originationFee = core.getUserOriginationFee(_reserve, msg.sender);
        vars.originationFee = proposalStructure.serviceFee;
        vars.isETH = EthAddressLib.ethAddress() == vars.reserve;

        require(vars.compoundedBorrowBalance > 0, "The user does not have any borrow pending");

        // proposalStructure에 borower 추가되면 주석 해제
        // require(
        //     proposalStructure.borrower == msg.sender,
        //     "To repay on behalf of an user an explicit amount to repay is needed."
        // );

        // pay origination fee to service
        require(
            vars.originationFee > 0,
            "Oigination Fee should be greater than 0"
        );

        core.transferToFeeCollectionAddress{value: vars.isETH ? vars.originationFee : 0}(
            vars.reserve,
            msg.sender,
            vars.originationFee,
            addressesProvider.getTokenDistributor()
        );

        console.log("\x1b[43m %s %s \x1b[0m", "\n   => LBPM : Fee Collected Amount", vars.originationFee);

        //default to max amount
        vars.paybackAmount = vars.compoundedBorrowBalance.add(vars.originationFee);
        vars.paybackAmountMinusFees = vars.paybackAmount.sub(vars.originationFee);

        // require(
        //     ((!vars.isETH && _amount == vars.paybackAmount) || (vars.isETH && vars.paybackAmount == msg.value)), 
        //     "Invalid amount parameter sent for the repayment"
        // );

        // Borrower should have enough balance to cover the repay
        require(
            core.getUserUnderlyingAssetBalance(vars.reserve, msg.sender) > vars.paybackAmount,
            "The user does not have enough balance to complete the repayment"
        );
        
        // Send the amount to repay to the core except the origination fee
        address payable senderPayable = payable(msg.sender);
        core.transferToReserve{value:vars.isETH ? msg.value.sub(vars.originationFee) : 0}(
            vars.reserve,
            senderPayable,
            vars.paybackAmountMinusFees
        );
        
        // UpdateOnRepayState로 repay 완료된 이후에 reserve data update
        // repaidWholeLoan = true
        uint256 userPrincipalBorrowBalanceCheck;
        uint256 userCompoundedBorrowBalanceCheck;
        uint256 userBorrowBalanceIncreaseCheck;
        (
            userPrincipalBorrowBalanceCheck, 
            userCompoundedBorrowBalanceCheck,
            userBorrowBalanceIncreaseCheck
        ) = core.getUserBorrowBalances(vars.reserve, msg.sender);

        // Update After Repayment and Service Fee Payment
        core.updateStateOnRepay(
            vars.reserve,
            msg.sender,
            vars.paybackAmountMinusFees,
            vars.originationFee,
            vars.borrowBalanceIncrease,
            false
        );

        // Repayment Finished
        // Redirect Creditor & Send paybackAmountMinusFees to Creditor
        // Burn NFT for entire loan process end
        uint256 _tokenIdFromCore = proposalStructure.tokenId;
        address payable ownerOfBond = payable(nft.ownerOf(_tokenIdFromCore));

        core.transferToUser(
            vars.reserve,
            ownerOfBond,
            vars.paybackAmountMinusFees
        );

        nft.burnNFT(_tokenIdFromCore);

        // From Core Contract Returning Borrower's Collateral AToken to Borrower
        address reserveForCollateral = proposalStructure.reserveForCollateral;
        uint256 collateralAmount = proposalStructure.collateralAmount;
        core.transferCollateralATokenOnRepay(msg.sender,reserveForCollateral,collateralAmount);

        emit Repay(
            vars.reserve,
            msg.sender,
            msg.sender,
            vars.paybackAmount,
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

    function liquidationCallProposeMode(
        uint256 _proposalId,
        bool _isBorrowProposal,
        bool _receiveAToken
    ) external payable nonReentrant {
        address liquidationManager = addressesProvider.getLendingBoardLiquidationManager();

        //solium-disable-next-line
        (bool success, bytes memory result) = liquidationManager.delegatecall(
            abi.encodeWithSignature(
                "liquidationCallProposeMode(uint256,bool,bool)",
                _proposalId,
                _isBorrowProposal,
                _receiveAToken
            )
        );
        require(success, "Liquidation Call for ProposeMode failed");

        (uint256 returnCode, string memory returnMessage) = abi.decode(result, (uint256, string));

        if (returnCode != 0) {
            //error found
            revert(string(abi.encodePacked("Liquidation failed: ", returnMessage)));
        }
    }


    // WIP : borrowProposal, borrowProposalAccept, getBorrowProposal, lendProposal, lendProposalAccept, getLendProposal

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

        userCurrentAvailableReserveBalanceInWei = userCurrentATokenBalance - userCurrentBorrowBalance;
        
        // userCurrentAvailableReserveBalance = userCurrentAvailableReserveBalanceInWei.div(10 ** 18);
        userCurrentAvailableReserveBalance = userCurrentAvailableReserveBalanceInWei;

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
        // require(_interestRate > 0 && _interestRate < 100,"Invalid Interest Rate Input");
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

        uint256 collateralNeededInWei = _amount
            .mul(requestedBorrowAmountInWei)
            .div(borrowLTV);
        
        uint256 collateralNeeded = collateralNeededInWei
            .div(oracle.getAssetPrice(_reserveForCollateral));
        
        require(userCurrentAvailableCollateralBalance >= collateralNeeded,"There is not enough collateral to cover a new borrow proposal");

        //calculating fees
        borrowLocalVars.borrowFee = feeProvider.calculateLoanOriginationFee(msg.sender, _amount);
        require(borrowLocalVars.borrowFee > 0, "The amount to borrow is too small");

        // If all conditions passed - Borrow Proposal Generated
        proposalVars.active = true;
        proposalVars.isAccepted = false;
        proposalVars.borrower = msg.sender;
        proposalVars.lender = zeroAddress; // Lender not yet set, so setting to zero Address
        proposalVars.reserveToReceive = _reserveToBorrow;
        // borrower의 collateral이 ltv를 고려했을 때 충분한 양을 가지고 있는지 확인 => 부족하면 _amount를 줄이라는 메세지 emit => 위에서 확인
        proposalVars.amount = _amount;
        // valid한 reserveForCollateral인지 확인 => 위에서 확인
        proposalVars.reserveForCollateral = _reserveForCollateral;
        // 필요한 Collateral amount는 Proposal Accept 시 정해진다. 일단 0으로 초기화
        proposalVars.collateralAmount = 0;
        // interestRate이 0 이상 100 이하(or 서비스 책정 최대 이자율 이하인지) 확인
        proposalVars.interestRate = _interestRate;
        proposalVars.dueDate = _dueDate;
        proposalVars.proposalDate = block.timestamp;
        proposalVars.serviceFee = borrowLocalVars.borrowFee;
        // LTV는 System Set
        proposalVars.ltv = borrowLTV;
        proposalVars.tokenId = 0;
        proposalVars.isRepayed = false;

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
        // borrowProposalVars = core.getBorrowProposalFromCore(_proposalId);
        borrowProposalVars = core.getProposalFromCore(_proposalId,true);

        // Lender의 소유 reserve(토큰)이 borrowProposalList[_proposalId].reserveToBorrow 보다 많거나 같은지 확인
        require(borrowProposalVars.active == true, "Only Active Borrow Proposal can be Accepted");

        address reserveToBorrow = borrowProposalVars.reserveToReceive;
        uint256 amount = borrowProposalVars.amount;
        address borrower = borrowProposalVars.borrower;
        uint256 borrowFee = borrowProposalVars.serviceFee;

        proposalAcceptInternal(reserveToBorrow,amount,_proposalId,borrower,msg.sender,borrowFee,true);
        // borrowProposalList[_proposalId].active = false;
    }
    
    function getBorrowProposal(uint256 _proposalId) 
        public
        view 
        returns(
            bool active,
            bool isAccepted,
            address borrower,
            address lender,
            address reserveToBorrow,
            uint256 amount,
            address reserveForCollateral,
            uint256 collateralAmount,
            uint256 interestRate,
            uint256 dueDate,
            uint256 proposalDate,
            uint256 ltv,
            uint256 tokenId,
            bool isRepayed
        )
    {   
            require(_proposalId >= 0 && _proposalId <= core.getBorrowProposalCount(), "Invalid _proposalId");

            CoreLibrary.ProposalStructure memory borrowProposalVars;

            // borrowProposalVars = core.getBorrowProposalFromCore(_proposalId);
            borrowProposalVars = core.getProposalFromCore(_proposalId,true);

            active = borrowProposalVars.active;
            isAccepted = borrowProposalVars.isAccepted;
            borrower = borrowProposalVars.borrower;
            lender = borrowProposalVars.lender;
            reserveToBorrow = borrowProposalVars.reserveToReceive;
            amount = borrowProposalVars.amount;
            reserveForCollateral = borrowProposalVars.reserveForCollateral;
            collateralAmount = borrowProposalVars.collateralAmount;
            interestRate = borrowProposalVars.interestRate;
            dueDate = borrowProposalVars.dueDate;
            proposalDate = borrowProposalVars.proposalDate;
            ltv = borrowProposalVars.ltv;
            tokenId = borrowProposalVars.tokenId;
            isRepayed = borrowProposalVars.isRepayed;
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
        // require(_interestRate > 0 && _interestRate < 100,"Invalid Interest Rate Input");
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

        // Lemd하기에 충분한 balance를 가지고 있는지 확인한다.
        require(userCurrentAvailableLendBalanceInWei >= _amount,"There is not enough balance to lend in order to cover a new lend proposal");

        lendLocarVars.lendFee = feeProvider.calculateLoanOriginationFee(msg.sender, _amount);
        require(lendLocarVars.lendFee > 0, "The amount to borrow is too small");

        proposalVars.active = true;
        proposalVars.isAccepted = false;
        proposalVars.borrower = zeroAddress;
        proposalVars.lender = msg.sender;
        proposalVars.reserveToReceive = _reserveToLend;
        proposalVars.amount = _amount;
        proposalVars.reserveForCollateral = _reserveForCollateral;
        // 필요한 Collateral amount는 Proposal Accept 시 정해진다. 일단 0으로 초기화
        proposalVars.collateralAmount = 0;
        proposalVars.interestRate = _interestRate;        
        proposalVars.dueDate = _dueDate;
        proposalVars.proposalDate = block.timestamp;
        proposalVars.serviceFee = lendLocarVars.lendFee;
        proposalVars.ltv = collateralLTV; // LTV는 System Set
        proposalVars.tokenId = 0; // Nft bond tokenId initialized with 0
        proposalVars.isRepayed = false;

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
        // lendProposalVars = core.getLendProposalFromCore(_proposalId);
        lendProposalVars = core.getProposalFromCore(_proposalId,false);

        // Lender의 소유 reserve(토큰)이 borrowProposalList[proposalId].reserveToBorrow 보다 많거나 같은지 확인
        require(lendProposalVars.active == true, "Only Active Borrow Proposal can be Accepted");
        address reserveToLend = lendProposalVars.reserveToReceive;
        uint256 amount = lendProposalVars.amount;
        address lender = lendProposalVars.lender;
        uint256 lendFee = lendProposalVars.serviceFee;
        // Borrower가 곧 msg.sender이기에 parameter로 전달한다.
        proposalAcceptInternal(reserveToLend,amount,_proposalId,msg.sender,lender,lendFee,false);
        // lendProposalList[_proposalId].active = false;
    }

    function getLendProposal(uint256 _proposalId) 
        public
        view 
        returns(
            bool active,
            bool isAccepted,
            address lender,
            address reserveToLend,
            uint256 amount,
            address reserveForCollateral,
            uint256 collateralAmount,
            uint256 interestRate,
            uint256 dueDate,
            uint256 proposalDate,
            uint256 ltv,
            uint256 tokenId,
            bool isRepayed
        )
    {   
            require(_proposalId >= 0 && _proposalId <= core.getLendProposalCount(), "Invalid _proposalId");

            CoreLibrary.ProposalStructure memory lendProposalVars;
            // lendProposalVars = core.getLendProposalFromCore(_proposalId);
            lendProposalVars = core.getProposalFromCore(_proposalId,false);

            active = lendProposalVars.active;
            lender = lendProposalVars.lender;
            reserveToLend = lendProposalVars.reserveToReceive;
            amount = lendProposalVars.amount;
            reserveForCollateral = lendProposalVars.reserveForCollateral;
            collateralAmount = lendProposalVars.collateralAmount;
            interestRate = lendProposalVars.interestRate;
            dueDate = lendProposalVars.dueDate;
            proposalDate = lendProposalVars.proposalDate;
            ltv = lendProposalVars.ltv;
            tokenId = lendProposalVars.tokenId;
            isRepayed = lendProposalVars.isRepayed;
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

        IPriceOracleGetter oracle = IPriceOracleGetter(addressesProvider.getPriceOracle());

        CoreLibrary.ProposalStructure memory proposalVar = core.getProposalFromCore(_proposalId,_isBorrowProposal);
        bool isAccepted = proposalVar.isAccepted;
        address reserveToReceive = proposalVar.reserveToReceive;
        address reserveForCollateral = proposalVar.reserveForCollateral;
        uint256 interestRate = proposalVar.interestRate;
        uint256 dueDate = proposalVar.dueDate;
        uint256 collateralLtv = proposalVar.ltv;

        require(isAccepted == false, "Current Proposal Already Accepted");

        uint256 collateralAmount;

        // Collateral Amount needed calculation
        uint256 receiveAssetBalanceInETH = oracle
            .getAssetPrice(reserveToReceive).mul(_amount);
        
        uint256 collateralOraclePriceInWei = oracle
            .getAssetPrice(reserveForCollateral);

        // Collateral Amount Calculation (in Wei unit)
        collateralAmount = receiveAssetBalanceInETH
            .div(collateralLtv)
            .mul(100)
            .div(collateralOraclePriceInWei);

        core.setProposalCollateralAmount(_proposalId, _isBorrowProposal, collateralAmount);

        uint256 paybackAmountMinusFee = _amount + (_amount * interestRate / 100);


        // Borrow Proposal Accept Case
        if(_isBorrowProposal){ // Borrow의 경우 Borrow Proposer의 담보가 충분한지 확인

            // Borrow Proposal Accept msg.sender will be Lender, so Lender's Balance Should be Checked
            uint256 userCurrentAvailableReserveBalanceInWei = getUserReserveBalance(_reserve,msg.sender).mul(10 ** 18);

            require(userCurrentAvailableReserveBalanceInWei >= _amount, "Lender doesn't have enough Reserve Balance to Accept Borrow Proposal");

        } else { // Lend Proposal Accept Case

            uint256 borrowAssetPriceInWei = oracle
                .getAssetPrice(_reserve)
                .mul(_amount)
                .div(10 ** 18); // potential error points
            uint256 borrowAssetPriceInEth = borrowAssetPriceInWei
                .div(10 ** 18);

            // amount가 parseEther로 들어가ㅏ기에 10^18로 나눠도 wei 단위로 표시됨
            uint256 userCollateralBalance = getUserReserveBalance(_reserve, msg.sender);
            uint256 userCollateralLtvAppliedValue = (userCollateralBalance)
                .mul(collateralLtv)
                .mul(collateralOraclePriceInWei)
                .div(10 ** 36);

            require(userCollateralLtvAppliedValue >= borrowAssetPriceInEth,"Borrower doesn't have enough collateral to accept Lend Proposal");
        }

        uint256 borrowBalanceIncreased; // WIP : Revision mandated

        (,borrowBalanceIncreased) = core.updateStateOnBorrowProposeMode(
            _reserve,
            _borrower,
            _amount,
            _serviceFee,
            CoreLibrary.InterestRateMode.STABLE,
            _isBorrowProposal,
            _proposalId 
        );

        // Borrower's Collateral AToken Sent to Core Contract Address
        // The Borrower's Collateral AToken from certain proposal should be transfered to the service
        core.transferCollateralATokenOnProposalAccept(_borrower,reserveForCollateral,collateralAmount);

        // Transfering the Token Borrow Proposer Desired
        address payable borrowerPayable = payable(_borrower);
        core.transferToUser(_reserve, borrowerPayable, _amount);

        // After Proposal Accepted => Deactivation
        // core.deactivateProposal(_proposalId,_isBorrowProposal); => Should be used when User declines Proposal

        // Proposal State Update on Proposal Accept
        core.updateProposalOnAccept(_proposalId,_isBorrowProposal);

        console.log("\x1b[43m%s\x1b[0m", "\n   => LBPM : NFT Minting Started");
        // @김주헌 Added Minting NFT & Send to Lender
        uint256 _tokenId;
        uint256 _contractTimestamp = block.timestamp;
        // require(block.timestamp <= _dueDate, "[!] Loan: Loan is expired");
        _tokenId = nft.mintNFT(_lender, _proposalId, _borrower, _amount, dueDate, _contractTimestamp, interestRate, paybackAmountMinusFee);
        
        console.log("\x1b[43m%s\x1b[0m", "\n   => LBPM : NFT Minting Done");

        if (_isBorrowProposal) {
            core.setTokenIdToBorrowProposalId(_proposalId, _tokenId);
            // Modify Proposal State
            core.setProposalLender(_proposalId, _isBorrowProposal, _lender);
        } else {
            core.setTokenIdToLendProposalId(_proposalId, _tokenId);
            // Modify Proposal State
            core.setProposalBorrower(_proposalId, _isBorrowProposal, _borrower); 
        }

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

    // Getter for Proposals
    function getBorrowProposalList(uint256 _startIdx, uint256 _endIdx) 
        public
        view
        returns(
            CoreLibrary.ProposalStructure [] memory result // struct BorrowProposal array
        )
    {
        return dataProvider.getBorrowProposalList(_startIdx, _endIdx);
    }

    function getLendProposalList(uint256 _startIdx, uint256 _endIdx) 
        public
        view
        returns(
            CoreLibrary.ProposalStructure [] memory result // struct BorrowProposal array
        )
    {
        return dataProvider.getLendProposalList(_startIdx, _endIdx);
    }

    // Returns Proposals the _user should Repay
    function getRepayProposalList(address _user) 
        public
        view
        returns(
            CoreLibrary.ProposalStructure[] memory result // struct LendProposal array
        )
    {
        return dataProvider.getRepayProposalList(_user);
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