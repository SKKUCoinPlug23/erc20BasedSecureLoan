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
      hardhatSampleToken,
      STKNaddress,
      PLUGaddress,
      hardhatPlugToken,
      hardhatLendingBoardNFT,
    };
  }

  /*
   * Test for Viction Horizon Hackathon : Scenario #1
   * 1. Make two Borrow Proposals
   * 
   */
  describe.only("<Proposal and Repayment Interaction>", function () {
    it("Borrow Proposal then Repay Case", async function () {
      const {
        owner,
        user1,
        hardhatLendingBoardProposeMode,
        hardhatLendingBoardConfigurator,
        hardhatLendingBoardCore,
        hardhatSampleToken,
        hardhatLendingBoardDataProvider,
        hardhatLendingBoardFeeProvider,
        STKNaddress,
        PLUGaddress,
        hardhatLendingBoardNFT
      } = await loadFixture(deployLendingBoardFixture);

      // borrow()
      var reserveData = await hardhatLendingBoardProposeMode.getReserveData(
        STKNaddress
      );
      // console.log(
      //   "STKN Reserve Data available Liquidity : ",
      //   reserveData.availableLiquidity.toString()
      // );
      // console.log(
      //   "Owner STKN amount : ",
      //   await hardhatSampleToken.balanceOf(owner.address)
      // );

      const borrowAmount1 = ethers.utils.parseEther("10");
      const borrowAmount2 = ethers.utils.parseEther("20");

      const interestRate = 10; // 일단은 parseEther 고려하지 않고 10으로 설정
      const dueDate = Date.now() + 100000;

      console.log("\n\n");
      console.log("\x1b[36m%s\x1b[0m", "╔════════════════════════════════════════════════╗");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "║                   0. Settings                  ║");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "║  - User1 : Borrow Proposer & Borrower          ║");
      console.log("\x1b[36m%s\x1b[0m", "║  - User2 : Lender                              ║");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "╚════════════════════════════════════════════════╝");

      // Borrowing STKN( = 2ETH) using PLUG( = 5ETH) as a collateral
      console.log("\n\n");
      console.log("\x1b[36m%s\x1b[0m", "╔════════════════════════════════════════════════╗");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "║           1. Making Borrow Proposals           ║");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "╚════════════════════════════════════════════════╝");
      console.log("\x1b[36m%s\x1b[0m", "=> User1 wants to lend some asset to others.");
      console.log("\x1b[36m%s\x1b[0m", "=> User1 makes two Borrow Proposals to service");

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
      await expect(
        hardhatLendingBoardProposeMode
          .connect(owner)
          .borrowProposal(
            STKNaddress,
            borrowAmount2,
            PLUGaddress,
            interestRate,
            dueDate
          )
      ).to.emit(hardhatLendingBoardProposeMode, "BorrowProposed");
      console.log("    [*] Borrow Proposal #2 Done");
      
      const generatedBorrowProposal = await hardhatLendingBoardProposeMode
        .connect(owner)
        .getBorrowProposal(0);

      // print Borrow Proposal #1 Data
      console.log("\x1b[32m%s\x1b[0m", "\n\nBorrow Proposal #1");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Borrower          :", generatedBorrowProposal.borrower);
      console.log(" Lender            :", generatedBorrowProposal.lender);
      console.log(" Amount            :", generatedBorrowProposal.amount.toString());
      console.log(" Collateral Amount :", generatedBorrowProposal.collateralAmount.toString());
      console.log(" Interest Rate     :", generatedBorrowProposal.interestRate.toString());
      console.log(" Due Date          :", generatedBorrowProposal.dueDate.toString());
      console.log(" LTV               :", generatedBorrowProposal.ltv.toString());
      console.log(" is Repayed        :", generatedBorrowProposal.isRepayed);
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Data from borowProposal needs to have a borrower's id matching that of owner.address.
      expect(owner.address).to.equal(generatedBorrowProposal.borrower);

      // User1's STKN Reserve Data before Borrow Proposal Accept
      let ownerSTKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          owner.address
        );
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

      // User1's STKN Reserve Data after Borrow Proposal Accept
      // WIP : 현재 User1의 currentBorrowBalance(대출량)이 증가하지 않는 문제 발생
      user1STKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          user1.address
        );
      // console.log("\x1b[36m%s\x1b[0m", "\n\nUser1's STKN Reserve Data After Borrow Proposal Accept");
      // console.log("\x1b[36m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      // console.log(user1STKNReserveData);
      // console.log("\x1b[36m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      ownerSTKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          owner.address
        );
      console.log("\x1b[32m%s\x1b[0m\x1b[34m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nUser1's STKN Reserve Data ", "After ", "Borrow Proposal Accept");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Current Borrow Balance   :", ownerSTKNReserveData.currentBorrowBalance.toString());
      console.log(" Principal Borrow Balance :", ownerSTKNReserveData.principalBorrowBalance.toString());
      console.log(" Origination Fee          :", ownerSTKNReserveData.originationFee.toString());
      console.log(" Current AToken Balance   :", ownerSTKNReserveData.currentATokenBalance.toString());
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

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


      // =========
      //    NFT
      // =========
      console.log("\n\n");
      console.log("\x1b[36m%s\x1b[0m", "╔════════════════════════════════════════════════╗");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "║                       3. NFT                   ║");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "╚════════════════════════════════════════════════╝");
      console.log("\x1b[36m%s\x1b[0m", "=> NFT is minted right after Borrow Proposal Accept");
      console.log("\x1b[36m%s\x1b[0m", "=> NFT is minted to the Lender");
      console.log("    [*] NFT is minted to the Lender");

      // Get Information of NFT (Get mapping Value) 
      let nftInfo1 = await hardhatLendingBoardNFT.connect(user1).getNFTMetadata(1);
      console.log("\x1b[32m%s\x1b[0m\x1b[34m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nMetadata of ", "NFT ", "for Borrow Proposal #1");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Proposal ID              :", nftInfo1.proposalId.toString());
      console.log(" Borrower                 :", nftInfo1.borrower);
      console.log(" Amount                   :", nftInfo1.amount.toString());
      console.log(" Due Date                 :", nftInfo1.dueDate.toString());
      console.log(" Timestamp                :", nftInfo1.contractTimestamp.toString());
      console.log(" Interest Rate            :", nftInfo1.interestRate.toString());
      console.log(" Payback Amount minus fee :", nftInfo1.paybackAmountMinusFee.toString());
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // check lender's NFT balance before repay & burn NFT
      const beforeNFTbalance = await hardhatLendingBoardNFT.balanceOf(user1.address);
      console.log("\x1b[32m%s\x1b[0m\x1b[34m%s\x1b[0m\x1b[32m%s\x1b[0m\x1b[31m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nLender's ", "NFT ", "Balance ", "Before ", "Repayment");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Lender's NFT Balance :", beforeNFTbalance.toString());
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // ===============
      //       repay
      // ===============
      console.log("\n\n");
      console.log("\x1b[36m%s\x1b[0m", "╔════════════════════════════════════════════════╗");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "║                   4. Repayment                 ║");
      console.log("\x1b[36m%s\x1b[0m", "║                                                ║");
      console.log("\x1b[36m%s\x1b[0m", "╚════════════════════════════════════════════════╝");
      console.log("\x1b[36m%s\x1b[0m", "=> User1 wants to repay the borrowed asset.");

      // if the Borrower of Proposal is not repaying, it should be reverted
      const invalidRepayer = user1;
      await expect(
        hardhatLendingBoardProposeMode.connect(invalidRepayer).repay(0, true)
      ).to.be.reverted;
      
      // User1 is the appropriate Borrower
      await hardhatLendingBoardProposeMode.connect(owner).repay(0, true);
      
      // Attempt on Repaying on a already Repayed Proposal should be reverted
      await expect(hardhatLendingBoardProposeMode.connect(owner).repay(0, true))
      .to.be.reverted;

      console.log("    [*] User1 repayment completed.");
      console.log("    [*] NFT for Borrow Proposal #1 is burned.");
      
      ownerSTKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          owner.address
        );
      console.log("\x1b[32m%s\x1b[0m\x1b[34m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nUser1's STKN Reserve Data ", "After ", "Repayment");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Current AToken Balance   :", ownerSTKNReserveData.currentATokenBalance.toString());
      console.log(" Current Borrow Balance   :", ownerSTKNReserveData.currentBorrowBalance.toString());
      console.log(" Principal Borrow Balance :", ownerSTKNReserveData.principalBorrowBalance.toString());
      console.log(" Origination Fee          :", ownerSTKNReserveData.originationFee.toString());
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      ownerPLUGReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          PLUGaddress,
          owner.address
        );
      console.log("\x1b[32m%s\x1b[0m\x1b[34m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nUser1's PLUG(Collateral) Reserve Data ", "After ", "Repayment");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Current AToken Balance   :", ownerPLUGReserveData.currentATokenBalance.toString());
      console.log(" Current Borrow Balance   :", ownerPLUGReserveData.currentBorrowBalance.toString());
      console.log(" Principal Borrow Balance :", ownerPLUGReserveData.principalBorrowBalance.toString());
      console.log(" Origination Fee          :", ownerPLUGReserveData.originationFee.toString());
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
          
      // check lender's NFT balance after repay & burn NFT
      const afterNFTbalance = await hardhatLendingBoardNFT.balanceOf(user1.address);
      console.log("\x1b[32m%s\x1b[0m\x1b[34m%s\x1b[0m\x1b[32m%s\x1b[0m\x1b[34m%s\x1b[0m\x1b[32m%s\x1b[0m", "\n\nLender's ", "NFT ", "Balance ", "After ", "Repayment");
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" Lender's NFT Balance :", afterNFTbalance.toString());
      console.log("\x1b[32m%s\x1b[0m", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });
  });
});
