# Uniswap Version Comparison & Migration Guide

## Current Status

**We're currently using Uniswap V2**, which is still active but handles less volume than newer versions.

### Volume Comparison (as of Jan 2025)

- **Uniswap V3**: ~$2.4B daily volume (majority)
- **Uniswap V2**: ~$455M daily volume (still significant!)
- **Uniswap V4**: Just launched Jan 2025 (newest)

## Should We Upgrade?

### Pros of Staying with V2:
- ✅ Simpler event structure (easier to parse)
- ✅ Still has substantial volume ($455M/day)
- ✅ More stable/established
- ✅ Our current code works perfectly

### Pros of Upgrading to V3:
- ✅ Much higher volume (~5x more)
- ✅ More accurate price data (concentrated liquidity)
- ✅ Better for backtesting (more data points)
- ✅ More representative of current market

### V4 Considerations:
- ⚠️ Very new (launched Jan 2025)
- ⚠️ May have limited historical data
- ⚠️ API might still be evolving

## Recommendation

**For backtesting historical data (last year)**: **Upgrade to V3**
- V3 has been active since May 2021
- Much more volume = better data quality
- More representative of current market behavior

**For current analysis**: Consider supporting **both V2 and V3**
- V2 still has significant volume
- V3 has the majority
- Combining both gives complete picture

## Migration Path

### Option 1: Add V3 Support (Recommended)

Create a parallel indexer for V3:

```typescript
// V3 uses PoolCreated events and Swap events from pools
// Main differences:
// - Factory address: 0x1F98431c8aD98523631AE4a59f267346ea31F984
// - Pool addresses are created dynamically
// - Swap event signature is the same but structure differs slightly
```

### Option 2: Replace V2 with V3

Simply update the factory address and pool detection logic.

## V3 Implementation Notes

**V3 Factory**: `0x1F98431c8aD98523631AE4a59f267346ea31F984`

**V3 WETH/USDC Pool**: 
- Fee tier 0.05%: `0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640`
- Fee tier 0.3%: `0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8`
- Fee tier 1%: `0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36`

**Swap Event**: Same signature as V2, but pool addresses differ.

## Quick Stats

- **V2 Launch**: May 2020
- **V3 Launch**: May 2021  
- **V4 Launch**: January 2025

For a full year of data (2024), V3 would give you:
- More data points (higher volume)
- More accurate prices (concentrated liquidity)
- Better representation of current market

## Next Steps

1. **For now**: Keep V2, it works and has good volume
2. **For historical analysis**: Add V3 support for better data
3. **Future**: Consider V4 once it has more historical data

Would you like me to create a V3 indexer? It would be similar to the V2 one but querying V3 pools instead.

