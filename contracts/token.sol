// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function banlanceOf(address account) external view returns (uint256);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function transfer(address account, uint256 value) external returns (bool);

    function approve(address spender, uint256 value) external returns (bool);

    function transferFrom(
        address spender,
        address to,
        uint256 value
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract MyToken is IERC20 {
    string public constant name = "MyToken";
    string public constant symbol = "MTH";
    uint8 public constant decilmals = 1;

    uint256 _totalSupply = 100000 * 10 ** decilmals;
    mapping(address => uint256) banlances;
    mapping(address => mapping(address => uint256)) allowances;

    constructor() {
        banlances[msg.sender] = _totalSupply * 10 ** decilmals;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply * 10 ** decilmals;
    }

    function banlanceOf(address account) external view returns (uint256) {
        return banlances[account];
    }

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256) {
        return allowances[owner][spender];
    }

    function transfer(address account, uint256 value) external returns (bool) {
        require(banlances[msg.sender] >= value, "not have enough tokens");
        banlances[msg.sender] -= value;
        banlances[account] += value;
        emit Transfer(msg.sender, account, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        require(banlances[msg.sender] >= value, "not have enough tokens");
        allowances[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(
        address spender,
        address to,
        uint256 value
    ) external returns (bool) {
        require(banlances[spender] >= value, "not enough tokens");
        require(
            allowances[spender][msg.sender] >= value,
            "not allow enough tokens"
        );
        allowances[spender][msg.sender] -= value;
        banlances[spender] -= value;
        banlances[to] += value;
        emit Transfer(spender, to, value);
        return true;
    }
}
