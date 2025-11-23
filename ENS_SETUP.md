# 🌐 ENS Integration Setup Guide

This guide explains how to set up ENS subname minting for Galactic Alpha.

## 📋 Prerequisites

Before users can mint subnames, you need to:

1. **Register the parent domain**: `galacticalpha.eth` must be registered on Ethereum Mainnet or Sepolia testnet
2. **Wrap the domain**: The parent domain must be wrapped using the ENS NameWrapper contract
3. **Grant permissions**: Ensure the contract/account has permission to create subnames

## 🔧 Setup Steps

### 1. Register `galacticalpha.eth`

- Go to [app.ens.domains](https://app.ens.domains)
- Search for `galacticalpha.eth`
- Register it (requires ETH for registration fees)
- For testing, use Sepolia testnet

### 2. Wrap the Domain with NameWrapper

1. In the ENS app, navigate to your domain
2. Click "Wrap Name" or use the NameWrapper contract directly
3. This enables subname creation capabilities

### 3. Configure Permissions (IMPORTANT!)

**By default, only the owner of the wrapped domain can create subnames.** To allow other wallets to mint subnames, you need to approve an operator.

#### Option A: Approve an Operator Address

If you want a specific address (like your app's contract or admin wallet) to be able to create subnames:

1. Go to [app.ens.domains](https://app.ens.domains) and connect the wallet that owns `galacticalpha.eth`
2. Navigate to your domain
3. Go to the "More" tab → "Set Approval For All"
4. Enter the address you want to approve (this can be a contract or another wallet)
5. Approve the transaction

Alternatively, you can use the `approveSubnameOperator` function in `lib/ens-utils.ts`:

```typescript
import { approveSubnameOperator } from '@/lib/ens-utils'

// As the parent domain owner, approve an operator
await approveSubnameOperator({
  operatorAddress: '0x...', // Address that should be able to create subnames
  chainId: 11155111 // Sepolia
})
```

Or use the helper script `scripts/approve-ens-operator.ts`:

1. Edit the script and set `OPERATOR_ADDRESS` to the address you want to approve
2. In your browser console (on the app page), run:
```javascript
// Import and run the approval function
import { approveSubnameOperator } from '@/lib/ens-utils'
await approveSubnameOperator({
  operatorAddress: '0x...', // The address to approve
  chainId: 11155111
})
```

#### Option B: Deploy GalacticSubnameRegistrar Contract (Recommended)

The `GalacticSubnameRegistrar` contract allows any user to mint subnames without manual operator approvals. This is the recommended approach for production.

**Step 1: Deploy the Contract**

From the `contracts` directory:

```bash
npx hardhat run ./scripts/deploySubnameRegistrar.js --network sepolia
```

Or from the project root:

```bash
cd contracts && npx hardhat run ./scripts/deploySubnameRegistrar.js --network sepolia
```

**Note:** Use `./scripts/` (with `./`) for Hardhat v2 compatibility.

The script will display the deployed contract address and next steps.

**Step 2: Approve the Contract as Operator**

After deployment, approve the contract so it can create subnames. **You don't need to unwrap the name** - you can approve directly.

**Option A: Use the Approval Page (Easiest)**

1. Start your app: `npm run dev`
2. Navigate to `/approve-contract`
3. Connect the wallet that owns `galacticalpha.eth`
4. Click "Approve Contract as Operator"
5. Confirm the transaction in your wallet

**Option B: Browser Console**

1. Go to your app's `/mint` page (or any page)
2. Open browser console (F12)
3. Run:

```javascript
import { approveSubnameOperator } from '@/lib/ens-utils'

await approveSubnameOperator({
  operatorAddress: '0x6544F8CaD4fcA7472cB9B5128e1f7A6D11e60825', // Your deployed contract address
  chainId: 11155111 // Sepolia
})
```

**Option C: Direct Contract Call (Etherscan)**

1. Go to [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x0635513f179D50A207757E05759CbD106d7dFcE8#writeContract)
2. Connect your wallet
3. Find `setApprovalForAll` function
4. Enter:
   - `operator`: `0x6544F8CaD4fcA7472cB9B5128e1f7A6D11e60825` (your contract address)
   - `approved`: `true`
5. Click "Write" and confirm

**Note:** The ENS Manager UI may not show "Set Approval For All" for wrapped names. Use one of the methods above instead.

**Step 3: Update Frontend Config**

Edit `lib/ens-contract-config.ts`:

```typescript
export const ENS_CONTRACT_CONFIG = {
  11155111: {
    nameWrapper: '0x0635513f179D50A207757E05759CbD106d7dFcE8',
    subnameRegistrar: '0xYOUR_DEPLOYED_CONTRACT_ADDRESS', // ⬅️ Update this
  },
  // ...
}
```

**Step 4: Test**

1. Start your app: `npm run dev`
2. Navigate to `/mint`
3. Connect any wallet (doesn't need to be the owner!)
4. Reveal and mint a subname
5. 🎉 Success!

**Contract Features:**
- `mintSubname(label)`: Mint a subname (anyone can call)
- `isAvailable(label)`: Check if subname is available
- `isMinted(label)`: Check if subname was minted
- `recoverSubname(label)`: Admin recovery function
- `getInfo()`: Get contract information

**Deployment Prerequisites:**
- `.env` file with `PRIVATE_KEY` set (wallet that owns `galacticalpha.eth`)
- Hardhat installed: `npm install --save-dev hardhat`
- Sufficient ETH for gas fees
- Optional: Set `SEPOLIA_RPC_URL` in `.env` for a faster RPC (recommended: Alchemy, Infura, or QuickNode)

**Troubleshooting Deployment Timeouts:**

If you get a `HeadersTimeoutError`, the RPC endpoint is slow. Try these solutions:

1. **Use a faster RPC provider** (Recommended):
   - Get a free API key from [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/)
   - Add to your `.env`:
   ```env
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
   # OR
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   ```

2. **Try alternative public RPCs**:
   ```env
   SEPOLIA_RPC_URL=https://rpc2.sepolia.org
   # OR
   SEPOLIA_RPC_URL=https://sepolia.gateway.tenderly.co
   ```

3. **Retry the deployment** - Public RPCs can be intermittent

The Hardhat config now includes a 120-second timeout and uses a more reliable default RPC.

## 🧪 Testing

### Testnet Setup (Sepolia)

1. Switch to Sepolia testnet in your wallet
2. Get Sepolia ETH from a faucet
3. Register `galacticalpha.eth` on Sepolia
4. Wrap it with NameWrapper
5. Test minting subnames through the app

### Mainnet Setup

1. Ensure you have ETH for gas fees
2. Register `galacticalpha.eth` on Ethereum Mainnet
3. Wrap it with NameWrapper
4. Deploy your app

## 📝 Usage

Users can now:

1. Visit the `/mint` page
2. Click "Reveal Your Stellar Name" to generate a cosmic identity
3. Click "Mint Identity" to mint the ENS subname
4. The subname will be owned by their wallet address

## 🔍 Contract Addresses

### Ethereum Mainnet
- ENS Registry: `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e`
- NameWrapper: `0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401`
- Public Resolver: `0x231b0Ee14048e9dCcD1d247744d114a4EB5E8B63`

### Sepolia Testnet
- ENS Registry: `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e`
- NameWrapper: `0x0635513f179D50A207757E05759CbD106d7dFcE8`
- Public Resolver: `0x8FADE66B81c5C1593aB7b0C5F0C5B4c5E5B5E5B5`

## ⚠️ Important Notes

- **Gas Costs**: Minting subnames requires gas fees. Ensure users have sufficient ETH
- **Name Availability**: The app doesn't check availability before minting. Duplicate names will fail
- **Chain Support**: Currently supports Ethereum Mainnet (chainId: 1) and Sepolia (chainId: 11155111)
- **Parent Domain**: The parent domain `galacticalpha.eth` must be wrapped before subnames can be created

## 🐛 Troubleshooting

### "Unauthorized" Error

This error occurs when a wallet that is NOT the owner of `galacticalpha.eth` tries to create a subname.

**Quick Fix for Testing:**

If you want to test minting from a different wallet, approve that wallet as an operator:

1. Connect the wallet that owns `galacticalpha.eth` to your app
2. In the browser console, run:
```javascript
import { approveSubnameOperator } from '@/lib/ens-utils'

// Approve your testing wallet address
await approveSubnameOperator({
  operatorAddress: '0x...', // ⬅️ Your testing wallet address
  chainId: 11155111 // Sepolia
})
```

3. Now switch to your testing wallet and try minting again

**Production Solution:**

Deploy the `GalacticSubnameRegistrar` contract (see Option B above). This allows any wallet to mint subnames without manual approvals.

### "Already Exists" Error
- The subname has already been minted
- User needs to reveal a new name

### "Unsupported Network" Error
- User must switch to Ethereum Mainnet or Sepolia
- The app only supports these chains for ENS operations

## 🔄 How It Works

1. **User clicks "Mint Identity"** → Frontend calls `mintSubname()` from `ens-utils.ts`
2. **`ens-utils.ts` checks** → Is contract configured? Yes → Use contract
3. **Contract receives call** → Checks if subname is available
4. **Contract calls NameWrapper** → Creates subname (contract is approved operator)
5. **Subname is minted** → User owns `{name}.galacticalpha.eth` ✨

## 📊 Verify Contract Deployment

After deploying the contract, verify it works:

```javascript
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { GALACTIC_SUBNAME_REGISTRAR_ABI } from '@/lib/ens-registrar-abi'

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

const info = await publicClient.readContract({
  address: 'YOUR_CONTRACT_ADDRESS',
  abi: GALACTIC_SUBNAME_REGISTRAR_ABI,
  functionName: 'getInfo',
})

console.log('Contract Info:', info)
```

## 📚 Files Reference

- Contract: `contracts/contracts/GalacticSubnameRegistrar.sol`
- Deployment Script: `contracts/scripts/deploySubnameRegistrar.js`
- Config: `lib/ens-contract-config.ts`
- ABI: `lib/ens-registrar-abi.ts`
- Utils: `lib/ens-utils.ts`
- Component: `components/zodiac-minter.tsx`

## 📚 Resources

- [ENS Documentation](https://docs.ens.domains/)
- [ENS Subnames Guide](https://docs.ens.domains/dapp-developer-guide/ens-subnames)
- [NameWrapper Documentation](https://docs.ens.domains/wrapper/overview)
- [ENS.js SDK](https://github.com/ensdomains/ensjs)
- [Hardhat Documentation](https://hardhat.org/docs)

