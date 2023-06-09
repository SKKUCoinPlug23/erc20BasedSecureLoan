
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("<LendingBoardProposeMode Contract Test Implementation>", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployLendingBoardFixture() {
    // Get the ContractFactory and Signers here.
    const [owner, user1, user2, borrower1, borrower2] = await ethers.getSigners();

    // Libraries
    const CoreLibrary = await ethers.getContractFactory("CoreLibrary");
    const hardhatCoreLibrary = await CoreLibrary.deploy();
    await hardhatCoreLibrary.deployed();

    // Main Contracts 객체 생성 
    const LendingBoardProposeMode = await ethers.getContractFactory("LendingBoardProposeMode");
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
    const TestLendingRateOracle = await ethers.getContractFactory("TestLendingRateOracle");
    const TokenDistributor = await ethers.getContractFactory("TokenDistributor");

    // Main Contracts Deployment
    const hardhatLendingBoardProposeMode = await LendingBoardProposeMode.deploy();
    await hardhatLendingBoardProposeMode.deployed()
    const hardhatLendingBoardCore = await LendingBoardCore.deploy();
    await hardhatLendingBoardCore.deployed()
    const hardhatLendingBoardConfigurator = await LendingBoardConfigurator.deploy();
    await hardhatLendingBoardConfigurator.deployed()
    const hardhatLendingBoardDataProvider = await LendingBoardDataProvider.deploy();
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
    // await hardhatLendingBoardAddressesProvider.setLendingRateOracle();

    // LBAP 이용한 setter가 정상작동했는지 expect를 이용하여 확인
    const addressStoredInAddressesProvider = await hardhatLendingBoardAddressesProvider.getLendingBoard();
    expect(addressStoredInAddressesProvider).to.equal(hardhatLendingBoardProposeMode.address);

    // 각 Main Contract의 initialize()를 이용하여 initialization 수행
    await hardhatLendingBoardProposeMode.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardCore.initialize(hardhatLendingBoardAddressesProvider.address); 
    await hardhatLendingBoardConfigurator.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardDataProvider.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardParametersProvider.initialize(hardhatLendingBoardAddressesProvider.address);
    await hardhatLendingBoardFeeProvider.initialize(hardhatLendingBoardAddressesProvider.address);
    // since DISTRIBUTION_BASE = 10000; set in TokenDistributor.sol dummy data for percentages set like below
    await hardhatTokenDistributor.initialize([owner.address,user1.address,user2.address],[4000,3000,2000]);
    // await hardhatLendingBoardLiquidationManager.initialize(hardhatLendingBoardAddressesProvider.address);

    // SampleToken(STKN) Deployment for Testing. SampleToken.sol에서 가져옴
    const SampleToken = await ethers.getContractFactory("SampleToken");
    const hardhatSampleToken = await SampleToken.deploy();
    await hardhatSampleToken.deployed();
    
    // Sample Token Address 확인
    const STKNaddress = hardhatSampleToken.address;
    // console.log("STKNaddress : ",STKNaddress);

    // 임의로 TestOracle AssetPrice 및 TestLendingRateOracle의 LendingRate 설정
    const STKNPrice = ethers.utils.parseEther('2');
    console.log("STKN Price : ",STKNPrice);
    await hardhatTestOracle.setAssetPrice(STKNaddress,STKNPrice);

    const STKNLendingRate = ethers.utils.parseEther('0.05');
    await hardhatTestLendingRateOracle.setMarketBorrowRate(STKNaddress,STKNLendingRate);

    // PlugToken(PLUG) Deployment
    const PlugToken = await ethers.getContractFactory("PlugToken");
    const hardhatPlugToken = await PlugToken.deploy();
    await hardhatPlugToken.deployed();
    
    const PLUGaddress = hardhatPlugToken.address;

    const PLUGPrice = ethers.utils.parseEther('5');
    await hardhatTestOracle.setAssetPrice(PLUGaddress,PLUGPrice);

    const PLUGLendingRate = ethers.utils.parseEther('0.1');
    await hardhatTestLendingRateOracle.setMarketBorrowRate(PLUGaddress,PLUGLendingRate);

    // Default Reserve Interest-Rate Strategy Contract Setting
    const DefaultReserveInterestRateStrategy = await ethers.getContractFactory("DefaultReserveInterestRateStrategy");

    // STKN Interest Rate Strategy setting
    const STKNhardhatDefaultReserveInterestRateStrategy = await DefaultReserveInterestRateStrategy.deploy(STKNaddress,hardhatLendingBoardAddressesProvider.address,1,1,1,1,1);
    await STKNhardhatDefaultReserveInterestRateStrategy.deployed();
    const STKNstrategyAddress = STKNhardhatDefaultReserveInterestRateStrategy.address;
    // 생성한 STKN의 Reserve를 initialization 해준다.
    await hardhatLendingBoardConfigurator.initReserve(STKNaddress,18,STKNstrategyAddress);
    // await hardhatLendingBoardConfigurator.setReserveInterestRateStrategyAddress(STKNaddress,STKNstrategyAddress)

    // PLUG Interest Rate Strategy setting
    const PLUGhardhatDefaultReserveInterestRateStrategy = await DefaultReserveInterestRateStrategy.deploy(PLUGaddress,hardhatLendingBoardAddressesProvider.address,1,1,1,1,1);
    await PLUGhardhatDefaultReserveInterestRateStrategy.deployed();
    const PLUGstrategyAddress = PLUGhardhatDefaultReserveInterestRateStrategy.address;
    // 생성한 STKN의 Reserve를 initialization 해준다.
    await hardhatLendingBoardConfigurator.initReserve(PLUGaddress,18,PLUGstrategyAddress);

    // user1에게 STKN과 PLUG를 전송해준다.
    const transferAmount = ethers.utils.parseEther('3000');
    await hardhatSampleToken.connect(owner).transfer(user1.address,transferAmount);
    await hardhatPlugToken.connect(owner).transfer(user1.address,transferAmount);

    // Approve LendingBoard contract to spend tokens
    const approveAmount = ethers.utils.parseEther('2000');

    // Send the approval transaction. The address should be LBCore not LB itself.
    // Owner의 approval 및 deposit
    let approvalResult = await hardhatSampleToken.connect(owner).approve(hardhatLendingBoardCore.address, approveAmount);
    approvalResult = await hardhatPlugToken.connect(owner).approve(hardhatLendingBoardCore.address, approveAmount);
    
    // deposit() 이용하여 서비스에 STKN 예치
    const depositAmount = ethers.utils.parseEther('1000');

    // STKN 100개 예치
    await hardhatLendingBoardProposeMode.connect(owner).deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
    // PLUG 100개 예치
    await hardhatLendingBoardProposeMode.connect(owner).deposit(PLUGaddress, depositAmount, 0); // Set Referral Code = 0

    // User1의 approval 및 Deposit
    approvalResult = await hardhatSampleToken.connect(user1).approve(hardhatLendingBoardCore.address, approveAmount);
    approvalResult = await hardhatPlugToken.connect(user1).approve(hardhatLendingBoardCore.address, approveAmount);

    // STKN 100개 예치
    await hardhatLendingBoardProposeMode.connect(user1).deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
    // PLUG 100개 예치
    await hardhatLendingBoardProposeMode.connect(user1).deposit(PLUGaddress, depositAmount, 0); // Set Referral Code = 0

    let baseLTVasCollateral,liquidationThreshold,liquidationBonus
    // configuring STKN Reserve for Borrowing and Collateral
    await hardhatLendingBoardConfigurator.connect(owner).enableBorrowingOnReserve(STKNaddress,true);
    baseLTVasCollateral = ethers.utils.parseEther('0.5');
    liquidationThreshold = ethers.utils.parseEther('0.70');
    liquidationBonus = ethers.utils.parseEther('0.01');
    await hardhatLendingBoardConfigurator.connect(owner).enableReserveAsCollateral(STKNaddress,baseLTVasCollateral,liquidationThreshold,liquidationBonus);
    await hardhatLendingBoardProposeMode.connect(owner).setUserUseReserveAsCollateral(STKNaddress,1); // 1 : enable, 0 : disable
    // console.log("set STKN as Collateral enabled");

    // configuring PLUG Reserve for Borrowing and Collateral
    await hardhatLendingBoardConfigurator.connect(owner).enableBorrowingOnReserve(PLUGaddress,true);
    baseLTVasCollateral = ethers.utils.parseEther('0.5');
    liquidationThreshold = ethers.utils.parseEther('0.70');
    liquidationBonus = ethers.utils.parseEther('0.01');
    await hardhatLendingBoardConfigurator.connect(owner).enableReserveAsCollateral(PLUGaddress,baseLTVasCollateral,liquidationThreshold,liquidationBonus);
    await hardhatLendingBoardProposeMode.connect(owner).setUserUseReserveAsCollateral(PLUGaddress,1); // 1 : enable, 0 : disable
    // console.log("set PLUG as Collateral enabled");
    
    // Fixtures can return anything you consider useful for your tests
    return { owner, user1, user2, borrower1, borrower2, LendingBoardProposeMode, hardhatLendingBoardProposeMode,hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator,hardhatLendingBoardDataProvider, hardhatLendingBoardFeeProvider,hardhatSampleToken,STKNaddress,PLUGaddress};
  }

  describe("<Initializations>", function () {

    it("Should Deploy Successfully and Set the proper address", async function () {
      const { hardhatLendingBoardProposeMode, owner } = await loadFixture(deployLendingBoardFixture);
      // expect(await hardhatLendingBoardProposeMode.owner()).to.equal(owner.address);
    });
  });

  describe("<Lending Board Interaction>", function () {

    it("Depositing Sample Token to Service For the First Time", async function () {
      // loadFixture 이용해서 필요한 객체들을 가져온다.
      const { owner,hardhatLendingBoardProposeMode,STKNaddress } = await loadFixture(deployLendingBoardFixture);

      // deposit() 이용하여 서비스에 STKN 예치
      const depositAmount = ethers.utils.parseEther('10');
      console.log("Deposit Amount : ",depositAmount.toString());
      await hardhatLendingBoardProposeMode.connect(owner).deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
    });

    it("Getting Reserve Configuration Data",async function(){
      const { owner,addr1, hardhatLendingBoardProposeMode, hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator,hardhatSampleToken,hardhatLendingBoardDataProvider,STKNaddress } = await loadFixture(deployLendingBoardFixture);
      // STKN의 Reserve getter function test
      const reserveData = await hardhatLendingBoardProposeMode.getReserveData(STKNaddress);
      // console.log("STKN Reserve Data : ",reserveData);
    });
    
    it("Borrowing",async function(){
      const { owner,addr1, hardhatLendingBoardProposeMode, hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator,hardhatSampleToken,hardhatLendingBoardDataProvider,hardhatLendingBoardFeeProvider, STKNaddress } = await loadFixture(deployLendingBoardFixture);
      // borrow()
      var reserveData = await hardhatLendingBoardProposeMode.getReserveData(STKNaddress);
      console.log("STKN Reserve Data available Liquidity : ",reserveData.availableLiquidity.toString());

      const borrowAmount = ethers.utils.parseEther('1');
      await hardhatLendingBoardProposeMode.connect(owner).borrow(STKNaddress,borrowAmount,2); // InterestRateMode 1 == stable, 2 == variable
      
      reserveData = await hardhatLendingBoardProposeMode.getReserveData(STKNaddress);
      console.log("STKN Reserve Data available Liquidity : ",reserveData.availableLiquidity.toString());
    });

    it("Borrow and Repay less than the borrow amount",async function(){
      const { owner,user1, hardhatLendingBoardProposeMode, hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator,hardhatSampleToken,hardhatLendingBoardDataProvider,hardhatLendingBoardFeeProvider, STKNaddress } = await loadFixture(deployLendingBoardFixture);
     
      // borrow()
      var reserveData = await hardhatLendingBoardProposeMode.getReserveData(STKNaddress);
      console.log("STKN Reserve Data available Liquidity : ",reserveData.availableLiquidity.toString());

      const borrowAmount = ethers.utils.parseEther('1');
      await hardhatLendingBoardProposeMode.connect(owner).borrow(STKNaddress,borrowAmount,2); // InterestRateMode 1 == stable, 2 == variable
      
      reserveData = await hardhatLendingBoardProposeMode.getReserveData(STKNaddress);
      console.log("STKN Reserve Data available Liquidity : ",reserveData.availableLiquidity.toString());

      // owner가 아닌 user1은 대출을 하지 않았기에 user1으로 repay시 revert되어야 함
      await expect(hardhatLendingBoardProposeMode.connect(user1).repay(STKNaddress,borrowAmount,user1.address)).to.be.reverted;
      // owner가 repay하는 경우
      const repayAmount = ethers.utils.parseEther('0.5'); // 대출한 값보다 적은 금액을 repayAmount로 책정
      await hardhatLendingBoardProposeMode.connect(owner).repay(STKNaddress,repayAmount,owner.address);
      reserveData = await hardhatLendingBoardProposeMode.getReserveData(STKNaddress);
      console.log("STKN Reserve Data available Liquidity : ",reserveData.availableLiquidity.toString());

    });

    it("Borrow and Repay more than the borrow amount",async function(){
      const { owner,user1, hardhatLendingBoardProposeMode, hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator,hardhatSampleToken,hardhatLendingBoardDataProvider,hardhatLendingBoardFeeProvider, STKNaddress } = await loadFixture(deployLendingBoardFixture);
     
      // borrow()
      var reserveData = await hardhatLendingBoardProposeMode.getReserveData(STKNaddress);
      console.log("STKN Reserve Data available Liquidity : ",reserveData.availableLiquidity.toString());
      console.log("Owner STKN amount : ",await hardhatSampleToken.balanceOf(owner.address));

      const borrowAmount = ethers.utils.parseEther('10');
      await hardhatLendingBoardProposeMode.connect(owner).borrow(STKNaddress,borrowAmount,2); // InterestRateMode 1 == stable, 2 == variable
      
      reserveData = await hardhatLendingBoardProposeMode.getReserveData(STKNaddress);
      console.log("STKN Reserve Data available Liquidity : ",reserveData.availableLiquidity.toString());
      console.log("Owner STKN amount : ",await hardhatSampleToken.balanceOf(owner.address));

      // owner가 아닌 user1은 대출을 하지 않았기에 user1으로 repay시 revert되어야 함
      await expect(hardhatLendingBoardProposeMode.connect(user1).repay(STKNaddress,borrowAmount,user1.address)).to.be.reverted;
      // owner가 repay하는 경우
      const repayAmount = ethers.utils.parseEther('21'); // 대출한 값보다 적은 금액을 repayAmount로 책정
      await hardhatLendingBoardProposeMode.connect(owner).repay(STKNaddress,repayAmount,owner.address);
      reserveData = await hardhatLendingBoardProposeMode.getReserveData(STKNaddress);
      console.log("STKN Reserve Data available Liquidity : ",reserveData.availableLiquidity.toString());
      console.log("Owner STKN amount : ",await hardhatSampleToken.balanceOf(owner.address));

    });

    it("Borrow Proposal Test Case",async function(){
      const { owner,user1, hardhatLendingBoardProposeMode, hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator,hardhatSampleToken,hardhatLendingBoardDataProvider,hardhatLendingBoardFeeProvider, STKNaddress, PLUGaddress } = await loadFixture(deployLendingBoardFixture);
     
      // borrow()
      var reserveData = await hardhatLendingBoardProposeMode.getReserveData(STKNaddress);
      console.log("STKN Reserve Data available Liquidity : ",reserveData.availableLiquidity.toString());
      console.log("Owner STKN amount : ",await hardhatSampleToken.balanceOf(owner.address));

      const borrowAmount1 = ethers.utils.parseEther('10');
      const borrowAmount2 = ethers.utils.parseEther('20');

      const interestRate = 10; // 일단은 parseEther 고려하지 않고 10으로 설정
      // dueDate의 경우 임의로 현재시간의 + 100000 으로 설정한다.
      const dueDate = Date.now() + 100000;
      console.log("dueDate from JS : ",dueDate);
      // Borrowing STKN( = 2ETH) using PLUG( = 5ETH) as a collateral
      await expect(hardhatLendingBoardProposeMode.connect(owner).borrowProposal(STKNaddress,borrowAmount1,PLUGaddress,interestRate,dueDate)).to.emit(hardhatLendingBoardProposeMode,"BorrowProposed");

      await expect(hardhatLendingBoardProposeMode.connect(owner).borrowProposal(STKNaddress,borrowAmount2,PLUGaddress,interestRate,dueDate)).to.emit(hardhatLendingBoardProposeMode,"BorrowProposed");

      const generatedBorrowProposal = await hardhatLendingBoardProposeMode.connect(owner).getBorrowProposal(0);
      // Data from borowProposal needs to have a borrower's id matching that of owner.address.
      expect(owner.address).to.equal(generatedBorrowProposal.borrower);

      // User1's STKN Reserve Data before Borrow Proposal Accept
      let user1STKNReserveData = await hardhatLendingBoardDataProvider.getUserReserveData(STKNaddress,user1.address);
      console.log("User1's STKN Reserve Data : ",user1STKNReserveData);

      await hardhatLendingBoardProposeMode.connect(user1).borrowProposalAccept(0);
      console.log("Lender's Account Balance after BorrowProposal Accepted");
  
      // User1's STKN Reserve Data after Borrow Proposal Accept
      // WIP : 현재 User1의 currentBorrowBalance(대출량)이 증가하지 않는 문제 발생 
      user1STKNReserveData = await hardhatLendingBoardDataProvider.getUserReserveData(STKNaddress,user1.address);
      console.log("User1's STKN Reserve Data After Proposal Accepted : ",user1STKNReserveData);

      const borrowProposalList = await hardhatLendingBoardProposeMode.getBorrowProposalList(0,1);
      console.log("Borrow Proposal List : ",borrowProposalList);


    });
    
  });


});