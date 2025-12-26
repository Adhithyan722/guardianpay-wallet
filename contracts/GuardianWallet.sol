// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GuardianWallet {
    address public owner;

    event Executed(address to, uint256 value, bytes data);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    receive() external payable {}

    function execute(
        address to,
        uint256 value,
        bytes calldata data
    ) external onlyOwner {
        (bool success, ) = to.call{value: value}(data);
        require(success, "Transaction failed");
        emit Executed(to, value, data);
    }
}
