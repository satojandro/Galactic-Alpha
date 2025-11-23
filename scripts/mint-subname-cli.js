/**
 * CLI script to mint ENS subnames using GalacticSubnameRegistrar contract
 *
 * This proves that the ENS deployment works and anyone can create sub-accounts!
 *
 * Usage:
 *   node scripts/mint-subname-cli.js <subname>
 *
 * Examples:
 *   node scripts/mint-subname-cli.js "nova-star"
 *   node scripts/mint-subname-cli.js "cosmic-wallet"
 *
 * Requires:
 *   - PRIVATE_KEY in .env file (any wallet with Sepolia ETH)
 *   - SEPOLIA_RPC_URL in .env (optional, has default)
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
const { ethers } = require('ethers')

// Configuration from deployment
const CONTRACT_ADDRESS = '0x6544F8CaD4fcA7472cB9B5128e1f7A6D11e60825' // Deployed contract
const RPC_URL = process.env.SEPOLIA_RPC_URL || 'https://lb.drpc.live/sepolia/Au_X8MHT5km3gTHdk3Zh9IDSHlrSyFwR8JVUQmlfqV1j'
const CHAIN_ID = 11155111 // Sepolia

// Contract ABI (just the mintSubname function)
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'label',
        type: 'string',
      },
    ],
    name: 'mintSubname',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'label',
        type: 'string',
      },
    ],
    name: 'isAvailable',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'label',
        type: 'string',
      },
    ],
    name: 'isMinted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalMinted',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

async function checkSubnameAvailability(contract, label) {
  try {
    console.log(`🔍 Checking if "${label}" is available...`)

    const isMinted = await contract.isMinted(label)
    const isAvailable = await contract.isAvailable(label)

    console.log(`   Already minted: ${isMinted}`)
    console.log(`   Available: ${isAvailable}`)

    return { isMinted, isAvailable }
  } catch (error) {
    console.log(`   ⚠️  Could not check availability: ${error.message}`)
    return { isMinted: null, isAvailable: null }
  }
}

async function main() {
  // Get subname from command line arguments
  const subname = process.argv[2]

  if (!subname) {
    console.error('\n❌ Error: Please provide a subname to mint')
    console.log('\nUsage:')
    console.log('  node scripts/mint-subname-cli.js <subname>')
    console.log('\nExamples:')
    console.log('  node scripts/mint-subname-cli.js "nova-star"')
    console.log('  node scripts/mint-subname-cli.js "cosmic-wallet"')
    process.exit(1)
  }

  // Validate subname format
  const normalizedSubname = subname.toLowerCase().trim()
  if (!/^[a-z0-9-]+$/.test(normalizedSubname)) {
    console.error(`❌ Error: Invalid subname format: "${subname}"`)
    console.log('Subname must contain only lowercase letters, numbers, and hyphens')
    process.exit(1)
  }

  console.log(`\n🚀 Minting ENS Subname: ${normalizedSubname}.galacticalpha.eth\n`)

  // Check for private key
  if (!process.env.PRIVATE_KEY) {
    console.error('❌ Error: PRIVATE_KEY not found in .env file')
    console.log('\nPlease add your private key to .env:')
    console.log('PRIVATE_KEY=your_private_key_here')
    console.log('\n⚠️  IMPORTANT: Use a wallet with Sepolia ETH!')
    process.exit(1)
  }

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  console.log('📝 Configuration:')
  console.log(`   Network: Sepolia (${CHAIN_ID})`)
  console.log(`   RPC: ${RPC_URL}`)
  console.log(`   Signer: ${signer.address}`)
  console.log(`   Contract: ${CONTRACT_ADDRESS}`)
  console.log(`   Subname: ${normalizedSubname}.galacticalpha.eth`)
  console.log('')

  // Check balance
  const balance = await provider.getBalance(signer.address)
  console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`)

  if (balance === 0n) {
    console.error('\n❌ Error: Insufficient balance. Please add Sepolia ETH to your wallet.')
    console.log('Get Sepolia ETH from: https://sepoliafaucet.com/')
    process.exit(1)
  }

  // Connect to contract
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

  // Check subname availability
  const { isMinted, isAvailable } = await checkSubnameAvailability(contract, normalizedSubname)

  if (isMinted === true) {
    console.error(`\n❌ Error: Subname "${normalizedSubname}.galacticalpha.eth" is already minted!`)
    process.exit(1)
  }

  if (isAvailable === false) {
    console.error(`\n❌ Error: Subname "${normalizedSubname}.galacticalpha.eth" is not available!`)
    process.exit(1)
  }

  console.log('\n⏳ Sending mint transaction...\n')

  try {
    // Send the transaction
    const tx = await contract.mintSubname(normalizedSubname)
    console.log(`✅ Transaction sent: ${tx.hash}`)
    console.log(`\n⏳ Waiting for confirmation...`)

    // Wait for confirmation
    const receipt = await tx.wait()

    console.log(`\n🎉 SUCCESS! Subname minted!`)
    console.log(`\n📊 Transaction Details:`)
    console.log(`   Hash: ${receipt.hash}`)
    console.log(`   Block: ${receipt.blockNumber}`)
    console.log(`   Gas Used: ${receipt.gasUsed.toString()}`)
    console.log(`   Full Name: ${normalizedSubname}.galacticalpha.eth`)

    console.log(`\n🔗 View on Etherscan:`)
    console.log(`   https://sepolia.etherscan.io/tx/${receipt.hash}`)

    // Verify the subname was actually minted
    console.log(`\n🔍 Verifying mint...`)
    const { isMinted: isNowMinted } = await checkSubnameAvailability(contract, normalizedSubname)

    if (isNowMinted) {
      console.log(`✅ Verification: Subname is now minted!`)
      console.log(`\n✨ Proof: ANYONE can create subnames under galacticalpha.eth!`)
      console.log(`   The contract is working and deployed correctly.`)
    } else {
      console.log(`⚠️  Warning: Could not verify mint status`)
    }

    // Show total minted count
    try {
      const totalMinted = await contract.totalMinted()
      console.log(`\n📈 Total subnames minted: ${totalMinted.toString()}`)
    } catch (error) {
      console.log(`⚠️  Could not get total minted count`)
    }

  } catch (error) {
    console.error('\n❌ Error minting subname:')
    if (error.reason) {
      console.error(`   ${error.reason}`)
    } else {
      console.error(`   ${error.message}`)
    }

    // Provide helpful error messages
    if (error.message && error.message.includes('already minted')) {
      console.log(`\n💡 This subname was already taken. Try a different name!`)
    } else if (error.message && error.message.includes('insufficient funds')) {
      console.log(`\n💡 You need more Sepolia ETH. Get some from: https://sepoliafaucet.com/`)
    } else if (error.message && error.message.includes('not approved')) {
      console.log(`\n💡 The contract needs to be approved as an operator first.`)
      console.log(`   Run: node scripts/approve-contract-cli.js`)
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
