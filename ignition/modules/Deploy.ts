import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployModule = buildModule("DeployModule", (m) => {
  const factory = m.contract("GuardianWalletFactory");
  const merchantPay = m.contract("MerchantPay");

  return { factory, merchantPay };
});

export default DeployModule;
