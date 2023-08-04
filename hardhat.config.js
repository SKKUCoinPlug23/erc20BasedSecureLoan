require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const SEPOLIA_PRIVATE_KEY1 = process.env.SEPOLIA_PRIVATE_KEY1;
const SEPOLIA_PRIVATE_KEY2 = process.env.SEPOLIA_PRIVATE_KEY2;
const SEPOLIA_PRIVATE_KEY3 = process.env.SEPOLIA_PRIVATE_KEY3;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // loggingEnabled: true,
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      loggingEnabled: true,
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      gasPrice : 80000000000,
      accounts: [SEPOLIA_PRIVATE_KEY1,SEPOLIA_PRIVATE_KEY2,SEPOLIA_PRIVATE_KEY3]
    },
    metadium: {
      loggingEnabled: true,
      url: `https://api.metadium.com/dev`,
      gasPrice : 80000000000,
      accounts: [SEPOLIA_PRIVATE_KEY1,SEPOLIA_PRIVATE_KEY2,SEPOLIA_PRIVATE_KEY3]
    }
  },
  solidity: {
    compilers:[
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          },
          viaIR: true,
        }
      },
      {
        version: "0.8.6",
        settings: {
          optimizer: {
            enabled: true,
            details: {
              yulDetails: {
                optimizerSteps: "u",
              },
            },
            runs: 200
          },
          viaIR: true,
        }
      },
    ]
  }
}
