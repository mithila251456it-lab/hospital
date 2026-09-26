/**
 * HospitalityHub B2B Resource Exchange — Server-Side MMR Location Whitelist
 * 
 * Mirrors the frontend locationService.js to re-verify all incoming locations
 * strictly within the Mumbai Metropolitan Region (MMR).
 */

export const VALID_MMR_LOCATIONS = [
  "All Locations (MMR)",
  "Lower Parel, Mumbai",
  "Dadar West, Mumbai",
  "Colaba & Fort, Mumbai",
  "Worli, Mumbai",
  "Bandra West, Mumbai",
  "Bandra Kurla Complex (BKC), Mumbai",
  "Andheri East, Mumbai",
  "Andheri West, Mumbai",
  "Malad & Goregaon, Mumbai",
  "Borivali West, Mumbai",
  "Ghatkopar West, Mumbai",
  "Kurla & Chembur, Mumbai",
  "Powai, Mumbai",
  "Mulund West, Mumbai",
  "Majiwada, Thane",
  "Ghodbunder Road, Thane",
  "Kalyan West, Thane",
  "Dombivli East, Thane",
  "Bhiwandi Industrial Hub",
  "Ulhasnagar, Thane",
  "Vashi, Navi Mumbai",
  "Panvel, Navi Mumbai",
  "Belapur & Nerul, Navi Mumbai",
  "Airoli & Mahape, Navi Mumbai",
  "Mira Road & Bhayandar",
  "Vasai East, Extended MMR",
  "Virar West, Extended MMR"
];

/**
 * Validate whether a given location string is within authorized MMR boundaries
 */
export function isValidMMRLocation(locationName) {
  if (!locationName || typeof locationName !== 'string') return false;
  const clean = locationName.trim().toLowerCase();
  if (clean === 'all locations (mmr)') return true;
  
  return VALID_MMR_LOCATIONS.some(loc => {
    const locClean = loc.toLowerCase();
    return locClean.includes(clean) || clean.includes(locClean) || clean.includes('mumbai') || clean.includes('thane') || clean.includes('navi mumbai') || clean.includes('bhiwandi') || clean.includes('kalyan') || clean.includes('dombivli') || clean.includes('vasai') || clean.includes('virar') || clean.includes('panvel');
  });
}
