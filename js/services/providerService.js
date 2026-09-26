/**
 * HospitalityHub B2B Resource Exchange
 * Provider Service & Business Verification System
 * 
 * Handles Provider verification applications, multi-tier compliance statuses
 * (Not Submitted, Pending Verification, Verified, Rejected),
 * and provider directory management across the MMR.
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'hub_providers_v3';

  // Seed verified MMR provider organizations
  const SEED_PROVIDERS = [
    {
      id: "prov-01",
      businessName: "Imperial Banquets & Hospitality Ltd",
      contactPerson: "Rajesh Malhotra",
      email: "procurement@imperialbanquets.in",
      phone: "+91 98200 12345",
      businessType: "Hotel & Banquet Venue",
      location: "Lower Parel, Mumbai",
      description: "South Mumbai's flagship luxury banqueting and event production infrastructure. 500-seater pillarless halls, industrial warming kitchens, and dedicated valet bays.",
      gstin: "27AAACI1234A1Z5",
      fssaiLicense: "11521001000452",
      tradeLicense: "TL-MUM-2024-88412",
      verificationStatus: "Verified",
      verified: true,
      rating: 4.9,
      reviewsCount: 42,
      completedRentals: 56,
      activeFleetCount: 4,
      joinedYear: "2023",
      photos: [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "prov-02",
      businessName: "The Westside Grand Hotel & Suites",
      contactPerson: "Anita Deshmukh",
      email: "events@westsidegrand.in",
      phone: "+91 98201 98765",
      businessType: "Hotel & Resort",
      location: "Bandra West, Mumbai",
      description: "Five-star corporate summit and luxury wedding destination featuring 4K projection suites, presidential hospitality lounges, and master executive chef kitchens.",
      gstin: "27AABCW5432D1Z9",
      fssaiLicense: "11522002000891",
      tradeLicense: "TL-MUM-2023-77219",
      verificationStatus: "Verified",
      verified: true,
      rating: 4.8,
      reviewsCount: 36,
      completedRentals: 48,
      activeFleetCount: 3,
      joinedYear: "2024",
      photos: [
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "prov-03",
      businessName: "Royal Kitchens & Equipment Depot",
      contactPerson: "Mahesh Kulkarni",
      email: "mahesh@royalkitchens.in",
      phone: "+91 98222 11223",
      businessType: "Catering Enterprise",
      location: "Ghatkopar West, Mumbai",
      description: "Specialist commercial culinary machinery rentals. Combi ovens, blast chillers, heavy gas banks, and 500-cover banquet crockery.",
      gstin: "27AABCR8765E1Z3",
      fssaiLicense: "11520003000674",
      tradeLicense: "TL-MUM-2022-44129",
      verificationStatus: "Verified",
      verified: true,
      rating: 4.9,
      reviewsCount: 38,
      completedRentals: 62,
      activeFleetCount: 5,
      joinedYear: "2022",
      photos: [
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1590725140246-20acdee442be?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "prov-04",
      businessName: "TransMMR Hospitality Fleet",
      contactPerson: "Sandeep Varma",
      email: "fleet@transmmr.in",
      phone: "+91 98211 54321",
      businessType: "Logistics & Cold Storage",
      location: "Panvel, Navi Mumbai",
      description: "MMR's dedicated hospitality logistics provider. Tail-lift heavy transport, temperature-monitored refrigerated vans, and executive VIP MPVs.",
      gstin: "27AABCT9876C1Z2",
      fssaiLicense: "N/A (Logistics)",
      tradeLicense: "TL-NVM-2023-33981",
      verificationStatus: "Verified",
      verified: true,
      rating: 4.9,
      reviewsCount: 47,
      completedRentals: 71,
      activeFleetCount: 6,
      joinedYear: "2023",
      photos: [
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "prov-05",
      businessName: "Metro Catering Logistics Network",
      contactPerson: "Girish Nair",
      email: "operations@metrocatering.in",
      phone: "+91 98203 77889",
      businessType: "Catering Enterprise",
      location: "Kalyan West, Thane",
      description: "Heavy-duty commercial cooking equipment and mobile gas batteries for banquet caterers across Thane, Kalyan, and Navi Mumbai.",
      gstin: "27AABCM3321F1Z6",
      fssaiLicense: "11523004000912",
      tradeLicense: "TL-THN-2024-11872",
      verificationStatus: "Verified",
      verified: true,
      rating: 4.8,
      reviewsCount: 29,
      completedRentals: 44,
      activeFleetCount: 3,
      joinedYear: "2024",
      photos: [
        "https://images.unsplash.com/photo-1590725140246-20acdee442be?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "prov-06",
      businessName: "ColdChain Express Depot",
      contactPerson: "Sameer Joshi",
      email: "sameer@coldchainexpress.in",
      phone: "+91 98208 44551",
      businessType: "Logistics & Cold Storage",
      location: "Bhiwandi Industrial Hub",
      description: "Industrial blast freezers, refrigerated transport containers, and HACCP certified cold chain logistics for banquet caterers.",
      gstin: "27AABCC6654G1Z8",
      fssaiLicense: "11521005000321",
      tradeLicense: "TL-THN-2023-99418",
      verificationStatus: "Verified",
      verified: true,
      rating: 4.8,
      reviewsCount: 27,
      completedRentals: 43,
      activeFleetCount: 4,
      joinedYear: "2023",
      photos: [
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
      ]
    },
    {
      id: "prov-07",
      businessName: "Grand Staging & Event Power",
      contactPerson: "Kunal Shah",
      email: "kunal@grandpower.in",
      phone: "+91 98219 88776",
      businessType: "Event Planner & Production",
      location: "Vasai East, Extended MMR",
      description: "Silent acoustic canopy diesel generators (125 kVA - 250 kVA) and waterproof German pagoda tent structures for mega events.",
      gstin: "27AABCG1199H1Z4",
      fssaiLicense: "N/A (Power & Staging)",
      tradeLicense: "TL-PLG-2024-55612",
      verificationStatus: "Verified",
      verified: true,
      rating: 4.9,
      reviewsCount: 53,
      completedRentals: 77,
      activeFleetCount: 5,
      joinedYear: "2022",
      photos: [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80"
      ]
    }
  ];

  class ProviderService {
    constructor() {
      this.providers = this.loadProviders();
    }

    loadProviders() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
      return SEED_PROVIDERS;
    }

    saveProviders() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.providers));
      } catch (e) {}
    }

    // Get all providers in MMR
    getProviders(filterLocation = 'All Locations (MMR)', filterType = 'All') {
      return this.providers.filter(prov => {
        const matchesLocation = !filterLocation || filterLocation === 'All Locations (MMR)' || prov.location === filterLocation;
        const matchesType = !filterType || filterType === 'All' || prov.businessType === filterType;
        return matchesLocation && matchesType;
      });
    }

    // Get provider by business name or ID
    getProviderByName(shopName) {
      if (!shopName) return null;
      return this.providers.find(p => p.businessName.toLowerCase() === shopName.toLowerCase()) || null;
    }

    getProviderById(id) {
      return this.providers.find(p => p.id === id) || null;
    }

    // Submit a Provider Verification Application
    async submitVerification(applicationData) {
      const {
        fullName,
        businessName,
        businessType,
        location,
        contactPhone,
        email,
        description,
        gstin,
        fssaiLicense,
        tradeLicense,
        photos
      } = applicationData;

      if (!fullName || !businessName || !email || !contactPhone || !location) {
        return { success: false, error: 'Please fill in all mandatory business identity fields.' };
      }

      if (window.locationService && !window.locationService.isValidMMRLocation(location)) {
        return { success: false, error: 'Business location must be within the Mumbai Metropolitan Region (MMR).' };
      }

      if (!photos || photos.length < 3 || photos.length > 4) {
        return { success: false, error: 'Please provide between 3 and 4 authentic high-resolution photos of your establishment/assets.' };
      }

      // Process new provider verification application
      const existingIdx = this.providers.findIndex(p => p.email.toLowerCase() === email.toLowerCase());
      const newProviderRecord = {
        id: existingIdx >= 0 ? this.providers[existingIdx].id : `prov-${Date.now()}`,
        contactPerson: fullName,
        businessName: businessName.trim(),
        businessType: businessType || 'Hotel & Banquet Venue',
        location: location,
        phone: contactPhone,
        email: email.toLowerCase(),
        description: description || 'Verified enterprise hospitality supplier in MMR.',
        gstin: gstin || '27XXXXX0000X1Z0',
        fssaiLicense: fssaiLicense || 'Pending Verification',
        tradeLicense: tradeLicense || 'Pending Verification',
        photos: photos.map(p => (typeof p === 'string' ? p : p.previewUrl || p.dataUrl || p.url)),
        verificationStatus: 'Pending Verification', // Critical: Never fake verified
        verified: false,
        rating: 5.0,
        reviewsCount: 0,
        completedRentals: 0,
        activeFleetCount: 1,
        joinedYear: new Date().getFullYear().toString(),
        submittedAt: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        this.providers[existingIdx] = newProviderRecord;
      } else {
        this.providers.push(newProviderRecord);
      }
      this.saveProviders();

      // Update active user profile if currently logged in
      if (window.authService && window.authService.getCurrentUser()) {
        const current = window.authService.getCurrentUser();
        if (current.email.toLowerCase() === email.toLowerCase()) {
          window.authService.updateProfile({
            businessName: newProviderRecord.businessName,
            businessType: newProviderRecord.businessType,
            location: newProviderRecord.location,
            phone: newProviderRecord.phone,
            verificationStatus: 'Pending Verification',
            verified: false,
            role: 'Provider',
            accountType: 'provider'
          });
        }
      }

      return {
        success: true,
        provider: newProviderRecord,
        message: 'Your verification dossier has been submitted. Our compliance team will review your GSTIN, trade license, and asset photos within 24 hours.'
      };
    }
  }

  if (typeof window !== 'undefined') {
    window.providerService = new ProviderService();
    window.SEED_PROVIDERS = SEED_PROVIDERS;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProviderService;
  }
})(typeof window !== 'undefined' ? window : global);
