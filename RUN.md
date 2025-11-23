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

# Run with default settings (or specify block range)
npx tsx indexer.ts

# Or with custom block range:
START_BLOCK=18000000 END_BLOCK=18030000 npx tsx indexer.ts

# Or use npm script:
npm run index
```

**Output:** Creates `pipes/swap_data.json`

**Expected time:** Depends on block range (can take a few minutes for large ranges)

---

### Step 2: Generate Astrological Data

Calculate today's astrological conditions:

```bash
cd ../astro

# Run the astro calculator
npx tsx today.ts

# Or use npm script:
npm run today
```

**Output:** Creates `astro/astro_today_index.json`

**Expected time:** < 1 second

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

