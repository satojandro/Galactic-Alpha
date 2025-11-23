# 📅 Date Ranges & Uniswap Version Guide

## Question 1: How to Get Block Numbers for Calendar Dates?

### ✅ Solution: Use the `blockToDate.ts` Utility

I've created a helper script that converts between dates and block numbers:

```bash
cd pipes

# Convert date range to block range (for last year)
npx tsx blockToDate.ts --range 2024-01-01 2024-12-31

# Output will show:
# 📅 Date Range: 2024-01-01 to 2024-12-31
# 🔢 Block Range: 18,500,000 to 19,200,000
# 💡 To query this date range, use:
#    START_BLOCK=18500000 END_BLOCK=19200000 npx tsx indexer.ts
```

### How It Works

- **Ethereum blocks** are mined approximately every **12 seconds**
- **Genesis block** (Block 0) was at: `2015-07-30 15:26:28 UTC`
- Formula: `timestamp = genesis_timestamp + (block_number × 12)`

### Updated Indexer Output

The indexer now includes **timestamp and date fields** in the output:

```json
{
  "block": 18020330,
  "timestamp": 1704067200,
  "date": "2024-01-01",
  "txHash": "0x...",
  "price": "2135.82",
  "volume": "81234.24"
}
```

This makes it easy to:
- Match swap data with astrological data by date
- Filter data by date ranges
- Display dates in the frontend

### Complete Workflow for Last Year

```bash
# 1. Find block range for 2024
cd pipes
npx tsx blockToDate.ts --range 2024-01-01 2024-12-31

# 2. Generate swap data (use the block numbers from step 1)
START_BLOCK=18500000 END_BLOCK=19200000 npx tsx indexer.ts

# 3. Generate astro data for the same date range
cd ../astro
npx tsx dateRange.ts 2024-01-01 2024-12-31

# 4. Join the data
cd ../backtester
npx tsx joinAstro.ts
```

---

## Question 2: Are We Using Outdated Uniswap Version?

### Current Status: Uniswap V2

**Yes, we're using V2**, which is still active but handles less volume than V3.

### Volume Comparison (Jan 2025)

| Version | Daily Volume | Status |
|---------|-------------|--------|
| **V3** | ~$2.4B | **Majority** |
| **V2** | ~$455M | Still significant |
| **V4** | New (Jan 2025) | Just launched |

### Should We Upgrade?

#### ✅ **Pros of Staying with V2:**
- Still has substantial volume ($455M/day)
- Simpler event structure
- More stable/established
- Our code works perfectly

#### ✅ **Pros of Upgrading to V3:**
- **5x more volume** (~$2.4B vs $455M)
- More accurate prices (concentrated liquidity)
- Better for backtesting (more data points)
- More representative of current market

#### ⚠️ **V4 Considerations:**
- Very new (launched Jan 2025)
- Limited historical data
- API might still be evolving

### Recommendation

**For historical backtesting (last year): Upgrade to V3**
- V3 has been active since May 2021
- Much more volume = better data quality
- More representative of current market behavior

**For current analysis: Consider supporting both V2 and V3**
- V2 still has significant volume
- V3 has the majority
- Combining both gives complete picture

### Migration Path

See `pipes/UNISWAP_VERSIONS.md` for detailed migration guide.

**Quick V3 Info:**
- **Factory**: `0x1F98431c8aD98523631AE4a59f267346ea31F984`
- **WETH/USDC Pool (0.05%)**: `0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640`
- **WETH/USDC Pool (0.3%)**: `0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8`

The Swap event signature is the same, but pool addresses differ.

---

## Summary

### ✅ What I've Added:

1. **`pipes/blockToDate.ts`** - Convert dates ↔ block numbers
2. **`pipes/indexer.ts`** - Now includes `timestamp` and `date` fields
3. **`astro/dateRange.ts`** - Generate astro data for date ranges
4. **`pipes/UNISWAP_VERSIONS.md`** - Detailed version comparison
5. **Updated `RUN.md`** - Instructions for date range queries

### 🚀 Next Steps:

1. **For date ranges**: Use `blockToDate.ts` to find block ranges, then query
2. **For Uniswap**: Consider adding V3 support for better historical data
3. **For backtesting**: Use `dateRange.ts` to generate astro data for full year

All tools are ready to use! 🎉

