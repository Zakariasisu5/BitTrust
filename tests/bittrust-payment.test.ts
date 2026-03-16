import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { tx } from "@stacks/clarinet-sdk"; 

const deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const tokenDeployer = deployer;
const agentWallet = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5";

describe("BitTrust Payment Gateway", () => {
  it("allows an AI Agent to mint USDCx, buy an API credit, and updates balance", () => {
    
    //  Mint 5,000,000 USDCx to the Agent using 'tx' instead of 'simnet'
    const mintTx = simnet.mineBlock([
      tx.callPublicFn(
        "usdcx-mock",
        "mint",
        [Cl.uint(5000000), Cl.principal(agentWallet)],
        agentWallet
      ),
    ]);
    // The new SDK returns the array directly, no need for .receipts
    expect(mintTx[0].result).toBeOk(Cl.bool(true));

    //  Buy 1 API Credit for 1,000,000 USDCx
    const buyTx = simnet.mineBlock([
      tx.callPublicFn(
        "bittrust-payment",
        "buy-credits",
        [
          Cl.uint(1000000),
          Cl.contractPrincipal(tokenDeployer, "usdcx-mock"), // The accepted token
        ],
        agentWallet
      ),
    ]);
    expect(buyTx[0].result).toBeOk(Cl.bool(true));

    //  Verify the Agent's API Credit Balance is 1 (simnet is still used for read-only!)
    const balanceQuery = simnet.callReadOnlyFn(
      "bittrust-payment",
      "get-balance",
      [Cl.principal(agentWallet)],
      deployer
    );
    expect(balanceQuery.result).toBeUint(1);
  });

  it("blocks an agent from buying credits if they pass the wrong token", () => {
    const fakeBuyTx = simnet.mineBlock([
      tx.callPublicFn(
        "bittrust-payment",
        "buy-credits",
        [
          Cl.uint(1000000),
          Cl.contractPrincipal(deployer, "bittrust-reputation"), 
        ],
        agentWallet
      ),
    ]);
    expect(fakeBuyTx[0].result).toBeErr(Cl.uint(202));
  });
});