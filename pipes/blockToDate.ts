/**
 * Block to Date Converter Utility
 * 
 * Helps convert between Ethereum block numbers and calendar dates.
 * Useful for querying historical data by date range.
 * 
 * Usage:
 *   npx tsx blockToDate.ts <block_number>
 *   npx tsx blockToDate.ts --date 2024-01-01
 *   npx tsx blockToDate.ts --range 2024-01-01 2024-12-31
 */

// Ethereum mainnet average block time: ~12 seconds
const BLOCK_TIME_SECONDS = 12;

// Ethereum genesis block: Block 0 at 2015-07-30 15:26:28 UTC
const GENESIS_BLOCK = 0;
const GENESIS_TIMESTAMP = 1438217288; // Unix timestamp in seconds

/**
 * Convert block number to approximate timestamp
 */
function blockToTimestamp(blockNumber: number): number {
  // Approximate: genesis timestamp + (block number * block time)
  return GENESIS_TIMESTAMP + (blockNumber * BLOCK_TIME_SECONDS);
}

/**
 * Convert timestamp to approximate block number
 */
function timestampToBlock(timestamp: number): number {
  return Math.floor((timestamp - GENESIS_TIMESTAMP) / BLOCK_TIME_SECONDS);
}

/**
 * Convert date string (YYYY-MM-DD) to timestamp
 */
function dateToTimestamp(dateStr: string): number {
  return Math.floor(new Date(dateStr + 'T00:00:00Z').getTime() / 1000);
}

/**
 * Convert timestamp to date string (YYYY-MM-DD)
 */
function timestampToDate(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString().split('T')[0];
}

/**
 * Get block range for a date range
 */
function getBlockRange(startDate: string, endDate: string): { startBlock: number; endBlock: number } {
  const startTimestamp = dateToTimestamp(startDate);
  const endTimestamp = dateToTimestamp(endDate) + 86400; // Add 24 hours to include the full end date
  
  const startBlock = timestampToBlock(startTimestamp);
  const endBlock = timestampToBlock(endTimestamp);
  
  return { startBlock, endBlock };
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('📅 Ethereum Block to Date Converter\n');
  console.log('Usage:');
  console.log('  npx tsx blockToDate.ts <block_number>');
  console.log('  npx tsx blockToDate.ts --date YYYY-MM-DD');
  console.log('  npx tsx blockToDate.ts --range YYYY-MM-DD YYYY-MM-DD');
  console.log('\nExamples:');
  console.log('  npx tsx blockToDate.ts 18000000');
  console.log('  npx tsx blockToDate.ts --date 2024-01-01');
  console.log('  npx tsx blockToDate.ts --range 2024-01-01 2024-12-31');
  process.exit(0);
}

if (args[0] === '--date' && args[1]) {
  // Convert date to block number
  const date = args[1];
  const timestamp = dateToTimestamp(date);
  const block = timestampToBlock(timestamp);
  
  console.log(`📅 Date: ${date}`);
  console.log(`🔢 Approximate Block: ${block.toLocaleString()}`);
  console.log(`⏰ Timestamp: ${timestamp}`);
  console.log(`\n💡 To query this date, use:`);
  console.log(`   START_BLOCK=${block} END_BLOCK=${block + 7200} npx tsx indexer.ts`);
  console.log(`\n   Note: You can use commas in the numbers - the indexer will handle them automatically!`);
  
} else if (args[0] === '--range' && args[1] && args[2]) {
  // Convert date range to block range
  const startDate = args[1];
  const endDate = args[2];
  const { startBlock, endBlock } = getBlockRange(startDate, endDate);
  
  console.log(`📅 Date Range: ${startDate} to ${endDate}`);
  console.log(`🔢 Block Range: ${startBlock.toLocaleString()} to ${endBlock.toLocaleString()}`);
  console.log(`📊 Total Blocks: ${(endBlock - startBlock).toLocaleString()}`);
  console.log(`\n💡 To query this date range, use:`);
  console.log(`   START_BLOCK=${startBlock} END_BLOCK=${endBlock} npx tsx indexer.ts`);
  console.log(`\n   Or with commas (indexer handles them automatically):`);
  console.log(`   START_BLOCK=${startBlock.toLocaleString()} END_BLOCK=${endBlock.toLocaleString()} npx tsx indexer.ts`);
  
} else if (!isNaN(Number(args[0]))) {
  // Convert block number to date
  const blockNumber = parseInt(args[0], 10);
  const timestamp = blockToTimestamp(blockNumber);
  const date = timestampToDate(timestamp);
  
  console.log(`🔢 Block: ${blockNumber.toLocaleString()}`);
  console.log(`📅 Approximate Date: ${date}`);
  console.log(`⏰ Timestamp: ${timestamp}`);
  
} else {
  console.error('❌ Invalid arguments. Use --help for usage information.');
  process.exit(1);
}

