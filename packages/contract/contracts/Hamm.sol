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
    uint private constant FIRST_PIGGY_BANK_ID = 1;
    uint private nextPiggyBankId = FIRST_PIGGY_BANK_ID;
    mapping(uint => PiggyBank) private piggyBanksById;

    address private tipReceiverAddress;

    constructor(address _tipReceiverAddress) ERC721("PiggyBank", "PBK") {
        tipReceiverAddress = _tipReceiverAddress;
    }

    event PiggyBankCreated(uint piggyBankId);

    event PiggyBankWithdrawed(uint piggyBankId);

    modifier onlyOwner(uint piggyBankId) {
        require(
            msg.sender == ownerOf(piggyBankId),
            "Only owner can call this function."
        );
        _;
    }

    modifier onlyWithdrawerOrOwner(uint piggyBankId) {
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
        uint piggyBankId = nextPiggyBankId++;
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
        for (
            uint piggyBankId = FIRST_PIGGY_BANK_ID;
            piggyBankId < nextPiggyBankId;
            piggyBankId++
        ) {
            if (foundPiggyBank >= numberOfPiggyBanks) break;
            if (!_exists(piggyBankId)) continue;
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
        require(
            _exists(piggyBankId),
            "You are depositing on a deleted or not created piggy bank"
        );
        IERC20 inputToken = IERC20(
            piggyBanksById[piggyBankId].tokenContractAddress
        );
        piggyBanksById[piggyBankId].balance += amount;
        return inputToken.transferFrom(msg.sender, address(this), amount);
    }

    function withdrawalPiggyBank(
        uint piggyBankId,
        uint tip
    ) public onlyWithdrawer(piggyBankId) returns (bool transfer) {
        uint amount = piggyBanksById[piggyBankId].balance;
        require(tip <= amount, "The tip is not correct");
        uint amountToWithdrawer = amount - tip;
        piggyBanksById[piggyBankId].balance = 0;
        IERC20 inputToken = IERC20(
            piggyBanksById[piggyBankId].tokenContractAddress
        );
        transfer = inputToken.transfer(
            ownerOf(piggyBankId),
            amountToWithdrawer
        );
        if (tip > 0) {
            inputToken.transfer(tipReceiverAddress, tip);
        }
        emit PiggyBankWithdrawed(piggyBankId);
    }

    function deletePiggyBank(uint piggyBankId) public onlyOwner(piggyBankId) {
        withdrawalPiggyBank(piggyBankId, 0);
        _burn(piggyBankId);
    }

    function changeWithdrawer(
        uint piggyBankId,
        address withdrawerAddress
    ) public onlyWithdrawerOrOwner(piggyBankId) {
        piggyBanksById[piggyBankId].withdrawerAddress = withdrawerAddress;
    }
}
