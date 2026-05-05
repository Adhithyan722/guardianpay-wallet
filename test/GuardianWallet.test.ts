import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther, getBytes, keccak256, solidityPacked } from "ethers";

describe("GuardianWallet & MerchantPay", function () {
  async function deployFixture() {
    const [owner, aiGuardian, merchant, attacker] = await ethers.getSigners();

    // Deploy Factory
    const Factory = await ethers.getContractFactory("GuardianWalletFactory");
    const factory = await Factory.deploy();

    // Deploy MerchantPay
    const MerchantPay = await ethers.getContractFactory("MerchantPay");
    const merchantPay = await MerchantPay.deploy();

    // Create wallet
    const tx = await factory.createWallet(owner.address, aiGuardian.address);
    const receipt = await tx.wait();
    
    // Get the emitted WalletCreated event to find the wallet address
    let walletAddress = "";
    for (const log of receipt!.logs) {
        try {
            const parsedLog = factory.interface.parseLog(log as any);
            if (parsedLog && parsedLog.name === "WalletCreated") {
                walletAddress = parsedLog.args[0];
                break;
            }
        } catch (e) {}
    }

    const wallet = await ethers.getContractAt("GuardianWallet", walletAddress);

    // Deploy Mock ERC20 Token
    const Token = await ethers.getContractFactory("MockERC20");
    const token = await Token.deploy("Stablecoin", "USD", parseEther("10000"));

    // Give wallet some tokens to pay merchant
    await token.transfer(walletAddress, parseEther("1000"));
    
    // Give wallet some ETH for gas / native execution
    await owner.sendTransaction({ to: walletAddress, value: parseEther("10") });

    return { factory, merchantPay, wallet, token, owner, aiGuardian, merchant, attacker, walletAddress };
  }

  describe("Wallet Execution via AI Guardian", function () {
    it("Should allow execution with valid AI Guardian signature", async function () {
      const { wallet, token, owner, aiGuardian, merchant, merchantPay, walletAddress } = await deployFixture();

      // We want the wallet to approve MerchantPay to spend its tokens
      const amount = parseEther("100");
      const approveData = token.interface.encodeFunctionData("approve", [await merchantPay.getAddress(), amount]);

      const nonce = await wallet.nonce();
      
      // Create hash: keccak256(abi.encodePacked(address(this), to, value, data, nonce))
      const payloadHash = keccak256(
          solidityPacked(
              ["address", "address", "uint256", "bytes", "uint256"],
              [walletAddress, await token.getAddress(), 0, approveData, nonce]
          )
      );

      // Sign the hash
      const signature = await aiGuardian.signMessage(getBytes(payloadHash));

      // Execute via owner
      await expect(wallet.connect(owner).execute(await token.getAddress(), 0, approveData, signature))
        .to.emit(wallet, "Executed");

      expect(await token.allowance(walletAddress, await merchantPay.getAddress())).to.equal(amount);
    });

    it("Should revert if signature is from someone else", async function () {
      const { wallet, token, owner, attacker, walletAddress } = await deployFixture();

      const amount = parseEther("100");
      const approveData = token.interface.encodeFunctionData("approve", [attacker.address, amount]);

      const nonce = await wallet.nonce();
      
      const payloadHash = keccak256(
          solidityPacked(
              ["address", "address", "uint256", "bytes", "uint256"],
              [walletAddress, await token.getAddress(), 0, approveData, nonce]
          )
      );

      // Attacker signs it instead of AI Guardian
      const signature = await attacker.signMessage(getBytes(payloadHash));

      await expect(
        wallet.connect(owner).execute(await token.getAddress(), 0, approveData, signature)
      ).to.be.revertedWith("Invalid Guardian Signature");
    });
  });
});
