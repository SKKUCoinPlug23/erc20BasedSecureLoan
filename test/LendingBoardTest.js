
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("<LendingBoard Contract Test Implementation>", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployLendingBoardFixture() {
    // Get the ContractFactory and Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Libraries
    const CoreLibrary = await ethers.getContractFactory("CoreLibrary");
    const hardhatCoreLibrary = await CoreLibrary.deploy();
    await hardhatCoreLibrary.deployed();

    // Main Contracts 객체 생성 
    const LendingBoard = await ethers.getContractFactory("LendingBoard");
    const LendingBoardCore = await ethers.getContractFactory("LendingBoardCore", {
      signer : owner,
      libraries : {
        CoreLibrary : hardhatCoreLibrary.address,
      },
    });
    const LendingBoardConfigurator = await ethers.getContractFactory("LendingBoardConfigurator");
    const LendingBoardDataProvider = await ethers.getContractFactory("LendingBoardDataProvider");
    const LendingBoardParametersProvider = await ethers.getContractFactory("LendingBoardParametersProvider");
    const LendingBoardFeeProvider = await ethers.getContractFactory("FeeProvider");
    const LendingBoardLiquidationManager = await ethers.getContractFactory("LendingBoardLiquidationManager");
    const LendingBoardAddressesProvider = await ethers.getContractFactory("LendingBoardAddressesProvider");
    const TestOracle = await ethers.getContractFactory("TestOracle");

    // Main Contracts Deployment
    const hardhatLendingBoard = await LendingBoard.deploy();
    await hardhatLendingBoard.deployed()
    const hardhatLendingBoardCore = await LendingBoardCore.deploy();
    await hardhatLendingBoardCore.deployed()
    const hardhatLendingBoardConfigurator = await LendingBoardConfigurator.deploy();
    await hardhatLendingBoardConfigurator.deployed()
    const hardhatLendingBoardDataProvider= await LendingBoardDataProvider.deploy();
    await hardhatLendingBoardDataProvider.deployed()
    const hardhatLendingBoardParametersProvider = await LendingBoardParametersProvider.deploy();
    await hardhatLendingBoardParametersProvider.deployed()
    const hardhatLendingBoardFeeProvider = await LendingBoardFeeProvider.deploy();
    await hardhatLendingBoardFeeProvider.deployed()
    const hardhatLendingBoardLiquidationManager = await LendingBoardLiquidationManager.deploy();
    await hardhatLendingBoardLiquidationManager.deployed()
    const hardhatLendingBoardAddressesProvider = await LendingBoardAddressesProvider.deploy();
    await hardhatLendingBoardAddressesProvider.deployed();
    const hardhatTestOracle = await TestOracle.deploy();
    await hardhatTestOracle.deployed();

    // Using LendingBoardAddressesProvider(LBAP) set the deployed Smart Contract address to the appropriate location
    await hardhatLendingBoardAddressesProvider.setLendingBoardImpl(hardhatLendingBoard.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardCoreImpl(hardhatLendingBoardCore.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardConfiguratorImpl(hardhatLendingBoardConfigurator.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardDataProviderImpl(hardhatLendingBoardDataProvider.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardParametersProviderImpl(hardhatLendingBoardParametersProvider.address);
    await hardhatLendingBoardAddressesProvider.setFeeProviderImpl(hardhatLendingBoardFeeProvider.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardLiquidationManager(hardhatLendingBoardLiquidationManager.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardManager(owner.address);
    // await hardhatLendingBoardAddressesProvider.setPriceOracle();
    // await hardhatLendingBoardAddressesProvider.setLendingRateOracle();
    // await hardhatLendingBoardAddressesProvider.setTokenDistributor();

    // Setting address for contracts that are outside the context of the protocol
    // await hardhatLendingBoardAddressesProvider.setLendingBoardManager();
    await hardhatLendingBoardAddressesProvider.setPriceOracle(hardhatTestOracle.address);
    // await hardhatLendingBoardAddressesProvider.setLendingRateOracle();
    // await hardhatLendingBoardAddressesProvider.setTokenDistributor();

    // LBAP 이용한 setter가 정상작동했는지 expect를 이용하여 확인
    const addressStoredInAddressesProvider = await hardhatLendingBoardAddressesProvider.getLendingBoard();
    expect(addressStoredInAddressesProvider).to.equal(hardhatLendingBoard.address);

    // 각 Main Contract의 initialize()를 이용하여 initialization 수행
    await hardhatLendingBoard.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardCore.initialize(hardhatLendingBoardAddressesProvider.address); 
    await hardhatLendingBoardConfigurator.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardDataProvider.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardParametersProvider.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardFeeProvider.initialize(hardhatLendingBoardAddressesProvider.address);
    // await hardhatLendingBoardLiquidationManager.initialize(hardhatLendingBoardAddressesProvider.address);

    // SampleToken(STKN) Deployment for Testing. SampleToken.sol에서 가져옴
    const SampleToken = await ethers.getContractFactory("SampleToken");
    const hardhatSampleToken = await SampleToken.deploy();
    await hardhatSampleToken.deployed();
    
    const STKNaddress = hardhatSampleToken.address;
    console.log("STKNaddress : ",STKNaddress);
    const STKNPrice = ethers.utils.parseEther('2');
    console.log("STKN Price : ",STKNPrice);
    await hardhatTestOracle.setAssetPrice(STKNaddress,STKNPrice);

    // Default Reserve Interest-Rate Strategy Contract Setting
    const DefaultReserveInterestRateStrategy = await ethers.getContractFactory("DefaultReserveInterestRateStrategy");
    const hardhatDefaultReserveInterestRateStrategy = await DefaultReserveInterestRateStrategy.deploy(STKNaddress,hardhatLendingBoardAddressesProvider.address,1,1,1,1,1);
    await hardhatDefaultReserveInterestRateStrategy.deployed();
    const strategyAddress = hardhatDefaultReserveInterestRateStrategy.address;

    // 생성한 STKN의 Reserve를 initialization 해준다.
    await hardhatLendingBoardConfigurator.initReserve(STKNaddress,18,strategyAddress);

    // Approve LendingBoard contract to spend tokens
    const approveAmount = ethers.utils.parseEther('1000');
    // Send the approval transaction. The address should be LBCore not LB itself.
    const approvalResult = await hardhatSampleToken.connect(owner).approve(hardhatLendingBoardCore.address, approveAmount);
    // Wait for the transaction to be mined
    await approvalResult.wait();

    const balanceOfOwner = await hardhatSampleToken.connect(owner).balanceOf(owner.address);
    console.log("Balance of Owner : ",balanceOfOwner.toString());

    // const balanceOfAddr1 = await hardhatSampleToken.connect(addr1).balanceOf(addr1.address);
    // console.log("Balance of Address1 User : ",balanceOfAddr1.toString());

    // Retrieve and log the allowance
    // const allowance = await hardhatSampleToken.allowance(owner.address, hardhatLendingBoardCore.address);
    // console.log("Allowance after approval: ", allowance.toString()); // allowance는 정상적으로 incremented
    // console.log("Reserve Address : ",STKNaddress);
    // console.log("LB Address : ",hardhatLendingBoard.address);
    // console.log("LBCore Address : ",hardhatLendingBoardCore.address);

    // console.log("STKN Approval for LendingBoard Contract Done");
    
    // Fixtures can return anything you consider useful for your tests
    return { owner, addr1, addr2, LendingBoard, hardhatLendingBoard,hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator,hardhatLendingBoardDataProvider, hardhatLendingBoardFeeProvider,hardhatSampleToken,STKNaddress};
  }

  describe("<Initializations>", function () {

    it("Should Deploy Successfully and Set the proper address", async function () {
      const { hardhatLendingBoard, owner } = await loadFixture(deployLendingBoardFixture);
      // expect(await hardhatLendingBoard.owner()).to.equal(owner.address);
    });
  });

  describe("<Lending Board Interaction>", function () {

    it("Depositing Sample Token to Service For the First Time", async function () {
      // loadFixture 이용해서 필요한 객체들을 가져온다.
      const { owner,addr1, hardhatLendingBoard, hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator,hardhatSampleToken,STKNaddress } = await loadFixture(deployLendingBoardFixture);

      // deposit() 이용하여 서비스에 STKN 예치
      const depositAmount = ethers.utils.parseEther('10');
      console.log("Deposit Amount : ",depositAmount.toString());
      await hardhatLendingBoard.connect(owner).deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
    });

    it("Getting Reserve Configuration Data",async function(){
      const { owner,addr1, hardhatLendingBoard, hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator,hardhatSampleToken,hardhatLendingBoardDataProvider,STKNaddress } = await loadFixture(deployLendingBoardFixture);
      // STKN의 Reserve getter function test
      const reserveData = await hardhatLendingBoard.getReserveData(STKNaddress);
      console.log("STKN Reserve Data : ",reserveData);
    });
    
    it("Borrowing",async function(){
      const { owner,addr1, hardhatLendingBoard, hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator,hardhatSampleToken,hardhatLendingBoardDataProvider,hardhatLendingBoardFeeProvider, STKNaddress } = await loadFixture(deployLendingBoardFixture);
      // deposit() 이용하여 서비스에 STKN 예치
      const depositAmount = ethers.utils.parseEther('10');
      console.log("Deposit Amount : ",depositAmount.toString());
      await hardhatLendingBoard.connect(owner).deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
      // borrow()
      await hardhatLendingBoardConfigurator.connect(owner).enableBorrowingOnReserve(STKNaddress,true);
      const baseLTVasCollateral = ethers.utils.parseEther('0.45');
      const liquidationThreshold = ethers.utils.parseEther('0.70');
      const liquidationBonus = ethers.utils.parseEther('0.01');
      await hardhatLendingBoardConfigurator.connect(owner).enableReserveAsCollateral(STKNaddress,baseLTVasCollateral,liquidationThreshold,liquidationBonus);
      await hardhatLendingBoard.connect(owner).setUserUseReserveAsCollateral(STKNaddress,1); // 1 : enable, 0 : disable
      console.log("set STKN as Collateral enabled");
      const reserveData = await hardhatLendingBoard.getReserveData(STKNaddress);
      console.log("STKN Reserve Data : ",reserveData);

      const borrowAmount = ethers.utils.parseEther('10');
      // Check borrowfee
      // const borrowfee = await hardhatLendingBoardFeeProvider.calculateLoanOriginationFee(owner.address,borrowAmount);
      // console.log("BorrowFee : ",borrowfee);
      await hardhatLendingBoard.connect(owner).borrow(STKNaddress,borrowAmount,1);
    });
    
  });


});