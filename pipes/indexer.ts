/**
 * Galactic Alpha - SQD Pipes Indexer
 * 
 * This indexer pulls Uniswap V2 Swap events for WETH/USDC pair,
 * extracts price and volume data, and outputs to JSON format.
 * 
 * Usage:
 *   npm install
 *   npx tsx indexer.ts
 */

import { EvmBatchProcessor } from '@subsquid/evm-processor';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Uniswap V2 Swap event signature
// event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)
const SWAP_EVENT_TOPIC = '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822';

// Known Uniswap V2 WETH/USDC pair address (mainnet)
// You can find this by querying the Uniswap V2 Factory or using a known address
const WETH_USDC_PAIR = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc';

// Token addresses
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

// Token decimals
// Note: In Uniswap V2 pairs, token0 is the token with the lower address (alphabetically)
// For WETH/USDC: WETH (0xC02...) < USDC (0xA0b...), so WETH is token0, USDC is token1
const WETH_DECIMALS = 18;  // token0 decimals
const USDC_DECIMALS = 6;   // token1 decimals

/**
 * Interface for the output data format
 */
interface SwapData {
  block: number;
  txHash: string;
  price: string;
  volume: string;
}

/**
 * Converts hex string to BigInt
 */
function hexToBigInt(hex: string): bigint {
  return BigInt(hex);
}

/**
 * Extracts amount from event data
 * Event data format: 0x + (64 chars per uint256) * 4 = 256 chars + 2 for 0x
 */
function extractAmounts(data: string): {
  amount0In: bigint;
  amount1In: bigint;
  amount0Out: bigint;
  amount1Out: bigint;
} {
  // Remove 0x prefix
  const cleanData = data.startsWith('0x') ? data.slice(2) : data;
  
  // Each uint256 is 64 hex characters (32 bytes)
  const amount0In = hexToBigInt('0x' + cleanData.slice(0, 64));
  const amount1In = hexToBigInt('0x' + cleanData.slice(64, 128));
  const amount0Out = hexToBigInt('0x' + cleanData.slice(128, 192));
  const amount1Out = hexToBigInt('0x' + cleanData.slice(192, 256));
  
  return { amount0In, amount1In, amount0Out, amount1Out };
}

/**
 * Calculates price from swap amounts
 * Price = amount1 / amount0 (in human-readable units)
 */
function calculatePrice(
  amount0In: bigint,
  amount1In: bigint,
  amount0Out: bigint,
  amount1Out: bigint,
  token0Decimals: number,
  token1Decimals: number
): number {
  // Determine which token is being swapped in/out
  // If amount0In > 0, we're swapping token0 for token1
  // If amount1In > 0, we're swapping token1 for token0
  
  let amount0: bigint;
  let amount1: bigint;
  
  if (amount0In > 0n) {
    // Swapping token0 for token1
    amount0 = amount0In;
    amount1 = amount1Out;
  } else {
    // Swapping token1 for token0
    amount0 = amount0Out;
    amount1 = amount1In;
  }
  
  // Convert to human-readable units
  const amount0Human = Number(amount0) / (10 ** token0Decimals);
  const amount1Human = Number(amount1) / (10 ** token1Decimals);
  
  // Price = amount1 / amount0
  // For WETH/USDC: price = USDC / WETH (e.g., 2000 USDC per WETH)
  if (amount0Human === 0) return 0;
  return amount1Human / amount0Human;
}

/**
 * Calculates volume in USD terms
 * Volume = amount0 * price (in human-readable units)
 */
function calculateVolume(
  amount0In: bigint,
  amount0Out: bigint,
  token0Decimals: number,
  price: number
): number {
  // Volume is the total amount swapped
  const amount0 = amount0In > 0n ? amount0In : amount0Out;
  const amount0Human = Number(amount0) / (10 ** token0Decimals);
  
  // Volume = amount * price
  return amount0Human * price;
}

/**
 * Main processor setup
 */
const processor = new EvmBatchProcessor()
  .setDataSource({
    // Use Subsquid's Ethereum archive
    archive: 'https://eth.archive.subsquid.io',
  })
  .addLog({
    // Filter for specific pair address (WETH/USDC)
    // You can also use [] to listen to all pairs
    address: [WETH_USDC_PAIR],
    // Filter for Swap events
    topic0: [SWAP_EVENT_TOPIC],
  })
  .setBlockRange({
    // Start from a recent block (adjust as needed)
    // For testing, use a small recent range
    from: process.env.START_BLOCK ? parseInt(process.env.START_BLOCK) : undefined,
    to: process.env.END_BLOCK ? parseInt(process.env.END_BLOCK) : undefined,
  });

/**
 * Process blocks and extract swap data
 */
processor.run(async (ctx) => {
  const swapData: SwapData[] = [];
  
  console.log(`Processing ${ctx.blocks.length} blocks...`);
  
  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      // Verify this is a Swap event
      if (log.topics[0] !== SWAP_EVENT_TOPIC) continue;
      
      // Extract amounts from event data
      const { amount0In, amount1In, amount0Out, amount1Out } = extractAmounts(log.data);
      
      // Calculate price (assuming token0 is WETH and token1 is USDC)
      // Note: In Uniswap V2, token0/token1 order depends on the pair creation
      // For WETH/USDC, typically WETH is token0 and USDC is token1
      const price = calculatePrice(
        amount0In,
        amount1In,
        amount0Out,
        amount1Out,
        WETH_DECIMALS,
        USDC_DECIMALS
      );
      
      // Calculate volume
      const volume = calculateVolume(
        amount0In,
        amount0Out,
        WETH_DECIMALS,
        price
      );
      
      // Store the data
      swapData.push({
        block: block.header.height,
        txHash: log.transactionHash,
        price: price.toFixed(2),
        volume: volume.toFixed(2),
      });
    }
  }
  
  // Output results
  if (swapData.length > 0) {
    const outputPath = join(process.cwd(), 'swap_data.json');
    writeFileSync(outputPath, JSON.stringify(swapData, null, 2));
    console.log(`✅ Processed ${swapData.length} swaps`);
    console.log(`📁 Output written to: ${outputPath}`);
    console.log(`\nSample output:`);
    console.log(JSON.stringify(swapData.slice(0, 3), null, 2));
  } else {
    console.log('⚠️  No swap events found in the specified block range');
    console.log('💡 Try adjusting START_BLOCK and END_BLOCK environment variables');
  }
});

