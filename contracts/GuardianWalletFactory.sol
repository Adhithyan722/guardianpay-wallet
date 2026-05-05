// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GuardianWallet.sol";

contract GuardianWalletFactory {
    event WalletCreated(address indexed wallet, address indexed owner, address indexed aiGuardian);

    function createWallet(address _owner, address _aiGuardian) external returns (address) {
        GuardianWallet newWallet = new GuardianWallet(_owner, _aiGuardian);
        emit WalletCreated(address(newWallet), _owner, _aiGuardian);
        return address(newWallet);
    }
}
