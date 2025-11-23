# Pipes Module

SQD Pipes integration for indexing Uniswap V2 Swap events and extracting price/volume data.

## Overview

This module uses the Subsquid Pipes SDK to:
- Listen for Uniswap V2 `Swap` events from the WETH/USDC pair
- Extract price and volume data per swap
- Output data in JSON format for use in backtesting and analytics

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the indexer:**
   ```bash
   npx tsx indexer.ts
   ```

   Or use the npm script:
   ```bash
   npm run index
   ```

## Configuration

You can configure the block range using environment variables:

```bash
# Process specific block range
START_BLOCK=18000000 END_BLOCK=18010000 npx tsx indexer.ts

# Or set in your shell
export START_BLOCK=18000000
export END_BLOCK=18010000
npx tsx indexer.ts
```

If no block range is specified, the processor will use default settings from the Subsquid archive.

## Output Format

The indexer outputs `swap_data.json` with the following format:

```json
[
  {
    "block": 18020330,
    "txHash": "0x...",
    "price": "2135.82",
    "volume": "81234.24"
  }
]
```

Where:
- `block`: Block number where the swap occurred
- `txHash`: Transaction hash of the swap
- `price`: Calculated price (USDC per WETH)
- `volume`: Volume in USD terms

## How It Works

1. **Event Listening**: The processor listens for Uniswap V2 `Swap` events using the event signature `0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822`

2. **Data Extraction**: For each swap event, we extract:
   - `amount0In`, `amount1In`: Input amounts
   - `amount0Out`, `amount1Out`: Output amounts
   - Block number and transaction hash

3. **Price Calculation**: Price is calculated as `amount1 / amount0` (in human-readable units)

4. **Volume Calculation**: Volume = `amount0 * price` (in USD terms)

## Integration

This data can be used for:
- Backtesting token behavior against astrological events
- Chart overlays showing price movements
- Vault logic that responds to market conditions
- Analytics and correlation analysis

## Notes

- The indexer currently focuses on the WETH/USDC pair
- Token decimals are hardcoded (WETH: 18, USDC: 6)
- For production use, consider adding error handling and rate limiting
- The processor uses Subsquid's Ethereum archive for efficient data access
