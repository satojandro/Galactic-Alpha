
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

**Next Steps:**
- Test the indexer: `cd pipes && npm install && npx tsx indexer.ts`
- Integrate output with backtesting visualizer
- Begin Phase 2: Astro Integration

---

## ✅ Active Work Queue

### 1. SQD Pipes Indexer (HIGH PRIORITY)
- [x] Use `pipes/indexer.ts` provided by Nova *(Created `pipes/indexer.ts` with full implementation)*
- [x] Pull Uniswap V2 `Swap` events for WETH/USDC
- [x] Extract block, txHash, tokenIn, tokenOut → derive price & volume
- [x] Store output as JSON or expose as endpoint *(Outputs to `swap_data.json`)*
- [ ] Confirm SQD integration is working for backtesting *(Ready for testing - run `npm install && npx tsx indexer.ts` in `pipes/` directory)*

### 2. Astro Integration (Parallel)
- [ ] Install `astronomia` (`npm install astronomia`)
- [ ] Create `astro/today.ts` that calculates:
  - Current moon phase
  - Retrograde state (Mercury)
  - Jupiter/Mars aspects (optional)
- [ ] Output to `astro_today_index.json` (see mock)

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
