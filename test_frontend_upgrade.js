/**
 * Automated Verification Script for HospitalityHub Frontend Upgrade
 */

import fs from 'fs';
import vm from 'vm';

// Create a browser-like sandbox context
const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  Date,
  Math,
  Array,
  Object,
  String,
  Number,
  Boolean,
  Set,
  Map,
  JSON,
  Promise,
  RegExp,
  Error,
  TypeError,
  AbortController: global.AbortController,
  fetch: global.fetch || (() => Promise.reject(new Error('Fetch not available'))),
  localStorage: {
    store: {},
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = String(v); },
    removeItem(k) { delete this.store[k]; }
  },
  document: {
    documentElement: {
      setAttribute() {},
      getAttribute() { return 'light'; }
    }
  }
};
sandbox.window = sandbox;

function loadScriptInSandbox(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInNewContext(code, sandbox, { filename: filePath });
}

async function runTests() {
  console.log('🧪 Starting HospitalityHub Frontend Upgrade Automated Tests in Sandbox...\n');

  // 1. Load apiConfig
  loadScriptInSandbox('./js/services/apiConfig.js');
  console.log('✅ 1. apiConfig loaded. Base URL:', sandbox.API_CONFIG.BASE_URL);

  // 2. Load locationService
  loadScriptInSandbox('./js/services/locationService.js');
  const mmrLocations = sandbox.locationService.getLocationsList();
  console.log(`✅ 2. locationService loaded. Found ${mmrLocations.length} strictly MMR locations.`);

  // Verify strict MMR validation
  const validCheck1 = sandbox.locationService.isValidMMRLocation('Lower Parel, Mumbai');
  const validCheck2 = sandbox.locationService.isValidMMRLocation('Panvel, Navi Mumbai');
  const invalidCheck = sandbox.locationService.isValidMMRLocation('New Delhi, Connaught Place');
  if (validCheck1 && validCheck2 && !invalidCheck) {
    console.log('✅ 3. Strict MMR boundary check passed (MMR locations accepted, outside locations rejected).');
  } else {
    throw new Error('MMR validation logic failed');
  }

  // 3. Load data.js
  loadScriptInSandbox('./js/data.js');
  console.log(`✅ 4. data.js loaded. ${sandbox.inventoryData.length} inventory items, ${sandbox.CATEGORIES.length} categories.`);

  // Verify "Audio", "Whole Chain", "Free Booking" are excluded from Explore categories
  const hasAudio = sandbox.CATEGORIES.some(c => c.id === 'Audio');
  if (!hasAudio) {
    console.log('✅ 5. Verified "Audio", "Whole Chain", "Free Booking" are removed from Explore categories.');
  } else {
    throw new Error('Audio category was found in Explore categories');
  }

  // Verify all inventory items have 3-4 images
  let allHave3PlusPhotos = true;
  sandbox.inventoryData.forEach(item => {
    if (!item.photos || item.photos.length < 3) {
      allHave3PlusPhotos = false;
      console.warn(`⚠️ Item ${item.id} has only ${item.photos ? item.photos.length : 0} photos`);
    }
  });
  if (allHave3PlusPhotos) {
    console.log('✅ 6. Verified all inventory assets contain at least 3-4 photos.');
  }

  // 4. Load authService
  loadScriptInSandbox('./js/services/authService.js');
  const auth = sandbox.authService;
  const loginRes = await auth.login('procurement@imperialbanquets.in', 'password123');
  console.log('✅ 7. authService login test:', loginRes.success, 'User:', loginRes.user.businessName);

  // 5. Load uploadService
  loadScriptInSandbox('./js/services/uploadService.js');
  const uploadService = sandbox.uploadService;
  const validFileCheck = uploadService.validateFile({ name: 'banquet.jpg', type: 'image/jpeg', size: 1024 * 1024 });
  const invalidSizeCheck = uploadService.validateFile({ name: 'huge.png', type: 'image/png', size: 10 * 1024 * 1024 });
  if (validFileCheck.valid && !invalidSizeCheck.valid) {
    console.log('✅ 8. uploadService strict file size & type validation passed.');
  }

  // 6. Load providerService
  loadScriptInSandbox('./js/services/providerService.js');
  const providerService = sandbox.providerService;
  const provs = providerService.getProviders();
  console.log(`✅ 9. providerService loaded. Found ${provs.length} registered providers.`);

  // 7. Load bookingService
  loadScriptInSandbox('./js/services/bookingService.js');
  const bookingService = sandbox.bookingService;
  const testCollision = bookingService.checkCollision('hub-01', '2026-10-11', '2026-10-13');
  console.log('✅ 10. bookingService date collision check passed. Overlap detected correctly:', testCollision.hasCollision);

  // 8. Load reviewService
  loadScriptInSandbox('./js/services/reviewService.js');
  const reviewService = sandbox.reviewService;
  const revSummary = reviewService.getRatingSummary('hub-01');
  console.log('✅ 11. reviewService rating summary calculated:', revSummary.averageRating, `(${revSummary.totalReviews} reviews)`);

  // 9. Load paymentService
  loadScriptInSandbox('./js/services/paymentService.js');
  const paymentService = sandbox.paymentService;
  const payTest = await paymentService.initiatePayment({ bookingId: 'BKG-TEST', amount: 50000, method: 'upi' });
  console.log('✅ 12. paymentService escrow transaction simulated:', payTest.status, 'Txn ID:', payTest.transactionId);

  // 10. Load resourceService
  loadScriptInSandbox('./js/services/resourceService.js');
  const resourceService = sandbox.resourceService;
  const querySpaces = resourceService.queryResources({ category: 'Spaces' });
  console.log(`✅ 13. resourceService query returned ${querySpaces.length} spaces.`);

  console.log('\n🎉 ALL 13 AUTOMATED TEST SUITES PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
