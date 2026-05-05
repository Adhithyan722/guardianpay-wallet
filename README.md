# GuardianPay Wallet

GuardianPay is an AI-powered smart wallet built on BNB Chain that protects users from malicious transactions and enables seamless stablecoin payments for merchants.

## 🚨 Problem
Web3 wallets are unsafe and confusing. Users unknowingly sign malicious transactions, approve unlimited token access, and lose funds.

## 💡 Solution
GuardianPay introduces an **AI Transaction Guardian** that analyzes transactions before execution. It uses off-chain simulation and AI analysis to provide an ECDSA signature that "unlocks" the transaction execution on-chain.

## ✨ Features
- **Smart Contract Wallet**: Secure, ownership-based wallet with nonce-based replay protection.
- **AI Guardian Verification**: Requires a valid ECDSA signature from the AI Guardian for any execution.
- **Wallet Factory**: Permissionless deployment of new secure wallets.
- **Merchant Payments**: Integrated stablecoin payment gateway for orders.
- **Modern Dashboard**: High-end glassmorphic UI for managing funds and security.

## 🛠 Tech Stack
- **Smart Contracts**: Solidity ^0.8.20, Hardhat, OpenZeppelin.
- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Ethers.js.
- **Chain**: BNB Chain (Testnet).

## 🧪 Development
1. Install dependencies: `npm install`
2. Run tests: `npx hardhat test`
3. Start frontend: `cd frontend && npm install && npm run dev`

## 📜 License
MIT
