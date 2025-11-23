/**
 * Galactic Alpha - Astrological Conditions Engine
 * 
 * This script calculates today's astrological conditions including:
 * - Moon phase
 * - Mercury retrograde status
 * - Jupiter-Mars conjunction (within 10 degrees)
 * - Astro rating based on these conditions
 * 
 * Usage:
 *   npm install
 *   npx tsx today.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { julian, moonposition, solar, planetposition, data } from 'astronomia';

/**
 * Interface for the output data format
 */
interface AstroData {
  date: string;
  moon_phase: string;
  mercury_retrograde: boolean;
  jupiter_mars_conjunction: boolean;
  astro_rating: string;
}

/**
 * Normalizes an angle to 0-360 degrees
 */
function normalizeAngle(angle: number): number {
  while (angle < 0) angle += 360;
  while (angle >= 360) angle -= 360;
  return angle;
}

/**
 * Calculates the angular distance between two celestial longitudes
 * Returns the smallest angle between them (0-180 degrees)
 */
function angularDistance(lon1: number, lon2: number): number {
  const diff = Math.abs(normalizeAngle(lon1) - normalizeAngle(lon2));
  return Math.min(diff, 360 - diff);
}

/**
 * Determines the moon phase name from the phase value
 * Phase values: 0 = New Moon, 0.25 = First Quarter, 0.5 = Full Moon, 0.75 = Last Quarter
 */
function getMoonPhaseName(phase: number): string {
  // Normalize phase to 0-1 range
  const normalizedPhase = phase % 1;
  
  if (normalizedPhase < 0.03 || normalizedPhase > 0.97) {
    return 'New Moon';
  } else if (normalizedPhase < 0.22) {
    return 'Waxing Crescent';
  } else if (normalizedPhase < 0.28) {
    return 'First Quarter';
  } else if (normalizedPhase < 0.47) {
    return 'Waxing Gibbous';
  } else if (normalizedPhase < 0.53) {
    return 'Full Moon';
  } else if (normalizedPhase < 0.72) {
    return 'Waning Gibbous';
  } else if (normalizedPhase < 0.78) {
    return 'Last Quarter';
  } else {
    return 'Waning Crescent';
  }
}

/**
 * Checks if Mercury is in retrograde motion
 * Compares positions over 3 days to detect backward motion
 */
function isMercuryRetrograde(jd: number): boolean {
  const mercury = new planetposition.Planet(data.vsop87Bearth, 'mercury');
  
  // Get positions for yesterday, today, and tomorrow
  const posYesterday = mercury.position(jd - 1);
  const posToday = mercury.position(jd);
  const posTomorrow = mercury.position(jd + 1);
  
  // Calculate the change in longitude
  const changeYesterdayToToday = normalizeAngle(posToday.lon) - normalizeAngle(posYesterday.lon);
  const changeTodayToTomorrow = normalizeAngle(posTomorrow.lon) - normalizeAngle(posToday.lon);
  
  // Handle wraparound at 360/0 degrees
  let delta1 = changeYesterdayToToday;
  if (delta1 > 180) delta1 -= 360;
  if (delta1 < -180) delta1 += 360;
  
  let delta2 = changeTodayToTomorrow;
  if (delta2 > 180) delta2 -= 360;
  if (delta2 < -180) delta2 += 360;
  
  // If both changes are negative, Mercury is retrograde
  // If the speed is decreasing and negative, it's retrograde
  return delta1 < 0 && delta2 < 0;
}

/**
 * Checks if Jupiter and Mars are conjunct (within 10 degrees)
 */
function isJupiterMarsConjunction(jd: number): boolean {
  const jupiter = new planetposition.Planet(data.vsop87Bearth, 'jupiter');
  const mars = new planetposition.Planet(data.vsop87Bearth, 'mars');
  
  const jupiterPos = jupiter.position(jd);
  const marsPos = mars.position(jd);
  
  // Calculate angular distance between the two planets
  const distance = angularDistance(jupiterPos.lon, marsPos.lon);
  
  // Conjunction is within 10 degrees
  return distance <= 10;
}

