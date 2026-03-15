import { openContractCall } from "@stacks/connect";
import { Cl } from "@stacks/transactions";
import type { UserSession } from "@stacks/auth";
import { CONTRACTS, NETWORK, QUERY_PRICE } from "./contracts";

const appDetails = {
  name: "BitTrust",
  icon: typeof window !== "undefined" ? `${window.location.origin}/icon.png` : "",
};

export interface ContractCallFinishData {
  txId: string;
  stacksTransaction: unknown;
}

export function mintTestUsdc(
  amount: string,
  recipient: string,
  userSession: UserSession,
  onFinish: (data: ContractCallFinishData) => void,
  onCancel: () => void
): void {
  openContractCall({
    contractAddress: CONTRACTS.usdcxMock.address,
    contractName: CONTRACTS.usdcxMock.name,
    functionName: "mint",
    functionArgs: [Cl.uint(amount), Cl.principal(recipient)],
    network: NETWORK,
    userSession,
    appDetails,
    onFinish: (data) => onFinish(data as ContractCallFinishData),
    onCancel,
  });
}

export function buyCredits(
  amount: string,
  userSession: UserSession,
  onFinish: (data: ContractCallFinishData) => void,
  onCancel: () => void
): void {
  if (BigInt(amount) % BigInt(QUERY_PRICE) !== BigInt(0)) {
    throw new Error(`Amount must be a multiple of ${QUERY_PRICE}`);
  }
  openContractCall({
    contractAddress: CONTRACTS.payment.address,
    contractName: CONTRACTS.payment.name,
    functionName: "buy-credits",
    functionArgs: [
      Cl.uint(amount),
      Cl.contractPrincipal(CONTRACTS.usdcxMock.address, CONTRACTS.usdcxMock.name),
    ],
    network: NETWORK,
    userSession,
    appDetails,
    onFinish: (data) => onFinish(data as ContractCallFinishData),
    onCancel,
  });
}
