# Astro Module

Astrological Conditions Engine for calculating daily cosmic events and their potential impact on market behavior.

## Overview

This module uses the `astronomia` library to calculate:
- **Moon phase** (New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, Waning Crescent)
- **Mercury retrograde status** (detects backward planetary motion)
- **Jupiter-Mars conjunction** (checks if planets are within 10 degrees)
- **Astro rating** (narrative tag describing cosmic energy)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
   
   This will install `astronomia` - a Node.js ephemeris library for astronomical calculations.

2. **Run the script:**
   ```bash
   npx tsx today.ts
   ```
   
   Or use the npm script:
   ```bash
   npm run today
   ```

## Output Format

The script outputs `astro_today_index.json` with the following format:

```json
{
  "date": "2025-11-22",
  "moon_phase": "New Moon",
  "mercury_retrograde": false,
  "jupiter_mars_conjunction": true,
  "astro_rating": "Amplified Forces 🪐"
}
```

Where:
- `date`: Date in YYYY-MM-DD format
- `moon_phase`: Current moon phase name
- `mercury_retrograde`: Boolean indicating if Mercury is in retrograde motion
- `jupiter_mars_conjunction`: Boolean indicating if Jupiter and Mars are conjunct (within 10 degrees)
- `astro_rating`: Narrative tag describing the cosmic energy (e.g., "Chaotic Neutral 🌕", "Calm and Collected 🌑")

## How It Works

1. **Moon Phase Calculation**: 
   - Calculates the angular difference between the Moon's and Sun's ecliptic longitudes
   - Converts the phase angle (0-360°) to a phase value (0-1)
   - Classifies into one of 8 moon phases based on the phase value

2. **Mercury Retrograde Detection**:
   - Compares Mercury's longitude position over 3 consecutive days
   - Detects backward motion by checking if the planet's longitude decreases over time

3. **Jupiter-Mars Conjunction**:
   - Calculates the angular distance between Jupiter and Mars
   - Checks if the distance is within 10 degrees (conjunction threshold)

4. **Astro Rating Generation**:
   - Combines all conditions to generate a narrative tag
   - Ratings range from "Chaotic Neutral" (Full Moon + Retrograde + Conjunction) to "Calm and Collected" (New Moon + No retrograde + No conjunction)

## Astro Rating Examples

- **Chaotic Neutral 🌕**: Full Moon + Mercury Retrograde + Jupiter-Mars Conjunction
- **Volatile Energy 🌕**: Full Moon + Mercury Retrograde
- **Calm and Collected 🌑**: New Moon + No retrograde + No conjunction
- **Retrograde Turbulence 🔁**: Mercury Retrograde alone
- **Amplified Forces 🪐**: Jupiter-Mars Conjunction alone
- **Releasing Energy 🌘**: Waning moon phases
- **Building Energy 🌒**: Waxing moon phases
- **Moderate Energy 🌗**: Default neutral state

## Integration

This data will be used in:
- **Backtesting Joiner** (`backtester/joinAstro.ts`): Merges astro data with swap data for correlation analysis
- **Chart Overlays**: Visual indicators of astrological events on price charts
- **Vault Logic**: Trading strategies that respond to cosmic conditions
- **Sentiment Analysis**: Weighting market sentiment based on astrological events

## Notes

- Calculations use VSOP87 planetary theory for high accuracy
- All calculations are based on ecliptic coordinates (astronomical standard)
- The script calculates conditions for "today" (current date when run)
- For historical dates, modify the date in the script or add command-line arguments
- The `astronomia` library provides precise ephemeris data based on NASA JPL data

## Future Enhancements

- Add support for other retrograde planets (Venus, Mars)
- Include more planetary aspects (oppositions, squares, trines)
- Calculate planetary houses and zodiac signs
- Add support for lunar nodes and other astrological points
- Allow date range processing for historical analysis

