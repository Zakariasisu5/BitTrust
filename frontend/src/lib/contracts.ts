export const CONTRACT_DEPLOYER = "ST2JPZFFA0BFAMHDJMKACNY5YD7P7R6HEEN7NPVJG";

export const CONTRACTS = {
  reputation: {
    address: CONTRACT_DEPLOYER,
    name: "bittrust-reputation",
    fullId: `${CONTRACT_DEPLOYER}.bittrust-reputation`,
  },
  payment: {
    address: CONTRACT_DEPLOYER,
    name: "bittrust-payment",
    fullId: `${CONTRACT_DEPLOYER}.bittrust-payment`,
  },
  usdcxMock: {
    address: CONTRACT_DEPLOYER,
    name: "usdcx-mock",
    fullId: `${CONTRACT_DEPLOYER}.usdcx-mock`,
  },
} as const;

export const NETWORK = "testnet" as const;

export const QUERY_PRICE = 1_000_000; // 1 USDCx per credit (6 decimals)

export const USDCX_DECIMALS = 6;
