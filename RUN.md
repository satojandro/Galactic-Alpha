# 🚀 How to Run Galactic Alpha

This guide walks you through running the complete Galactic Alpha pipeline from data collection to visualization.

## Prerequisites

✅ All dependencies installed in each module:
- `pipes/` - npm install ✅
- `astro/` - npm install ✅
- `backtester/` - npm install ✅
- `galactic-alpha/` - npm install ✅

## Step-by-Step Execution

### Step 1: Generate Swap Data (Pipes Indexer)

Generate blockchain swap data from Uniswap V2:

```bash
cd pipes

# Option A: Use block numbers directly
START_BLOCK=18000000 END_BLOCK=18030000 npx tsx indexer.ts

# Option B: Convert dates to blocks first (recommended for date ranges)
# First, find the block range for your date range:
npx tsx blockToDate.ts --range 2024-01-01 2024-12-31
# Then use the output block numbers:
START_BLOCK=<start_block> END_BLOCK=<end_block> npx tsx indexer.ts

# Example: Get all swaps from 2024
npx tsx blockToDate.ts --range 2024-01-01 2024-12-31
# Output will show: START_BLOCK=... END_BLOCK=... npx tsx indexer.ts
```

**Output:** Creates `pipes/swap_data.json` (now includes `timestamp` and `date` fields)

**Expected time:** Depends on block range (can take a few minutes for large ranges)

**💡 Tip:** Use `blockToDate.ts` to convert calendar dates to block numbers!

---

### Step 2: Generate Astrological Data

Calculate astrological conditions:

```bash
cd ../astro

# Option A: Generate for today only
npx tsx today.ts

# Option B: Generate for a date range (for backtesting)
npx tsx dateRange.ts 2024-01-01 2024-12-31
# Or with flags:
npx tsx dateRange.ts --start 2024-01-01 --end 2024-12-31
```

**Output:** 
- `astro/astro_today_index.json` (single date - today)
- `astro/astro_date_range_index.json` (date range - array of dates)

**Expected time:** 
- Single date: < 1 second
- Full year: ~10-30 seconds

---

### Step 3: Join Swap + Astro Data

Combine the swap data with astrological conditions:

```bash
cd ../backtester

# Run the joiner script
npx tsx joinAstro.ts

# Or use npm script:
npm run join
```

**Output:** Creates `backtest/swap_astro_joined.json`

**Expected time:** < 1 second

---

### Step 4: Copy Data to Frontend

Make the joined data available to the frontend:

```bash
# From project root
mkdir -p galactic-alpha/public/data
cp backtest/swap_astro_joined.json galactic-alpha/public/data/
```

---

### Step 5: Run the Frontend

Start the Next.js development server:

```bash
cd galactic-alpha

# Start the dev server
npm run dev

# Or if you prefer:
next dev
```

**Output:** Frontend runs at `http://localhost:3000`

**Navigate to:** `http://localhost:3000/backtesting` to see the chart

---

## Quick Run Script (All Steps)

You can run everything in sequence with this script:

```bash
#!/bin/bash

# Step 1: Generate swap data
echo "🔍 Step 1: Generating swap data..."
cd pipes
START_BLOCK=18000000 END_BLOCK=18030000 npx tsx indexer.ts
cd ..

# Step 2: Generate astro data
echo "🌟 Step 2: Calculating astrological conditions..."
cd astro
npx tsx today.ts
cd ..

# Step 3: Join data
echo "🔗 Step 3: Joining swap and astro data..."
cd backtester
npx tsx joinAstro.ts
cd ..

# Step 4: Copy to frontend
echo "📁 Step 4: Copying data to frontend..."
mkdir -p galactic-alpha/public/data
cp backtest/swap_astro_joined.json galactic-alpha/public/data/

# Step 5: Start frontend
echo "🎨 Step 5: Starting frontend..."
cd galactic-alpha
npm run dev
```

Save this as `run-all.sh`, make it executable (`chmod +x run-all.sh`), and run it with `./run-all.sh`

---

## 📅 Working with Date Ranges

### Converting Dates to Block Numbers

Use the `blockToDate.ts` utility to convert between dates and blocks:

```bash
cd pipes

# Convert a single date to block number
npx tsx blockToDate.ts --date 2024-01-01

# Convert a date range to block range (for querying last year)
npx tsx blockToDate.ts --range 2024-01-01 2024-12-31

# Convert a block number to date
npx tsx blockToDate.ts 18000000
```

### Getting Data for Last Year

**Step 1:** Find block range for last year:
```bash
cd pipes
npx tsx blockToDate.ts --range 2024-01-01 2024-12-31
# Copy the START_BLOCK and END_BLOCK values
```

**Step 2:** Generate swap data:
```bash
START_BLOCK=<from_output> END_BLOCK=<from_output> npx tsx indexer.ts
```

**Step 3:** Generate astro data for the same date range:
```bash
cd ../astro
npx tsx dateRange.ts 2024-01-01 2024-12-31
```

**Step 4:** Join the data (the joiner will match dates automatically):
```bash
cd ../backtester
npx tsx joinAstro.ts
```

### Understanding Block Timestamps

The indexer now includes `timestamp` and `date` fields in the output:
- `timestamp`: Unix timestamp in seconds
- `date`: ISO date string (YYYY-MM-DD)

This makes it easy to match swap data with astrological data by date!

---

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Make sure you've run `npm install` in each directory:
- `cd pipes && npm install`
- `cd ../astro && npm install`
- `cd ../backtester && npm install`
- `cd ../galactic-alpha && npm install`

### Issue: Pipes indexer fails
**Solution:** 
- Check that `@sqd-pipes/pipes` is installed: `cd pipes && npm list @sqd-pipes/pipes`
- Try a smaller block range first: `START_BLOCK=18000000 END_BLOCK=18001000 npx tsx indexer.ts`

### Issue: Frontend shows "Failed to load data"
**Solution:**
- Verify `galactic-alpha/public/data/swap_astro_joined.json` exists
- Check the browser console for specific error messages
- Make sure the JSON file is valid: `cat galactic-alpha/public/data/swap_astro_joined.json | jq .`

### Issue: No swap events found
**Solution:**
- Try a different block range (some blocks may not have swaps)
- Check that the Uniswap V2 pair address is correct
- Verify you're querying Ethereum mainnet blocks

---

## File Flow Diagram

```
pipes/indexer.ts
    ↓
pipes/swap_data.json
    ↓
backtester/joinAstro.ts ← astro/astro_today_index.json
    ↓
backtest/swap_astro_joined.json
    ↓
galactic-alpha/public/data/swap_astro_joined.json
    ↓
galactic-alpha/app/backtesting/page.tsx (AstroChart component)
```

---

## Development Workflow

For active development:

1. **Terminal 1:** Run the frontend (stays running)
   ```bash
   cd galactic-alpha && npm run dev
   ```

2. **Terminal 2:** When you need fresh data, run steps 1-4:
   ```bash
   cd pipes && npx tsx indexer.ts && cd ../astro && npx tsx today.ts && cd ../backtester && npx tsx joinAstro.ts && cp ../backtest/swap_astro_joined.json ../galactic-alpha/public/data/
   ```

3. **Browser:** Refresh `http://localhost:3000/backtesting` to see updated data

---

## Next Steps

Once everything is running:
- ✅ Visit `/backtesting` to see the cosmic chart
- ✅ Toggle astrological events to see correlations
- ✅ Hover over event markers for details
- ✅ Explore other pages: `/vaults`, `/mint`

Happy cosmic trading! 🌙✨

