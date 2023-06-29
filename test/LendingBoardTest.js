
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("LendingBoard Contract Test Implementation", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployLendingBoardFixture() {
    // Get the ContractFactory and Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Libraries
    const CoreLibrary = await ethers.getContractFactory("CoreLibrary");
    const hardhatCoreLibrary = await CoreLibrary.deploy();
    await hardhatCoreLibrary.deployed();

    // Main Contracts
    const LendingBoard = await ethers.getContractFactory("LendingBoard");
    const LendingBoardCore = await ethers.getContractFactory("LendingBoardCore", {
      signer :owner,
      libraries : {
        CoreLibrary : hardhatCoreLibrary.address,
      },
    });

    const LendingBoardConfigurator = await ethers.getContractFactory("LendingBoardConfigurator");
    const LendingBoardDataProvider = await ethers.getContractFactory("LendingBoardDataProvider");
    const LendingBoardParametersProvider = await ethers.getContractFactory("LendingBoardParametersProvider");
    const LendingBoardFeeProvider = await ethers.getContractFactory("FeeProvider");
    const LendingBoardLiquidationManager = await ethers.getContractFactory("LendingBoardLiquidationManager");

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

    console.log("Lending Board Base Contracts Deployment Successful");

    // Fixtures can return anything you consider useful for your tests
    return { LendingBoard, hardhatLendingBoard, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {

    it("Should Deploy Successfully", async function () {
      const { hardhatLendingBoard, owner } = await loadFixture(deployLendingBoardFixture);


      // expect(await hardhatLendingBoard.owner()).to.equal(owner.address);
    });

  });

});