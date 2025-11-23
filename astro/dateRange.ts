/**
 * Astrological Conditions Generator for Date Range
 * 
 * Generates astrological data for a range of dates (useful for backtesting).
 * 
 * Usage:
 *   npx tsx dateRange.ts 2024-01-01 2024-12-31
 *   npx tsx dateRange.ts --start 2024-01-01 --end 2024-12-31
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as julian from 'astronomia/src/julian';
import * as moonposition from 'astronomia/src/moonposition';
import * as solar from 'astronomia/src/solar';
import * as planetposition from 'astronomia/src/planetposition';

// ... (include all the helper functions from today.ts)
// For brevity, I'll reference today.ts functions

// Import types and functions from today.ts
// In a real implementation, you'd extract these to a shared module

interface AstroData {
  date: string;
  moon_phase: string;
  mercury_retrograde: boolean;
  jupiter_mars_conjunction: boolean;
  astro_rating: string;
}

/**
 * Normalize angle to 0-360 range
 */
function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

/**
 * Get moon phase name from phase value (0-1)
 */
function getMoonPhaseName(phaseValue: number): string {
  if (phaseValue < 0.03125) return 'New Moon';
  if (phaseValue < 0.21875) return 'Waxing Crescent';
  if (phaseValue < 0.28125) return 'First Quarter';
  if (phaseValue < 0.46875) return 'Waxing Gibbous';
  if (phaseValue < 0.53125) return 'Full Moon';
  if (phaseValue < 0.71875) return 'Waning Gibbous';
  if (phaseValue < 0.78125) return 'Last Quarter';
  return 'Waning Crescent';
}

/**
 * Check if Mercury is retrograde
 */
function isMercuryRetrograde(jd: number): boolean {
  const mercury1 = planetposition.mercury(jd - 1);
  const mercury2 = planetposition.mercury(jd);
  const mercury3 = planetposition.mercury(jd + 1);
  
  // Check if longitude decreases (backward motion)
  const lon1 = normalizeAngle(mercury1.lon);
  const lon2 = normalizeAngle(mercury2.lon);
  const lon3 = normalizeAngle(mercury3.lon);
  
  // Retrograde if longitude decreases
  return (lon2 < lon1 && lon3 < lon2) || (lon2 > lon1 && lon3 < lon2 && Math.abs(lon3 - lon1) > 180);
}

/**
 * Check if Jupiter and Mars are conjunct (within 10 degrees)
 */
function isJupiterMarsConjunction(jd: number): boolean {
  const jupiter = planetposition.jupiter(jd);
  const mars = planetposition.mars(jd);
  
  const jupiterLon = normalizeAngle(jupiter.lon);
  const marsLon = normalizeAngle(mars.lon);
  
  const angularDistance = Math.abs(jupiterLon - marsLon);
  const minDistance = Math.min(angularDistance, 360 - angularDistance);
  
  return minDistance <= 10; // Within 10 degrees
}

/**
 * Generate astro rating
 */
function generateAstroRating(
  moonPhase: string,
  mercuryRetrograde: boolean,
  jupiterMarsConjunction: boolean
): string {
  if (moonPhase === 'Full Moon' && jupiterMarsConjunction) {
    return 'Amplified Forces 🪐';
  }
  if (moonPhase === 'New Moon' && !mercuryRetrograde) {
    return 'Calm and Collected 🌑';
  }
  if (mercuryRetrograde && moonPhase === 'Full Moon') {
    return 'Chaotic Neutral 🌕';
  }
  if (mercuryRetrograde) {
    return 'Retrograde Turbulence ☿';
  }
  if (jupiterMarsConjunction) {
    return 'Planetary Alignment 🪐';
  }
  return 'Moderate Energy 🌗';
}

/**
 * Calculate astro data for a single date
 */
function calculateAstroForDate(dateStr: string): AstroData {
  const [year, month, day] = dateStr.split('-').map(Number);
  const jd = julian.CalendarGregorianToJD(year, month, day);
  
  const moonPos = moonposition.position(jd);
  const sunLon = solar.apparentLongitude(jd);
  const phaseAngle = normalizeAngle(moonPos.lon - sunLon);
  const moonPhaseValue = phaseAngle / 360;
  const moonPhaseName = getMoonPhaseName(moonPhaseValue);
  
  const mercuryRetrograde = isMercuryRetrograde(jd);
  const jupiterMarsConjunction = isJupiterMarsConjunction(jd);
  const astroRating = generateAstroRating(moonPhaseName, mercuryRetrograde, jupiterMarsConjunction);
  
  return {
    date: dateStr,
    moon_phase: moonPhaseName,
    mercury_retrograde: mercuryRetrograde,
    jupiter_mars_conjunction: jupiterMarsConjunction,
    astro_rating: astroRating,
  };
}

/**
 * Generate date range
 */
function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }
  
  return dates;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  let startDate: string;
  let endDate: string;
  
  if (args[0] === '--start' && args[1] && args[2] === '--end' && args[3]) {
    startDate = args[1];
    endDate = args[3];
  } else if (args[0] && args[1]) {
    startDate = args[0];
    endDate = args[1];
  } else {
    console.error('Usage: npx tsx dateRange.ts <start_date> <end_date>');
    console.error('   or: npx tsx dateRange.ts --start YYYY-MM-DD --end YYYY-MM-DD');
    console.error('Example: npx tsx dateRange.ts 2024-01-01 2024-12-31');
    process.exit(1);
  }
  
  console.log(`🌙 Generating astrological data for ${startDate} to ${endDate}...\n`);
  
  const dates = getDateRange(startDate, endDate);
  const astroData: AstroData[] = [];
  
  let processed = 0;
  for (const date of dates) {
    astroData.push(calculateAstroForDate(date));
    processed++;
    
    if (processed % 30 === 0) {
      console.log(`   Processed ${processed}/${dates.length} dates...`);
    }
  }
  
  // Output to file (one entry per date, indexed by date)
  const outputPath = join(__dirname, 'astro_date_range_index.json');
  writeFileSync(outputPath, JSON.stringify(astroData, null, 2));
  
  console.log(`\n✅ Generated astrological data for ${astroData.length} dates`);
  console.log(`📁 Output written to: ${outputPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Full Moons: ${astroData.filter(d => d.moon_phase === 'Full Moon').length}`);
  console.log(`   New Moons: ${astroData.filter(d => d.moon_phase === 'New Moon').length}`);
  console.log(`   Mercury Retrograde days: ${astroData.filter(d => d.mercury_retrograde).length}`);
  console.log(`   Jupiter-Mars Conjunctions: ${astroData.filter(d => d.jupiter_mars_conjunction).length}`);
}

main();

