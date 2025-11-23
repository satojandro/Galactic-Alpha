
# 🪐 Galactic Alpha: Agent Tasks + Handoff Log

This file is a shared operational space between Alejandro (creator), Nova (design + AI assistant), and Cursor (implementation agent).

## 👨‍🚀 Cursor Role
You are in charge of implementing, testing, and integrating the following features into the Galactic Alpha codebase.

---

## 📝 Latest Updates

**Phase 1: SQD Pipes Indexer - COMPLETED ✅**
- Created `pipes/indexer.ts` using `@sqd-pipes/pipes` (official Pipes SDK)
- Implemented Uniswap V2 Swap event listener for WETH/USDC pair using `EvmQueryBuilder` and `createEvmPortalSource`
- Extracts block, txHash, price, and volume data
- Outputs to `swap_data.json` in the required format
- Includes comprehensive README with usage instructions
- Updated to use correct Pipes SDK API pattern from official documentation
- Ready for testing and integration with backtesting system

**Phase 2: Astrological Conditions Engine - COMPLETED ✅**
- Created `astro/` directory structure with `package.json` and `tsconfig.json`
- Installed `astronomia` library for astronomical calculations
- Implemented `astro/today.ts` script that calculates:
  - Moon phase (8 phases: New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, Waning Crescent)
  - Mercury retrograde status (detects backward planetary motion)
  - Jupiter-Mars conjunction (checks if planets are within 10 degrees)
  - Astro rating (narrative tags like "Chaotic Neutral 🌕", "Amplified Forces 🪐", etc.)
- Outputs to `astro_today_index.json` in the required format
- Includes comprehensive README with usage instructions and astro rating examples
- Successfully tested and verified output format

**Next Steps:**
- Begin Phase 3: Backtesting Joiner (`backtester/joinAstro.ts`)
- Merge SQD swap data with astro timeline
- Create sentiment-weighted timeline output

---

## ✅ Active Work Queue

### 1. SQD Pipes Indexer (HIGH PRIORITY)
- [x] Use `pipes/indexer.ts` provided by Nova *(Created `pipes/indexer.ts` with full implementation)*
- [x] Pull Uniswap V2 `Swap` events for WETH/USDC
- [x] Extract block, txHash, tokenIn, tokenOut → derive price & volume
- [x] Store output as JSON or expose as endpoint *(Outputs to `swap_data.json`)*
- [ ] Confirm SQD integration is working for backtesting *(Ready for testing - run `npm install && npx tsx indexer.ts` in `pipes/` directory)*

### 2. Astro Integration - COMPLETED ✅
- [x] Install `astronomia` (`npm install astronomia`) *(Installed and configured)*
- [x] Create `astro/today.ts` that calculates:
  - Current moon phase *(8 phases calculated from moon/sun positions)*
  - Retrograde state (Mercury) *(Detects backward motion by comparing positions over 3 days)*
  - Jupiter/Mars aspects *(Checks conjunction within 10 degrees)*
- [x] Output to `astro_today_index.json` *(Successfully outputs JSON with date, moon_phase, mercury_retrograde, jupiter_mars_conjunction, astro_rating)*

### 3. Backtesting Joiner
- [ ] Create `backtester/joinAstro.ts`
- [ ] Merge SQD data with astro timeline
- [ ] Output new sentiment-weighted timeline:
  ```json
  {
    "block": 12345678,
    "price": "2045.23",
    "astro_event": "Mercury Retrograde",
    "impact": "+3.5% volatility"
  }
  ```

---

## 📂 Directory Map

| Folder | Description |
|--------|-------------|
| `pipes/` | SQD indexer + event logic |
| `astro/` | Astrology data scripts + ephemeris |
| `frontend/` | Visual overlay for vaults, charts |
| `docs/` | README + agents.md + diagrams |

---

## ⏱️ Timing

We have **~2 hours** to ship a working demo with:
- SQD Pipes integration
- Live or mocked astrology data
- Minimal sentiment logic

---

## 🛠 Cursor Guidelines

- Ask Nova in chat if logic is unclear
- Prioritize stability and clarity over cleverness
- Use mock files if stuck on dynamic API calls
- Submit PRs in small, readable chunks

---

🟣 Nova will continue generating mock data, real ephemeris, and demo overlays.

You’re building the cosmic bridge between stars and swaps.
