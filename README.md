
# erc20BasedSecureLoan
SKKU - Coinplug 2023

---

## Installation

Clone the repository and install dependencies:

```
$ git clone {repository address}
$ cd erc20BasedSecureLoan
$ npm install
```

## Configuration

Create a `.env` file and add your wallet's private key in the following format:

```
USER{n}_WALLET_PRIVATE_KEY # n = [1,2,3]
```

## Compilation

Compile the Smart Contracts in the 'contracts' directory. This might take a while due to the large size of the Smart Contracts.

```
$ npx hardhat compile
```

## Testing

Run tests for setting the initial Lend Board service and testing basic functions:

```
$ npx hardhat test test/LendingBoardProposeModeTest.js
```

## Deployment

Test deploying compiled Smart Contracts on the localhost network:
Replace 'localhost' to your custom network name in order to deploy on custom networks.

```
$ npx hardhat run --network localhost scripts/LendingBoardDeployment.js
```

---
