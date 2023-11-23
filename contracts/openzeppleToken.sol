// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OhMyToken is ERC20 {
    constructor(uint256 totalSupply) ERC20("OhMyToken", "OMTH") {
        _mint(msg.sender, totalSupply);
    }
}
