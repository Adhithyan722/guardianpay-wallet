// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract GuardianWallet {
    using ECDSA for bytes32;

    address public owner;
    address public aiGuardian;
    uint256 public nonce;

    event Executed(address indexed to, uint256 value, bytes data, uint256 nonce);
    event GuardianUpdated(address indexed oldGuardian, address indexed newGuardian);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _owner, address _aiGuardian) {
        owner = _owner;
        aiGuardian = _aiGuardian;
    }

    receive() external payable {}

    function updateGuardian(address _newGuardian) external onlyOwner {
        emit GuardianUpdated(aiGuardian, _newGuardian);
        aiGuardian = _newGuardian;
    }

    function execute(
        address to,
        uint256 value,
        bytes calldata data,
        bytes calldata guardianSignature
    ) external onlyOwner {
        // Create the payload hash
        bytes32 payloadHash = keccak256(
            abi.encodePacked(address(this), to, value, data, nonce)
        );
        
        // Convert to Ethereum Signed Message hash
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(payloadHash);
        
        // Recover the signer
        address recoveredSigner = ethSignedMessageHash.recover(guardianSignature);
        
        // Require the signer to be the AI Guardian
        require(recoveredSigner == aiGuardian, "Invalid Guardian Signature");

        nonce++;

        (bool success, ) = to.call{value: value}(data);
        require(success, "Transaction failed");
        
        emit Executed(to, value, data, nonce - 1);
    }
}
