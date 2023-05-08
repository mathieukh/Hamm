// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

struct PiggyBank {
    string name;
    string description;
    address tokenContractAddress;
    uint balance;
    address withdrawerAddress;
}

contract Hamm is ERC721 {
    uint numPiggyBanks = 0;
    mapping(uint => PiggyBank) piggyBanksById;

    constructor() ERC721("PiggyBank", "PBK") {}

    event PiggyBankCreated(uint piggyBankId);

    event PiggyBankWithdrawed(uint piggyBankId);

    modifier onlyWithdrawerOrBeneficiary(uint piggyBankId) {
        require(
            msg.sender == ownerOf(piggyBankId) ||
                msg.sender == piggyBanksById[piggyBankId].withdrawerAddress,
            "Only withdrawer or owner can call this function."
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
        PiggyBank storage piggyBank = piggyBanksById[piggyBankId];
        piggyBank.name = name;
        piggyBank.description = description;
        piggyBank.tokenContractAddress = tokenContractAddress;
        piggyBank.balance = 0;
        piggyBank.withdrawerAddress = withdrawerAddress;
        _safeMint(beneficiaryAddress, piggyBankId);
        emit PiggyBankCreated(piggyBankId);
    }

    function getPiggyBanksIds() external view returns (uint[] memory) {
        return getPiggyBankIdsForAddress(msg.sender);
    }

    function getPiggyBankIdsForAddress(
        address beneficiaryAddress
    ) public view returns (uint[] memory) {
        uint numberOfPiggyBanks = balanceOf(beneficiaryAddress);
        uint[] memory ownedPiggyBankIds = new uint[](numberOfPiggyBanks);
        uint foundPiggyBank = 0;
        for (uint piggyBankId = 0; piggyBankId < numPiggyBanks; piggyBankId++) {
            if (foundPiggyBank >= numberOfPiggyBanks) break;
            if (ownerOf(piggyBankId) == beneficiaryAddress)
                ownedPiggyBankIds[foundPiggyBank++] = piggyBankId;
        }
        return ownedPiggyBankIds;
    }

    function getPiggyBankById(
        uint piggyBankId
    )
        public
        view
        returns (
            string memory name,
            string memory description,
            address tokenContractAddress,
            uint balance,
            address beneficiaryAddress,
            address withdrawerAddress
        )
    {
        name = piggyBanksById[piggyBankId].name;
        description = piggyBanksById[piggyBankId].description;
        tokenContractAddress = piggyBanksById[piggyBankId].tokenContractAddress;
        balance = piggyBanksById[piggyBankId].balance;
        beneficiaryAddress = ownerOf(piggyBankId);
        withdrawerAddress = piggyBanksById[piggyBankId].withdrawerAddress;
    }

    function depositPiggyBank(
        uint piggyBankId,
        uint amount
    ) public returns (bool) {
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
        bool transfer = inputToken.transfer(ownerOf(piggyBankId), amount);
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
