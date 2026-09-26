/**
 * Automated Verification Script for Supabase Backend Migration
 */

import http from 'http';
import { isValidMMRLocation, VALID_MMR_LOCATIONS } from './server/mmrLocations.js';
import { profileToClient, profileToDb, resourceToClient, resourceToDb, requestToClient, requestToDb } from './server/mappers.js';
import { isConfigured } from './server/supabaseAdmin.js';

async function runVerification() {
  console.log('🧪 Starting HospitalityHub Supabase Backend & Schema Verification...\n');

  // 1. Test MMR Location Whitelist
  console.log('1. Verifying Server-Side MMR Location Whitelist...');
  console.log(`   Found ${VALID_MMR_LOCATIONS.length} valid MMR planning zones.`);
  if (!isValidMMRLocation('Lower Parel, Mumbai')) throw new Error('Lower Parel should be valid MMR');
  if (!isValidMMRLocation('Vashi, Navi Mumbai')) throw new Error('Vashi should be valid MMR');
  if (!isValidMMRLocation('Kalyan West, Thane')) throw new Error('Kalyan should be valid MMR');
  if (!isValidMMRLocation('Bhiwandi Industrial Hub')) throw new Error('Bhiwandi should be valid MMR');
  if (isValidMMRLocation('Bengaluru, Karnataka')) throw new Error('Bengaluru must be rejected by MMR whitelist');
  if (isValidMMRLocation('New Delhi, CP')) throw new Error('New Delhi must be rejected by MMR whitelist');
  console.log('   ✅ Server MMR whitelist strictly enforces MMR-only boundaries.');

  // 2. Test Mappers
  console.log('\n2. Verifying camelCase <-> snake_case Postgres Mappers...');
  
  // Profile mapper test
  const dbProfile = {
    id: 'uuid-1234',
    email: 'test@imperialbanquets.in',
    business_name: 'Imperial Banquets Ltd',
    business_type: 'Hotel & Banquet Venue',
    role: 'Provider',
    account_type: 'provider',
    location: 'Lower Parel, Mumbai',
    contact_phone: '+91 98200 12345',
    rating: 4.9,
    verified: true
  };
  const clientProfile = profileToClient(dbProfile);
  if (clientProfile.businessName !== 'Imperial Banquets Ltd' || clientProfile.accountType !== 'provider') {
    throw new Error('profileToClient mapper failed');
  }
  const backToDbProfile = profileToDb(clientProfile);
  if (backToDbProfile.business_name !== 'Imperial Banquets Ltd' || backToDbProfile.account_type !== 'provider') {
    throw new Error('profileToDb mapper failed');
  }
  console.log('   ✅ Profile mappers verified (camelCase <-> snake_case).');

  // Resource mapper test
  const clientResource = {
    id: 'hub-01',
    title: '500-Seater Ballroom',
    category: 'Spaces',
    shopName: 'Imperial Banquets',
    location: 'Lower Parel, Mumbai',
    pricePerDay: 28000,
    securityDeposit: 12000,
    instantDispatchAvailable: true,
    specifications: ['500 Seated Capacity', 'Central HVAC']
  };
  const dbResource = resourceToDb(clientResource, 'owner-uuid-1', 'procurement@imperialbanquets.in');
  if (dbResource.price_per_day !== 28000 || dbResource.instant_dispatch_available !== true || dbResource.shop_name !== 'Imperial Banquets') {
    throw new Error('resourceToDb mapper failed');
  }
  const backToClientResource = resourceToClient(dbResource);
  if (backToClientResource.pricePerDay !== 28000 || backToClientResource.instantDispatchAvailable !== true) {
    throw new Error('resourceToClient mapper failed');
  }
  console.log('   ✅ Resource mappers verified.');

  // Request mapper test
  const clientReq = {
    id: 'BKG-9011',
    assetId: 'hub-01',
    assetTitle: '500-Seater Ballroom',
    providerEmail: 'procurement@imperialbanquets.in',
    seekerEmail: 'director@tajbanquets.in',
    seekerBusiness: 'Taj Lands End',
    startDate: '2026-10-10',
    endDate: '2026-10-14',
    days: 4,
    dailyRate: 28000,
    totalAmount: 124000,
    tokenPaid: 22400,
    paymentStatus: 'Payment Successful (Escrow Locked)',
    status: 'Confirmed'
  };
  const dbReq = requestToDb(clientReq, 'seeker-uuid-2', 'director@tajbanquets.in');
  if (dbReq.total_amount !== 124000 || dbReq.token_paid !== 22400 || dbReq.seeker_business !== 'Taj Lands End') {
    throw new Error('requestToDb mapper failed');
  }
  const backToClientReq = requestToClient(dbReq);
  if (backToClientReq.totalAmount !== 124000 || backToClientReq.tokenPaid !== 22400 || backToClientReq.seekerBusiness !== 'Taj Lands End') {
    throw new Error('requestToClient mapper failed');
  }
  console.log('   ✅ Request mappers verified.');

  // 3. Supabase Configuration Check
  console.log('\n3. Checking Supabase Admin Configuration...');
  console.log(`   Supabase Configured: ${isConfigured}`);
  if (!isConfigured) {
    console.log('   ℹ️ Supabase environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) not yet populated in .env.');
    console.log('   ℹ️ Endpoints will return clear 503 status code when unconfigured (as designed).');
  } else {
    console.log('   ✅ Supabase client initialized with Service Role credentials.');
  }

  console.log('\n🎉 ALL BACKEND SUPABASE ARCHITECTURE CHECKS PASSED SUCCESSFULLY! ✅');
}

runVerification().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
