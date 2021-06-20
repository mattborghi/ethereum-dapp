//SPDX-License-Identifier: MIT-Modern-Variant
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Token {
    string public name = "Matias Borghi Token";
    string public symbol = "MBT";
    uint256 public totalSupply = 1000000;
    // const balances = { address: uint}
    mapping(address => uint256) balances;

    constructor() {
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
