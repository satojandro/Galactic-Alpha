# Galactic Vault Contracts

Smart contracts for the Galactic Alpha vault system - an ERC4626 vault with cosmic alignment mechanics.

## 📋 Overview

The `GalacticVault` is an ERC4626-compliant vault that adds a cosmic twist: deposits and withdrawals can only occur when the vault is "cosmically aligned" (controlled by the owner).

## 🏗️ Contract Features

- **ERC4626 Standard**: Full compliance with the ERC4626 tokenized vault standard
- **Cosmic Alignment**: Owner-controlled toggle that gates deposits/withdrawals
- **Ownable**: Uses OpenZeppelin's Ownable for access control
- **Events**: Emits `AlignmentShift` events when alignment state changes

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Hardhat (development framework)
- OpenZeppelin Contracts (secure contract library)
- Hardhat Toolbox (testing and deployment tools)
- dotenv (environment variable management)

### 2. Configure Environment

Copy the example environment file and add your private key:

```bash
cp .env.example .env
```

Then edit `.env` and add your wallet's private key:

```
PRIVATE_KEY=your-actual-private-key-here
```

⚠️ **Security Warning**: Never commit your `.env` file or share your private key!

### 3. Compile Contracts

```bash
npm run compile
```

This will compile the Solidity contracts and generate artifacts.

### 4. Deploy to Zircuit

**Deploy to Zircuit Mainnet:**
```bash
npm run deploy:zircuit
```

**Deploy to Zircuit Testnet (Garfield):**
```bash
npm run deploy:zircuit-testnet
```

This will deploy the `GalacticVault` contract to the selected Zircuit network.

**Note:** Make sure you have:
- Sufficient funds in your wallet for gas fees
- The correct asset token address for the network you're deploying to (you may need a mock token for testnet)

## 📝 Contract Details

### Constructor Parameters

- `asset_`: The address of the underlying ERC20 token (e.g., USDC)

### Key Functions

- `toggleAlignment(bool state)`: Owner-only function to open/close the vault
- `deposit(uint256 assets, address receiver)`: Deposit assets (only when aligned)
- `withdraw(uint256 assets, address receiver, address owner_)`: Withdraw assets (only when aligned)

### Modifiers

- `onlyDuringCosmicAlignment`: Ensures vault is open before deposits/withdrawals

## 🔍 Verification

After deployment, verify your contract on Zircuit Explorer using:

```bash
npx hardhat verify --network zircuit <CONTRACT_ADDRESS> <ASSET_ADDRESS>
```

## 📚 Resources

- [ERC4626 Standard](https://eips.ethereum.org/EIPS/eip-4626)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Zircuit Documentation](https://docs.zircuit.com/)

## 🛠️ Development

### Running Tests

```bash
npm test
```

### Network Configuration

The `hardhat.config.js` includes both Zircuit mainnet and testnet configurations:

- **Zircuit Mainnet**: `https://mainnet.zircuit.com` (Chain ID: 48900)
- **Zircuit Testnet (Garfield)**: `https://garfield-testnet.zircuit.com` (Chain ID: 48898)

You can add other networks as needed.

## ⚠️ Important Notes

1. **Asset Token**: Make sure the asset address you use is valid for the network you're deploying to
2. **Private Key Security**: Never expose your private key in code or version control
3. **Gas Costs**: Ensure your wallet has sufficient funds for deployment
4. **Initial State**: The vault starts closed (`vaultOpen = false`) - owner must call `toggleAlignment(true)` to open it
