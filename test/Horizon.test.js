const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("<LendingBoardProposeMode Contract Test Implementation>", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployLendingBoardFixture() {
    // Get the ContractFactory and Signers here.
    const [owner, user1, user2, borrower1, borrower2] =
      await ethers.getSigners();

    // Libraries
    const CoreLibrary = await ethers.getContractFactory("CoreLibrary");
    const hardhatCoreLibrary = await CoreLibrary.deploy();
    await hardhatCoreLibrary.deployed();

    // Main Contracts 객체 생성
    const LendingBoardProposeMode = await ethers.getContractFactory(
      "LendingBoardProposeMode"
    );
    const LendingBoardCore = await ethers.getContractFactory(
      "LendingBoardCore",
      {
        signer: owner,
        libraries: {
          CoreLibrary: hardhatCoreLibrary.address,
        },
      }
    );
    const LendingBoardConfigurator = await ethers.getContractFactory(
      "LendingBoardConfigurator"
    );
    const LendingBoardDataProvider = await ethers.getContractFactory(
      "LendingBoardDataProvider"
    );
    const LendingBoardParametersProvider = await ethers.getContractFactory(
      "LendingBoardParametersProvider"
    );
    const LendingBoardFeeProvider = await ethers.getContractFactory(
      "FeeProvider"
    );
    const LendingBoardLiquidationManager = await ethers.getContractFactory(
      "LendingBoardLiquidationManager"
    );
    const LendingBoardAddressesProvider = await ethers.getContractFactory(
      "LendingBoardAddressesProvider"
    );
    const TestOracle = await ethers.getContractFactory("TestOracle");
    const TestLendingRateOracle = await ethers.getContractFactory(
      "TestLendingRateOracle"
    );
    const TokenDistributor = await ethers.getContractFactory(
      "TokenDistributor"
    );
    const LendingBoardNFT = await ethers.getContractFactory("LendingBoardNFT");

    // Main Contracts Deployment
    const hardhatLendingBoardProposeMode =
      await LendingBoardProposeMode.deploy();
    await hardhatLendingBoardProposeMode.deployed();
    const hardhatLendingBoardCore = await LendingBoardCore.deploy();
    await hardhatLendingBoardCore.deployed();
    const hardhatLendingBoardConfigurator =
      await LendingBoardConfigurator.deploy();
    await hardhatLendingBoardConfigurator.deployed();
    const hardhatLendingBoardDataProvider =
      await LendingBoardDataProvider.deploy();
    await hardhatLendingBoardDataProvider.deployed();
    const hardhatLendingBoardParametersProvider =
      await LendingBoardParametersProvider.deploy();
    await hardhatLendingBoardParametersProvider.deployed();
    const hardhatLendingBoardFeeProvider =
      await LendingBoardFeeProvider.deploy();
    await hardhatLendingBoardFeeProvider.deployed();
    const hardhatLendingBoardLiquidationManager =
      await LendingBoardLiquidationManager.deploy();
    await hardhatLendingBoardLiquidationManager.deployed();
    const hardhatLendingBoardAddressesProvider =
      await LendingBoardAddressesProvider.deploy();
    await hardhatLendingBoardAddressesProvider.deployed();
    const hardhatTestOracle = await TestOracle.deploy();
    await hardhatTestOracle.deployed();
    const hardhatTestLendingRateOracle = await TestLendingRateOracle.deploy();
    await hardhatTestLendingRateOracle.deployed();
    const hardhatTokenDistributor = await TokenDistributor.deploy();
    await hardhatTokenDistributor.deployed();
    const hardhatLendingBoardNFT = await LendingBoardNFT.deploy(); // NFT Minting Contracts Deployment
    await hardhatLendingBoardNFT.deployed();
    // Test -> might be erased
    // console.log("NFT Token Deployed to : ", hardhatLendingBoardNFT.address);

    // Using LendingBoardAddressesProvider(LBAP) set the deployed Smart Contract address to the appropriate location
    await hardhatLendingBoardAddressesProvider.setLendingBoardImpl(
      hardhatLendingBoardProposeMode.address
    );
    await hardhatLendingBoardAddressesProvider.setLendingBoardCoreImpl(
      hardhatLendingBoardCore.address
    );
    await hardhatLendingBoardAddressesProvider.setLendingBoardConfiguratorImpl(
      hardhatLendingBoardConfigurator.address
    );
    await hardhatLendingBoardAddressesProvider.setLendingBoardDataProviderImpl(
      hardhatLendingBoardDataProvider.address
    );
    await hardhatLendingBoardAddressesProvider.setLendingBoardParametersProviderImpl(
      hardhatLendingBoardParametersProvider.address
    );
    await hardhatLendingBoardAddressesProvider.setFeeProviderImpl(
      hardhatLendingBoardFeeProvider.address
    );
    await hardhatLendingBoardAddressesProvider.setLendingBoardNFTImpl(
      hardhatLendingBoardNFT.address
    ); // Newly updated for NFT

    // Setting address for contracts that are outside the context of the protocol
    await hardhatLendingBoardAddressesProvider.setLendingBoardLiquidationManager(
      hardhatLendingBoardLiquidationManager.address
    );
    await hardhatLendingBoardAddressesProvider.setLendingBoardManager(
      owner.address
    );
    await hardhatLendingBoardAddressesProvider.setPriceOracle(
      hardhatTestOracle.address
    );
    await hardhatLendingBoardAddressesProvider.setLendingRateOracle(
      hardhatTestLendingRateOracle.address
    );
    await hardhatLendingBoardAddressesProvider.setTokenDistributor(
      hardhatTokenDistributor.address
    );
    // await hardhatLendingBoardAddressesProvider.setLendingRateOracle();

    // LBAP 이용한 setter가 정상작동했는지 expect를 이용하여 확인
    const addressStoredInAddressesProvider =
      await hardhatLendingBoardAddressesProvider.getLendingBoard();
    expect(addressStoredInAddressesProvider).to.equal(
      hardhatLendingBoardProposeMode.address
    );

    // 각 Main Contract의 initialize()를 이용하여 initialization 수행
    await hardhatLendingBoardProposeMode.initialize(
      hardhatLendingBoardAddressesProvider.address
    );
    await hardhatLendingBoardCore.initialize(
      hardhatLendingBoardAddressesProvider.address
    );
    await hardhatLendingBoardConfigurator.initialize(
      hardhatLendingBoardAddressesProvider.address
    );
    await hardhatLendingBoardDataProvider.initialize(
      hardhatLendingBoardAddressesProvider.address
    );
    await hardhatLendingBoardParametersProvider.initialize(
      hardhatLendingBoardAddressesProvider.address
    );
    await hardhatLendingBoardFeeProvider.initialize(
      hardhatLendingBoardAddressesProvider.address
    );
    // await hardhatLendingBoardLiquidationManager.initialize(hardhatLendingBoardAddressesProvider.address);
    // since DISTRIBUTION_BASE = 10000; set in TokenDistributor.sol dummy data for percentages set like below
    await hardhatTokenDistributor.initialize(
      [owner.address, user1.address, user2.address],
      [4000, 3000, 2000]
    );

    // SampleToken(STKN) Deployment for Testing. SampleToken.sol에서 가져옴
    const SampleToken = await ethers.getContractFactory("SampleToken");
    const hardhatSampleToken = await SampleToken.deploy();
    await hardhatSampleToken.deployed();

    // Sample Token Address 확인
    const STKNaddress = hardhatSampleToken.address;
    // console.log("STKNaddress : ",STKNaddress);

    // 임의로 TestOracle AssetPrice 및 TestLendingRateOracle의 LendingRate 설정
    const STKNPrice = ethers.utils.parseEther("2");
    // console.log("STKN Price : ", STKNPrice);
    await hardhatTestOracle.setAssetPrice(STKNaddress, STKNPrice);

    const STKNLendingRate = ethers.utils.parseEther("0.05");
    await hardhatTestLendingRateOracle.setMarketBorrowRate(
      STKNaddress,
      STKNLendingRate
    );

    // PlugToken(PLUG) Deployment
    const PlugToken = await ethers.getContractFactory("PlugToken");
    const hardhatPlugToken = await PlugToken.deploy();
    await hardhatPlugToken.deployed();

    const PLUGaddress = hardhatPlugToken.address;

    const PLUGPrice = ethers.utils.parseEther("5");
    await hardhatTestOracle.setAssetPrice(PLUGaddress, PLUGPrice);

    const PLUGLendingRate = ethers.utils.parseEther("0.1");
    await hardhatTestLendingRateOracle.setMarketBorrowRate(
      PLUGaddress,
      PLUGLendingRate
    );

    // Default Reserve Interest-Rate Strategy Contract Setting
    const DefaultReserveInterestRateStrategy = await ethers.getContractFactory(
      "DefaultReserveInterestRateStrategy"
    );

    // STKN Interest Rate Strategy setting
    // WIP : Decimal이 18인지 27인지 잘 모르겠음
    const sampleBaseVariableRate = ethers.utils.parseUnits("0.02", 18); // 2% annual interest rate
    const sampleVariableRateSlope1 = ethers.utils.parseUnits("0.1", 18); // 10% increase in the annual interest rate for each increase of 1 in the utilization rate, applys the same logic in the below variables
    const sampleVariableRateSlope2 = ethers.utils.parseUnits("0.5", 18);
    const sampleStableRateSlope1 = ethers.utils.parseUnits("0.1", 18);
    const sampleStableRateSlope2 = ethers.utils.parseUnits("0.5", 18);

    const STKNhardhatDefaultReserveInterestRateStrategy =
      await DefaultReserveInterestRateStrategy.deploy(
        STKNaddress,
        hardhatLendingBoardAddressesProvider.address,
        sampleBaseVariableRate,
        sampleVariableRateSlope1,
        sampleVariableRateSlope2,
        sampleStableRateSlope1,
        sampleStableRateSlope2
      );
    await STKNhardhatDefaultReserveInterestRateStrategy.deployed();
    const STKNstrategyAddress =
      STKNhardhatDefaultReserveInterestRateStrategy.address;
    // 생성한 STKN의 Reserve를 initialization 해준다.
    await hardhatLendingBoardConfigurator.initReserve(
      STKNaddress,
      18,
      STKNstrategyAddress
    );
    // await hardhatLendingBoardConfigurator.setReserveInterestRateStrategyAddress(STKNaddress,STKNstrategyAddress)

    // PLUG Interest Rate Strategy setting
    const PLUGhardhatDefaultReserveInterestRateStrategy =
      await DefaultReserveInterestRateStrategy.deploy(
        PLUGaddress,
        hardhatLendingBoardAddressesProvider.address,
        sampleBaseVariableRate,
        sampleVariableRateSlope1,
        sampleVariableRateSlope2,
        sampleStableRateSlope1,
        sampleStableRateSlope2
      );
    await PLUGhardhatDefaultReserveInterestRateStrategy.deployed();
    const PLUGstrategyAddress =
      PLUGhardhatDefaultReserveInterestRateStrategy.address;
    // 생성한 STKN의 Reserve를 initialization 해준다.
    await hardhatLendingBoardConfigurator.initReserve(
      PLUGaddress,
      18,
      PLUGstrategyAddress
    );

    // user1에게 STKN과 PLUG를 전송해준다.
    const transferAmount = ethers.utils.parseEther("3000");
    await hardhatSampleToken
      .connect(owner)
      .transfer(user1.address, transferAmount);
    await hardhatPlugToken
      .connect(owner)
      .transfer(user1.address, transferAmount);

    // user2(Liquidator)에게도 동일하게 전송
    await hardhatSampleToken
      .connect(owner)
      .transfer(user2.address, transferAmount);
    await hardhatPlugToken
      .connect(owner)
      .transfer(user2.address, transferAmount);

    // Approve LendingBoard contract to spend tokens
    const approveAmount = ethers.utils.parseEther("2000");

    // console.log(
    //   " ====================== Depositing STKN and PLUG ======================"
    // );
    // Send the approval transaction. The address should be LBCore not LB itself.
    // Owner의 approval 및 deposit
    let approvalResult = await hardhatSampleToken
      .connect(owner)
      .approve(hardhatLendingBoardCore.address, approveAmount);
    approvalResult = await hardhatPlugToken
      .connect(owner)
      .approve(hardhatLendingBoardCore.address, approveAmount);

    // deposit() 이용하여 서비스에 STKN 예치
    const depositAmount = ethers.utils.parseEther("1000");

    // STKN 1000개 예치
    await hardhatLendingBoardProposeMode
      .connect(owner)
      .deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
    // PLUG 1000개 예치
    await hardhatLendingBoardProposeMode
      .connect(owner)
      .deposit(PLUGaddress, depositAmount, 0); // Set Referral Code = 0

    // console.log(
    //   " ====================== ====================== ======================"
    // );

    // User1의 approval 및 Deposit
    approvalResult = await hardhatSampleToken
      .connect(user1)
      .approve(hardhatLendingBoardCore.address, approveAmount);
    approvalResult = await hardhatPlugToken
      .connect(user1)
      .approve(hardhatLendingBoardCore.address, approveAmount);

    await hardhatLendingBoardProposeMode
      .connect(user1)
      .deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
    await hardhatLendingBoardProposeMode
      .connect(user1)
      .deposit(PLUGaddress, depositAmount, 0); // Set Referral Code = 0

    // console.log(
    //   " ====================== ====================== ======================"
    // );

    // User2의 approval 및 Deposit
    approvalResult = await hardhatSampleToken
      .connect(user2)
      .approve(hardhatLendingBoardCore.address, approveAmount);
    approvalResult = await hardhatPlugToken
      .connect(user2)
      .approve(hardhatLendingBoardCore.address, approveAmount);

    await hardhatLendingBoardProposeMode
      .connect(user2)
      .deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
    await hardhatLendingBoardProposeMode
      .connect(user2)
      .deposit(PLUGaddress, depositAmount, 0); // Set Referral Code = 0

    // console.log(
    //   " ====================== ====================== ======================"
    // );

    let baseLTVasCollateral, liquidationThreshold, liquidationBonus;
    // configuring STKN Reserve for Borrowing and Collateral
    await hardhatLendingBoardConfigurator
      .connect(owner)
      .enableBorrowingOnReserve(STKNaddress, true);
    // WIP : parseEther('0.70') 으로 해야할지 '70'일지 '0.70'일지
    // baseLTVasCollateral = ethers.utils.parseEther('0.5');
    baseLTVasCollateral = "50";
    // liquidationThreshold = ethers.utils.parseEther('0.70');
    liquidationThreshold = "70";
    // liquidationBonus = ethers.utils.parseEther('0.01');
    // WIP : 기존에는 10으로 설정했는데 calculateAvailableCollateralToLiquidate() 계산과정 확인해보니 100 + 10 = 110 으로 설정하는게 맞는듯
    liquidationBonus = "110";

    await hardhatLendingBoardConfigurator
      .connect(owner)
      .enableReserveAsCollateral(
        STKNaddress,
        baseLTVasCollateral,
        liquidationThreshold,
        liquidationBonus
      );

    await hardhatLendingBoardProposeMode
      .connect(owner)
      .setUserUseReserveAsCollateral(STKNaddress, 1); // 1 : enable, 0 : disable
    await hardhatLendingBoardProposeMode
      .connect(user1)
      .setUserUseReserveAsCollateral(STKNaddress, 1); // 1 : enable, 0 : disable

    // configuring PLUG Reserve for Borrowing and Collateral
    await hardhatLendingBoardConfigurator
      .connect(owner)
      .enableBorrowingOnReserve(PLUGaddress, true);
    // baseLTVasCollateral = ethers.utils.parseEther('0.5');
    baseLTVasCollateral = "50";
    // liquidationThreshold = ethers.utils.parseEther('0.70');
    liquidationThreshold = "70";
    // liquidationBonus = ethers.utils.parseEther('0.01');
    liquidationBonus = "110";

    await hardhatLendingBoardConfigurator
      .connect(owner)
      .enableReserveAsCollateral(
        PLUGaddress,
        baseLTVasCollateral,
        liquidationThreshold,
        liquidationBonus
      );

    await hardhatLendingBoardProposeMode
      .connect(owner)
      .setUserUseReserveAsCollateral(PLUGaddress, 1); // 1 : enable, 0 : disable
    await hardhatLendingBoardProposeMode
      .connect(user1)
      .setUserUseReserveAsCollateral(PLUGaddress, 1); // 1 : enable, 0 : disable
    // console.log("set PLUG as Collateral enabled");

    // Fixtures can return anything you consider useful for your tests
    return {
      owner,
      user1,
      user2,
      borrower1,
      borrower2,
      LendingBoardProposeMode,
      hardhatLendingBoardProposeMode,
      hardhatLendingBoardAddressesProvider,
      hardhatLendingBoardCore,
      hardhatLendingBoardConfigurator,
      hardhatLendingBoardDataProvider,
      hardhatLendingBoardFeeProvider,
      hardhatLendingBoardLiquidationManager,
      hardhatSampleToken,
      STKNaddress,
      PLUGaddress,
      hardhatLendingBoardNFT
    };
  }

  // describe.only 로 아래 Liquidation Situation 만 Test Run
  describe.only("<Liquidation Situation>", function () {
    it("Should be underCollateralized and be ready for liquidation", async function () {
      const {
        owner,
        user1,
        user2,
        hardhatLendingBoardProposeMode,
        hardhatLendingBoardConfigurator,
        hardhatLendingBoardCore,
        hardhatSampleToken,
        hardhatLendingBoardDataProvider,
        hardhatLendingBoardFeeProvider,
        hardhatLendingBoardLiquidationManager,
        STKNaddress,
        PLUGaddress,
        hardhatLendingBoardNFT
      } = await loadFixture(deployLendingBoardFixture);

      const borrowAmount1 = ethers.utils.parseEther("10");
      const borrowAmount2 = ethers.utils.parseEther("20");

      const interestRate = 10; // 일단은 parseEther 고려하지 않고 10으로 설정
      // dueDate의 경우 임의로 현재시간의 + 100000 으로 설정한다.
      const dueDate = Date.now() + 100000;

      console.log("\n\n");
      console.log("\x1b[36m%s\x1b[0m", "╔════════════════════════════════════════════════╗");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "║                   0. Settings                  ║");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "║  - User1 : Borrow Proposer & Borrower          ║");
      console.log("\x1b[36m%s\x1b[0m", "║  - User2 : Lender                              ║");
      console.log("\x1b[36m%s\x1b[0m", "║  - User3 : Liquidator                          ║");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "╚════════════════════════════════════════════════╝");

      // Borrowing STKN( = 2ETH) using PLUG( = 5ETH) as a collateral
      console.log("\n\n");
      console.log("\x1b[36m%s\x1b[0m", "╔════════════════════════════════════════════════╗");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "║           1. Making Borrow Proposals           ║");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "╚════════════════════════════════════════════════╝");
      console.log("\x1b[36m%s\x1b[0m", "=> User1 wants to borrow some asset to others.");
      console.log("\x1b[36m%s\x1b[0m", "=> User1 makes a Borrow Proposal to service.");
      
      await expect(
        hardhatLendingBoardProposeMode
          .connect(owner)
          .borrowProposal(
            STKNaddress,
            borrowAmount1,
            PLUGaddress,
            interestRate,
            dueDate
          )
      ).to.emit(hardhatLendingBoardProposeMode, "BorrowProposed");
      console.log("    [*] Borrow Proposal #1 Done");

      // getBorrowProposalList()를 확인하기 위해 동일한 Proposal 두개를 생성한다.
      // await expect(hardhatLendingBoardProposeMode.connect(owner).borrowProposal(STKNaddress,borrowAmount2,PLUGaddress,interestRate,dueDate)).to.emit(hardhatLendingBoardProposeMode,"BorrowProposed");

      // const generatedBorrowProposal = await hardhatLendingBoardProposeMode
      //   .connect(owner)
      //   .getBorrowProposal(0);

      let proposalLiquidationAvailability =
        await hardhatLendingBoardDataProvider.getProposalLiquidationAvailability(
          0,
          true
        ); // _isBorrowProposal == true
      console.log("\x1b[32m%s\x1b[0m\x1b[31m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nLiquidation Availability of Proposal ", "Before ", "Borrow Proposal Accept");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Proposal Liquidation Availability : ", proposalLiquidationAvailability);
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("\x1b[33m%s\x1b[0m", "--> Borrow Proposal should be accepted before Liquidation.");

      // Owner's STKN Balance before Proposal Accept
      var ownerSTKNReserveData = await hardhatLendingBoardDataProvider.getUserReserveData(
        STKNaddress,
        owner.address
      )
      console.log("\x1b[32m%s\x1b[0m\x1b[31m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nUser1's STKN Reserve Data ", "Before ", "Borrow Proposal Accept");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Current AToken Balance   :", ownerSTKNReserveData.currentATokenBalance.toString());
      console.log(" Current Borrow Balance   :", ownerSTKNReserveData.currentBorrowBalance.toString());
      console.log(" Principal Borrow Balance :", ownerSTKNReserveData.principalBorrowBalance.toString());
      console.log(" Origination Fee          :", ownerSTKNReserveData.originationFee.toString());
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      let ownerPLUGReserveData =
      await hardhatLendingBoardDataProvider.getUserReserveData(
        PLUGaddress,
        owner.address
        );
      console.log("\x1b[32m%s\x1b[0m\x1b[31m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nUser1's PLUG(Collateral) Reserve Data ", "Before ", "Borrow Proposal Accept");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Current AToken Balance   :", ownerPLUGReserveData.currentATokenBalance.toString());
      console.log(" Current Borrow Balance   :", ownerPLUGReserveData.currentBorrowBalance.toString());
      console.log(" Principal Borrow Balance :", ownerPLUGReserveData.principalBorrowBalance.toString());
      console.log(" Origination Fee          :", ownerPLUGReserveData.originationFee.toString());
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      // User1 accepts Borrow Proposal #1
      console.log("\n\n");
      console.log("\x1b[36m%s\x1b[0m", "╔════════════════════════════════════════════════╗");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "║          2. Accepting Borrow Proposal          ║");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "╚════════════════════════════════════════════════╝");
      console.log("\x1b[36m%s\x1b[0m", "=> User2 wants to lend some asset to others.");
      console.log("\x1b[36m%s\x1b[0m", "=> User2 found Proposal #1 in the service, accepts it.");

      await hardhatLendingBoardProposeMode
        .connect(user1)
        .borrowProposalAccept(0);
      console.log("    [*] Borrow Proposal #1 Accepted");
      
      // proposalLiquidationAvailability =
      // await hardhatLendingBoardDataProvider.getProposalLiquidationAvailability(
      //   0,
      //   true
      // ); // _isBorrowProposal == true
      // console.log("\x1b[32m%s\x1b[0m\x1b[34m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nLiquidation Availability of Proposal ", "After ", "Borrow Proposal Accept");
      // console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      // console.log(" Proposal Liquidation Availability : ", proposalLiquidationAvailability);
      // console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      ownerSTKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          owner.address
        );
      console.log("\x1b[32m%s\x1b[0m\x1b[34m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nUser1's STKN Reserve Data ", "After ", "Borrow Proposal Accept");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Current AToken Balance   :", ownerSTKNReserveData.currentATokenBalance.toString());
      console.log(" Current Borrow Balance   :", ownerSTKNReserveData.currentBorrowBalance.toString());
      console.log(" Principal Borrow Balance :", ownerSTKNReserveData.principalBorrowBalance.toString());
      console.log(" Origination Fee          :", ownerSTKNReserveData.originationFee.toString());
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("\x1b[33m%s\x1b[0m", "--> Borrow Balance Values are changed.");
      console.log("\x1b[33m%s\x1b[0m", "--> Also Origination Fee is charged.");

      ownerPLUGReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          PLUGaddress,
          owner.address
        );
      console.log("\x1b[32m%s\x1b[0m\x1b[34m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nUser1's PLUG(Collateral) Reserve Data ", "After ", "Borrow Proposal Accept");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Current AToken Balance   :", ownerPLUGReserveData.currentATokenBalance.toString());
      console.log(" Current Borrow Balance   :", ownerPLUGReserveData.currentBorrowBalance.toString());
      console.log(" Principal Borrow Balance :", ownerPLUGReserveData.principalBorrowBalance.toString());
      console.log(" Origination Fee          :", ownerPLUGReserveData.originationFee.toString());
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("\x1b[33m%s\x1b[0m", "--> Amount of PLUG(Collateral) decreased.");

      
      /*
       * Liquidation Part
       */
      console.log("\n\n");
      console.log("\x1b[36m%s\x1b[0m", "╔════════════════════════════════════════════════╗");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "║          3. Before Liquidation by User3        ║");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "╚════════════════════════════════════════════════╝");
      console.log("\x1b[36m%s\x1b[0m", "=> User3 wants to liquidate someone's Borrow Position.");

      // let liquidatorSTKNReserveData =
      //   await hardhatLendingBoardDataProvider.getUserReserveData(
      //     STKNaddress,
      //     user2.address
      //   );
      // console.log("\x1b[32m%s\x1b[0m\x1b[31m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nUser3's STKN Reserve Data ", "Before ", "Liquidation Execution");
      // console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      // console.log(" Current AToken Balance   :", liquidatorSTKNReserveData.currentATokenBalance.toString());
      // console.log(" Current Borrow Balance   :", liquidatorSTKNReserveData.currentBorrowBalance.toString());
      // console.log(" Principal Borrow Balance :", liquidatorSTKNReserveData.principalBorrowBalance.toString());
      // console.log(" Origination Fee          :", liquidatorSTKNReserveData.originationFee.toString());
      // console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      let liquidatorPLUGReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          PLUGaddress,
          user2.address
        );
      console.log("\x1b[32m%s\x1b[0m\x1b[31m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nUser3's PLUG(Collateral) Reserve Data ", "Before ", "Liquidation Execution");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Current AToken Balance   :", liquidatorPLUGReserveData.currentATokenBalance.toString());
      console.log(" Current Borrow Balance   :", liquidatorPLUGReserveData.currentBorrowBalance.toString());
      console.log(" Principal Borrow Balance :", liquidatorPLUGReserveData.principalBorrowBalance.toString());
      console.log(" Origination Fee          :", liquidatorPLUGReserveData.originationFee.toString());
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // // check lender's NFT balance before repay & burn NFT
      // const beforeNFTbalance = await hardhatLendingBoardNFT.balanceOf(user1.address);
      // console.log("\x1b[32m%s\x1b[0m\x1b[34m%s\x1b[0m\x1b[32m%s\x1b[0m\x1b[31m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nLender's ", "NFT ", "Balance ", "Before ", "Liquidation Execution");
      // console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      // console.log(" Lender's NFT Balance :", beforeNFTbalance.toString());
      // console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // const borrowProposalDataFromCore = await hardhatLendingBoardCore.connect(user2).getProposalFromCore(0,true);
      // const borrowProposalDataFromCore = await hardhatLendingBoardDataProvider.connect(user2).getProposalData(0,true);
      // console.log(" Borrow Proposal From Core : ",borrowProposalDataFromCore);

      // Direct Access to Liquidation Manager for Testing
      // user2 set as LIquidator
      console.log("\n\n");
      console.log("\x1b[36m%s\x1b[0m", "╔════════════════════════════════════════════════╗");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "║          4. After Liquidation by User3         ║");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "╚════════════════════════════════════════════════╝");
      console.log("\x1b[36m%s\x1b[0m", "=> User3 liquidates User1's Borrow Position.");

      await hardhatLendingBoardProposeMode
        .connect(user2)
        .liquidationCallProposeMode(0, true, true);
      console.log("    [*] Borrow Proposal #1 Liquidated");

      // var ownerSTKNReserveData = await hardhatLendingBoardDataProvider.getUserReserveData(
      //   STKNaddress,
      //   owner.address
      // )
      // console.log("\x1b[32m%s\x1b[0m\x1b[36m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nUser1's STKN Reserve Data ", "After ", "Liquidation Execution");
      // console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      // console.log(" Current AToken Balance   :", ownerSTKNReserveData.currentATokenBalance.toString());
      // console.log(" Current Borrow Balance   :", ownerSTKNReserveData.currentBorrowBalance.toString());
      // console.log(" Principal Borrow Balance :", ownerSTKNReserveData.principalBorrowBalance.toString());
      // console.log(" Origination Fee          :", ownerSTKNReserveData.originationFee.toString());
      // console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      // console.log("\x1b[33m%s\x1b[0m", "--> User3 liquidates User1's Borrow Position.");
      // console.log("\x1b[33m%s\x1b[0m", "--> User1 do not have to pat origination fee.");
      // console.log("\x1b[33m%s\x1b[0m", "--> Still, User1 has to pay back the Borrowed Amount.");

      ownerPLUGReserveData =
      await hardhatLendingBoardDataProvider.getUserReserveData(
        PLUGaddress,
        owner.address
        );
      console.log("\x1b[32m%s\x1b[0m\x1b[36m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nUser1's PLUG(Collateral) Reserve Data ", "After ", "Liquidation Execution");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Current AToken Balance   :", ownerPLUGReserveData.currentATokenBalance.toString());
      console.log(" Current Borrow Balance   :", ownerPLUGReserveData.currentBorrowBalance.toString());
      console.log(" Principal Borrow Balance :", ownerPLUGReserveData.principalBorrowBalance.toString());
      console.log(" Origination Fee          :", ownerPLUGReserveData.originationFee.toString());
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("\x1b[33m%s\x1b[0m", "--> Borrow Position is Liquidated, so User1's PLUG(Collateral) is decreased.");

      // liquidatorSTKNReserveData =
      //   await hardhatLendingBoardDataProvider.getUserReserveData(
      //     STKNaddress,
      //     user2.address
      //   );
      // console.log("\x1b[32m%s\x1b[0m\x1b[36m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nUser3's STKN Reserve Data ", "After ", "Liquidation Execution");
      // console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      // console.log(" Current AToken Balance   :", liquidatorSTKNReserveData.currentATokenBalance.toString());
      // console.log(" Current Borrow Balance   :", liquidatorSTKNReserveData.currentBorrowBalance.toString());
      // console.log(" Principal Borrow Balance :", liquidatorSTKNReserveData.principalBorrowBalance.toString());
      // console.log(" Origination Fee          :", liquidatorSTKNReserveData.originationFee.toString());
      // console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      liquidatorPLUGReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          PLUGaddress,
          user2.address
        );
      console.log("\x1b[32m%s\x1b[0m\x1b[36m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nUser3's PLUG(Collateral) Reserve Data ", "After ", "Liquidation Execution");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Current AToken Balance   :", liquidatorPLUGReserveData.currentATokenBalance.toString());
      console.log(" Current Borrow Balance   :", liquidatorPLUGReserveData.currentBorrowBalance.toString());
      console.log(" Principal Borrow Balance :", liquidatorPLUGReserveData.principalBorrowBalance.toString());
      console.log(" Origination Fee          :", liquidatorPLUGReserveData.originationFee.toString());
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("\x1b[33m%s\x1b[0m", "--> User3 got some PLUG(Collateral) as a reward of Liquidation.");

      // // check lender's NFT balance after liquidation & burn NFT
      // const afterNFTbalance = await hardhatLendingBoardNFT.balanceOf(owner.address);
      // console.log("\x1b[32m%s\x1b[0m\x1b[34m%s\x1b[0m\x1b[32m%s\x1b[0m\x1b[31m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nLender's ", "NFT ", "Balance ", "After ", "Liquidation Execution");
      // console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      // console.log(" Lender's NFT Balance :", afterNFTbalance.toString());
      // console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });
  });
});
