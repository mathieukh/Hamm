// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

struct PiggyBank {
    bool paused;
    string name;
    string description;
    address tokenContractAddress;
    uint balance;
    address beneficiaryAddress;
    address withdrawerAddress;
}

contract Hamm {
    uint numPiggyBanks = 0;
    mapping(uint => PiggyBank) piggyBanksById;
    mapping(address => uint[]) piggyBankIdsByBeneficiary;

    event PiggyBankCreated(uint piggyBankId);

    event PiggyBankWithdrawed(uint piggyBankId);

    modifier onlyWithdrawerOrBeneficiary(uint piggyBankId) {
        require(
            msg.sender == piggyBanksById[piggyBankId].withdrawerAddress ||
                msg.sender == piggyBanksById[piggyBankId].beneficiaryAddress,
            "Only withdrawer or beneficiary can call this function."
        );
        _;
    }

    modifier onlyWithdrawer(uint piggyBankId) {
        require(
            msg.sender == piggyBanksById[piggyBankId].withdrawerAddress,
            "Only withdrawer can call this function."
        );
        _;
    }

    modifier onlyActivePiggyBank(uint piggyBankId) {
        require(
            piggyBanksById[piggyBankId].paused == false,
            "You can not deposit in a paused piggy bank"
        );
        _;
    }

    function createNewPiggyBankForSender(
        string memory name,
        string memory description,
        address tokenContractAddress
    ) external {
        createNewPiggyBank(
            msg.sender,
            msg.sender,
            name,
            description,
            tokenContractAddress
        );
    }

    function createNewPiggyBank(
        address beneficiaryAddress,
        address withdrawerAddress,
        string memory name,
        string memory description,
        address tokenContractAddress
    ) public {
        uint piggyBankId = numPiggyBanks++;
        piggyBankIdsByBeneficiary[beneficiaryAddress].push(piggyBankId);
        PiggyBank storage piggyBank = piggyBanksById[piggyBankId];
        piggyBank.paused = false;
        piggyBank.name = name;
        piggyBank.description = description;
        piggyBank.tokenContractAddress = tokenContractAddress;
        piggyBank.balance = 0;
        piggyBank.beneficiaryAddress = beneficiaryAddress;
        piggyBank.withdrawerAddress = withdrawerAddress;
        emit PiggyBankCreated(piggyBankId);
    }

    function getPiggyBanksIds() external view returns (uint[] memory) {
        return getPiggyBankIdsForAddress(msg.sender);
    }

    function getPiggyBankIdsForAddress(
        address beneficiaryAddress
    ) public view returns (uint[] memory) {
        return piggyBankIdsByBeneficiary[beneficiaryAddress];
    }

    function getPiggyBankById(
        uint piggyBankId
    )
        public
        view
        returns (
            bool paused,
            string memory name,
            string memory description,
            address tokenContractAddress,
            uint balance,
            address beneficiaryAddress,
            address withdrawerAddress
        )
    {
        paused = piggyBanksById[piggyBankId].paused;
        name = piggyBanksById[piggyBankId].name;
        description = piggyBanksById[piggyBankId].description;
        tokenContractAddress = piggyBanksById[piggyBankId].tokenContractAddress;
        balance = piggyBanksById[piggyBankId].balance;
        beneficiaryAddress = piggyBanksById[piggyBankId].beneficiaryAddress;
        withdrawerAddress = piggyBanksById[piggyBankId].withdrawerAddress;
    }

    function togglePiggyBank(
        uint piggyBankId
    ) public onlyWithdrawerOrBeneficiary(piggyBankId) {
        piggyBanksById[piggyBankId].paused = !piggyBanksById[piggyBankId]
            .paused;
    }

    function depositPiggyBank(
        uint piggyBankId,
        uint amount
    ) public onlyActivePiggyBank(piggyBankId) returns (bool) {
        IERC20 inputToken = IERC20(
            piggyBanksById[piggyBankId].tokenContractAddress
        );
        piggyBanksById[piggyBankId].balance += amount;
        return inputToken.transferFrom(msg.sender, address(this), amount);
    }

    function withdrawalPiggyBank(
        uint piggyBankId
    ) public onlyWithdrawer(piggyBankId) returns (bool) {
        uint amount = piggyBanksById[piggyBankId].balance;
        piggyBanksById[piggyBankId].balance = 0;
        IERC20 inputToken = IERC20(
            piggyBanksById[piggyBankId].tokenContractAddress
        );
        bool transfer = inputToken.transfer(
            piggyBanksById[piggyBankId].beneficiaryAddress,
            amount
        );
        emit PiggyBankWithdrawed(piggyBankId);
        return transfer;
    }

    function changeWithdrawer(
        uint piggyBankId,
        address withdrawerAddress
    ) public onlyWithdrawerOrBeneficiary(piggyBankId) {
        piggyBanksById[piggyBankId].withdrawerAddress = withdrawerAddress;
    }
}
