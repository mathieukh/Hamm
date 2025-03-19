// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

error InvalidFeeBps(uint24 feeBps);

interface IHamm is IERC721Enumerable {
    event TokenWhitelisted(address tokenContractAddress);

    event TokenRemovedFromWhitelist(address tokenContractAddress);

    event PiggyBankCreated(uint piggyBankId);

    event PiggyBankDeposited(uint piggyBankId, address sender, uint amount);

    event PiggyBankWithdrawed(uint piggyBankId);

    event PiggyBankDeleted(uint piggyBankId);

    struct PiggyBank {
        string name;
        string description;
        address tokenContractAddress;
        uint balance;
    }
}
