// SPDX-License-Identifier: MIT
pragma solidity >=0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PlugToken is ERC20 {
    constructor() ERC20("PlugToken", "PLUG") {
        _mint(msg.sender, 1000000 * 18**decimals());
    }
}