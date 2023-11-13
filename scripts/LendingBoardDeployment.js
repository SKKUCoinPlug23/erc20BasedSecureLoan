const hre = require("hardhat");

async function main() {
  console.log(
    "\x1b[43m%s\x1b[0m",
    "\n Lending Board Smart Contract Deployment Start"
  );
  const [owner, user1, user2] = await ethers.getSigners();
  console.log("\x1b[43m%s\x1b[0m", "\n Getting Sepolia Testnet Account");

  // Libraries
  const CoreLibrary = await ethers.getContractFactory("CoreLibrary");
  const hardhatCoreLibrary = await CoreLibrary.deploy();
  await hardhatCoreLibrary.deployed();
  console.log(
    "\x1b[43m%s\x1b[0m",
    "\n Core Library Deployed on Sepolia Testnet"
  );

  // Main Contracts 객체 생성
  const LendingBoardProposeMode = await ethers.getContractFactory(
    "LendingBoardProposeMode"
  );
  const LendingBoardCore = await ethers.getContractFactory("LendingBoardCore", {
    signer: owner,
    libraries: {
      CoreLibrary: hardhatCoreLibrary.address,
    },
  });
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
  const TokenDistributor = await ethers.getContractFactory("TokenDistributor");
  const LendingBoardNFT = await ethers.getContractFactory("LendingBoardNFT");

  console.log("\x1b[43m%s\x1b[0m", "\n Smart Contract Getting Done");

  // Main Contracts Deployment
  const hardhatLendingBoardProposeMode = await LendingBoardProposeMode.deploy();
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
  const hardhatLendingBoardFeeProvider = await LendingBoardFeeProvider.deploy();
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
  console.log("\x1b[43m%s\x1b[0m", "\nSmart Contract Deployment Successful");

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

  console.log(
    "\x1b[43m%s\x1b[0m",
    "\nLending Board Addresses Provider setting Successful"
  );

  // 각 Main Contract의 initialize()를 이용하여 initialization 수행
  // await hardhatLendingBoardProposeMode.initialize(hardhatLendingBoardAddressesProvider.address);
  // manually specifying GasLimit for LendingBoardProposeMode Contracdt(Main User Interaction Contract)
  // Gas Limit per Block is 30000000
  var estimatedGas;
  estimatedGas = await hardhatLendingBoardProposeMode.estimateGas.initialize(
    hardhatLendingBoardAddressesProvider.address
  );
  console.log("Estimated Gas for LBPM initialization : ", estimatedGas);
  await hardhatLendingBoardProposeMode.initialize(
    hardhatLendingBoardAddressesProvider.address,
    { gasLimit: 30000000 }
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
  // since DISTRIBUTION_BASE = 10000; set in TokenDistributor.sol dummy data for percentages set like below
  await hardhatTokenDistributor.initialize(
    [owner.address, user1.address, user2.address],
    [4000, 3000, 2000]
  );
  // await hardhatLendingBoardLiquidationManager.initialize(hardhatLendingBoardAddressesProvider.address);

  console.log(
    "\x1b[43m%s\x1b[0m",
    "\nEach Smart Contract Initialization Successful"
  );

  // SampleToken(STKN) Deployment for Testing. SampleToken.sol에서 가져옴
  const SampleToken = await ethers.getContractFactory("SampleToken");
  const hardhatSampleToken = await SampleToken.deploy();
  await hardhatSampleToken.deployed();

  // Sample Token Address 확인
  const STKNaddress = hardhatSampleToken.address;

  // 임의로 TestOracle AssetPrice 및 TestLendingRateOracle의 LendingRate 설정
  const STKNPrice = ethers.utils.parseEther("2");
  console.log("STKN Address : ", STKNaddress);
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
  console.log("PLUG Address : ", PLUGaddress);
  console.log("PLUG Price : ", PLUGPrice);
  await hardhatTestOracle.setAssetPrice(PLUGaddress, PLUGPrice, { gasLimit: 3000000 });

  const PLUGLendingRate = ethers.utils.parseEther("0.1");
  await hardhatTestLendingRateOracle.setMarketBorrowRate(
    PLUGaddress,
    PLUGLendingRate,
    { gasLimit: 3000000 }
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
      sampleStableRateSlope2,
      { gasLimit: 3000000 }
    );
  await STKNhardhatDefaultReserveInterestRateStrategy.deployed();
  const STKNstrategyAddress =
    STKNhardhatDefaultReserveInterestRateStrategy.address;
  // 생성한 STKN의 Reserve를 initialization 해준다.
  await hardhatLendingBoardConfigurator.initReserve(
    STKNaddress,
    18,
    STKNstrategyAddress,
    { gasLimit: 3000000 }
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
      sampleStableRateSlope2,
      { gasLimit: 3000000 }
    );
  await PLUGhardhatDefaultReserveInterestRateStrategy.deployed();
  const PLUGstrategyAddress =
    PLUGhardhatDefaultReserveInterestRateStrategy.address;
  // 생성한 STKN의 Reserve를 initialization 해준다.
  await hardhatLendingBoardConfigurator.initReserve(
    PLUGaddress,
    18,
    PLUGstrategyAddress,
    { gasLimit: 3000000 }
  );

  console.log(
    "\x1b[43m%s\x1b[0m",
    "\nTest token : STKN, PLUG Reserve and InterestRateStrategy setting Successful"
  );

  // user1에게 STKN과 PLUG를 전송해준다.
  const transferAmount = ethers.utils.parseEther("3000");
  await hardhatSampleToken
    .connect(owner)
    .transfer(user1.address, transferAmount, { gasLimit: 3000000 });
  await hardhatPlugToken.connect(owner).transfer(user1.address, transferAmount, { gasLimit: 3000000 });

  console.log(
    " ====================== Depositing STKN and PLUG ======================"
  );
  console.log("Lending Board Core address : ", hardhatLendingBoardCore.address);
  // Approve LendingBoard contract to spend tokens
  const approveAmount = ethers.utils.parseEther("2000");

  console.log("Pass 0");
  // Send the approval transaction. The address should be LBCore not LB itself.
  // Owner의 approval 및 deposit
  let approvalResult = await hardhatSampleToken
    .connect(owner)
    .approve(hardhatLendingBoardCore.address, approveAmount, { gasLimit: 3000000 });
  console.log("Pass 1");
  approvalResult = await hardhatPlugToken
    .connect(owner)
    .approve(hardhatLendingBoardCore.address, approveAmount, { gasLimit: 3000000 });
  console.log("Pass 2");

  // deposit() 이용하여 서비스에 STKN 예치
  const depositAmount = ethers.utils.parseEther("1000");
  console.log("Pass 3");

  estimatedGas = await hardhatLendingBoardProposeMode
    .connect(owner)
    .deposit(STKNaddress, depositAmount, 0, { gasLimit: 3000000 });
  console.log("Estimated Gas for LBPM Deposit : ", estimatedGas);

  // STKN 1000개 예치
  await hardhatLendingBoardProposeMode
    .connect(owner)
    .deposit(STKNaddress, depositAmount, 0, { gasLimit: 30000000 }); // Set Referral Code = 0
  // PLUG 1000개 예치
  await hardhatLendingBoardProposeMode
    .connect(owner)
    .deposit(PLUGaddress, depositAmount, 0, { gasLimit: 30000000 }); // Set Referral Code = 0

  console.log(
    "\x1b[43m%s\x1b[0m",
    "\n Owner Account STKN and PLUG deposited to LendingBoard Service Successful"
  );

  // User1의 approval 및 Deposit
  approvalResult = await hardhatSampleToken
    .connect(user1)
    .approve(hardhatLendingBoardCore.address, approveAmount, { gasLimit: 3000000 });
  approvalResult = await hardhatPlugToken
    .connect(user1)
    .approve(hardhatLendingBoardCore.address, approveAmount, { gasLimit: 3000000 });

  await hardhatLendingBoardProposeMode
    .connect(user1)
    .deposit(STKNaddress, depositAmount, 0, { gasLimit: 30000000 }); // Set Referral Code = 0
  await hardhatLendingBoardProposeMode
    .connect(user1)
    .deposit(PLUGaddress, depositAmount, 0, { gasLimit: 30000000 }); // Set Referral Code = 0

  console.log(
    "\x1b[43m%s\x1b[0m",
    "\n User1 Account STKN and PLUG deposited to LendingBoard Service Successful"
  );

  let baseLTVasCollateral, liquidationThreshold, liquidationBonus;
  // configuring STKN Reserve for Borrowing and Collateral
  await hardhatLendingBoardConfigurator
    .connect(owner)
    .enableBorrowingOnReserve(STKNaddress, true, { gasLimit: 3000000 });
  // WIP : parseEther('0.70') 으로 해야할지 '70'일지 '0.70'일지
  baseLTVasCollateral = ethers.utils.parseEther("0.5");
  // liquidationThreshold = ethers.utils.parseEther('0.70');
  liquidationThreshold = "70";
  liquidationBonus = ethers.utils.parseEther("0.01");
  await hardhatLendingBoardConfigurator
    .connect(owner)
    .enableReserveAsCollateral(
      STKNaddress,
      baseLTVasCollateral,
      liquidationThreshold,
      liquidationBonus, { gasLimit: 3000000 }
    );

  await hardhatLendingBoardProposeMode
    .connect(owner)
    .setUserUseReserveAsCollateral(STKNaddress, 1, { gasLimit: 3000000 }); // 1 : enable, 0 : disable
  await hardhatLendingBoardProposeMode
    .connect(user1)
    .setUserUseReserveAsCollateral(STKNaddress, 1, { gasLimit: 3000000 }); // 1 : enable, 0 : disable

  // configuring PLUG Reserve for Borrowing and Collateral
  await hardhatLendingBoardConfigurator
    .connect(owner)
    .enableBorrowingOnReserve(PLUGaddress, true, { gasLimit: 3000000 });
  baseLTVasCollateral = ethers.utils.parseEther("0.5");
  // liquidationThreshold = ethers.utils.parseEther('0.70');
  liquidationThreshold = "70";
  liquidationBonus = ethers.utils.parseEther("0.01");
  await hardhatLendingBoardConfigurator
    .connect(owner)
    .enableReserveAsCollateral(
      PLUGaddress,
      baseLTVasCollateral,
      liquidationThreshold,
      liquidationBonus, { gasLimit: 3000000 }
    );

  await hardhatLendingBoardProposeMode
    .connect(owner)
    .setUserUseReserveAsCollateral(PLUGaddress, 1, { gasLimit: 3000000 }); // 1 : enable, 0 : disable
  await hardhatLendingBoardProposeMode
    .connect(user1)
    .setUserUseReserveAsCollateral(PLUGaddress, 1, { gasLimit: 3000000 }); // 1 : enable, 0 : disable
  // console.log("set PLUG as Collateral enabled");

  console.log(
    "\x1b[43m%s\x1b[0m",
    "\n Token's Reserve set(LTV, LiquidationThreshold, LiquidationBonus) for Service"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
