const MyToken = artifacts.require("MyToken");

contract("MyToken", (accounts) => {
  let tokenInstance;

  before(async () => {
    tokenInstance = await MyToken.deployed();
  });

  describe("Token attributes", () => {
    it("has the correct name", async () => {
      const name = await tokenInstance.name();
      assert.equal(name, "MyToken", "name is not correct");
    });

    it("has the correct symbol", async () => {
      const symbol = await tokenInstance.symbol();
      assert.equal(symbol, "MTH", "symbol is not correct");
    });

    it("has the correct decimals", async () => {
      const decimals = await tokenInstance.decilmals();
      assert.equal(decimals.toNumber(), 18, "decimals is not correct");
    });
  });

  describe("Total supply", () => {
    it("sets the total supply upon deployment", async () => {
      const totalSupply = await tokenInstance.totalSupply();
      assert.equal(totalSupply.toNumber(), 100000, "total supply is wrong");
    });

    it("allocates the initial supply to the creator", async () => {
      const adminBalance = await tokenInstance.banlanceOf(accounts[0]);
      assert.equal(
        adminBalance.toNumber(),
        100000,
        "initial supply is not allocated to the creator"
      );
    });
  });

  describe("Transferring tokens", () => {
    it("transfers token ownership", async () => {
      try {
        await tokenInstance.transfer.call(accounts[1], 999999999999);
        assert.fail("The transfer should have thrown an error");
      } catch (error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "error message must contain revert"
        );
      }
      const success = await tokenInstance.transfer.call(accounts[1], 25000, {
        from: accounts[0],
      });
      assert.equal(success, true, "it returns true");
      await tokenInstance.transfer(accounts[1], 25000, { from: accounts[0] });
      const balance = await tokenInstance.banlanceOf(accounts[1]);
      assert.equal(
        balance.toNumber(),
        25000,
        "adds the amount to the receiving account"
      );
      const balanceOfSender = await tokenInstance.banlanceOf(accounts[0]);
      assert.equal(
        balanceOfSender.toNumber(),
        75000,
        "deducts the amount from the sending account"
      );
    });
  });

  describe("Approvals", () => {
    it("approves tokens for delegated transfer", async () => {
      const success = await tokenInstance.approve.call(accounts[1], 100);
      assert.equal(success, true, "it returns true");
      await tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
      const allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
      assert.equal(
        allowance.toNumber(),
        100,
        "stores the allowance for delegated transfer"
      );
    });

    it("handles delegated token transfers", async () => {
      await tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
      try {
        await tokenInstance.transferFrom(accounts[0], accounts[2], 9999, {
          from: accounts[1],
        });
        assert.fail("The transfer should have thrown an error");
      } catch (error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "cannot transfer value larger than balance"
        );
      }
      try {
        await tokenInstance.transferFrom(accounts[0], accounts[2], 20, {
          from: accounts[1],
        });
        assert.fail("The transfer should have thrown an error");
      } catch (error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "cannot transfer value larger than approved amount"
        );
      }
      const success = await tokenInstance.transferFrom.call(
        accounts[0],
        accounts[2],
        10,
        { from: accounts[1] }
      );
      assert.equal(success, true, "it returns true");
      await tokenInstance.transferFrom(accounts[0], accounts[2], 10, {
        from: accounts[1],
      });
      const balance = await tokenInstance.banlanceOf(accounts[2]);
      assert.equal(
        balance.toNumber(),
        10,
        "adds the amount to the receiving account"
      );
      const balanceOfSender = await tokenInstance.banlanceOf(accounts[0]);
      assert.equal(
        balanceOfSender.toNumber(),
        74990,
        "deducts the amount from the sending account"
      );
      const allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
      assert.equal(
        allowance.toNumber(),
        90,
        "deducts the amount from the allowance"
      );
    });
  });
});
