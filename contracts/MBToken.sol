//SPDX-License-Identifier: MIT-Modern-Variant
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MBToken is ERC20 {
    constructor() ERC20("Matias Borghi Token", "MBT") {
        _mint(msg.sender, 100000 * (10 ** 18));
    }
}