import { expect } from "chai";
import hre from "hardhat";
import { isAddressEqual, maxUint256 } from "viem";

describe("Hamm", () => {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployHammContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, ...otherAccounts] = await hre.viem.getWalletClients();
    const fakeToken = await hre.viem.deployContract("FakeToken", [
      "FakeToken",
      "FTK",
    ]);
    const fakeToken2 = await hre.viem.deployContract("FakeToken", [
      "FakeToken 2",
      "FTK2",
    ]);
    const renderer = await hre.viem.deployContract("HammRendererV1");
    const hamm = await hre.viem.deployContract("Hamm", [
      owner.account.address,
      renderer.address,
      [fakeToken.address],
    ]);
    const publicClient = await hre.viem.getPublicClient();
    return {
      hamm,
      owner,
      otherAccounts,
      publicClient,
      fakeToken,
      fakeToken2,
    };
  }

  describe("Create a piggy bank", () => {
    it("Given a user A, When creating a Piggy bank in the contract, Then an event PiggyBankCreated with the id is emitted", async () => {
      const {
        hamm,
        otherAccounts: [userA],
        fakeToken,
        publicClient,
      } = await deployHammContract();
      const receipt = await hamm.write
        .createNewPiggyBank([
          userA.account.address,
          "My piggy bank",
          "A new piggy bank to test the contract",
          fakeToken.address,
        ])
        .then((tx) => publicClient.waitForTransactionReceipt({ hash: tx }));
      expect(receipt.status).to.eq("success");
      const events = await hamm.getEvents.PiggyBankCreated();
      expect(events).to.have.lengthOf(1);
      const [event] = events;
      expect(event.args.piggyBankId).to.eq(1n);
    });

    it("Given a user A, When creating piggy banks for the sender, Then the piggy banks ids can be retrieve for the sender", async () => {
      const {
        hamm,
        owner: userA,
        fakeToken,
        publicClient,
      } = await deployHammContract();
      await hamm.write
        .createNewPiggyBank([
          userA.account.address,
          "My piggy bank",
          "A new piggy bank to test the contract",
          fakeToken.address,
        ])
        .then((tx) => publicClient.waitForTransactionReceipt({ hash: tx }));
      const ownedIds = await hamm.read.getPiggyBankIdsByBeneficiary([
        userA.account.address,
      ]);
      expect(ownedIds).to.eql([1n]);
    });

    it("Given a user A, When creating piggy banks for user B, Then the user A must not have piggy banks", async () => {
      const {
        hamm,
        otherAccounts: [userA, userB],
        fakeToken,
        publicClient,
      } = await deployHammContract();
      await hamm.write
        .createNewPiggyBank([
          userB.account.address,
          "My piggy bank",
          "A new piggy bank to test the contract",
          fakeToken.address,
        ])
        .then((tx) => publicClient.waitForTransactionReceipt({ hash: tx }));
      const ownedIds = await hamm.read.getPiggyBankIdsByBeneficiary([
        userA.account.address,
      ]);
      expect(ownedIds).to.be.empty;
    });
  });

  describe("Retrieving piggy banks", () => {
    it("Given a user A and B having piggy banks, When retrieving the piggy banks for each user, Then they must see there piggy banks ids only", async () => {
      const {
        hamm,
        otherAccounts: [userA, userB],
        fakeToken,
        publicClient,
      } = await deployHammContract();
      await hamm.write
        .createNewPiggyBank([
          userA.account.address,
          "Piggy bank 1",
          "Piggy bank of the user A",
          fakeToken.address,
        ])
        .then((txHash) =>
          publicClient.waitForTransactionReceipt({ hash: txHash })
        );
      await hamm.write
        .createNewPiggyBank([
          userB.account.address,
          "Piggy bank 2",
          "Piggy bank of the user B",
          fakeToken.address,
        ])
        .then((txHash) =>
          publicClient.waitForTransactionReceipt({ hash: txHash })
        );
      const idsForUserA = await hamm.read.getPiggyBankIdsByBeneficiary([
        userA.account.address,
      ]);
      const idsForUserB = await hamm.read.getPiggyBankIdsByBeneficiary([
        userB.account.address,
      ]);
      expect(idsForUserA).to.eql([1n]);
      expect(idsForUserB).to.eql([2n]);
    });

    it("Given a piggy bank, When retrieving it, Then all the data must be available", async () => {
      const {
        hamm,
        owner: userA,
        fakeToken,
        publicClient,
      } = await deployHammContract();
      await hamm.write
        .createNewPiggyBank([
          userA.account.address,
          "Piggy bank 1",
          "Piggy bank of the user",
          fakeToken.address,
        ])
        .then((txHash) =>
          publicClient.waitForTransactionReceipt({ hash: txHash })
        );
      const [piggyBank, beneficiaryAddress] = await hamm.read.getPiggyBankById([
        1n,
      ]);
      expect(isAddressEqual(beneficiaryAddress, userA.account.address)).to.be
        .true;
      expect(piggyBank.balance).to.eql(0n);
      expect(piggyBank.name).to.eql("Piggy bank 1");
      expect(piggyBank.description).to.eql("Piggy bank of the user");
      expect(isAddressEqual(piggyBank.tokenContractAddress, fakeToken.address))
        .to.be.true;
    });
  });

  describe("Deposit / Withdraw", () => {
    it("Given a user depositing money in a piggy bank, When checking the balance of the piggy bank, Then it must be the amount deposited by the user", async () => {
      const { hamm, owner, fakeToken, publicClient } =
        await deployHammContract();
      await hamm.write
        .createNewPiggyBank([
          owner.account.address,
          "Piggy bank 1",
          "Piggy bank of the user",
          fakeToken.address,
        ])
        .then((tx) => publicClient.waitForTransactionReceipt({ hash: tx }));
      await fakeToken.write
        .mint([owner.account.address, 100_000n])
        .then((tx) => publicClient.waitForTransactionReceipt({ hash: tx }));
      await fakeToken.write
        .approve([hamm.address, maxUint256])
        .then((tx) => publicClient.waitForTransactionReceipt({ hash: tx }));
      await hamm.write
        .depositPiggyBank([1n, 50_000n])
        .then((tx) => publicClient.waitForTransactionReceipt({ hash: tx }));
      const [{ balance }] = await hamm.read.getPiggyBankById([1n]);
      expect(balance).to.eql(50_000n);
      expect(await fakeToken.read.balanceOf([owner.account.address])).to.eql(
        50_000n
      );
      expect(await fakeToken.read.balanceOf([hamm.address])).to.eql(50_000n);
    });

    it("Given a piggy bank with funds, When the beneficiary want to withdraw it, Then it must withdraw the fund to the beneficiary", async () => {
      const {
        hamm,
        otherAccounts: [userA, userB],
        fakeToken,
      } = await deployHammContract();
      await hamm.write.createNewPiggyBank([
        userA.account.address,
        "Piggy bank 1",
        "Piggy bank of the user",
        fakeToken.address,
      ]);
      await fakeToken.write.mint([userB.account.address, 100_000n]);
      await fakeToken.write.approve([hamm.address, maxUint256], {
        account: userB.account,
      });
      const DEPOSIT_AMOUNT = 50_000n;
      await hamm.write.depositPiggyBank([1n, DEPOSIT_AMOUNT], {
        account: userB.account,
      });
      const balanceAfterDeposit = await fakeToken.read.balanceOf([
        userA.account.address,
      ]);
      expect(balanceAfterDeposit).to.eql(
        0n,
        "User A must not received the funds directly at the deposit"
      );
      await hamm.write.withdrawalPiggyBank([1n, 0], {
        account: userA.account,
      });
      const balanceAfterWithdrawal = await fakeToken.read.balanceOf([
        userA.account.address,
      ]);
      expect(balanceAfterWithdrawal).to.be.eql(
        DEPOSIT_AMOUNT,
        "User A must receive the funds after the withdrawal"
      );
    });

    it("Given a piggy bank, When a user different than the beneficiary want to withdraw, Then it must revert as only the beneficiary can withdraw", async () => {
      const {
        hamm,
        otherAccounts: [userA, userB],
        fakeToken,
      } = await deployHammContract();
      await hamm.write.createNewPiggyBank([
        userA.account.address,
        "Piggy bank 1",
        "Piggy bank of the user",
        fakeToken.address,
      ]);
      await fakeToken.write.mint([userB.account.address, 100_000n]);
      await fakeToken.write.approve([hamm.address, maxUint256], {
        account: userB.account,
      });
      await hamm.write.depositPiggyBank([1n, 50_000n], {
        account: userB.account,
      });
      await expect(
        hamm.write.withdrawalPiggyBank([1n, 0], { account: userB.account })
      ).to.rejected;
    });

    it("Given a user, When he wants to deposit on a non-existing piggy bank, Then it must revert", async () => {
      const { hamm, owner, publicClient, fakeToken } =
        await deployHammContract();
      await fakeToken.write
        .mint([owner.account.address, 100_000n])
        .then((tx) => publicClient.waitForTransactionReceipt({ hash: tx }));
      await fakeToken.write
        .approve([hamm.address, maxUint256])
        .then((tx) => publicClient.waitForTransactionReceipt({ hash: tx }));
      await expect(hamm.write.depositPiggyBank([1n, 50_000n])).to.be.rejected;
    });
  });

  describe("Fee", () => {
    it("Given a Hamm contract, When a user withdraw its piggy bank with a fee, Then the owner of Hamm will receive the fee of the amount", async () => {
      const {
        hamm,
        owner,
        otherAccounts: [userA, userB],
        fakeToken,
      } = await deployHammContract();
      await hamm.write.createNewPiggyBank([
        userA.account.address,
        "Piggy bank 1",
        "Piggy bank of the user",
        fakeToken.address,
      ]);
      await fakeToken.write.mint([userB.account.address, 100_000n]);
      await fakeToken.write.approve([hamm.address, maxUint256], {
        account: userB.account,
      });
      await hamm.write.depositPiggyBank([1n, 50_000n], {
        account: userB.account,
      });
      await hamm.write.withdrawalPiggyBank([1n, 50], {
        account: userA.account,
      });
      const ownerBalance = await fakeToken.read.balanceOf([
        owner.account.address,
      ]);
      expect(ownerBalance).to.be.eql(250n);

      const withdrawerBalance = await fakeToken.read.balanceOf([
        userA.account.address,
      ]);
      expect(withdrawerBalance).to.be.eql(49_750n);
    });

    it("Given a piggy bank without enough fund to fee 0.5%, When a user withdraw its piggy bank, Then all the funds go to the user directly", async () => {
      const {
        hamm,
        owner,
        otherAccounts: [userA, userB],
        fakeToken,
      } = await deployHammContract();
      await hamm.write.createNewPiggyBank(
        [
          userB.account.address,
          "Piggy bank 1",
          "Piggy bank of the user B",
          fakeToken.address,
        ],
        { account: userB.account }
      );
      const piggyBankId = 1n;
      await fakeToken.write.mint([userB.account.address, 100_000n]);
      await fakeToken.write.approve([hamm.address, maxUint256], {
        account: userB.account,
      });

      await hamm.write.depositPiggyBank([piggyBankId, 100n], {
        account: userB.account,
      });

      const feeReceiverBalanceBefore = await fakeToken.read.balanceOf([
        owner.account.address,
      ]);
      expect(feeReceiverBalanceBefore).to.be.eql(0n);

      await hamm.write.withdrawalPiggyBank([piggyBankId, 50], {
        account: userB.account,
      });

      const feeReceiverBalanceAfter = await fakeToken.read.balanceOf([
        owner.account.address,
      ]);
      expect(feeReceiverBalanceAfter).to.be.eql(0n);

      const userB_BalanceAfter = await fakeToken.read.balanceOf([
        userB.account.address,
      ]);
      expect(userB_BalanceAfter).to.be.eql(100_000n);
    });
  });

  describe("Delete a piggy bank", () => {
    it("Given a user with a piggy bank, When it want to delete the piggy bank, Then it must be deleted", async () => {
      const {
        hamm,
        otherAccounts: [userB],
        fakeToken,
      } = await deployHammContract();
      await hamm.write.createNewPiggyBank(
        [
          userB.account.address,
          "Piggy bank 1",
          "Piggy bank of the user B",
          fakeToken.address,
        ],
        { account: userB.account }
      );
      await hamm.write.deletePiggyBank([1n, 0], { account: userB.account });

      await expect(hamm.read.ownerOf([1n])).to.be.rejected;
    });

    it("Given a piggy bank with a balance, When it is deleted, Then it must be withdrawed and deleted", async () => {
      const {
        hamm,
        owner: userA,
        otherAccounts: [userB],
        fakeToken,
      } = await deployHammContract();
      await hamm.write.createNewPiggyBank(
        [
          userA.account.address,
          "Piggy bank 1",
          "Piggy bank of the user A",
          fakeToken.address,
        ],
        { account: userA.account }
      );

      await fakeToken.write.mint([userB.account.address, 100_000n]);
      await fakeToken.write.approve([hamm.address, maxUint256], {
        account: userB.account,
      });

      await hamm.write.depositPiggyBank([1n, 100_000n], {
        account: userB.account,
      });

      await hamm.write.deletePiggyBank([1n, 0], {
        account: userA.account,
      });

      const balanceAfter = await fakeToken.read.balanceOf([
        userA.account.address,
      ]);
      expect(balanceAfter).to.eql(100_000n);
    });

    it("Given a user with deleted piggy banks, When retrieving the piggy banks owned by the user, Then it must returns the existing piggy banks", async () => {
      const { hamm, owner: userA, fakeToken } = await deployHammContract();

      await hamm.write.createNewPiggyBank(
        [
          userA.account.address,
          "Piggy bank 1",
          "Piggy bank of the user A",
          fakeToken.address,
        ],
        { account: userA.account }
      );

      await hamm.write.createNewPiggyBank(
        [
          userA.account.address,
          "Piggy bank 2",
          "Second piggy bank of the user A",
          fakeToken.address,
        ],
        { account: userA.account }
      );

      await hamm.write.deletePiggyBank([1n, 0], {
        account: userA.account,
      });

      const ownedPiggyBanks = await hamm.read.getPiggyBankIdsByBeneficiary([
        userA.account.address,
      ]);
      expect(ownedPiggyBanks).to.eql([2n]);
    });

    it("Given a piggy bank owned by user A, When another user wants to delete the piggy bank, Then it must revert as only the owner can delete the piggy bank", async () => {
      const {
        hamm,
        owner: userA,
        otherAccounts: [userB],
        fakeToken,
      } = await deployHammContract();
      await hamm.write.createNewPiggyBank(
        [
          userA.account.address,
          "Piggy bank 1",
          "Piggy bank of the user A",
          fakeToken.address,
        ],
        { account: userA.account }
      );

      await expect(
        hamm.write.deletePiggyBank([1n, 0], { account: userB.account })
      ).to.be.rejected;
    });
  });

  describe("Whitelist", () => {
    it("Given a token not in the whitelist, When a user wants to create a piggy bank, Then it must revert", async () => {
      const { hamm, owner, fakeToken2 } = await deployHammContract();

      await expect(
        hamm.write.createNewPiggyBank(
          [
            owner.account.address,
            "Piggy bank 1",
            "Piggy bank of the user",
            fakeToken2.address,
          ],
          { account: owner.account }
        )
      ).to.be.rejected;
    });

    it("Given a token not in the whitelist, the owner can add it to the whitelist", async () => {
      const { hamm, owner, fakeToken2 } = await deployHammContract();

      await hamm.write.addTokenToWhitelist([fakeToken2.address], {
        account: owner.account,
      });
    });

    it("Given a token added to the whitelist, When a user wants to create a piggy bank, Then it must be created", async () => {
      const { hamm, owner, fakeToken2 } = await deployHammContract();

      await hamm.write.addTokenToWhitelist([fakeToken2.address], {
        account: owner.account,
      });

      await hamm.write.createNewPiggyBank(
        [
          owner.account.address,
          "Piggy bank 1",
          "Piggy bank of the user",
          fakeToken2.address,
        ],
        { account: owner.account }
      );
    });
  });
});
