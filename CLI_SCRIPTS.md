# CLI Scripts for Testing ENS Deployment

These scripts allow you to test the GalacticSubnameRegistrar contract deployment and prove that anyone can create subnames under `galacticalpha.eth`.

## Prerequisites

1. **Create `.env` file** with your private key:
   ```bash
   cp .env.example .env  # If it exists, or create manually
   ```

   Add your private key (get from MetaMask: Account Details → Export Private Key):
   ```
   PRIVATE_KEY=0x_your_private_key_here
   SEPOLIA_RPC_URL=https://lb.drpc.live/sepolia/Au_X8MHT5km3gTHdk3Zh9IDSHlrSyFwR8JVUQmlfqV1j
   ```

2. **Get Sepolia ETH**: Visit https://sepoliafaucet.com/ to get test ETH

## Scripts

### 1. Approve Contract as ENS Operator

**Purpose**: Allow the GalacticSubnameRegistrar contract to create subnames (run this first if not done).

**Usage**:
```bash
node scripts/approve-contract-cli.js
```

**Requirements**: The private key must own `galacticalpha.eth`

### 2. Mint ENS Subname (ANY Wallet!)

**Purpose**: Test that anyone can create subnames using the deployed contract.

**Usage**:
```bash
node scripts/mint-subname-cli.js <subname>
```

**Examples**:
```bash
# Mint nova-star.galacticalpha.eth
node scripts/mint-subname-cli.js "nova-star"

# Mint cosmic-wallet.galacticalpha.eth
node scripts/mint-subname-cli.js "cosmic-wallet"

# Mint any unique subname
node scripts/mint-subname-cli.js "my-test-name"
```

**Requirements**: Any wallet with Sepolia ETH (proves the contract works for everyone!)

## What These Scripts Prove

✅ **Contract Deployment Works**: The GalacticSubnameRegistrar is deployed and functional
✅ **Permissionless Minting**: Anyone with ETH can create subnames (no special permissions needed)
✅ **ENS Integration**: Subnames are properly registered in the ENS NameWrapper
✅ **Gas Efficiency**: Low-cost transactions for subname creation

## Example Output

```bash
🚀 Minting ENS Subname: nova-star.galacticalpha.eth

📝 Configuration:
   Network: Sepolia (11155111)
   RPC: https://lb.drpc.live/sepolia/Au_X8MHT5km3gTHdk3Zh9IDSHlrSyFwR8JVUQmlfqV1j
   Signer: 0x339A311407fE71D1D7810ba41Cfe841fC179b3fd
   Contract: 0x6544F8CaD4fcA7472cB9B5128e1f7A6D11e60825
   Subname: nova-star.galacticalpha.eth

💰 Balance: 0.5 ETH

🔍 Checking if "nova-star" is available...
   Already minted: false
   Available: true

⏳ Sending mint transaction...

✅ Transaction sent: 0x1234567890abcdef...
⏳ Waiting for confirmation...

🎉 SUCCESS! Subname minted!

📊 Transaction Details:
   Hash: 0x1234567890abcdef...
   Block: 1234567
   Gas Used: 123456
   Full Name: nova-star.galacticalpha.eth

🔗 View on Etherscan:
   https://sepolia.etherscan.io/tx/0x1234567890abcdef...

🔍 Verifying mint...
✅ Verification: Subname is now minted!

✨ Proof: ANYONE can create subnames under galacticalpha.eth!
   The contract is working and deployed correctly.

📈 Total subnames minted: 1
```

## Troubleshooting

### "insufficient funds"
- Get more Sepolia ETH from https://sepoliafaucet.com/

### "not approved"
- Run `node scripts/approve-contract-cli.js` first (requires parent domain owner)

### "already minted"
- Choose a different subname

### "Invalid subname format"
- Use only lowercase letters, numbers, and hyphens
- Examples: `nova-star`, `cosmic123`, `test-name`

## Contract Addresses

- **GalacticSubnameRegistrar**: `0x6544F8CaD4fcA7472cB9B5128e1f7A6D11e60825`
- **ENS NameWrapper (Sepolia)**: `0x0635513f179D50A207757E05759CbD106d7dFcE8`

View contracts on Etherscan:
- https://sepolia.etherscan.io/address/0x6544F8CaD4fcA7472cB9B5128e1f7A6D11e60825
