require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      loggingEnabled: true,
      allowUnlimitedContractSize: true,
    },
    metadium_testnet: {
      url: "https://api.metadium.com/dev",
      gasPrice: 80000000000
    },
  },
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true,
    }
  }
}
