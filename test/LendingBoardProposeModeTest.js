const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("\x1b[44m<LendingBoardProposeMode Contract Test Implementation>", function () {
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
    console.log("hardhatLendingBoardAddressesProvider deployed to : ", hardhatLendingBoardAddressesProvider.address);
    console.log("NFT Token Deployed to : ", hardhatLendingBoardNFT.address);

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
    console.log("STKN Price : ", STKNPrice);
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

    console.log(
      " ====================== Depositing STKN and PLUG ======================"
    );
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

    console.log(
      " ====================== ====================== ======================"
    );

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

    console.log(
      " ====================== ====================== ======================"
    );

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

    console.log(
      " ====================== ====================== ======================"
    );

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
    };
  }

  describe("\x1b[44m<<Initializations>", function () {
    it("\x1b[45m Should Deploy Successfully and Set the proper address", async function () {
      const { hardhatLendingBoardProposeMode, owner } = await loadFixture(
        deployLendingBoardFixture
      );
      // expect(await hardhatLendingBoardProposeMode.owner()).to.equal(owner.address);
    });
  });

  describe("\x1b[44m<<Lending Board Interaction>", function () {
    it("\x1b[45m Depositing Sample Token to Service For the First Time", async function () {
      // loadFixture 이용해서 필요한 객체들을 가져온다.
      const { owner, hardhatLendingBoardProposeMode, STKNaddress } =
        await loadFixture(deployLendingBoardFixture);

      // deposit() 이용하여 서비스에 STKN 예치
      const depositAmount = ethers.utils.parseEther("10");
      console.log("Deposit Amount : ", depositAmount.toString());
      await hardhatLendingBoardProposeMode
        .connect(owner)
        .deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
    });

    it("\x1b[45m Getting Reserve Configuration Data", async function () {
      const {
        owner,
        addr1,
        hardhatLendingBoardProposeMode,
        hardhatLendingBoardAddressesProvider,
        hardhatLendingBoardCore,
        hardhatLendingBoardConfigurator,
        hardhatSampleToken,
        hardhatLendingBoardDataProvider,
        STKNaddress,
      } = await loadFixture(deployLendingBoardFixture);
      // STKN의 Reserve getter function test
      const reserveData = await hardhatLendingBoardProposeMode.getReserveData(
        STKNaddress
      );
      // console.log("STKN Reserve Data : ",reserveData);
    });

    it("\x1b[45m Borrow Proposal Test Case", async function () {
      const {
        owner,
        user1,
        hardhatLendingBoardProposeMode,
        hardhatLendingBoardConfigurator,
        hardhatSampleToken,
        hardhatLendingBoardDataProvider,
        hardhatLendingBoardFeeProvider,
        STKNaddress,
        PLUGaddress,
      } = await loadFixture(deployLendingBoardFixture);

      // borrow()
      var reserveData = await hardhatLendingBoardProposeMode.getReserveData(
        STKNaddress
      );
      console.log(
        "STKN Reserve Data available Liquidity : ",
        reserveData.availableLiquidity.toString()
      );
      console.log(
        "Owner STKN amount : ",
        await hardhatSampleToken.balanceOf(owner.address)
      );

      const borrowAmount1 = ethers.utils.parseEther("10");
      const borrowAmount2 = ethers.utils.parseEther("20");

      const interestRate = 10; // 일단은 parseEther 고려하지 않고 10으로 설정
      // dueDate의 경우 임의로 현재시간의 + 100000 으로 설정한다.
      const dueDate = Date.now() + 100000;

      // Borrowing STKN( = 2ETH) using PLUG( = 5ETH) as a collateral
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

      const generatedBorrowProposal = await hardhatLendingBoardProposeMode
        .connect(owner)
        .getBorrowProposal(0);
      // Data from borowProposal needs to have a borrower's id matching that of owner.address.
      expect(owner.address).to.equal(generatedBorrowProposal.borrower);

      console.log(
        " ========================== Lender's Account Balance before BorrowProposal Accept ========================== "
      );
      // User1's STKN Reserve Data before Borrow Proposal Accept
      let user1STKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          user1.address
        );
      console.log(user1STKNReserveData);

      await hardhatLendingBoardProposeMode
        .connect(user1)
        .borrowProposalAccept(0);
      console.log(
        " ========================== Lender's Account Balance after BorrowProposal Accepted ========================== "
      );

      // User1's STKN Reserve Data after Borrow Proposal Accept
      // WIP : 현재 User1의 currentBorrowBalance(대출량)이 증가하지 않는 문제 발생
      console.log(
        " ========================== User1's(Lender) STKN Reserve Data After First Proposal Accepted ========================== "
      );
      user1STKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          user1.address
        );
      console.log(user1STKNReserveData);

      console.log(
        " ========================== Owner (Borrower) STKN Reserve Data After First Proposal Accepted ========================== "
      );
      const ownerSTKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          owner.address
        );
      console.log(ownerSTKNReserveData);

      const borrowProposalList =
        await hardhatLendingBoardProposeMode.getBorrowProposalList(0, 1);
      // console.log("Borrow Proposal List : ",borrowProposalList);
    });

    it("\x1b[45m Borrow Proposal Test Case Failing due to lack of collateral", async function () {
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
      } = await loadFixture(deployLendingBoardFixture);

      // borrow()
      var reserveData = await hardhatLendingBoardProposeMode.getReserveData(
        STKNaddress
      );
      console.log(
        "STKN Reserve Data available Liquidity : ",
        reserveData.availableLiquidity.toString()
      );
      console.log(
        "Owner STKN amount : ",
        await hardhatSampleToken.balanceOf(owner.address)
      );

      const borrowAmount1 = ethers.utils.parseEther("10000"); // should fail
      const borrowAmount2 = ethers.utils.parseEther("20");

      const interestRate = 10; // 일단은 parseEther 고려하지 않고 10으로 설정
      // dueDate의 경우 임의로 현재시간의 + 100000 으로 설정한다.
      const dueDate = Date.now() + 100000;

      // Borrowing STKN( = 2ETH) using PLUG( = 5ETH) as a collateral
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
      ).to.be.reverted;

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

      const generatedBorrowProposal = await hardhatLendingBoardProposeMode
        .connect(owner)
        .getBorrowProposal(0);
      // Data from borowProposal needs to have a borrower's id matching that of owner.address.
      expect(owner.address).to.equal(generatedBorrowProposal.borrower);

      console.log(
        " ========================== Lender's Account Balance before BorrowProposal Accept ========================== "
      );
      // User1's STKN Reserve Data before Borrow Proposal Accept
      let user1STKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          user1.address
        );
      console.log(user1STKNReserveData);

      await hardhatLendingBoardProposeMode
        .connect(user1)
        .borrowProposalAccept(0);
      console.log(
        " ========================== Lender's Account Balance after BorrowProposal Accepted ========================== "
      );

      // User1's STKN Reserve Data after Borrow Proposal Accept
      // WIP : 현재 User1의 currentBorrowBalance(대출량)이 증가하지 않는 문제 발생
      console.log(
        " ========================== User1's(Lender) STKN Reserve Data After First Proposal Accepted ========================== "
      );
      user1STKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          user1.address
        );
      console.log(user1STKNReserveData);

      console.log(
        " ========================== Owner (Borrower) STKN Reserve Data After First Proposal Accepted ========================== "
      );
      const ownerSTKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          owner.address
        );
      console.log(ownerSTKNReserveData);

      // var borrowProposalCount = await hardhatLendingBoardCore.getBorrowProposalCount();
      // const borrowProposalList = await hardhatLendingBoardProposeMode.getBorrowProposalList(0,borrowProposalCount);
      // console.log("Borrow Proposal List : ",borrowProposalList);
    });

    it("\x1b[45m Lend Proposal Test Case", async function () {
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
      } = await loadFixture(deployLendingBoardFixture);

      // borrow()
      var reserveData = await hardhatLendingBoardProposeMode.getReserveData(
        STKNaddress
      );
      console.log(
        "STKN Reserve Data available Liquidity : ",
        reserveData.availableLiquidity.toString()
      );
      console.log(
        "Owner STKN amount : ",
        await hardhatSampleToken.balanceOf(owner.address)
      );

      const lendAmount1 = ethers.utils.parseEther("10");
      const lendAmount2 = ethers.utils.parseEther("20");

      const interestRate = 10; // 일단은 parseEther 고려하지 않고 10으로 설정
      // dueDate의 경우 임의로 현재시간의 + 100000 으로 설정한다.
      const dueDate = Date.now() + 100000;
      console.log("dueDate from JS : ", dueDate);
      // Lending STKN( = 2ETH) using PLUG( = 5ETH) as a collateral
      await expect(
        hardhatLendingBoardProposeMode
          .connect(owner)
          .lendProposal(
            STKNaddress,
            lendAmount1,
            PLUGaddress,
            interestRate,
            dueDate
          )
      ).to.emit(hardhatLendingBoardProposeMode, "LendProposed");

      await expect(
        hardhatLendingBoardProposeMode
          .connect(owner)
          .lendProposal(
            STKNaddress,
            lendAmount2,
            PLUGaddress,
            interestRate,
            dueDate
          )
      ).to.emit(hardhatLendingBoardProposeMode, "LendProposed");

      const generatedLendProposal = await hardhatLendingBoardProposeMode
        .connect(owner)
        .getLendProposal(0);
      // Data from borowProposal needs to have a borrower's id matching that of owner.address.
      expect(owner.address).to.equal(generatedLendProposal.lender);

      // User1's STKN Reserve Data before Borrow Proposal Accept
      let user1STKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          user1.address
        );
      console.log(
        "========================== User1's STKN Reserve Data After First Proposal Proposed ========================== "
      );
      console.log(user1STKNReserveData);

      // User1's PLUG Reserve Data before Borrow Proposal Accpet(PLUG used as Collateral in this case)
      let user1PLUGReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          PLUGaddress,
          user1.address
        );
      console.log(
        "========================== User1's PLUG Reserve Data After First Proposal Proposed ========================== "
      );
      console.log(user1PLUGReserveData);
      console.log(
        " ========================== ========================== ========================== "
      );

      await hardhatLendingBoardProposeMode.connect(user1).lendProposalAccept(0);

      // User1's STKN Reserve Data after Borrow Proposal Accept
      // WIP : 현재 User1의 currentBorrowBalance(대출량)이 증가하지 않는 문제 발생
      console.log(
        " ========================== Borrower's Account Balance after lendProposal Accepted ========================== "
      );
      user1STKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          user1.address
        );
      console.log(
        "========================== User1's STKN Reserve Data After First Proposal Accepted ========================== "
      );
      console.log(user1STKNReserveData);

      user1PLUGReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          PLUGaddress,
          user1.address
        );
      console.log(
        "========================== User1's PLUG Reserve Data After Second Proposal Accepted ========================== "
      );
      console.log(user1PLUGReserveData);
      console.log(
        " ========================== ========================== ========================== "
      );

      console.log(
        "========================== First Lend Proposal and Accept Done ========================== "
      );

      // User1's STKKN Reserve Data after accepting Second Lend Proposal
      await hardhatLendingBoardProposeMode.connect(user1).lendProposalAccept(1);
      user1STKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          user1.address
        );
      console.log(
        "========================== User1's STKN Reserve Data After Second Proposal Accepted ========================== "
      );
      console.log(user1STKNReserveData);
      console.log(
        " ========================== ========================== ========================== "
      );

      user1PLUGReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          PLUGaddress,
          user1.address
        );
      console.log(
        "========================== User1's PLUG Reserve Data After Second Proposal Accepted ========================== "
      );
      console.log(user1PLUGReserveData);
      console.log(
        " ========================== ========================== ========================== "
      );

      const lendProposalList =
        await hardhatLendingBoardProposeMode.getLendProposalList(0, 1);
      console.log("Lend Proposal List : ", lendProposalList);
    });
  });

  describe("\x1b[44m<Proposal and Repayment Interaction>", function () {
    it("\x1b[45m Borrow Proposal then Repay Case", async function () {
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
      } = await loadFixture(deployLendingBoardFixture);

      // borrow()
      var reserveData = await hardhatLendingBoardProposeMode.getReserveData(
        STKNaddress
      );
      console.log(
        "STKN Reserve Data available Liquidity : ",
        reserveData.availableLiquidity.toString()
      );
      console.log(
        "Owner STKN amount : ",
        await hardhatSampleToken.balanceOf(owner.address)
      );

      const borrowAmount1 = ethers.utils.parseEther("10");
      const borrowAmount2 = ethers.utils.parseEther("20");

      const interestRate = 10; // 일단은 parseEther 고려하지 않고 10으로 설정
      // dueDate의 경우 임의로 현재시간의 + 100000 으로 설정한다.
      const dueDate = Date.now() + 100000;

      // Borrowing STKN( = 2ETH) using PLUG( = 5ETH) as a collateral
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

      const generatedBorrowProposal = await hardhatLendingBoardProposeMode
        .connect(owner)
        .getBorrowProposal(0);
      // Data from borowProposal needs to have a borrower's id matching that of owner.address.
      expect(owner.address).to.equal(generatedBorrowProposal.borrower);

      console.log(
        " ========================== Lender's Account Balance before BorrowProposal Accept ========================== "
      );
      // User1's STKN Reserve Data before Borrow Proposal Accept
      let user1STKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          user1.address
        );
      console.log(user1STKNReserveData);

      await hardhatLendingBoardProposeMode
        .connect(user1)
        .borrowProposalAccept(0);
      console.log(
        " ========================== Lender's Account Balance after BorrowProposal Accepted ========================== "
      );

      // User1's STKN Reserve Data after Borrow Proposal Accept
      // WIP : 현재 User1의 currentBorrowBalance(대출량)이 증가하지 않는 문제 발생
      console.log(
        " ========================== User1's(Lender) STKN Reserve Data After First Proposal Accepted ========================== "
      );
      user1STKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          user1.address
        );
      console.log(user1STKNReserveData);

      console.log(
        " ========================== Owner (Borrower) STKN Reserve Data After First Proposal Accepted ========================== "
      );
      let ownerSTKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          owner.address
        );
      console.log(ownerSTKNReserveData);

      console.log(
        " ========================== Owner (Borrower) PLUG (Collateral) Reserve Data After First Proposal Accepted ========================== "
      );
      let ownerPLUGReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          PLUGaddress,
          owner.address
        );
      console.log(ownerPLUGReserveData);

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

      console.log(
        " ========================== Owner (Borrower) STKN Reserve Data After Repayment ========================== "
      );
      ownerSTKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          owner.address
        );
      console.log(ownerSTKNReserveData);

      console.log(
        " ========================== Owner (Borrower) PLUG (Collateral) Reserve Data After Repayment ========================== "
      );
      ownerPLUGReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          PLUGaddress,
          owner.address
        );
      console.log(ownerPLUGReserveData);
    });
  });

  // describe.only 로 아래 Liquidation Situation 만 Test Run
  describe.only("\x1b[44m<<Liquidation Situation>", function () {
    it("\x1b[45m Should be underCollateralized and be ready for liquidation", async function () {
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
      } = await loadFixture(deployLendingBoardFixture);

      console.log("\x1b[44m Fixture Done, Setting for Liquidation\n");

      const borrowAmount1 = ethers.utils.parseEther("10");
      const borrowAmount2 = ethers.utils.parseEther("20");

      const interestRate = 10; // 일단은 parseEther 고려하지 않고 10으로 설정
      // dueDate의 경우 임의로 현재시간의 + 100000 으로 설정한다.
      const dueDate = Date.now() + 100000;

      // Borrowing STKN( = 2ETH) using PLUG( = 5ETH) as a collateral
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

      // getBorrowProposalList()를 확인하기 위해 동일한 Proposal 두개를 생성한다.
      // await expect(hardhatLendingBoardProposeMode.connect(owner).borrowProposal(STKNaddress,borrowAmount2,PLUGaddress,interestRate,dueDate)).to.emit(hardhatLendingBoardProposeMode,"BorrowProposed");

      // const generatedBorrowProposal = await hardhatLendingBoardProposeMode
      //   .connect(owner)
      //   .getBorrowProposal(0);

      const proposalLiquidationAvailability =
        await hardhatLendingBoardDataProvider.getProposalLiquidationAvailability(
          0,
          true
        ); // _isBorrowProposal == true
      console.log(
        " Proposal Liquidation Availability : ",
        proposalLiquidationAvailability
      );

      // Owner's STKN Balance before Proposal Accept
      var ownerSTKNBalance = await hardhatSampleToken.balanceOf(owner.address);

      console.log(ownerSTKNBalance);

      await hardhatLendingBoardProposeMode
        .connect(user1)
        .borrowProposalAccept(0);

      console.log(
        "========================== Owner's STKN Balance after Proposal Accepted ========================== "
      );

      // Owner's STKN Balance after Proposal Accept
      ownerSTKNBalance = await hardhatSampleToken.balanceOf(owner.address);

      console.log(ownerSTKNBalance);

      let ownerSTKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          owner.address
        );

      console.log(
        "========================== Owner's STKN Reserve Data After Proposal Accepted ========================== "
      );
      console.log(ownerSTKNReserveData);
      console.log(
        " ========================== ========================== ========================== "
      );

      let ownerPLUGReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          PLUGaddress,
          owner.address
        );
      console.log(
        "========================== Owner's PLUG Reserve Data After Proposal Accepted ========================== "
      );
      console.log(ownerPLUGReserveData);
      console.log(
        " ========================== ========================== ========================== "
      );

      let liquidatorSTKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          user2.address
        );
      console.log(
        "========================== Liquidator's STKN Reserve Data Before Liquidation ========================== "
      );
      console.log(liquidatorSTKNReserveData.currentATokenBalance);
      console.log(
        " ========================== ========================== ========================== "
      );

      let liquidatorPLUGReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          PLUGaddress,
          user2.address
        );
      console.log(
        "========================== Liquidator's PLUG Reserve Data Before Liquidation ========================== "
      );
      console.log(liquidatorPLUGReserveData.currentATokenBalance);
      console.log(
        " ========================== ========================== ========================== "
      );

      // const borrowProposalDataFromCore = await hardhatLendingBoardCore.connect(user2).getProposalFromCore(0,true);
      // const borrowProposalDataFromCore = await hardhatLendingBoardDataProvider.connect(user2).getProposalData(0,true);
      // console.log(" Borrow Proposal From Core : ",borrowProposalDataFromCore);

      // Direct Access to Liquidation Manager for Testing
      // user2 set as LIquidator
      await hardhatLendingBoardProposeMode
        .connect(user2)
        .liquidationCallProposeMode(0, true, true);

      ownerSTKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          owner.address
        );
      console.log(
        "========================== Owner's STKN Reserve Data After Liquidation ========================== "
      );
      console.log(ownerSTKNReserveData);
      console.log(
        " ========================== ========================== ========================== "
      );

      ownerPLUGReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          PLUGaddress,
          owner.address
        );
      console.log(
        "========================== Owner's PLUG Reserve Data After Liquidation ========================== "
      );
      console.log(ownerPLUGReserveData);
      console.log(
        " ========================== ========================== ========================== "
      );

      liquidatorSTKNReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          STKNaddress,
          user2.address
        );
      console.log(
        "========================== Liquidator's STKN Reserve Data After Liquidation ========================== "
      );
      console.log(liquidatorSTKNReserveData.currentATokenBalance);
      console.log(
        " ========================== ========================== ========================== "
      );

      liquidatorPLUGReserveData =
        await hardhatLendingBoardDataProvider.getUserReserveData(
          PLUGaddress,
          user2.address
        );
      console.log(
        "========================== Liquidator's PLUG Reserve Data After Liquidation ========================== "
      );
      console.log(liquidatorPLUGReserveData.currentATokenBalance);
      console.log(
        " ========================== ========================== ========================== "
      );
    });
  });
});
