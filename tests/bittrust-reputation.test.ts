import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { tx } from "@stacks/clarinet-sdk"; 

const deployer = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
const backendEngine = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5"; 
const targetAgent = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

describe("BitTrust Reputation Registry", () => {
  it("allows the owner to authorize a backend engine, which then updates a score", () => {
    
    //  Deployer authorizes the backend engine
    const authTx = simnet.mineBlock([
      tx.callPublicFn(
        "bittrust-reputation",
        "add-engine",
        [Cl.principal(backendEngine)],
        deployer
      ),
    ]);
    expect(authTx[0].result).toBeOk(Cl.bool(true));

    // The Backend Engine updates the target agent's score to 85
    const scoreTx = simnet.mineBlock([
      tx.callPublicFn(
        "bittrust-reputation",
        "update-score",
        [
          Cl.principal(targetAgent),
          Cl.uint(85),   // New Score
          Cl.uint(120),  // Total Transactions
        ],
        backendEngine // Acting as the authorized engine
      ),
    ]);
    expect(scoreTx[0].result).toBeOk(Cl.bool(true));

    // Verify the score was recorded properly
    const readScore = simnet.callReadOnlyFn(
      "bittrust-reputation",
      "get-score",
      [Cl.principal(targetAgent)],
      deployer
    );
    
    // We expect a tuple back containing the score data
    expect(readScore.result).toBeOk(
      Cl.tuple({
        "score": Cl.uint(85),
        "last-updated": Cl.uint(4), 
        "tx-count": Cl.uint(120)
      })
    );
  });
});