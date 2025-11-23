/**
 * Chunked Indexer - Processes large block ranges in smaller chunks
 * 
 * This script breaks large block ranges into manageable chunks and processes them sequentially.
 * Useful for querying large date ranges without timing out or overwhelming the API.
 * 
 * Usage:
 *   npx tsx indexInChunks.ts <start_block> <end_block> [chunk_size]
 * 
 * Example:
 *   npx tsx indexInChunks.ts 22154159 24789359 50000
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { spawn } from 'child_process';

interface SwapData {
  block: number;
  timestamp: number;
  date: string;
  txHash: string;
  price: string;
  volume: string;
}

const CHUNK_SIZE = 50000; // Process 50k blocks at a time (default)
const CHUNK_TIMEOUT_MS = 300000; // 5 minutes timeout per chunk

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: npx tsx indexInChunks.ts <start_block> <end_block> [chunk_size]');
    console.error('Example: npx tsx indexInChunks.ts 22154159 24789359 50000');
    process.exit(1);
  }
  
  const startBlock = parseInt(args[0].replace(/,/g, ''), 10);
  const endBlock = parseInt(args[1].replace(/,/g, ''), 10);
  const chunkSize = args[2] ? parseInt(args[2].replace(/,/g, ''), 10) : CHUNK_SIZE;
  
  if (isNaN(startBlock) || isNaN(endBlock) || isNaN(chunkSize)) {
    console.error('❌ Invalid block numbers or chunk size');
    process.exit(1);
  }
  
  const totalBlocks = endBlock - startBlock;
  const numChunks = Math.ceil(totalBlocks / chunkSize);
  
  console.log('🔪 Chunked Indexer');
  console.log(`   Start Block: ${startBlock.toLocaleString()}`);
  console.log(`   End Block: ${endBlock.toLocaleString()}`);
  console.log(`   Total Blocks: ${totalBlocks.toLocaleString()}`);
  console.log(`   Chunk Size: ${chunkSize.toLocaleString()}`);
  console.log(`   Number of Chunks: ${numChunks}`);
  console.log(`\n📦 Processing in chunks...\n`);
  
  const allSwapData: SwapData[] = [];
  const outputFile = join(process.cwd(), 'swap_data.json');
  
  // If output file exists, load it (for resuming)
  if (existsSync(outputFile)) {
    try {
      const existing = JSON.parse(readFileSync(outputFile, 'utf-8'));
      if (Array.isArray(existing)) {
        allSwapData.push(...existing);
        console.log(`📖 Loaded ${existing.length} existing swaps from ${outputFile}`);
      }
    } catch (e) {
      console.warn('⚠️  Could not load existing file, starting fresh');
    }
  }
  
  // Process each chunk
  for (let i = 0; i < numChunks; i++) {
    const chunkStart = startBlock + (i * chunkSize);
    const chunkEnd = Math.min(chunkStart + chunkSize - 1, endBlock);
    
    console.log(`\n📦 Chunk ${i + 1}/${numChunks} (Blocks ${chunkStart.toLocaleString()} - ${chunkEnd.toLocaleString()})`);
    
    try {
      // Run the indexer for this chunk
      const command = `START_BLOCK=${chunkStart} END_BLOCK=${chunkEnd} npx tsx indexer.ts`;
      console.log(`   Running: ${command}`);
      
      // Run indexer with timeout protection
      let indexerOutput = '';
      const startTime = Date.now();
      console.log(`   ⏱️  Starting chunk (will timeout after ${CHUNK_TIMEOUT_MS / 1000}s if stuck)...`);
      
      try {
        // Use execSync with a wrapper that shows progress
        indexerOutput = execSync(command, { 
          encoding: 'utf-8',
          cwd: process.cwd(),
          stdio: ['inherit', 'pipe', 'pipe'],
          maxBuffer: 10 * 1024 * 1024 // 10MB buffer
        }) as string;
        
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`   ⏱️  Chunk completed in ${elapsed}s`);
        
      } catch (error: any) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        // Indexer might exit with error if no swaps found, which is OK
        if (error.stdout) indexerOutput = error.stdout.toString();
        if (error.stderr) {
          const stderrMsg = error.stderr.toString().trim();
          if (stderrMsg && !stderrMsg.includes('No swap events')) {
            console.log(`   ⚠️  ${stderrMsg}`);
          }
        }
        
        if (elapsed > CHUNK_TIMEOUT_MS / 1000) {
          console.log(`   ⏱️  Chunk took ${elapsed}s - consider using smaller chunk size`);
        }
      }
      
      // Check if swap_data.json was created/updated by the indexer
      if (existsSync(outputFile)) {
        const chunkData = JSON.parse(readFileSync(outputFile, 'utf-8'));
        if (Array.isArray(chunkData)) {
          // Merge with existing data, avoiding duplicates
          const existingBlocks = new Set(allSwapData.map(s => s.block));
          const newSwaps = chunkData.filter((s: SwapData) => !existingBlocks.has(s.block));
          
          if (newSwaps.length > 0) {
            allSwapData.push(...newSwaps);
            console.log(`   ✅ Found ${newSwaps.length} new swaps (total: ${allSwapData.length})`);
          } else {
            console.log(`   ℹ️  No new swaps in this chunk`);
          }
          
          // Save progress after each chunk
          writeFileSync(outputFile, JSON.stringify(allSwapData, null, 2));
          console.log(`   💾 Saved progress to: ${outputFile}`);
        }
      } else {
        console.log(`   ⚠️  No swaps found in this chunk (file not created)`);
        // Show if indexer said anything useful
        if (indexerOutput && indexerOutput.includes('Processed')) {
          const match = indexerOutput.match(/Processed (\d+) swaps/);
          if (match) {
            console.log(`   📊 Indexer reported: ${match[1]} swaps`);
          }
        }
      }
      
      // Show progress
      const progress = ((i + 1) / numChunks * 100).toFixed(1);
      console.log(`   Progress: ${progress}%`);
      
    } catch (error: any) {
      console.error(`   ❌ Error processing chunk ${i + 1}:`, error.message);
      console.error(`   ⚠️  Continuing with next chunk...`);
      // Continue with next chunk instead of failing completely
    }
  }
  
  // Final summary
  console.log(`\n✅ Finished processing all chunks!`);
  console.log(`📊 Total swaps found: ${allSwapData.length}`);
  console.log(`📁 Final output: ${outputFile}`);
  
  if (allSwapData.length > 0) {
    console.log(`\n📄 Sample (first 3 entries):`);
    console.log(JSON.stringify(allSwapData.slice(0, 3), null, 2));
  }
}

main();

