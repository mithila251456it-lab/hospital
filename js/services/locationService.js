/**
 * HospitalityHub B2B Resource Exchange
 * Location Service — Strict MMR (Mumbai Metropolitan Region) Scope
 * 
 * Centralized location registry and distance calculators strictly restricted
 * to valid municipal corporations and planning zones of the MMR.
 */

(function(window) {
  'use strict';

  // Central Logistics Depot (Bandra-Kurla Complex)
  const BKC_COORDINATES = { lat: 19.0674, lng: 72.8687 };

  // MMR Structured Locations & Clusters
  const MMR_REGIONS_DATA = [
    {
      name: "All Locations (MMR)",
      district: "All MMR",
      cluster: "Entire MMR",
      coordinates: BKC_COORDINATES,
      isAll: true
    },
    // 1. Mumbai South & Central
    {
      name: "Lower Parel, Mumbai",
      district: "Mumbai City",
      cluster: "South & Central Mumbai",
      coordinates: { lat: 18.9986, lng: 72.8311 },
      hubs: ["Phoenix Palladium", "Senapati Bapat Marg", "Kamala Mills"]
    },
    {
      name: "Dadar West, Mumbai",
      district: "Mumbai City",
      cluster: "South & Central Mumbai",
      coordinates: { lat: 19.0178, lng: 72.8478 },
      hubs: ["Shivaji Park", "Dadar Central Depot"]
    },
    {
      name: "Colaba & Fort, Mumbai",
      district: "Mumbai City",
      cluster: "South & Central Mumbai",
      coordinates: { lat: 18.9220, lng: 72.8347 },
      hubs: ["Nariman Point", "Cuffe Parade", "Heritage Hotel Belt"]
    },
    {
      name: "Worli, Mumbai",
      district: "Mumbai City",
      cluster: "South & Central Mumbai",
      coordinates: { lat: 19.0134, lng: 72.8153 },
      hubs: ["Worli Seaface", "Nehru Centre Banquets"]
    },
    
    // 2. Mumbai Western Suburbs
    {
      name: "Bandra West, Mumbai",
      district: "Mumbai Suburban",
      cluster: "Western Suburbs",
      coordinates: { lat: 19.0596, lng: 72.8295 },
      hubs: ["Pali Hill", "Carter Road", "Bandra Reclamation"]
    },
    {
      name: "Bandra Kurla Complex (BKC), Mumbai",
      district: "Mumbai Suburban",
      cluster: "Western Suburbs",
      coordinates: BKC_COORDINATES,
      hubs: ["Jio World Convention Centre", "BKC Expo Grounds"]
    },
    {
      name: "Andheri East, Mumbai",
      district: "Mumbai Suburban",
      cluster: "Western Suburbs",
      coordinates: { lat: 19.1136, lng: 72.8697 },
      hubs: ["MIDC Industrial Estate", "International Airport Cargo Terminal", "Sahar"]
    },
    {
      name: "Andheri West, Mumbai",
      district: "Mumbai Suburban",
      cluster: "Western Suburbs",
      coordinates: { lat: 19.1363, lng: 72.8277 },
      hubs: ["Lokhandwala", "Versova Event Studios", "Link Road"]
    },
    {
      name: "Malad & Goregaon, Mumbai",
      district: "Mumbai Suburban",
      cluster: "Western Suburbs",
      coordinates: { lat: 19.1860, lng: 72.8485 },
      hubs: ["Bombay Exhibition Centre (NESCO)", "Mindspace", "Film City"]
    },
    {
      name: "Borivali West, Mumbai",
      district: "Mumbai Suburban",
      cluster: "Western Suburbs",
      coordinates: { lat: 19.2307, lng: 72.8567 },
      hubs: ["Shimpoli Banquets", "Link Road Event Corridor"]
    },
    
    // 3. Mumbai Eastern Suburbs
    {
      name: "Ghatkopar West, Mumbai",
      district: "Mumbai Suburban",
      cluster: "Eastern Suburbs",
      coordinates: { lat: 19.0860, lng: 72.9090 },
      hubs: ["LBS Marg Commercial Kitchens", "R City Banquet Corridor"]
    },
    {
      name: "Kurla & Chembur, Mumbai",
      district: "Mumbai Suburban",
      cluster: "Eastern Suburbs",
      coordinates: { lat: 19.0728, lng: 72.8986 },
      hubs: ["Phoenix Marketcity Event Arena", "Eastern Freeway Connector"]
    },
    {
      name: "Powai, Mumbai",
      district: "Mumbai Suburban",
      cluster: "Eastern Suburbs",
      coordinates: { lat: 19.1197, lng: 72.9051 },
      hubs: ["Hiranandani Hospitality Zone", "Lakeside Venues"]
    },
    {
      name: "Mulund West, Mumbai",
      district: "Mumbai Suburban",
      cluster: "Eastern Suburbs",
      coordinates: { lat: 19.1726, lng: 72.9425 },
      hubs: ["Nirmal Corporate Hub", "Eastern Express Corridor"]
    },

    // 4. Thane District
    {
      name: "Majiwada, Thane",
      district: "Thane",
      cluster: "Thane & Ghodbunder",
      coordinates: { lat: 19.2183, lng: 72.9781 },
      hubs: ["Viviana Banquets Zone", "Eastern Express Highway Hub"]
    },
    {
      name: "Ghodbunder Road, Thane",
      district: "Thane",
      cluster: "Thane & Ghodbunder",
      coordinates: { lat: 19.2635, lng: 72.9463 },
      hubs: ["Resort Lawns Corridor", "Gaimukh Staging Hub"]
    },
    {
      name: "Kalyan West, Thane",
      district: "Thane",
      cluster: "Kalyan-Dombivli-Bhiwandi",
      coordinates: { lat: 19.2437, lng: 73.1355 },
      hubs: ["Kalyan APMC Hospitality Base", "Gandhar Nagar Banquets"]
    },
    {
      name: "Dombivli East, Thane",
      district: "Thane",
      cluster: "Kalyan-Dombivli-Bhiwandi",
      coordinates: { lat: 19.2184, lng: 73.0867 },
      hubs: ["MIDC Phase II Staging Depot", "Manpada Lawns"]
    },
    {
      name: "Bhiwandi Industrial Hub",
      district: "Thane",
      cluster: "Kalyan-Dombivli-Bhiwandi",
      coordinates: { lat: 19.2967, lng: 73.0631 },
      hubs: ["Anjur Phata Cold Storage", "Mankoli Warehousing Park", "Dapoda Logistics Hub"]
    },
    {
      name: "Ulhasnagar, Thane",
      district: "Thane",
      cluster: "Kalyan-Dombivli-Bhiwandi",
      coordinates: { lat: 19.2215, lng: 73.1645 },
      hubs: ["Furniture & Staging Depot", "Camp 3 Banquets"]
    },

    // 5. Navi Mumbai
    {
      name: "Vashi, Navi Mumbai",
      district: "Navi Mumbai",
      cluster: "Navi Mumbai",
      coordinates: { lat: 19.0771, lng: 72.9986 },
      hubs: ["CIDCO Exhibition Centre", "Sector 30A Hospitality District", "APMC Market"]
    },
    {
      name: "Panvel, Navi Mumbai",
      district: "Navi Mumbai",
      cluster: "Navi Mumbai",
      coordinates: { lat: 18.9894, lng: 73.1175 },
      hubs: ["Palaspa Logistics Junction", "Navi Mumbai Airport Zone", "Khandeshwar Lawns"]
    },
    {
      name: "Belapur & Nerul, Navi Mumbai",
      district: "Navi Mumbai",
      cluster: "Navi Mumbai",
      coordinates: { lat: 19.0282, lng: 73.0258 },
      hubs: ["CBD Belapur Corporate Venues", "Palm Beach Road Banquets"]
    },
    {
      name: "Airoli & Mahape, Navi Mumbai",
      district: "Navi Mumbai",
      cluster: "Navi Mumbai",
      coordinates: { lat: 19.1551, lng: 73.0033 },
      hubs: ["Millennium Business Park", "TTC Industrial Cloud Kitchens"]
    },

    // 6. Extended Northern MMR
    {
      name: "Mira Road & Bhayandar",
      district: "Thane",
      cluster: "Extended Northern MMR",
      coordinates: { lat: 19.2812, lng: 72.8561 },
      hubs: ["Kanakia Catering Cluster", "Western Express Link"]
    },
    {
      name: "Vasai East, Extended MMR",
      district: "Palghar (MMR)",
      cluster: "Extended Northern MMR",
      coordinates: { lat: 19.3919, lng: 72.8397 },
      hubs: ["Navghar Industrial Staging", "Vasai Power Equipment Base"]
    },
    {
      name: "Virar West, Extended MMR",
      district: "Palghar (MMR)",
      cluster: "Extended Northern MMR",
      coordinates: { lat: 19.4674, lng: 72.8028 },
      hubs: ["Arnala Beachfront Resorts", "Agashi Lawns"]
    }
  ];

  const LocationService = {
    // Return all valid MMR locations as plain string array
    getLocationsList: function() {
      return MMR_REGIONS_DATA.map(loc => loc.name);
    },

    // Return detailed metadata for all MMR regions
    getAllRegions: function() {
      return MMR_REGIONS_DATA;
    },

    // Return unique clusters (for grouping in UI)
    getClusters: function() {
      const clusters = {};
      MMR_REGIONS_DATA.filter(loc => !loc.isAll).forEach(loc => {
        if (!clusters[loc.cluster]) {
          clusters[loc.cluster] = [];
        }
        clusters[loc.cluster].push(loc);
      });
      return clusters;
    },

    // Verify if location is within authorized MMR boundaries
    isValidMMRLocation: function(locationName) {
      if (!locationName) return false;
      const clean = locationName.trim().toLowerCase();
      if (clean.includes('all locations')) return true;
      return MMR_REGIONS_DATA.some(loc => 
        loc.name.toLowerCase().includes(clean) || clean.includes(loc.name.toLowerCase())
      );
    },

    // Get coordinates for given MMR location
    getCoordinates: function(locationName) {
      const found = MMR_REGIONS_DATA.find(loc => loc.name === locationName);
      if (found) return found.coordinates;
      return BKC_COORDINATES;
    },

    // Calculate real Haversine distance in KM
    calculateDistanceKm: function(coord1, coord2) {
      if (!coord1 || !coord2) return 5.0;
      const lat1 = coord1.lat || BKC_COORDINATES.lat;
      const lon1 = coord1.lng || BKC_COORDINATES.lng;
      const lat2 = coord2.lat || BKC_COORDINATES.lat;
      const lon2 = coord2.lng || BKC_COORDINATES.lng;

      const R = 6371; // Earth radius in KM
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Math.round(R * c * 10) / 10;
    },

    // Search MMR locations with query
    searchLocations: function(query) {
      if (!query || !query.trim()) return MMR_REGIONS_DATA;
      const q = query.trim().toLowerCase();
      return MMR_REGIONS_DATA.filter(loc => 
        loc.name.toLowerCase().includes(q) ||
        loc.district.toLowerCase().includes(q) ||
        loc.cluster.toLowerCase().includes(q) ||
        (loc.hubs && loc.hubs.some(h => h.toLowerCase().includes(q)))
      );
    }
  };

  if (typeof window !== 'undefined') {
    window.locationService = LocationService;
    window.MMR_REGIONS = LocationService.getLocationsList();
  }
  if (typeof global !== 'undefined') {
    global.locationService = LocationService;
    global.MMR_REGIONS = LocationService.getLocationsList();
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocationService;
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