/**
 * Generates an astro rating based on the calculated conditions
 * Creates a narrative tag that describes the cosmic energy
 */
function generateAstroRating(
  moonPhase: string,
  mercuryRetrograde: boolean,
  jupiterMarsConjunction: boolean
): string {
  // Full Moon + Mercury Retrograde + Conjunction = Maximum chaos
  if (moonPhase === 'Full Moon' && mercuryRetrograde && jupiterMarsConjunction) {
    return 'Chaotic Neutral 🌕';
  }
  
  // Full Moon + Mercury Retrograde = High volatility
  if (moonPhase === 'Full Moon' && mercuryRetrograde) {
    return 'Volatile Energy 🌕';
  }
  
  // New Moon + No retrograde + No conjunction = Calm
  if (moonPhase === 'New Moon' && !mercuryRetrograde && !jupiterMarsConjunction) {
    return 'Calm and Collected 🌑';
  }
  
  // Mercury Retrograde alone = Communication challenges
  if (mercuryRetrograde) {
    return 'Retrograde Turbulence 🔁';
  }
  
  // Conjunction alone = Amplified energy
  if (jupiterMarsConjunction) {
    return 'Amplified Forces 🪐';
  }
  
  // Waning phases = Releasing energy
  if (moonPhase.includes('Waning')) {
    return 'Releasing Energy 🌘';
  }
  
  // Waxing phases = Building energy
  if (moonPhase.includes('Waxing')) {
    return 'Building Energy 🌒';
  }
  
  // Default neutral state
  return 'Moderate Energy 🌗';
}

/**
 * Main function to calculate and output astrological conditions
 */
function main() {
  console.log('🌙 Calculating astrological conditions for today...\n');
  
  // Get today's date
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JavaScript months are 0-indexed
  const day = today.getDate();
  
  // Convert to Julian Day Number
  const jd = julian.CalendarGregorianToJD(year, month, day);
  
  console.log(`📅 Date: ${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  console.log(`📊 Julian Day: ${jd.toFixed(2)}\n`);
  
  // Calculate moon phase using moon and sun positions
  const moonPos = moonposition.position(jd);
  const sunLon = solar.apparentLongitude(jd);
  // Phase angle: difference between moon and sun longitudes
  // Normalized to 0-360 degrees, then converted to 0-1 phase value
  const phaseAngle = normalizeAngle(moonPos.lon - sunLon);
  const moonPhaseValue = phaseAngle / 360;
  const moonPhaseName = getMoonPhaseName(moonPhaseValue);
  console.log(`🌙 Moon Phase: ${moonPhaseName} (phase: ${moonPhaseValue.toFixed(3)}, angle: ${phaseAngle.toFixed(2)}°)`);
  
  // Check Mercury retrograde status
  const mercuryRetrograde = isMercuryRetrograde(jd);
  console.log(`🔁 Mercury Retrograde: ${mercuryRetrograde ? 'Yes' : 'No'}`);
  
  // Check Jupiter-Mars conjunction
  const jupiterMarsConjunction = isJupiterMarsConjunction(jd);
  console.log(`🪐 Jupiter-Mars Conjunction: ${jupiterMarsConjunction ? 'Yes' : 'No'}`);
  
  // Generate astro rating
  const astroRating = generateAstroRating(moonPhaseName, mercuryRetrograde, jupiterMarsConjunction);
  console.log(`🧠 Astro Rating: ${astroRating}\n`);
  
  // Create output object
  const astroData: AstroData = {
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    moon_phase: moonPhaseName,
    mercury_retrograde: mercuryRetrograde,
    jupiter_mars_conjunction: jupiterMarsConjunction,
    astro_rating: astroRating,
  };
  
  // Write to JSON file
  const outputPath = join(process.cwd(), 'astro_today_index.json');
  writeFileSync(outputPath, JSON.stringify(astroData, null, 2));
  
  console.log(`✅ Astrological data saved to: ${outputPath}`);
  console.log('\n📄 Output:');
  console.log(JSON.stringify(astroData, null, 2));
}

// Run the main function
main();

