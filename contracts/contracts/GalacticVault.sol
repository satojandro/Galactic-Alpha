// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GalacticVault is ERC4626, Ownable {
    bool public vaultOpen = false;

    event AlignmentShift(bool aligned);

    constructor(IERC20 asset_, address initialOwner)
        ERC20("Galactic Vault Share", "GVS")
        ERC4626(asset_)
        Ownable(initialOwner)
    {}

    function toggleAlignment(bool state) external onlyOwner {
        vaultOpen = state;
        emit AlignmentShift(state);
    }

    modifier onlyDuringCosmicAlignment() {
        require(vaultOpen, "Not cosmically aligned");
        _;
    }

    function deposit(uint256 assets, address receiver)
        public
        override
        onlyDuringCosmicAlignment
        returns (uint256 shares)
    {
        return super.deposit(assets, receiver);
    }

    function withdraw(uint256 assets, address receiver, address owner_)
        public
        override
        onlyDuringCosmicAlignment
        returns (uint256 shares)
    {
        return super.withdraw(assets, receiver, owner_);
    }
}

