# 🪐 Backtesting Joiner

This module combines swap data from the SQD Pipes indexer with astrological conditions from the ephemeris engine to create enriched backtesting data.

## 📋 Prerequisites

Before running the joiner, you need to have generated both input files:

1. **Swap Data**: Run the Pipes indexer to generate `swap_data.json`
   ```bash
   cd ../pipes
   npm install
   npx tsx indexer.ts
   ```

2. **Astro Data**: Run the astro engine to generate `astro_today_index.json`
   ```bash
   cd ../astro
   npm install
   npx tsx today.ts
   ```

## 🚀 Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the joiner:
   ```bash
   npx tsx joinAstro.ts
   ```
   
   Or use the npm script:
   ```bash
   npm run join
   ```

## 📁 Input Files

- `../pipes/swap_data.json` - Swap data from the Pipes indexer
- `../astro/astro_today_index.json` - Astrological conditions from the ephemeris engine

## 📤 Output

The joiner creates `../backtest/swap_astro_joined.json` with enriched swap data that includes:

- All original swap fields (block, txHash, price, volume)
- Astro data for each swap:
  - `moon_phase`: Current moon phase (e.g., "New Moon", "Full Moon")
  - `mercury_retrograde`: Boolean indicating if Mercury is retrograde
  - `jupiter_mars_conjunction`: Boolean indicating if Jupiter and Mars are conjunct
  - `astro_rating`: Narrative tag describing cosmic energy (e.g., "Amplified Forces 🪐")

## 📄 Example Output

```json
{
  "block": 18020330,
  "txHash": "0xabc...",
  "price": "2135.82",
  "volume": "81234.24",
  "astro": {
    "moon_phase": "New Moon",
    "mercury_retrograde": false,
    "jupiter_mars_conjunction": true,
    "astro_rating": "Amplified Forces 🪐"
  }
}
```

## 🔧 How It Works

The joiner script:

1. Reads swap data from `pipes/swap_data.json`
2. Reads astro data from `astro/astro_today_index.json`
3. Enriches each swap entry with the astro conditions
4. Writes the combined data to `backtest/swap_astro_joined.json`

**Note**: Currently, all swaps are enriched with the same astro data (today's conditions). In future versions, this could be enhanced to match astro data by block timestamp or date.

