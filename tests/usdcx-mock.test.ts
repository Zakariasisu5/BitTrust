import { describe, expect, it } from "vitest";


/*
The test below is an example. To learn more, read the testing documentation here:
https://docs.stacks.co/clarinet/testing-with-clarinet-sdk
*/

describe("example tests", () => {
it("ensures simnet is well initialised", () => {
    expect(simnet.blockHeight).toBeDefined();
});

// it("shows an example", () => {
//   const { result } = simnet.callReadOnlyFn("counter", "get-counter", [], address1);
//   expect(result).toBeUint(0);
// });
});
