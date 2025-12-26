// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract MerchantPay {
    event PaymentReceived(
        address indexed payer,
        address indexed merchant,
        address token,
        uint256 amount,
        string orderId
    );

    function pay(
        address token,
        address merchant,
        uint256 amount,
        string calldata orderId
    ) external {
        require(
            IERC20(token).transferFrom(msg.sender, merchant, amount),
            "Payment failed"
        );

        emit PaymentReceived(msg.sender, merchant, token, amount, orderId);
    }
}
