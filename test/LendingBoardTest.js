
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("LendingBoard Contract Test Implementation", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployLendingBoardFixture() {
    // Get the ContractFactory and Signers here.
    const LendingBoard = await ethers.getContractFactory("LendingBoard");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const hardhatLendingBoard = await LendingBoard.deploy();

    await hardhatLendingBoard.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { LendingBoard, hardhatLendingBoard, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { hardhatLendingBoard, owner } = await loadFixture(deployLendingBoardFixture);

      expect(await hardhatLendingBoard.owner()).to.equal(owner.address);
    });

  });

});