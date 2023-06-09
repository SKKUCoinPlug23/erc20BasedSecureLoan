// SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SampleToken is ERC20 {
    constructor() ERC20("SampleToken", "STKN") {
        _mint(msg.sender, 2000000 * 18**decimals());
    }
}