// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IHamm, InvalidFeeBps} from "./interfaces/IHamm.sol";
import {IHammRenderer} from "./interfaces/IHammRenderer.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

/**
/**
 * @title Hamm
 * @author Khalypso
 * @notice A contract for creating and managing piggy banks.
 */
contract Hamm is IHamm, ERC721Enumerable, Ownable {
    IHammRenderer public renderer;
    mapping(address => bool) public isTokenWhitelisted;
    using Math for uint256;

    constructor(
        address owner,
        IHammRenderer _renderer,
        address[] memory _whitelist
    ) ERC721("PiggyBank", "PBK") Ownable(owner) {
        renderer = _renderer;
        for (uint256 i = 0; i < _whitelist.length; i++) {
            isTokenWhitelisted[_whitelist[i]] = true;
            emit TokenWhitelisted(_whitelist[i]);
        }
    }

    uint256 private nextPiggyBankId = 1;
    mapping(uint256 => PiggyBank) private piggyBanksById;

    modifier onlyExistingPiggyBank(uint256 piggyBankId) {
        _requireOwned(piggyBankId);
        _;
    }

    modifier onlyPiggyBankOwner(uint256 piggyBankId) {
        require(
            msg.sender == ownerOf(piggyBankId),
            "Only owner can call this function."
        );
        _;
    }

    modifier validFeeBps(uint24 feeBps) {
        require(feeBps >= 0 || feeBps <= 500, InvalidFeeBps(feeBps));
        _;
    }

    function updateRenderer(IHammRenderer _renderer) external onlyOwner {
        renderer = _renderer;
    }

    function createNewPiggyBank(
        address beneficiaryAddress,
        string memory name,
        string memory description,
        address tokenContractAddress
    ) public {
        require(
            isTokenWhitelisted[tokenContractAddress],
            "Token not whitelisted"
        );
        uint256 piggyBankId = nextPiggyBankId++;
        piggyBanksById[piggyBankId] = PiggyBank({
            name: name,
            description: description,
            tokenContractAddress: tokenContractAddress,
            balance: 0
        });
        _safeMint(beneficiaryAddress, piggyBankId);
        emit PiggyBankCreated(piggyBankId);
    }

    function getPiggyBankIdsByBeneficiary(
        address beneficiaryAddress
    ) public view returns (uint256[] memory ownedPiggyBankIds) {
        uint256 numberOfPiggyBanks = balanceOf(beneficiaryAddress);
        ownedPiggyBankIds = new uint256[](numberOfPiggyBanks);
        for (
            uint256 tokenIndex = 0;
            tokenIndex < numberOfPiggyBanks;
            tokenIndex++
        ) {
            ownedPiggyBankIds[tokenIndex] = tokenOfOwnerByIndex(
                beneficiaryAddress,
                tokenIndex
            );
        }
        return ownedPiggyBankIds;
    }

    function getPiggyBankById(
        uint256 piggyBankId
    )
        public
        view
        onlyExistingPiggyBank(piggyBankId)
        returns (PiggyBank memory piggyBank, address beneficiaryAddress)
    {
        piggyBank = piggyBanksById[piggyBankId];
        beneficiaryAddress = ownerOf(piggyBankId);
    }

    function depositPiggyBank(
        uint256 piggyBankId,
        uint256 amount
    ) public onlyExistingPiggyBank(piggyBankId) returns (bool) {
        IERC20 inputToken = IERC20(
            piggyBanksById[piggyBankId].tokenContractAddress
        );
        piggyBanksById[piggyBankId].balance += amount;
        emit PiggyBankDeposited(piggyBankId, msg.sender, amount);
        return inputToken.transferFrom(msg.sender, address(this), amount);
    }

    function withdrawalPiggyBank(
        uint256 piggyBankId,
        uint24 feeBps
    ) public onlyPiggyBankOwner(piggyBankId) validFeeBps(feeBps) {
        uint256 amount = piggyBanksById[piggyBankId].balance;
        uint256 fee = feeBps > 0 ? amount.mulDiv(feeBps, 10000) : 0;
        uint256 amountToWithdrawer = amount - fee;
        piggyBanksById[piggyBankId].balance = 0;
        IERC20 inputToken = IERC20(
            piggyBanksById[piggyBankId].tokenContractAddress
        );
        inputToken.transfer(ownerOf(piggyBankId), amountToWithdrawer);
        inputToken.transfer(owner(), fee);
        emit PiggyBankWithdrawed(piggyBankId);
    }

    function deletePiggyBank(
        uint256 piggyBankId,
        uint24 feeBps
    ) public onlyPiggyBankOwner(piggyBankId) validFeeBps(feeBps) {
        withdrawalPiggyBank(piggyBankId, feeBps);
        _burn(piggyBankId);
        emit PiggyBankDeleted(piggyBankId);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(
        uint256 tokenId
    )
        public
        view
        virtual
        override
        onlyExistingPiggyBank(tokenId)
        returns (string memory)
    {
        (PiggyBank memory piggyBank, ) = getPiggyBankById(tokenId);
        string memory nftSvg = renderer.renderSvg(piggyBank);
        string memory encodedNftSvg = string.concat(
            "data:image/svg+xml;base64,",
            Base64.encode(bytes(nftSvg))
        );
        string memory nftMetadata = string.concat(
            "{",
            '"name":',
            string.concat('"', piggyBank.name, '"'),
            ",",
            '"description":',
            string.concat('"', piggyBank.description, '"'),
            ",",
            '"image":',
            string.concat('"', encodedNftSvg, '"'),
            "}"
        );
        return
            string.concat(
                "data:application/json;base64,",
                Base64.encode(bytes(nftMetadata))
            );
    }

    function addTokenToWhitelist(
        address tokenContractAddress
    ) public onlyOwner {
        require(
            !isTokenWhitelisted[tokenContractAddress],
            "Token already whitelisted"
        );
        isTokenWhitelisted[tokenContractAddress] = true;
        emit TokenWhitelisted(tokenContractAddress);
    }

    function removeTokenFromWhitelist(
        address tokenContractAddress
    ) public onlyOwner {
        require(
            isTokenWhitelisted[tokenContractAddress],
            "Token not whitelisted"
        );
        isTokenWhitelisted[tokenContractAddress] = false;
        emit TokenRemovedFromWhitelist(tokenContractAddress);
    }
}
