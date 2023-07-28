const { ethers } = require("hardhat");
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
    const LendingBoardNFT = await ethers.getContractFactory("LendingBoardNFT");

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
    const hardhatLendingBoardNFT = await LendingBoardNFT.deploy(); // NFT Minting Contracts Deployment
    await hardhatLendingBoardNFT.deployed();
    // Test -> might be erased
    console.log("NFT Token Deployed to : ", hardhatLendingBoardNFT.address);

    // Using LendingBoardAddressesProvider(LBAP) set the deployed Smart Contract address to the appropriate location
    await hardhatLendingBoardAddressesProvider.setLendingBoardImpl(hardhatLendingBoardProposeMode.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardCoreImpl(hardhatLendingBoardCore.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardConfiguratorImpl(hardhatLendingBoardConfigurator.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardDataProviderImpl(hardhatLendingBoardDataProvider.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardParametersProviderImpl(hardhatLendingBoardParametersProvider.address);
    await hardhatLendingBoardAddressesProvider.setFeeProviderImpl(hardhatLendingBoardFeeProvider.address);
    await hardhatLendingBoardAddressesProvider.setLendingBoardNFTImpl(hardhatLendingBoardNFT.address); // Newly updated for NFT

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
    // WIP : Decimal이 18인지 27인지 잘 모르겠음
    const sampleBaseVariableRate = ethers.utils.parseUnits('0.02',18); // 2% annual interest rate
    const sampleVariableRateSlope1 = ethers.utils.parseUnits('0.1',18);  // 10% increase in the annual interest rate for each increase of 1 in the utilization rate, applys the same logic in the below variables
    const sampleVariableRateSlope2 = ethers.utils.parseUnits('0.5',18);
    const sampleStableRateSlope1 = ethers.utils.parseUnits('0.1',18); 
    const sampleStableRateSlope2 = ethers.utils.parseUnits('0.5',18);

    const STKNhardhatDefaultReserveInterestRateStrategy = await DefaultReserveInterestRateStrategy.deploy(STKNaddress,hardhatLendingBoardAddressesProvider.address,sampleBaseVariableRate,sampleVariableRateSlope1,sampleVariableRateSlope2,sampleStableRateSlope1,sampleStableRateSlope2);
    await STKNhardhatDefaultReserveInterestRateStrategy.deployed();
    const STKNstrategyAddress = STKNhardhatDefaultReserveInterestRateStrategy.address;
    // 생성한 STKN의 Reserve를 initialization 해준다.
    await hardhatLendingBoardConfigurator.initReserve(STKNaddress,18,STKNstrategyAddress);
    // await hardhatLendingBoardConfigurator.setReserveInterestRateStrategyAddress(STKNaddress,STKNstrategyAddress)

    // PLUG Interest Rate Strategy setting
    const PLUGhardhatDefaultReserveInterestRateStrategy = await DefaultReserveInterestRateStrategy.deploy(PLUGaddress,hardhatLendingBoardAddressesProvider.address,sampleBaseVariableRate,sampleVariableRateSlope1,sampleVariableRateSlope2,sampleStableRateSlope1,sampleStableRateSlope2);
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

    console.log(" ====================== Depositing STKN and PLUG ======================");
    // Send the approval transaction. The address should be LBCore not LB itself.
    // Owner의 approval 및 deposit
    let approvalResult = await hardhatSampleToken.connect(owner).approve(hardhatLendingBoardCore.address, approveAmount);
    approvalResult = await hardhatPlugToken.connect(owner).approve(hardhatLendingBoardCore.address, approveAmount);
    
    // deposit() 이용하여 서비스에 STKN 예치
    const depositAmount = ethers.utils.parseEther('1000');

    // STKN 1000개 예치
    await hardhatLendingBoardProposeMode.connect(owner).deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
    // PLUG 1000개 예치
    await hardhatLendingBoardProposeMode.connect(owner).deposit(PLUGaddress, depositAmount, 0); // Set Referral Code = 0
    // const ownerSTKNBalance = await hardhatLendingBoardProposeMode.getUserReserveData(STKNaddress,owner.address);
    // const ownerPLUGBalance = await hardhatLendingBoardProposeMode.getUserReserveData(PLUGaddress,owner.address);
    const ownerSTKNBalance = await hardhatSampleToken.balanceOf(owner.address);
    const ownerPLUGBalance = await hardhatPlugToken.balanceOf(owner.address);
    console.log("ownerSTKNBalance : ", ownerSTKNBalance);
    console.log("ownerPLUGBalance : ", ownerPLUGBalance); // -------------> Why different?

    console.log(" ====================== ====================== ======================");

    // User1의 approval 및 Deposit
    approvalResult = await hardhatSampleToken.connect(user1).approve(hardhatLendingBoardCore.address, approveAmount);
    approvalResult = await hardhatPlugToken.connect(user1).approve(hardhatLendingBoardCore.address, approveAmount);

    await hardhatLendingBoardProposeMode.connect(user1).deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
    await hardhatLendingBoardProposeMode.connect(user1).deposit(PLUGaddress, depositAmount, 0); // Set Referral Code = 0

    let baseLTVasCollateral,liquidationThreshold,liquidationBonus
    // configuring STKN Reserve for Borrowing and Collateral
    await hardhatLendingBoardConfigurator.connect(owner).enableBorrowingOnReserve(STKNaddress,true);
    baseLTVasCollateral = ethers.utils.parseEther('0.5');
    liquidationThreshold = ethers.utils.parseEther('0.70');
    liquidationBonus = ethers.utils.parseEther('0.01');
    await hardhatLendingBoardConfigurator.connect(owner).enableReserveAsCollateral(STKNaddress,baseLTVasCollateral,liquidationThreshold,liquidationBonus);

    await hardhatLendingBoardProposeMode.connect(owner).setUserUseReserveAsCollateral(STKNaddress,1); // 1 : enable, 0 : disable
    await hardhatLendingBoardProposeMode.connect(user1).setUserUseReserveAsCollateral(STKNaddress,1); // 1 : enable, 0 : disable


    // console.log("set STKN as Collateral enabled");

    // configuring PLUG Reserve for Borrowing and Collateral
    await hardhatLendingBoardConfigurator.connect(owner).enableBorrowingOnReserve(PLUGaddress,true);
    baseLTVasCollateral = ethers.utils.parseEther('0.5');
    liquidationThreshold = ethers.utils.parseEther('0.70');
    liquidationBonus = ethers.utils.parseEther('0.01');
    await hardhatLendingBoardConfigurator.connect(owner).enableReserveAsCollateral(PLUGaddress,baseLTVasCollateral,liquidationThreshold,liquidationBonus);

    await hardhatLendingBoardProposeMode.connect(owner).setUserUseReserveAsCollateral(PLUGaddress,1); // 1 : enable, 0 : disable
    await hardhatLendingBoardProposeMode.connect(user1).setUserUseReserveAsCollateral(PLUGaddress,1); // 1 : enable, 0 : disable
    // console.log("set PLUG as Collateral enabled");

    // Fixtures can return anything you consider useful for your tests
    return { owner, user1, user2, borrower1, borrower2, LendingBoardProposeMode, hardhatLendingBoardProposeMode,hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator,hardhatLendingBoardDataProvider, hardhatLendingBoardFeeProvider,hardhatSampleToken,STKNaddress,PLUGaddress,hardhatLendingBoardNFT,hardhatPlugToken};
  }

  describe("<Lending Board Interaction>", function () {

    it("Depositing Sample Token to Service For the First Time", async function () {
      // loadFixture 이용해서 필요한 객체들을 가져온다.
      const { owner,hardhatLendingBoardProposeMode,STKNaddress } = await loadFixture(deployLendingBoardFixture);

      // deposit() 이용하여 서비스에 STKN 예치
      const depositAmount = ethers.utils.parseEther('10');
      console.log("Deposit Amount : ", depositAmount.toString());
      await hardhatLendingBoardProposeMode.connect(owner).deposit(STKNaddress, depositAmount, 0); // Set Referral Code = 0
    });

    it("Getting Reserve Configuration Data",async function(){
      const { owner,addr1, hardhatLendingBoardProposeMode, hardhatLendingBoardAddressesProvider,hardhatLendingBoardCore,hardhatLendingBoardConfigurator,hardhatSampleToken,hardhatLendingBoardDataProvider,STKNaddress } = await loadFixture(deployLendingBoardFixture);
      // STKN의 Reserve getter function test
      const reserveData = await hardhatLendingBoardProposeMode.getReserveData(STKNaddress);
      console.log("STKN Reserve Data : ", reserveData);
    });
    
    it("Borrow Proposal Test Case", async function(){
      const { 
        owner,
        user1, 
        hardhatLendingBoardProposeMode, 
        hardhatLendingBoardAddressesProvider,
        hardhatLendingBoardCore,
        hardhatLendingBoardConfigurator,
        hardhatSampleToken,
        hardhatLendingBoardDataProvider,
        hardhatLendingBoardFeeProvider,
        STKNaddress, 
        PLUGaddress, 
        hardhatLendingBoardNFT,
        hardhatPlugToken
      } = await loadFixture(deployLendingBoardFixture);

      // borrow()
      var reserveData = await hardhatLendingBoardProposeMode.getReserveData(STKNaddress);
      console.log("STKN Reserve Data available Liquidity : ", reserveData.availableLiquidity.toString());
      console.log("[+] Owner STKN(Borrow) amount before borrow: ", await hardhatSampleToken.balanceOf(owner.address));
      
      const borrowAmount1 = ethers.utils.parseEther('10');
      const borrowAmount2 = ethers.utils.parseEther('20');
      
      const interestRate = 10;
      const dueDate = Date.now() + 100000;
      console.log("dueDate from JS : ", dueDate);

      let borrowerSTKNReserveData = await hardhatLendingBoardDataProvider.getUserReserveData(STKNaddress,owner.address);
      console.log("\x1b[43m%s\x1b[0m", "\n[Before Borrow] Borrower STKN Reserve Data available Liquidity : ", borrowerSTKNReserveData);

      // ===========
      //    Borrow
      // ===========
      // Borrowing STKN(= 2ETH) using PLUG(= 5ETH) as a collateral
      await expect(hardhatLendingBoardProposeMode
        .connect(owner)
        .borrowProposal(STKNaddress, borrowAmount1, PLUGaddress, interestRate, dueDate))
        .to.emit(hardhatLendingBoardProposeMode, "BorrowProposed");
      console.log("\x1b[42m%s\x1b[0m", "\n[*] Borrow Proposal #0 Proposed");
        
      await expect(hardhatLendingBoardProposeMode
        .connect(owner)
        .borrowProposal(STKNaddress, borrowAmount2, PLUGaddress, interestRate, dueDate))
        .to.emit(hardhatLendingBoardProposeMode, "BorrowProposed");
      console.log("\x1b[42m%s\x1b[0m", "\n[*] Borrow Proposal #1 Proposed");
      
      const generatedBorrowProposal = await hardhatLendingBoardProposeMode.connect(owner).getBorrowProposal(0);
      // Data from borowProposal needs to have a borrower's id matching that of owner.address.
      expect(owner.address).to.equal(generatedBorrowProposal.borrower);

      // Check the NFT & SToken Balance of Owner Before Borrow Proposal Accept
      const prevNFTbalance = await hardhatLendingBoardNFT.balanceOf(owner.address);
      expect(prevNFTbalance).to.equal(0);

      // User1 Accept Borrow Proposal #0
      await hardhatLendingBoardProposeMode.connect(user1).borrowProposalAccept(0);
      // Check the NFT & SToken Balance of Owner After Borrow Proposal Accept
      const currNFTbalance1 = await hardhatLendingBoardNFT.balanceOf(user1.address);
      expect(currNFTbalance1).to.equal(1);
      console.log("\x1b[42m%s\x1b[0m", "\n[*] Borrow Proposal #0 Accepted");

      borrowerSTKNReserveData = await hardhatLendingBoardDataProvider.getUserReserveData(STKNaddress,owner.address);
      console.log("\x1b[36m%s\x1b[0m", "\n[After Accepted Borrow Proposal #0] Borrower STKN Reserve Data available Liquidity : ", borrowerSTKNReserveData);

      // User1 Accept Borrow Proposal #1
      await hardhatLendingBoardProposeMode.connect(user1).borrowProposalAccept(1);
      // Check the NFT & SToken Balance of Owner After Borrow Proposal Accept
      const currNFTbalance2 = await hardhatLendingBoardNFT.balanceOf(user1.address);
      expect(currNFTbalance2).to.equal(2);
      console.log("\x1b[42m%s\x1b[0m", "\n[*] Borrow Proposal #1 Accepted");

      borrowerSTKNReserveData = await hardhatLendingBoardDataProvider.getUserReserveData(STKNaddress,owner.address);
      console.log("\x1b[36m%s\x1b[0m", "\n[After Accepted Borrow Proposal #1] Borrower STKN Reserve Data available Liquidity : ", borrowerSTKNReserveData);

      // =========
      //    NFT
      // =========

      // Get Information of NFT (Get mapping Value) 
      const nftInfo1 = await hardhatLendingBoardNFT.connect(user1).getNFTMetadata(1);
      console.log("[+] NFT #0 Info : ", nftInfo1);
      const nftInfo2 = await hardhatLendingBoardNFT.connect(user1).getNFTMetadata(2);
      console.log("[+] NFT #1 Info : ", nftInfo2);
      
      // pick up specific value of metadata : borrower 
      // (Could be operated by using getter function of NFT contract)
      const borrowerFromNFT1 = await nftInfo1.borrower;
      console.log("[+] Borrower from NFT : ", borrowerFromNFT1);

      // LendingBoardNFT function check
      const ownerTokenID = await hardhatLendingBoardNFT.connect(user1).tokenOfOwnerByIndex(user1.address, 0);
      expect(ownerTokenID).to.equal(1);
      const ownerOfTokenID = await hardhatLendingBoardNFT.connect(user1).ownerOf(ownerTokenID);
      expect(ownerOfTokenID).to.equal(user1.address);

      // show all NFT of user
      const userNFTs = await hardhatLendingBoardNFT.connect(user1).getUserTokenList(user1.address);
      console.log("[+] List of user NFTs : ", userNFTs);

      // =========
      //   Repay
      // =========
      // owner가 아닌 user1은 대출을 하지 않았기에 user1으로 repay시 revert되어야 함
      // await expect(hardhatLendingBoardProposeMode.connect(user1).repay(STKNaddress, borrowAmount, user1.address, 0, true)).to.be.reverted;

      // owner가 repay하는 경우
      // const paybackAmount = ethers.utils.parseEther('11.025'); // principal Borrow Amount
      const paybackAmount1 = 10;
      const paybackAmount2 = 20; 
      const interest1 = paybackAmount1 * interestRate / 100; // interest
      const interest2 = paybackAmount2 * interestRate / 100; // interest
      const fee1 = paybackAmount1 * 0.0025; // fee
      const fee2 = paybackAmount2 * 0.0025; // fee

      const finalPaybackAmount1 = ethers.utils.parseEther((paybackAmount1 + interest1 + fee1).toString());
      const finalPaybackAmount2 = ethers.utils.parseEther((paybackAmount2 + interest2 + fee2).toString());
      console.log("[+] Repay Amount for Proposal #0: ", finalPaybackAmount1.toString());
      console.log("[+] Repay Amount for Proposal #1: ", finalPaybackAmount2.toString());

      await hardhatLendingBoardProposeMode.connect(owner).repay(0, true);
      borrowerSTKNReserveData = await hardhatLendingBoardProposeMode.getUserReserveData(STKNaddress, owner.address);
      console.log("\x1b[42m%s\x1b[0m", "\n[*] Borrow Proposal #0 Repayed");
      console.log("\x1b[36m%s\x1b[0m", "\n[After Repay Proposal #0] owner STKN Reserve Data available Liquidity : ", borrowerSTKNReserveData);

      await hardhatLendingBoardProposeMode.connect(owner).repay(1, true);
      borrowerSTKNReserveData = await hardhatLendingBoardProposeMode.getUserReserveData(STKNaddress, owner.address);
      console.log("\x1b[42m%s\x1b[0m", "\n[*] Borrow Proposal #1 Repayed");
      console.log("\x1b[36m%s\x1b[0m", "\n[After Repay Proposal #1] owner STKN Reserve Data available Liquidity : ", borrowerSTKNReserveData);

      // check lender's NFT balance after repay & burn NFT
      const afterNFTbalance = await hardhatLendingBoardNFT.balanceOf(user1.address);
      expect(afterNFTbalance).to.equal(0);
    });
    
  });


});