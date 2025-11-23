/**
 * CLI script to approve GalacticSubnameRegistrar contract as ENS operator
 * 
 * Usage:
 *   node scripts/approve-contract-cli.js
 * 
 * Requires:
 *   - PRIVATE_KEY in .env file (wallet that owns galacticalpha.eth)
 *   - SEPOLIA_RPC_URL in .env (optional, has default)
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
const { ethers } = require('ethers')

// Configuration
const CONTRACT_ADDRESS = '0x6544F8CaD4fcA7472cB9B5128e1f7A6D11e60825' // Your deployed contract
const NAME_WRAPPER_ADDRESS = '0x0635513f179D50A207757E05759CbD106d7dFcE8' // Sepolia NameWrapper
const RPC_URL = process.env.SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'
const CHAIN_ID = 11155111 // Sepolia

// NameWrapper ABI (just the setApprovalForAll function)
const NAME_WRAPPER_ABI = [
  {
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

async function main() {
  console.log('\n🔐 Approving GalacticSubnameRegistrar Contract\n')
  
  // Check for private key
  if (!process.env.PRIVATE_KEY) {
    console.error('❌ Error: PRIVATE_KEY not found in .env file')
    console.log('\nPlease add your private key to .env:')
    console.log('PRIVATE_KEY=your_private_key_here')
    process.exit(1)
  }

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  console.log('📝 Configuration:')
  console.log(`   Network: Sepolia (${CHAIN_ID})`)
  console.log(`   RPC: ${RPC_URL}`)
  console.log(`   Signer: ${signer.address}`)
  console.log(`   NameWrapper: ${NAME_WRAPPER_ADDRESS}`)
  console.log(`   Contract to approve: ${CONTRACT_ADDRESS}`)
  console.log('')

  // Check balance
  const balance = await provider.getBalance(signer.address)
  console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`)
  
  if (balance === 0n) {
    console.error('\n❌ Error: Insufficient balance. Please add Sepolia ETH to your wallet.')
    process.exit(1)
  }

  // Connect to NameWrapper contract
  const nameWrapper = new ethers.Contract(
    NAME_WRAPPER_ADDRESS,
    NAME_WRAPPER_ABI,
    signer
  )

  console.log('\n⏳ Sending approval transaction...\n')

  try {
    // Send the transaction
    const tx = await nameWrapper.setApprovalForAll(CONTRACT_ADDRESS, true)
    console.log(`✅ Transaction sent: ${tx.hash}`)
    console.log(`\n⏳ Waiting for confirmation...`)
    
    // Wait for confirmation
    const receipt = await tx.wait()
    
    console.log(`\n🎉 Success! Contract approved as operator.`)
    console.log(`\n📊 Transaction Details:`)
    console.log(`   Hash: ${receipt.hash}`)
    console.log(`   Block: ${receipt.blockNumber}`)
    console.log(`   Gas Used: ${receipt.gasUsed.toString()}`)
    console.log(`\n🔗 View on Etherscan:`)
    console.log(`   https://sepolia.etherscan.io/tx/${receipt.hash}`)
    console.log(`\n✨ The contract can now create subnames under galacticalpha.eth!`)
    
  } catch (error) {
    console.error('\n❌ Error approving contract:')
    if (error.reason) {
      console.error(`   ${error.reason}`)
    } else {
      console.error(`   ${error.message}`)
    }
    process.exit(1)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

