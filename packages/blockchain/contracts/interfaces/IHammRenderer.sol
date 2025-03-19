// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IHamm} from "./IHamm.sol";

interface IHammRenderer {
    function renderSvg(
        IHamm.PiggyBank calldata piggyBank
    ) external view returns (string memory svg);
}
