import { expect } from "chai";
import hre from "hardhat";
import { BigNumber } from "ethers";
import { changeBalanceForUser as changeBalanceForUserInternal } from "./utils";

export const FIRST_PIGGY_BANK = BigNumber.from(1);

const deployHammContract = async ({
  tipReceiverAddress,
}: { tipReceiverAddress?: string } = {}) => {
  // Contracts are deployed using the first signer/account by default
  const [owner, otherAccount] = await hre.ethers.getSigners();
  const ERC20TokenFactory = await hre.ethers.getContractFactory("ERC20");
  const HammFactory = await hre.ethers.getContractFactory("Hamm");
  const hamm = await HammFactory.deploy(tipReceiverAddress ?? owner.address);
  const fakeToken = await ERC20TokenFactory.deploy("FakeToken", "FAKE");
  const changeBalanceForUser = (
    userAddress: string,
    locallyManipulatedBalance: BigNumber
  ) =>
    changeBalanceForUserInternal(
      hre,
      fakeToken.address,
      userAddress,
      locallyManipulatedBalance
    );
  return { owner, otherAccount, hamm, fakeToken, changeBalanceForUser };
};

describe("PiggyBank", () => {
  describe("Create a piggy bank", () => {
    it("Given a user A, When creating a Piggy bank in the contract, Then an event PiggyBankCreated with the id is emitted", async () => {
      const { hamm, owner: userA, fakeToken } = await deployHammContract();
      const tx = await hamm
        .connect(userA)
        .createNewPiggyBank(
          userA.address,
          userA.address,
          "My piggy bank",
          "A new piggy bank to test the contract",
          fakeToken.address
        );
      await expect(tx)
        .to.emit(hamm, "PiggyBankCreated")
        .withArgs(FIRST_PIGGY_BANK);
    });

    it("Given a user A, When creating piggy banks for the sender, Then the piggy banks ids can be retrieve for the sender", async () => {
      const { hamm, owner: userA, fakeToken } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBankForSender(
          "My piggy bank",
          "A new piggy bank to test the contract",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const ownedIds = await hamm.getPiggyBankIdsForAddress(userA.address);
      expect(ownedIds).to.eql([FIRST_PIGGY_BANK]);
    });

    it("Given a user A, When creating piggy banks for user B, Then the user A must not have piggy banks", async () => {
      const {
        hamm,
        owner: userA,
        otherAccount: userB,
        fakeToken,
      } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBank(
          userB.address,
          userB.address,
          "My piggy bank",
          "A new piggy bank to test the contract",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const ownedIds = await hamm.getPiggyBankIdsForAddress(userA.address);
      expect(ownedIds).to.be.empty;
    });

    it("Given a user A, When creating piggy banks for user B, Then the user B must have piggy banks", async () => {
      const {
        hamm,
        owner: userA,
        otherAccount: userB,
        fakeToken,
      } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBank(
          userB.address,
          userB.address,
          "My piggy bank",
          "A new piggy bank to test the contract",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const ownedIdsByUserB = await hamm.getPiggyBankIdsForAddress(
        userB.address
      );
      expect(ownedIdsByUserB).to.eql([FIRST_PIGGY_BANK]);
    });
  });

  describe("Retrieving piggy banks", () => {
    it("Given a user A and B having piggy banks, When retrieving the piggy banks for each user, Then they must see there piggy banks ids only", async () => {
      const {
        hamm,
        owner: userA,
        otherAccount: userB,
        fakeToken,
      } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBankForSender(
          "Piggy bank 1",
          "Piggy bank of the user A",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      await hamm
        .connect(userB)
        .createNewPiggyBankForSender(
          "Piggy bank 2",
          "Piggy bank of the user B",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const idsForUserA = await hamm.getPiggyBankIdsForAddress(userA.address);
      const idsForUserB = await hamm.getPiggyBankIdsForAddress(userB.address);
      expect(idsForUserA).to.eql([FIRST_PIGGY_BANK]);
      expect(idsForUserB).to.eql([FIRST_PIGGY_BANK.add(1)]);
    });

    it("Given a piggy bank, When retrieving it, Then all the data must be available", async () => {
      const { hamm, owner: userA, fakeToken } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBankForSender(
          "Piggy bank 1",
          "Piggy bank of the user",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const {
        balance,
        beneficiaryAddress,
        description,
        tokenContractAddress,
        name,
      } = await hamm.getPiggyBankById(FIRST_PIGGY_BANK);
      expect(balance).to.eql(BigNumber.from(0));
      expect(beneficiaryAddress).to.eql(userA.address);
      expect(name).to.eql("Piggy bank 1");
      expect(description).to.eql("Piggy bank of the user");
      expect(tokenContractAddress).to.eql(fakeToken.address);
    });
  });

  describe("Deposit / Withdraw", () => {
    it("Given a user depositing money in a piggy bank, When checking the balance of the piggy bank, Then it must be the amount deposited by the user", async () => {
      const {
        hamm,
        owner: userA,
        fakeToken,
        changeBalanceForUser,
      } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBankForSender(
          "Piggy bank 1",
          "Piggy bank of the user",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const piggyBankId = FIRST_PIGGY_BANK;
      const { balance: balanceBefore } = await hamm.getPiggyBankById(
        piggyBankId
      );
      await changeBalanceForUser(userA.address, BigNumber.from(100_000));
      expect(balanceBefore).to.eql(BigNumber.from(0));
      expect(await fakeToken.balanceOf(userA.address)).to.eql(
        BigNumber.from(100_000)
      );

      await fakeToken
        .connect(userA)
        .approve(hamm.address, BigNumber.from(200_000))
        .then((tx) => tx.wait());

      await hamm
        .connect(userA)
        .depositPiggyBank(piggyBankId, BigNumber.from(50_000))
        .then((tx) => tx.wait());

      const { balance: balanceAfter } = await hamm.getPiggyBankById(
        piggyBankId
      );
      expect(balanceAfter).to.eql(BigNumber.from(50_000));
      expect(await fakeToken.balanceOf(userA.address)).to.eql(
        BigNumber.from(50_000)
      );
    });

    it("Given a piggy bank with funds, When the withdrawer want to withdraw it, Then it must withdraw the fund to the beneficiary", async () => {
      const {
        hamm,
        owner: userA,
        otherAccount: userB,
        fakeToken,
        changeBalanceForUser,
      } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBank(
          userA.address,
          userB.address,
          "Piggy bank 1",
          "Piggy bank of the user",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const piggyBankId = FIRST_PIGGY_BANK;
      await changeBalanceForUser(userA.address, BigNumber.from(100_000));

      await fakeToken
        .connect(userA)
        .approve(hamm.address, BigNumber.from(200_000))
        .then((tx) => tx.wait());

      await hamm
        .connect(userA)
        .depositPiggyBank(piggyBankId, BigNumber.from(50_000))
        .then((tx) => tx.wait());

      const balanceBefore = await fakeToken.balanceOf(userA.address);
      expect(balanceBefore).to.be.eql(BigNumber.from(50_000));

      const tx = await hamm
        .connect(userB)
        .withdrawalPiggyBank(piggyBankId)
        .then((tx) => tx.wait());

      // User A receives the tip too as it is the tipReceiver by default
      const balanceAfter = await fakeToken.balanceOf(userA.address);
      expect(balanceAfter).to.be.eql(BigNumber.from(100_000));
      expect(tx).to.emit(hamm, "PiggyBankWithdrawed");
    });

    it("Given a piggy bank with funds, When the beneficiary want to withdraw it, Then it must withdraw the fund to the beneficiary", async () => {
      const {
        hamm,
        owner: userA,
        otherAccount: userB,
        fakeToken,
        changeBalanceForUser,
      } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBank(
          userA.address,
          userB.address,
          "Piggy bank 1",
          "Piggy bank of the user",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const piggyBankId = FIRST_PIGGY_BANK;
      await changeBalanceForUser(userA.address, BigNumber.from(100_000));

      await fakeToken
        .connect(userA)
        .approve(hamm.address, BigNumber.from(200_000))
        .then((tx) => tx.wait());

      await hamm
        .connect(userA)
        .depositPiggyBank(piggyBankId, BigNumber.from(50_000))
        .then((tx) => tx.wait());

      const balanceBefore = await fakeToken.balanceOf(userA.address);
      expect(balanceBefore).to.be.eql(BigNumber.from(50_000));

      const tx = await hamm
        .connect(userA)
        .withdrawalPiggyBank(piggyBankId)
        .then((tx) => tx.wait());

      // User A receives the tip too as it is the tipReceiver by default
      const balanceAfter = await fakeToken.balanceOf(userA.address);
      expect(balanceAfter).to.be.eql(BigNumber.from(100_000));
      expect(tx).to.emit(hamm, "PiggyBankWithdrawed");
    });

    it("Given a piggy bank, When a user different than the withdrawer or the beneficiary want to withdraw, Then it must revert as only the withdrawer or beneficiary can withdraw", async () => {
      const {
        hamm,
        owner: userA,
        otherAccount: userB,
        fakeToken,
        changeBalanceForUser,
      } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBankForSender(
          "Piggy bank 1",
          "Piggy bank of the user",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const piggyBankId = FIRST_PIGGY_BANK;
      await changeBalanceForUser(userA.address, BigNumber.from(100_000));
      await fakeToken
        .connect(userA)
        .approve(hamm.address, BigNumber.from(200_000))
        .then((tx) => tx.wait());
      await hamm
        .connect(userA)
        .depositPiggyBank(piggyBankId, BigNumber.from(50_000))
        .then((tx) => tx.wait());

      await expect(
        hamm.connect(userB).withdrawalPiggyBank(piggyBankId)
      ).to.be.revertedWith("Only withdrawer or owner can call this function.");
    });

    it("Given a user, When he wants to deposit on a non-existing piggy bank, Then it must revert", async () => {
      const {
        hamm,
        owner: userA,
        otherAccount: userB,
        fakeToken,
        changeBalanceForUser,
      } = await deployHammContract();
      const piggyBankId = FIRST_PIGGY_BANK;
      await changeBalanceForUser(userA.address, BigNumber.from(100_000));
      await fakeToken
        .connect(userA)
        .approve(hamm.address, BigNumber.from(200_000))
        .then((tx) => tx.wait());
      await expect(
        hamm
          .connect(userA)
          .depositPiggyBank(piggyBankId, BigNumber.from(50_000))
      ).revertedWith(
        "You are depositing on a deleted or not created piggy bank"
      );
    });
  });

  describe("Retrieve piggy banks", () => {
    it("Given a user with piggy banks, When retrieving the piggy banks ids, Then it must retrieve the user piggy banks ids", async () => {
      const { hamm, owner: userA, fakeToken } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBankForSender(
          "Piggy bank 1",
          "Bank 1",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      await hamm
        .connect(userA)
        .createNewPiggyBankForSender(
          "Piggy bank 2",
          "Bank 2",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const ownedPiggyBanksIds = await hamm.connect(userA).getPiggyBanksIds();
      expect(ownedPiggyBanksIds).to.be.eql([
        FIRST_PIGGY_BANK,
        FIRST_PIGGY_BANK.add(1),
      ]);
    });

    it("Given a user B with piggy banks, When retrieving the piggy banks ids for user A, Then it must retrieve an empty array", async () => {
      const {
        hamm,
        owner: userA,
        otherAccount: userB,
        fakeToken,
      } = await deployHammContract();
      await hamm
        .connect(userB)
        .createNewPiggyBankForSender(
          "Piggy bank 1",
          "Bank 1",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      await hamm
        .connect(userB)
        .createNewPiggyBankForSender(
          "Piggy bank 2",
          "Bank 2",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const ownedPiggyBanksIds = await hamm.connect(userA).getPiggyBanksIds();
      expect(ownedPiggyBanksIds).to.be.eql([]);
    });

    it("Given a user A and user B with piggy banks, When retrieving the piggy banks ids for user B, Then it must retrieve the piggy banks for user B", async () => {
      const {
        hamm,
        owner: userA,
        otherAccount: userB,
        fakeToken,
      } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBankForSender(
          "Piggy bank 1",
          "Bank 1",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      await hamm
        .connect(userA)
        .createNewPiggyBankForSender(
          "Piggy bank 2",
          "Bank 2",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      await hamm
        .connect(userB)
        .createNewPiggyBankForSender(
          "Piggy bank 3",
          "Bank 3",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      await hamm
        .connect(userB)
        .createNewPiggyBankForSender(
          "Piggy bank 4",
          "Bank 4",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const ownedPiggyBanksIds = await hamm
        .connect(userA)
        .getPiggyBankIdsForAddress(userB.address);
      expect(ownedPiggyBanksIds).to.be.eql([
        BigNumber.from(3),
        BigNumber.from(4),
      ]);
    });
  });

  describe("Change withdrawer", () => {
    it("Given a beneficiary in a piggy bank, When the beneficiary want to change the withdrawer of the piggy, Then the withdrawer can be change", async () => {
      const {
        hamm,
        owner: userA,
        otherAccount: userB,
        fakeToken,
      } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBank(
          userA.address,
          userB.address,
          "Piggy bank 1",
          "Piggy bank of the user",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const piggyBankId = FIRST_PIGGY_BANK;
      const { withdrawerAddress: withdrawerAddressBefore } =
        await hamm.getPiggyBankById(piggyBankId);
      expect(withdrawerAddressBefore).to.eql(userB.address);
      await hamm
        .connect(userA)
        .changeWithdrawer(piggyBankId, userA.address)
        .then((tx) => tx.wait());
      const { withdrawerAddress: withdrawerAddressAfter } =
        await hamm.getPiggyBankById(piggyBankId);
      expect(withdrawerAddressAfter).to.eql(userA.address);
    });

    it("Given a withdrawer in a piggy bank, When the withdrawer want to change the withdrawer of the piggy, Then it must revert as only the beneficiary can change the withdrawer of a piggy bank", async () => {
      const {
        hamm,
        owner: userA,
        otherAccount: userB,
        fakeToken,
      } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBank(
          userA.address,
          userB.address,
          "Piggy bank 1",
          "Piggy bank of the user",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const piggyBankId = FIRST_PIGGY_BANK;
      const { withdrawerAddress: withdrawerAddressBefore } =
        await hamm.getPiggyBankById(piggyBankId);
      expect(withdrawerAddressBefore).to.eql(userB.address);
      await expect(
        hamm.connect(userB).changeWithdrawer(piggyBankId, userB.address)
      ).to.revertedWith("Only owner can call this function.");
      const { withdrawerAddress: withdrawerAddressAfter } =
        await hamm.getPiggyBankById(piggyBankId);
      expect(withdrawerAddressAfter).to.eql(userB.address);
    });

    it("Given a user different than the beneficiary on a piggy bank, When it wants to change the withdrawer, Then it must revert as only the beneficiary can change the withdrawer of a piggy bank", async () => {
      const {
        hamm,
        owner: userA,
        otherAccount: userB,
        fakeToken,
      } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBank(
          userA.address,
          userA.address,
          "Piggy bank 1",
          "Piggy bank of the user",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const piggyBankId = FIRST_PIGGY_BANK;
      const { withdrawerAddress: withdrawerAddressBefore } =
        await hamm.getPiggyBankById(piggyBankId);
      expect(withdrawerAddressBefore).to.eql(userA.address);
      await expect(
        hamm.connect(userB).changeWithdrawer(piggyBankId, userB.address)
      ).to.revertedWith("Only owner can call this function.");
      const { withdrawerAddress: withdrawerAddressAfter } =
        await hamm.getPiggyBankById(piggyBankId);
      expect(withdrawerAddressAfter).to.eql(userA.address);
    });
  });

  describe("Tip", () => {
    it("Given a Hamm contract with a tip receiver address, When a user withdraw its piggy bank, Then the tip receiver address will receive 0.5% of the amount", async () => {
      const [userA] = await hre.ethers.getSigners();
      const {
        hamm,
        otherAccount: userB,
        fakeToken,
        changeBalanceForUser,
      } = await deployHammContract({ tipReceiverAddress: userA.address });
      await hamm
        .connect(userB)
        .createNewPiggyBankForSender(
          "Piggy bank 1",
          "Piggy bank of the user B",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const piggyBankId = FIRST_PIGGY_BANK;
      await changeBalanceForUser(userB.address, BigNumber.from(100_000));

      await fakeToken
        .connect(userB)
        .approve(hamm.address, BigNumber.from(200_000))
        .then((tx) => tx.wait());

      await hamm
        .connect(userB)
        .depositPiggyBank(piggyBankId, BigNumber.from(100_000))
        .then((tx) => tx.wait());

      const balanceBefore = await fakeToken.balanceOf(userA.address);
      expect(balanceBefore).to.be.eql(BigNumber.from(0));

      await hamm
        .connect(userB)
        .withdrawalPiggyBank(piggyBankId)
        .then((tx) => tx.wait());

      const tipReceiverBalanceAfter = await fakeToken.balanceOf(userA.address);
      expect(tipReceiverBalanceAfter).to.be.eql(BigNumber.from(500));

      const withdrawerBalanceAfter = await fakeToken.balanceOf(userB.address);
      expect(withdrawerBalanceAfter).to.be.eql(BigNumber.from(99_500));
    });

    it("Given a piggy bank without enough fund to tip 0.5%, When a user withdraw its piggy bank, Then all the funds go to the user directly", async () => {
      const [userA] = await hre.ethers.getSigners();
      const {
        hamm,
        otherAccount: userB,
        fakeToken,
        changeBalanceForUser,
      } = await deployHammContract({ tipReceiverAddress: userA.address });
      await hamm
        .connect(userB)
        .createNewPiggyBankForSender(
          "Piggy bank 1",
          "Piggy bank of the user B",
          fakeToken.address
        )
        .then((tx) => tx.wait());
      const piggyBankId = FIRST_PIGGY_BANK;
      await changeBalanceForUser(userB.address, BigNumber.from(100_000));

      await fakeToken
        .connect(userB)
        .approve(hamm.address, BigNumber.from(200_000))
        .then((tx) => tx.wait());

      await hamm
        .connect(userB)
        .depositPiggyBank(piggyBankId, BigNumber.from(100))
        .then((tx) => tx.wait());

      const balanceBefore = await fakeToken.balanceOf(userA.address);
      expect(balanceBefore).to.be.eql(BigNumber.from(0));

      await hamm
        .connect(userB)
        .withdrawalPiggyBank(piggyBankId)
        .then((tx) => tx.wait());

      const tipReceiverBalanceAfter = await fakeToken.balanceOf(userA.address);
      expect(tipReceiverBalanceAfter).to.be.eql(BigNumber.from(0));

      const withdrawerBalanceAfter = await fakeToken.balanceOf(userB.address);
      expect(withdrawerBalanceAfter).to.be.eql(BigNumber.from(100_000));
    });
  });

  describe("Delete a piggy bank", () => {
    it("Given a user with a piggy bank, When it want to delete the piggy bank, Then it must be deleted", async () => {
      const [userA] = await hre.ethers.getSigners();
      const {
        hamm,
        otherAccount: userB,
        fakeToken,
      } = await deployHammContract({ tipReceiverAddress: userA.address });
      await hamm
        .connect(userB)
        .createNewPiggyBankForSender(
          "Piggy bank 1",
          "Piggy bank of the user B",
          fakeToken.address
        )
        .then((tx) => tx.wait());

      await hamm
        .connect(userB)
        .deletePiggyBank(FIRST_PIGGY_BANK)
        .then((tx) => tx.wait());

      await expect(hamm.connect(userB).ownerOf(FIRST_PIGGY_BANK)).revertedWith(
        "ERC721: invalid token ID"
      );
    });

    it("Given a piggy bank with a balance, When it is deleted, Then it must be withdrawed and deleted", async () => {
      const {
        hamm,
        owner: userA,
        fakeToken,
        changeBalanceForUser,
      } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBankForSender(
          "Piggy bank 1",
          "Piggy bank of the user A",
          fakeToken.address
        )
        .then((tx) => tx.wait());

      await changeBalanceForUser(userA.address, BigNumber.from(100_000));

      await fakeToken
        .connect(userA)
        .approve(hamm.address, BigNumber.from(200_000))
        .then((tx) => tx.wait());

      await hamm
        .connect(userA)
        .depositPiggyBank(FIRST_PIGGY_BANK, BigNumber.from(100_000))
        .then((tx) => tx.wait());

      const balanceBefore = await fakeToken.balanceOf(userA.address);
      expect(balanceBefore).to.eql(BigNumber.from(0));

      await hamm
        .connect(userA)
        .deletePiggyBank(FIRST_PIGGY_BANK)
        .then((tx) => tx.wait());

      const balanceAfter = await fakeToken.balanceOf(userA.address);
      expect(balanceAfter).to.eql(BigNumber.from(100_000));
    });

    it("Given a user with deleted piggy banks, When retrieving the piggy banks owned by the user, Then it must returns the existing piggy banks", async () => {
      const { hamm, owner: userA, fakeToken } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBankForSender(
          "Piggy bank 1",
          "Piggy bank of the user A",
          fakeToken.address
        )
        .then((tx) => tx.wait());

      await hamm
        .connect(userA)
        .createNewPiggyBankForSender(
          "Piggy bank 2",
          "Piggy bank of the user A",
          fakeToken.address
        )
        .then((tx) => tx.wait());

      await hamm
        .connect(userA)
        .deletePiggyBank(FIRST_PIGGY_BANK)
        .then((tx) => tx.wait());

      const ownedPiggyBanks = await hamm.connect(userA).getPiggyBanksIds();
      expect(ownedPiggyBanks).to.eql([BigNumber.from(2)]);
    });

    it("Given a piggy bank owned by user A, When another user wants to delete the piggy bank, Then it must revert as only the owner can delete the piggy bank", async () => {
      const {
        hamm,
        owner: userA,
        otherAccount: userB,
        fakeToken,
      } = await deployHammContract();
      await hamm
        .connect(userA)
        .createNewPiggyBankForSender(
          "Piggy bank 1",
          "Piggy bank of the user A",
          fakeToken.address
        )
        .then((tx) => tx.wait());

      await expect(
        hamm.connect(userB).deletePiggyBank(FIRST_PIGGY_BANK)
      ).revertedWith("Only owner can call this function.");
    });
  });
});
