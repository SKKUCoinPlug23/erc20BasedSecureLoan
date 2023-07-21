const { ethers } = require("hardhat");

async function deployLendingBoardFixture() {
  // Get the ContractFactory and Signers here.
  const [owner, user1, user2, borrower1, borrower2] = await ethers.getSigners();

  // Libraries
  const CoreLibrary = await ethers.getContractFactory("CoreLibrary");
  const hardhatCoreLibrary = await CoreLibrary.deploy();
  await hardhatCoreLibrary.deployed();

  // Main Contracts 객체 생성
  const LendingBoardProposeMode = await ethers.getContractFactory("LendingBoard");
  const LendingBoardCore = await ethers.getContractFactory("LendingBoardCore", {
    signer: owner,
    libraries: {
      CoreLibrary: hardhatCoreLibrary.address,
    },
  });
  const LendingBoardConfigurator = await ethers.getContractFactory("LendingBoardConfigurator");
  const LendingBoardDataProvider = await ethers.getContractFactory("LendingBoardDataProvider");
  const LendingBoardParametersProvider = await ethers.getContractFactory("LendingBoardParametersProvider");
  const LendingBoardFeeProvider = await ethers.getContractFactory("FeeProvider");
  const LendingBoardLiquidationManager = await ethers.getContractFactory("LendingBoardLiquidationManager");
  const LendingBoardAddressesProvider = await ethers.getContractFactory("LendingBoardAddressesProvider");
  const TestOracle = await ethers.getContractFactory("TestOracle");
  const TestLendingRateOracle = await ethers.getContractFactory("TestLendingRateOracle");
  const TokenDistributor = await ethers.getContractFactory("TokenDistributor");

  // Main Contracts Deployment
  const hardhatLendingBoardProposeMode = await LendingBoardProposeMode.deploy();
  await hardhatLendingBoardProposeMode.deployed();
  const hardhatLendingBoardCore = await LendingBoardCore.deploy();
  await hardhatLendingBoardCore.deployed();
  const hardhatLendingBoardConfigurator = await LendingBoardConfigurator.deploy();
  await hardhatLendingBoardConfigurator.deployed();
  const hardhatLendingBoardDataProvider = await LendingBoardDataProvider.deploy();
  await hardhatLendingBoardDataProvider.deployed();
  const hardhatLendingBoardParametersProvider = await LendingBoardParametersProvider.deploy();
  await hardhatLendingBoardParametersProvider.deployed();
  const hardhatLendingBoardFeeProvider = await LendingBoardFeeProvider.deploy();
  await hardhatLendingBoardFeeProvider.deployed();
  const hardhatLendingBoardLiquidationManager = await LendingBoardLiquidationManager.deploy();
  await hardhatLendingBoardLiquidationManager.deployed();
  const hardhatLendingBoardAddressesProvider = await LendingBoardAddressesProvider.deploy();
  await hardhatLendingBoardAddressesProvider.deployed();
  const hardhatTestOracle = await TestOracle.deploy();
  await hardhatTestOracle.deployed();
  const hardhatTestLendingRateOracle = await TestLendingRateOracle.deploy();
  await hardhatTestLendingRateOracle.deployed();
  const hardhatTokenDistributor = await TokenDistributor.deploy();
  await hardhatTokenDistributor.deployed();

  // Using LendingBoardAddressesProvider(LBAP) set the deployed Smart Contract address to the appropriate location
  await hardhatLendingBoardAddressesProvider.setLendingBoardImpl(hardhatLendingBoardProposeMode.address);
  await hardhatLendingBoardAddressesProvider.setLendingBoardCoreImpl(hardhatLendingBoardCore.address);
  await hardhatLendingBoardAddressesProvider.setLendingBoardConfiguratorImpl(hardhatLendingBoardConfigurator.address);
  await hardhatLendingBoardAddressesProvider.setLendingBoardDataProviderImpl(hardhatLendingBoardDataProvider.address);
  await hardhatLendingBoardAddressesProvider.setLendingBoardParametersProviderImpl(hardhatLendingBoardParametersProvider.address);
  await hardhatLendingBoardAddressesProvider.setFeeProviderImpl(hardhatLendingBoardFeeProvider.address);

  // Setting address for contracts that are outside the context of the protocol
  await hardhatLendingBoardAddressesProvider.setLendingBoardLiquidationManager(hardhatLendingBoardLiquidationManager.address);
  await hardhatLendingBoardAddressesProvider.setLendingBoardManager(owner.address);
  await hardhatLendingBoardAddressesProvider.setPriceOracle(hardhatTestOracle.address);
  await hardhatLendingBoardAddressesProvider.setLendingRateOracle(hardhatTestLendingRateOracle.address);
  await hardhatLendingBoardAddressesProvider.setTokenDistributor(hardhatTokenDistributor.address);

  // LBAP 이용한 setter가 정상작동했는지 expect를 이용하여 확인
  const addressStoredInAddressesProvider = await hardhatLendingBoardAddressesProvider.getLendingBoard();
  console.log("Address stored in AddressesProvider:", addressStoredInAddressesProvider);
  
  // 각 Main Contract의 initialize()를 이용하여 initialization 수행
  await hardhatLendingBoardProposeMode.initialize(hardhatLendingBoardAddressesProvider.address);
  await hardhatLendingBoardCore.initialize(hardhatLendingBoardAddressesProvider.address);
  await hardhatLendingBoardConfigurator.initialize(hardhatLendingBoardAddressesProvider.address);
  await hardhatLendingBoardDataProvider.initialize(hardhatLendingBoardAddressesProvider.address);
  await hardhatLendingBoardParametersProvider.initialize(hardhatLendingBoardAddressesProvider.address);
  await hardhatLendingBoardFeeProvider.initialize(hardhatLendingBoardAddressesProvider.address);
  // since DISTRIBUTION_BASE = 10000; set in TokenDistributor.sol dummy data for percentages set like below
  await hardhatTokenDistributor.initialize([owner.address, user1.address, user2.address], [4000, 3000, 2000]);

  // SampleToken(STKN) Deployment for Testing. SampleToken.sol에서 가져옴
  const SampleToken = await ethers.getContractFactory("SampleToken");
  const hardhatSampleToken = await SampleToken.deploy();
  await hardhatSampleToken.deployed();

  // Sample Token Address 확인
  const STKNaddress = hardhatSampleToken.address;
  console.log("STKN address:", STKNaddress);

  // 임의로 TestOracle AssetPrice 및 TestLendingRateOracle의 LendingRate 설정
  const STKNPrice = ethers.utils.parseEther('2');
  console.log("STKN Price:", STKNPrice.toString());
  await hardhatTestOracle.setAssetPrice(STKNaddress, STKNPrice);

  const STKNLendingRate = ethers.utils.parseEther('0.05');
  await hardhatTestLendingRateOracle.setMarketBorrowRate(STKNaddress, STKNLendingRate);

  // PlugToken(PLUG) Deployment
  const PlugToken = await ethers.getContractFactory("PlugToken");
  const hardhatPlugToken = await PlugToken.deploy();
  await hardhatPlugToken.deployed();

  const PLUGaddress = hardhatPlugToken.address;

  const PLUGPrice = ethers.utils.parseEther('5');
  await hardhatTestOracle.setAssetPrice(PLUGaddress, PLUGPrice);

  const PLUGLendingRate = ethers.utils.parseEther('0.1');
  await hardhatTestLendingRateOracle.setMarketBorrowRate(PLUGaddress, PLUGLendingRate);

  // Default Reserve Interest-Rate Strategy Contract Setting
  const DefaultReserveInterestRateStrategy = await ethers.getContractFactory("DefaultReserveInterestRateStrategy");

  // STKN Interest Rate Strategy setting
  // WIP : Decimal이 18인지 27인지 잘 모르겠음
  const sampleBaseVariableRate = ethers.utils.parseUnits('0.02', 18); // 2% annual interest rate
  const sampleVariableRateSlope1 = ethers.utils.parseUnits('0.1', 18); // 10% increase in the annual interest rate for each increase of 1 in the utilization rate, applys the same logic in the below variables
  const sampleVariableRateSlope2 = ethers.utils.parseUnits('0.5', 18);
  const sampleStableRateSlope1 = ethers.utils.parseUnits('0.1', 18);
  const sampleStableRateSlope2 = ethers.utils.parseUnits('0.5', 18);

  const STKNhardhatDefaultReserveInterestRateStrategy = await DefaultReserveInterestRateStrategy.deploy(STKNaddress, hardhatLendingBoardAddressesProvider.address, sampleBaseVariableRate, sampleVariableRateSlope1, sampleVariableRateSlope2, sampleStableRateSlope1, sampleStableRateSlope2);
  await STKNhardhatDefaultReserveInterestRateStrategy.deployed();
  const STKNstrategyAddress = STKNhardhatDefaultReserveInterestRateStrategy.address;
  // 생성한 STKN의 Reserve를 initialization 해준다.
  await hardhatLendingBoardConfigurator.initReserve(STKNaddress, 18, STKNstrategyAddress);

  // PLUG Interest Rate Strategy setting
  const PLUGhardhatDefaultReserveInterestRateStrategy = await DefaultReserveInterestRateStrategy.deploy(PLUGaddress, hardhatLendingBoardAddressesProvider.address, sampleBaseVariableRate, sampleVariableRateSlope1, sampleVariableRateSlope2, sampleStableRateSlope1, sampleStableRateSlope2);
  await PLUGhardhatDefaultReserveInterestRateStrategy.deployed();
  const PLUGstrategyAddress = PLUGhardhatDefaultReserveInterestRateStrategy.address;
  // 생성한 STKN의 Reserve를 initialization 해준다.
  await hardhatLendingBoardConfigurator.initReserve(PLUGaddress, 18, PLUGstrategyAddress);

  // user1에게 STKN과 PLUG를 전송해준다.
  const transferAmount = ethers.utils.parseEther('3000');
  await hardhatSampleToken.connect(owner).transfer(user1.address, transferAmount);
  await hardhatPlugToken.connect(owner).transfer(user1.address, transferAmount);

  // Approve LendingBoard contract to spend tokens
  const approveAmount = ethers.utils.parseEther('2000');

  console.log(" ====================== Depositing STKN and PLUG ======================");
  // Send the approval transaction. The address should be LBCore not LB itself.
  // Owner의 approval 및 deposit
  await hardhatSampleToken.connect(owner).approve(hardhatLendingBoardCore.address, approveAmount);
  await hardhatPlugToken.connect(owner).approve(hardhatLendingBoardCore.address, approveAmount);

  // deposit() 이용하여 서비스에 STKN 예치
  const depositAmount = ethers.utils.parseEther('1000');

  // STKN 1000개 예치
  await hardhatLendingBoardProposeMode.connect(owner).deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
  // PLUG 1000개 예치
  await hardhatLendingBoardProposeMode.connect(owner).deposit(PLUGaddress, depositAmount, 0); // Set Referral Code = 0

  console.log(" ====================== ====================== ======================");

  // User1의 approval 및 Deposit
  await hardhatSampleToken.connect(user1).approve(hardhatLendingBoardCore.address, approveAmount);
  await hardhatPlugToken.connect(user1).approve(hardhatLendingBoardCore.address, approveAmount);

  await hardhatLendingBoardProposeMode.connect(user1).deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
  await hardhatLendingBoardProposeMode.connect(user1).deposit(PLUGaddress, depositAmount, 0); // Set Referral Code = 0

  let baseLTVasCollateral, liquidationThreshold, liquidationBonus;
  // configuring STKN Reserve for Borrowing and Collateral
  await hardhatLendingBoardConfigurator.connect(owner).enableBorrowingOnReserve(STKNaddress, true);
  baseLTVasCollateral = ethers.utils.parseEther('0.5');
  liquidationThreshold = ethers.utils.parseEther('0.70');
  liquidationBonus = ethers.utils.parseEther('0.01');
  await hardhatLendingBoardConfigurator.connect(owner).enableReserveAsCollateral(STKNaddress, baseLTVasCollateral, liquidationThreshold, liquidationBonus);

  await hardhatLendingBoardProposeMode.connect(owner).setUserUseReserveAsCollateral(STKNaddress, 1); // 1 : enable, 0 : disable
  await hardhatLendingBoardProposeMode.connect(user1).setUserUseReserveAsCollateral(STKNaddress, 1); // 1 : enable, 0 : disable

  // configuring PLUG Reserve for Borrowing and Collateral
  await hardhatLendingBoardConfigurator.connect(owner).enableBorrowingOnReserve(PLUGaddress, true);
  baseLTVasCollateral = ethers.utils.parseEther('0.5');
  liquidationThreshold = ethers.utils.parseEther('0.70');
  liquidationBonus = ethers.utils.parseEther('0.01');
  await hardhatLendingBoardConfigurator.connect(owner).enableReserveAsCollateral(PLUGaddress, baseLTVasCollateral, liquidationThreshold, liquidationBonus);

  await hardhatLendingBoardProposeMode.connect(owner).setUserUseReserveAsCollateral(PLUGaddress, 1); // 1 : enable, 0 : disable
  await hardhatLendingBoardProposeMode.connect(user1).setUserUseReserveAsCollateral(PLUGaddress, 1); // 1 : enable, 0 : disable

  console.log("Setup completed successfully!");

  // Return necessary variables for testing
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
  };
}

deployLendingBoardFixture()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });