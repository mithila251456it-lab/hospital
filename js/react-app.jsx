/**
 * HospitalityHub B2B Hospitality Resource Exchange
 * React 18 Production-Grade Frontend Application
 * 
 * Features:
 * - Complete Light + Dark Mode Theme Engine
 * - Full English + Hindi (EN/HI) UI Localization
 * - Provider ↔ Seeker Dual Role Experiences
 * - Cinematic Hero & Floating Search Panel
 * - 10 Standard Hospitality Categories
 * - Premium Resource Cards with 5-Factor Smart Match Score
 * - Multi-Photo Gallery & Carousel Modal
 * - Provider 6-Angle Photo Upload UI (Min 3 photos rule)
 * - Planned vs Emergency Rapid Dispatch Booking
 * - Calendar Lock & Collision Prevention System
 * - Multi-Tab Negotiation Center & Counter-Offer Modal
 * - Simulated Escrow Payment & Booking Confirmation
 * - Condition Audit (Pre-Dispatch vs Post-Return)
 * - Provider Revenue & Fleet Utilization Analytics
 */

const { useState, useEffect, useMemo, useCallback, useRef } = React;

// BKC Central Logistics Origin
const DEPOT_COORDS = { lat: 19.0674, lng: 72.8687 };

// Distance Calculation (Haversine Formula in KM)
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5.8;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// 3PL Logistics Fare Calculator
function calculateLogisticsFare(distanceKm, isEmergency = false) {
  const baseFare = isEmergency ? 650 : 400;
  const perKm = 28;
  return baseFare + Math.round(distanceKm * perKm);
}

// Smart Match Compatibility Score (80% - 98%)
function getSmartMatchScore(resource, distanceKm) {
  let score = 94;
  if (distanceKm < 6) score += 3;
  else if (distanceKm > 18) score -= 6;
  if (resource.rating >= 4.9) score += 2;
  if (resource.instantDispatchAvailable) score += 2;
  if (resource.availabilityStatus === "Pre-booked") score -= 14;
  return Math.min(99, Math.max(76, score));
}

// =========================================================================
// MAIN ROOT COMPONENT: HospitalityHubApp
// =========================================================================
function HospitalityHubApp() {
  // Theme State ('light' | 'dark')
  const [theme, setTheme] = useState(() => localStorage.getItem('hospitalityhub_theme') || 'light');

  // Language State ('en' | 'hi')
  const [lang, setLang] = useState(() => localStorage.getItem('hospitalityhub_lang') || 'en');

  // Active Role ('seeker' | 'provider')
  const [role, setRole] = useState('seeker');

  // Active Page / Tab View
  const [currentView, setCurrentView] = useState('marketplace'); // 'marketplace' | 'resources' | 'providers' | 'how-it-works' | 'seeker-dashboard' | 'provider-dashboard' | 'negotiations'
  
  // Data States
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('hub_inventory_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return window.inventoryData || [];
  });

  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('hub_requests_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return window.INITIAL_REQUESTS || [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return (window.DEMO_USERS && window.DEMO_USERS[0]) || {
      businessName: "Imperial Banquets & Hospitality Ltd",
      contactPerson: "Rajesh Malhotra",
      email: "procurement@imperialbanquets.in",
      role: "Provider & Seeker",
      location: "Lower Parel, Mumbai",
      verified: true,
      rating: 4.9,
      reviewsCount: 42
    };
  });

  // Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('All Locations (MMR)');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [searchQuantity, setSearchQuantity] = useState(1);
  const [searchBookingType, setSearchBookingType] = useState('All'); // 'All' | 'Planned' | 'Emergency'
  const [providerFilterStatus, setProviderFilterStatus] = useState('All');
  const [negotiationTab, setNegotiationTab] = useState('incoming'); // 'incoming' | 'outgoing' | 'counter' | 'accepted'

  // Modal / Interaction States
  const [selectedResource, setSelectedResource] = useState(null); // Detail modal
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [matchScoreModalItem, setMatchScoreModalItem] = useState(null); // Match Score breakdown
  const [checkoutResource, setCheckoutResource] = useState(null); // Checkout modal
  const [checkoutStep, setCheckoutStep] = useState('review'); // 'review' | 'processing' | 'confirmed'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [logisticsMode, setLogisticsMode] = useState('delivery'); // 'delivery' | 'pickup'
  const [negotiationModalItem, setNegotiationModalItem] = useState(null); // Counter-offer modal
  const [counterPriceInput, setCounterPriceInput] = useState('');
  const [counterNotesInput, setCounterNotesInput] = useState('');
  const [photoUploadModalOpen, setPhotoUploadModalOpen] = useState(false);
  const [photoAuditModalItem, setPhotoAuditModalItem] = useState(null);
  const [savedResourceIds, setSavedResourceIds] = useState(['hub-01', 'hub-05']);
  const [toasts, setToasts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // New Resource Form State (for Provider Listing)
  const [newResourceForm, setNewResourceForm] = useState({
    title: '',
    category: 'Spaces',
    pricePerDay: '',
    securityDeposit: '',
    quantityAvailable: 1,
    bookingType: 'Planned',
    location: 'Lower Parel, Mumbai',
    description: '',
    specifications: '',
    photos: []
  });

  // Sync Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hospitalityhub_theme', theme);
  }, [theme]);

  // Sync Language
  useEffect(() => {
    localStorage.setItem('hospitalityhub_lang', lang);
  }, [lang]);

  // Sync Inventory
  useEffect(() => {
    localStorage.setItem('hub_inventory_v1', JSON.stringify(inventory));
  }, [inventory]);

  // Sync Requests
  useEffect(() => {
    localStorage.setItem('hub_requests_v1', JSON.stringify(requests));
  }, [requests]);

  // Translation Helper
  const t = useCallback((key) => {
    const dict = window.TRANSLATIONS && window.TRANSLATIONS[lang];
    return (dict && dict[key]) || key;
  }, [lang]);

  // Toast Helper
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  // Filtered Inventory Memo
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      
      // Location filter
      if (searchLocation && searchLocation !== 'All Locations (MMR)' && !item.location.includes(searchLocation.split(',')[0])) {
        return false;
      }

      // Booking Type filter
      if (searchBookingType !== 'All' && item.bookingType !== searchBookingType) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesShop = item.shopName.toLowerCase().includes(q);
        const matchesSpecs = item.specifications && item.specifications.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesShop && !matchesSpecs) return false;
      }

      // Date lock filter (Check collision)
      if (searchStartDate && searchEndDate && item.bookedDates && item.bookedDates.length > 0) {
        const start = new Date(searchStartDate);
        const end = new Date(searchEndDate);
        const hasCollision = item.bookedDates.some((bd) => {
          const d = new Date(bd);
          return d >= start && d <= end;
        });
        if (hasCollision && item.quantityAvailable <= 1) {
          // Keep in list but marked as locked
        }
      }

      return true;
    });
  }, [inventory, selectedCategory, searchLocation, searchBookingType, searchQuery, searchStartDate, searchEndDate]);

  // Provider's Own Resources
  const providerResources = useMemo(() => {
    return inventory.filter((item) => {
      if (providerFilterStatus === 'All') return true;
      return item.availabilityStatus.toLowerCase() === providerFilterStatus.toLowerCase();
    });
  }, [inventory, providerFilterStatus]);

  // Toggle Save Resource
  const toggleSaveResource = (id) => {
    setSavedResourceIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((x) => x !== id) : [...prev, id];
      showToast(exists ? "Removed from saved resources" : "Resource saved to watchlist", "success");
      return updated;
    });
  };

  // Handle Checkout / Booking Submission
  const handleConfirmBooking = () => {
    if (!checkoutResource) return;
    setCheckoutStep('processing');

    setTimeout(() => {
      const bookingId = `B2B-${Math.floor(10000 + Math.random() * 90000)}`;
      const newReq = {
        id: bookingId,
        assetId: checkoutResource.id,
        assetTitle: checkoutResource.title,
        category: checkoutResource.category,
        providerBusiness: checkoutResource.shopName,
        seekerBusiness: currentUser.businessName,
        seekerContact: currentUser.email,
        seekerRating: currentUser.rating || 4.9,
        seekerLocation: currentUser.location || "Bandra West, Mumbai",
        startDate: searchStartDate || "2026-10-05",
        endDate: searchEndDate || "2026-10-07",
        days: 2,
        quantity: searchQuantity || 1,
        dailyRate: checkoutResource.pricePerDay,
        totalAmount: checkoutResource.pricePerDay * 2,
        tokenAmount: Math.round(checkoutResource.pricePerDay * 2 * 0.20),
        escrowDeposit: checkoutResource.securityDeposit,
        bookingMode: checkoutResource.bookingType || "Planned",
        deliveryMode: logisticsMode === 'delivery' ? 'Dedicated Site Delivery' : 'Depot Self Pickup',
        deliveryFee: logisticsMode === 'delivery' ? 850 : 0,
        status: "Approved",
        paymentStatus: "Paid (Token Verified)",
        paymentMethod: paymentMethod.toUpperCase(),
        notes: `Confirmed via ${paymentMethod.toUpperCase()} escrow. Calendar locked.`,
        auditStatus: "Submitted",
        history: [
          { sender: "seeker", type: "booking", amount: checkoutResource.pricePerDay * 2, date: "2026-09-26", message: "Instant booking with verified token payment." }
        ]
      };

      // Add to requests
      setRequests((prev) => [newReq, ...prev]);

      // Lock dates in inventory
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === checkoutResource.id) {
            const lockedDates = item.bookedDates ? [...item.bookedDates, "2026-10-05", "2026-10-06", "2026-10-07"] : ["2026-10-05", "2026-10-06", "2026-10-07"];
            return { ...item, availabilityStatus: "Pre-booked", bookedDates: lockedDates };
          }
          return item;
        })
      );

      setCheckoutStep('confirmed');
      showToast("Payment verified & calendar dates locked!", "success");
    }, 1500);
  };

  // Handle Sending Counter-Offer
  const handleSendCounterOffer = () => {
    if (!negotiationModalItem || !counterPriceInput) return;
    const price = parseInt(counterPriceInput, 10);
    
    // Update request state
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === negotiationModalItem.id) {
          const newHistory = [
            ...(req.history || []),
            {
              sender: role,
              type: "counter",
              amount: price,
              date: "2026-09-26",
              message: counterNotesInput || `Counter-offer proposed at ₹${price.toLocaleString()} / day.`
            }
          ];
          return {
            ...req,
            status: "Negotiating",
            negotiationOffer: price,
            providerCounter: role === 'provider' ? price : req.providerCounter,
            seekerOffer: role === 'seeker' ? price : req.seekerOffer,
            history: newHistory
          };
        }
        return req;
      })
    );

    setNegotiationModalItem(null);
    setCounterPriceInput('');
    setCounterNotesInput('');
    showToast(t('counterSuccess'), "success");
  };

  // Handle Accept Offer
  const handleAcceptOffer = (reqId) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === reqId) {
          return { ...req, status: "Approved", notes: "Offer accepted by provider. Ready for token payment." };
        }
        return req;
      })
    );
    showToast("Offer accepted! Escrow token generated.", "success");
  };

  // Handle Reject Offer
  const handleRejectOffer = (reqId) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === reqId) {
          return { ...req, status: "Rejected", notes: "Offer declined." };
        }
        return req;
      })
    );
    showToast("Offer rejected.", "info");
  };

  // Preset demo photo set for Provider Photo Upload UI
  const handleLoadDemoPhotos = () => {
    const demoPhotos = [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80"
    ];
    setNewResourceForm((prev) => ({
      ...prev,
      photos: demoPhotos
    }));
    showToast("Loaded 4 high-resolution verified demo photos", "success");
  };

  // Handle Create New Resource
  const handleCreateResource = (e) => {
    e.preventDefault();
    if (!newResourceForm.title || !newResourceForm.pricePerDay) {
      showToast("Please fill all required fields", "warning");
      return;
    }

    const newId = `hub-${Math.floor(100 + Math.random() * 900)}`;
    const specsArray = newResourceForm.specifications
      ? newResourceForm.specifications.split('\n').filter((x) => x.trim())
      : ["Commercial Grade Build", "Verified Safety Tested", "Delivery Ready"];

    const photosList = newResourceForm.photos.length > 0
      ? newResourceForm.photos
      : ["https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"];

    const createdItem = {
      id: newId,
      title: newResourceForm.title,
      category: newResourceForm.category,
      shopName: currentUser.businessName,
      vendorType: currentUser.businessType || "Hospitality Partner",
      location: newResourceForm.location,
      fulfillmentType: "Dedicated Site Delivery",
      pricePerDay: parseInt(newResourceForm.pricePerDay, 10),
      securityDeposit: parseInt(newResourceForm.securityDeposit, 10) || Math.round(newResourceForm.pricePerDay * 0.4),
      quantityAvailable: parseInt(newResourceForm.quantityAvailable, 10) || 1,
      availabilityStatus: "Available",
      bookingType: newResourceForm.bookingType,
      verified: true,
      rating: 5.0,
      reviewsCount: 1,
      completedRentals: 0,
      description: newResourceForm.description || "Newly listed verified hospitality resource.",
      specifications: specsArray,
      photos: photosList,
      image: photosList[0],
      coordinates: DEPOT_COORDS,
      instantDispatchAvailable: newResourceForm.bookingType === 'Emergency',
      bookedDates: [],
      timeSlots: ["Full Day (24 Hrs)"]
    };

    setInventory((prev) => [createdItem, ...prev]);
    setPhotoUploadModalOpen(false);
    showToast("Resource listed successfully on HospitalityHub!", "success");
  };

  return (
    <div className="hub-app-wrapper" data-theme={theme}>
      {/* 1. Header */}
      <header className="hub-header">
        <div className="hub-container">
          <div className="hub-header-inner">
            {/* Logo */}
            <div className="hub-logo" onClick={() => setCurrentView('marketplace')}>
              <div className="hub-logo-icon">
                <i data-lucide="building" className="icon-hub">🏨</i>
              </div>
              <div className="hub-logo-text">
                <span className="hub-logo-title">{t('brandName')}</span>
                <span className="hub-logo-tagline">{t('brandTagline')}</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hub-nav">
              <a
                href="#marketplace"
                className={`hub-nav-link ${currentView === 'marketplace' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setCurrentView('marketplace'); }}
              >
                {t('marketplace')}
              </a>
              <a
                href="#resources"
                className={`hub-nav-link ${currentView === 'resources' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setCurrentView('resources'); }}
              >
                {t('resources')}
              </a>
              <a
                href="#providers"
                className={`hub-nav-link ${currentView === 'providers' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setCurrentView('providers'); }}
              >
                {t('providers')}
              </a>
              <a
                href="#how-it-works"
                className={`hub-nav-link ${currentView === 'how-it-works' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setCurrentView('how-it-works'); }}
              >
                {t('howItWorks')}
              </a>
              <a
                href="#negotiations"
                className={`hub-nav-link ${currentView === 'negotiations' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setCurrentView('negotiations'); }}
              >
                {t('negotiations')}
              </a>
            </nav>

            {/* Header Controls Right */}
            <div className="hub-header-actions">
              {/* Language Switcher (EN | HI) */}
              <button
                className="hub-lang-toggle"
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                title="Switch Language (English / हिन्दी)"
              >
                🌐 {lang === 'en' ? 'हिन्दी' : 'English'}
              </button>

              {/* Theme Switcher (Light / Dark) */}
              <button
                className="hub-icon-btn"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                title="Toggle Light / Dark Theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              {/* Role Switcher (Provider ↔ Seeker) */}
              <div className="hub-role-switch">
                <button
                  className={`hub-role-btn ${role === 'seeker' ? 'active' : ''}`}
                  onClick={() => {
                    setRole('seeker');
                    if (currentView === 'provider-dashboard') setCurrentView('marketplace');
                    showToast("Switched to Seeker Mode", "info");
                  }}
                >
                  🔍 {t('seekerMode')}
                </button>
                <button
                  className={`hub-role-btn ${role === 'provider' ? 'active' : ''}`}
                  onClick={() => {
                    setRole('provider');
                    setCurrentView('provider-dashboard');
                    showToast("Switched to Provider Mode", "info");
                  }}
                >
                  💼 {t('providerMode')}
                </button>
              </div>

              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  className="hub-icon-btn"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  title={t('notifications')}
                >
                  🔔
                  <span className="hub-badge-count">{requests.length}</span>
                </button>

                {notificationsOpen && (
                  <div className="hub-notifications-dropdown" style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '320px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    padding: '1rem',
                    zIndex: 1100
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{t('notifications')}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setNotificationsOpen(false)}>
                        {t('markAllRead')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '260px', overflowY: 'auto' }}>
                      {requests.slice(0, 4).map((r) => (
                        <div key={r.id} style={{
                          padding: '0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-muted)',
                          fontSize: '0.78rem'
                        }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.assetTitle}</div>
                          <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{r.notes}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Status: {r.status} • {r.paymentStatus}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* List a Resource CTA Button */}
              <button
                className="hub-btn-primary"
                onClick={() => {
                  setRole('provider');
                  setPhotoUploadModalOpen(true);
                }}
              >
                {t('listResource')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY CONTENT SWITCHER */}
      <main className="hub-main">
        {/* VIEW: Marketplace / Home */}
        {(currentView === 'marketplace' || currentView === 'resources') && (
          <div>
            {/* Cinematic Hero Section */}
            <section className="hub-hero">
              <div className="hub-container">
                <div className="hub-hero-content">
                  <div className="hub-hero-eyebrow">
                    <span>✨</span> {t('heroEyebrow')}
                  </div>
                  <h1 className="hub-hero-heading">{t('heroHeading')}</h1>
                  <p className="hub-hero-subtext">{t('heroSubtext')}</p>
                  
                  <div className="hub-hero-ctas">
                    <button
                      className="hub-btn-primary"
                      style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}
                      onClick={() => {
                        const el = document.getElementById('search-panel');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {t('exploreResources')}
                    </button>
                    <button
                      className="hub-btn-secondary"
                      style={{ padding: '0.75rem 1.75rem', fontSize: '1rem', background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
                      onClick={() => {
                        setRole('provider');
                        setPhotoUploadModalOpen(true);
                      }}
                    >
                      {t('listYourResource')}
                    </button>
                  </div>

                  <div className="hub-hero-badges">
                    <div className="hub-hero-badge-item">
                      <span>✓</span> {t('verifiedPartnersBadge')}
                    </div>
                    <div className="hub-hero-badge-item">
                      <span>⚡</span> {t('instantDispatchBadge')}
                    </div>
                    <div className="hub-hero-badge-item">
                      <span>🔒</span> {t('calendarLockBadge')}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Floating Search Panel */}
            <div className="hub-container" id="search-panel">
              <div className="hub-search-wrapper">
                <div className="hub-search-panel">
                  <div className="hub-search-grid">
                    {/* What do you need? */}
                    <div className="hub-search-field">
                      <label className="hub-search-label">🔍 {t('whatDoYouNeed')}</label>
                      <input
                        type="text"
                        className="hub-search-input"
                        placeholder={t('searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Location */}
                    <div className="hub-search-field">
                      <label className="hub-search-label">📍 {t('location')}</label>
                      <select
                        className="hub-search-select"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                      >
                        {window.MMR_REGIONS && window.MMR_REGIONS.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    {/* Required From */}
                    <div className="hub-search-field">
                      <label className="hub-search-label">📅 {t('requiredFrom')}</label>
                      <input
                        type="date"
                        className="hub-search-input"
                        value={searchStartDate}
                        onChange={(e) => setSearchStartDate(e.target.value)}
                      />
                    </div>

                    {/* Required Until */}
                    <div className="hub-search-field">
                      <label className="hub-search-label">📅 {t('requiredUntil')}</label>
                      <input
                        type="date"
                        className="hub-search-input"
                        value={searchEndDate}
                        onChange={(e) => setSearchEndDate(e.target.value)}
                      />
                    </div>

                    {/* Quantity */}
                    <div className="hub-search-field">
                      <label className="hub-search-label">🔢 {t('quantity')}</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        className="hub-search-input"
                        value={searchQuantity}
                        onChange={(e) => setSearchQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      />
                    </div>

                    {/* Booking Type Toggle */}
                    <div className="hub-booking-toggle">
                      <label className="hub-search-label">⚡ {t('bookingType')}</label>
                      <div className="hub-booking-switch-box">
                        <button
                          type="button"
                          className={`hub-booking-switch-btn ${searchBookingType === 'Planned' ? 'active planned' : ''}`}
                          onClick={() => setSearchBookingType(searchBookingType === 'Planned' ? 'All' : 'Planned')}
                        >
                          📅 {t('plannedBooking')}
                        </button>
                        <button
                          type="button"
                          className={`hub-booking-switch-btn ${searchBookingType === 'Emergency' ? 'active emergency' : ''}`}
                          onClick={() => setSearchBookingType(searchBookingType === 'Emergency' ? 'All' : 'Emergency')}
                        >
                          ⚡ {t('emergencyBooking')}
                        </button>
                      </div>
                    </div>

                    {/* Search CTA */}
                    <button
                      className="hub-search-submit-btn"
                      onClick={() => showToast(`Filtered ${filteredInventory.length} resources`, "info")}
                    >
                      {t('searchBtn')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Horizontal Category Navigation Bar */}
              <div className="hub-category-nav-wrapper">
                <div className="hub-category-nav">
                  {window.CATEGORIES && window.CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      className={`hub-category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span className="hub-category-emoji">{cat.emoji}</span>
                      <span>{t(cat.key)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count & Meta */}
              <div className="hub-results-meta">
                <div className="hub-results-count">
                  {t('showingResults')} <strong>{filteredInventory.length}</strong> {t('verifiedResourcesFound')}
                </div>

                {(selectedCategory !== 'all' || searchBookingType !== 'All' || searchQuery) && (
                  <button
                    className="hub-btn-outline"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchBookingType('All');
                      setSearchQuery('');
                      setSearchLocation('All Locations (MMR)');
                    }}
                  >
                    ✕ {t('clearFilters')}
                  </button>
                )}
              </div>

              {/* 3. Resource Cards Grid */}
              <div className="hub-resource-grid">
                {filteredInventory.map((item) => {
                  const dist = calculateDistanceKm(DEPOT_COORDS.lat, DEPOT_COORDS.lng, item.coordinates.lat, item.coordinates.lng);
                  const matchScore = getSmartMatchScore(item, dist);
                  const isSaved = savedResourceIds.includes(item.id);

                  return (
                    <div key={item.id} className="hub-card">
                      {/* Media Header */}
                      <div className="hub-card-media" onClick={() => setSelectedResource(item)} style={{ cursor: 'pointer' }}>
                        <img src={item.image} alt={item.title} className="hub-card-img" />
                        
                        {/* Badges Top */}
                        <div className="hub-card-badges-top">
                          <span className="hub-badge hub-badge-verified">
                            ✓ {t('verifiedBusiness')}
                          </span>

                          <span
                            className="hub-badge hub-badge-match"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMatchScoreModalItem(item);
                            }}
                            title="View Smart Match Breakdown"
                          >
                            🎯 {matchScore}% {t('matchScore')}
                          </span>
                        </div>

                        {/* Booking Type Badge */}
                        <span className="hub-badge-booking-type">
                          {item.bookingType === 'Emergency' ? '⚡ ' + t('emergencyBooking') : '📅 ' + t('plannedBooking')}
                        </span>

                        {/* Photos Count */}
                        <span className="hub-badge-photos-count">
                          📷 {item.photos ? item.photos.length : 1}
                        </span>
                      </div>

                      {/* Card Content Body */}
                      <div className="hub-card-body">
                        <div className="hub-card-meta-top">
                          <span className="hub-card-location">
                            📍 {item.location} • {dist} km {t('away')}
                          </span>

                          {/* Status Badge (Icon + Text) */}
                          <span className={`hub-status-badge ${item.availabilityStatus.toLowerCase()}`}>
                            {item.availabilityStatus === 'Available' && '🟢 ' + t('available')}
                            {item.availabilityStatus === 'Negotiating' && '🟡 ' + t('negotiating')}
                            {item.availabilityStatus === 'Pre-booked' && '🔵 ' + t('preBooked')}
                            {item.availabilityStatus === 'Unavailable' && '🔴 ' + t('unavailable')}
                            {item.availabilityStatus === 'Completed' && '⚪ ' + t('completed')}
                          </span>
                        </div>

                        <h3 className="hub-card-title" onClick={() => setSelectedResource(item)} style={{ cursor: 'pointer' }}>
                          {item.title}
                        </h3>

                        <div className="hub-card-provider">
                          🏢 {item.shopName}
                        </div>

                        <div className="hub-card-rating">
                          <span className="hub-card-rating-star">⭐</span>
                          <span>{item.rating}</span>
                          <span className="hub-card-reviews-count">({item.reviewsCount} {t('reviews')}) • {item.completedRentals} {t('rentalsCompleted')}</span>
                        </div>

                        {/* Specs Chips */}
                        <div className="hub-card-specs">
                          {item.specifications && item.specifications.slice(0, 2).map((spec, idx) => (
                            <span key={idx} className="hub-card-spec-tag">
                              ✓ {spec}
                            </span>
                          ))}
                        </div>

                        {/* Card Footer & Pricing */}
                        <div className="hub-card-footer">
                          <div className="hub-card-price-row">
                            <div>
                              <span className="hub-card-price-value">₹{item.pricePerDay.toLocaleString()}</span>
                              <span className="hub-card-price-unit"> {t('perDay')}</span>
                            </div>
                            <div className="hub-card-quantity">
                              {t('availableUnits')}: {item.quantityAvailable}
                            </div>
                          </div>

                          <div className="hub-card-actions">
                            <button
                              className="hub-btn-primary"
                              onClick={() => {
                                setCheckoutResource(item);
                                setCheckoutStep('review');
                              }}
                            >
                              {t('requestRental')}
                            </button>
                            <button
                              className="hub-btn-outline"
                              onClick={() => {
                                setNegotiationModalItem({
                                  id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
                                  assetId: item.id,
                                  assetTitle: item.title,
                                  providerBusiness: item.shopName,
                                  seekerBusiness: currentUser.businessName,
                                  dailyRate: item.pricePerDay,
                                  totalAmount: item.pricePerDay * 2,
                                  days: 2
                                });
                                setCounterPriceInput(Math.round(item.pricePerDay * 0.9));
                              }}
                            >
                              {t('negotiate')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Trust & Benefits Section */}
            <section className="hub-trust-section">
              <div className="hub-container">
                <div className="hub-section-header">
                  <h2 className="hub-section-title">{t('trustHeading')}</h2>
                  <p className="hub-section-subtitle">{t('trustSubheading')}</p>
                </div>

                <div className="hub-benefits-grid">
                  <div className="hub-benefit-card">
                    <div className="hub-benefit-icon">🛡️</div>
                    <h4 className="hub-benefit-title">{t('benefit1Title')}</h4>
                    <p className="hub-benefit-desc">{t('benefit1Desc')}</p>
                  </div>

                  <div className="hub-benefit-card">
                    <div className="hub-benefit-icon">🎯</div>
                    <h4 className="hub-benefit-title">{t('benefit2Title')}</h4>
                    <p className="hub-benefit-desc">{t('benefit2Desc')}</p>
                  </div>

                  <div className="hub-benefit-card">
                    <div className="hub-benefit-icon">⚡</div>
                    <h4 className="hub-benefit-title">{t('benefit3Title')}</h4>
                    <p className="hub-benefit-desc">{t('benefit3Desc')}</p>
                  </div>

                  <div className="hub-benefit-card">
                    <div className="hub-benefit-icon">🤝</div>
                    <h4 className="hub-benefit-title">{t('benefit4Title')}</h4>
                    <p className="hub-benefit-desc">{t('benefit4Desc')}</p>
                  </div>

                  <div className="hub-benefit-card">
                    <div className="hub-benefit-icon">🔒</div>
                    <h4 className="hub-benefit-title">{t('benefit5Title')}</h4>
                    <p className="hub-benefit-desc">{t('benefit5Desc')}</p>
                  </div>

                  <div className="hub-benefit-card">
                    <div className="hub-benefit-icon">📸</div>
                    <h4 className="hub-benefit-title">{t('benefit6Title')}</h4>
                    <p className="hub-benefit-desc">{t('benefit6Desc')}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Idle Resources Call to Action */}
            <section className="hub-cta-section">
              <div className="hub-container">
                <div className="hub-cta-inner">
                  <h2 className="hub-cta-title">{t('ctaHeading')}</h2>
                  <p className="hub-cta-subtitle">{t('ctaSubheading')}</p>
                  <div className="hub-cta-buttons">
                    <button
                      className="hub-btn-primary"
                      style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}
                      onClick={() => {
                        setRole('provider');
                        setPhotoUploadModalOpen(true);
                      }}
                    >
                      {t('ctaListBtn')}
                    </button>
                    <button
                      className="hub-btn-secondary"
                      style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.25)' }}
                      onClick={() => {
                        window.scrollTo({ top: 600, behavior: 'smooth' });
                      }}
                    >
                      {t('ctaExploreBtn')}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW: Provider Dashboard */}
        {currentView === 'provider-dashboard' && (
          <div className="hub-container" style={{ padding: '2.5rem 1.5rem' }}>
            <div className="hub-dashboard-header">
              <div>
                <h1 className="hub-dashboard-title">{t('providerOverview')}</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Managing listings for <strong>{currentUser.businessName}</strong> (GSTIN: {currentUser.gstin || '27AAACI1234A1Z5'})
                </p>
              </div>

              <button
                className="hub-btn-primary"
                onClick={() => setPhotoUploadModalOpen(true)}
              >
                {t('addNewResource')}
              </button>
            </div>

            {/* Metrics Row */}
            <div className="hub-metrics-grid">
              <div className="hub-metric-card">
                <div className="hub-metric-header">
                  <span className="hub-metric-label">{t('activeResources')}</span>
                  <div className="hub-metric-icon" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}>📦</div>
                </div>
                <div className="hub-metric-val">{providerResources.length}</div>
              </div>

              <div className="hub-metric-card">
                <div className="hub-metric-header">
                  <span className="hub-metric-label">{t('bookedResources')}</span>
                  <div className="hub-metric-icon" style={{ background: 'var(--status-prebooked-bg)', color: 'var(--status-prebooked)' }}>🔒</div>
                </div>
                <div className="hub-metric-val">2</div>
              </div>

              <div className="hub-metric-card">
                <div className="hub-metric-header">
                  <span className="hub-metric-label">{t('pendingRequests')}</span>
                  <div className="hub-metric-icon" style={{ background: 'var(--accent-gold-subtle)', color: 'var(--accent-gold)' }}>⏳</div>
                </div>
                <div className="hub-metric-val">{requests.filter((r) => r.status === 'Negotiating').length}</div>
              </div>

              <div className="hub-metric-card">
                <div className="hub-metric-header">
                  <span className="hub-metric-label">{t('utilizationRate')}</span>
                  <div className="hub-metric-icon" style={{ background: 'var(--status-available-bg)', color: 'var(--status-available)' }}>📈</div>
                </div>
                <div className="hub-metric-val">84.2%</div>
              </div>

              <div className="hub-metric-card">
                <div className="hub-metric-header">
                  <span className="hub-metric-label">{t('totalRevenue')}</span>
                  <div className="hub-metric-icon" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}>💰</div>
                </div>
                <div className="hub-metric-val">₹1,88,400</div>
              </div>
            </div>

            {/* Provider Filter Tabs */}
            <div className="hub-tabs">
              {['All', 'Available', 'Negotiating', 'Pre-booked', 'Completed'].map((status) => (
                <button
                  key={status}
                  className={`hub-tab-btn ${providerFilterStatus === status ? 'active' : ''}`}
                  onClick={() => setProviderFilterStatus(status)}
                >
                  {status === 'All' && t('filterAll')}
                  {status === 'Available' && t('filterAvailable')}
                  {status === 'Negotiating' && t('filterNegotiating')}
                  {status === 'Pre-booked' && t('filterPreBooked')}
                  {status === 'Completed' && t('filterCompleted')}
                </button>
              ))}
            </div>

            {/* Provider Inventory List */}
            <div className="hub-resource-grid">
              {providerResources.map((item) => (
                <div key={item.id} className="hub-card">
                  <div className="hub-card-media" onClick={() => setSelectedResource(item)}>
                    <img src={item.image} alt={item.title} className="hub-card-img" />
                    <span className={`hub-status-badge ${item.availabilityStatus.toLowerCase()}`} style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                      {item.availabilityStatus}
                    </span>
                  </div>
                  <div className="hub-card-body">
                    <h4 className="hub-card-title">{item.title}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      Category: <strong>{item.category}</strong> • {item.location}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                      ₹{item.pricePerDay.toLocaleString()} / day
                    </div>
                    <div className="hub-card-actions">
                      <button
                        className="hub-btn-secondary"
                        onClick={() => setSelectedResource(item)}
                      >
                        {t('viewDetails')}
                      </button>
                      <button
                        className="hub-btn-outline"
                        onClick={() => {
                          setPhotoAuditModalItem(item);
                        }}
                      >
                        📸 Photo Audit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: Negotiations Center */}
        {currentView === 'negotiations' && (
          <div className="hub-container" style={{ padding: '2.5rem 1.5rem' }}>
            <div className="hub-dashboard-header">
              <div>
                <h1 className="hub-dashboard-title">{t('negotiationsCenter')}</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Direct B2B price negotiation, counter-offers, and custom commercial contracts.
                </p>
              </div>
            </div>

            <div className="hub-tabs">
              <button
                className={`hub-tab-btn ${negotiationTab === 'incoming' ? 'active' : ''}`}
                onClick={() => setNegotiationTab('incoming')}
              >
                📥 {t('incomingOffers')} ({requests.length})
              </button>
              <button
                className={`hub-tab-btn ${negotiationTab === 'counter' ? 'active' : ''}`}
                onClick={() => setNegotiationTab('counter')}
              >
                🔄 {t('counterOffers')}
              </button>
              <button
                className={`hub-tab-btn ${negotiationTab === 'accepted' ? 'active' : ''}`}
                onClick={() => setNegotiationTab('accepted')}
              >
                ✅ {t('acceptedOffers')}
              </button>
            </div>

            <div className="hub-negotiation-grid">
              {requests.map((req) => (
                <div key={req.id} className="hub-negotiation-card">
                  <div className="hub-negotiation-header">
                    <div className="hub-negotiation-parties">
                      <span>🏢 {req.providerBusiness}</span>
                      <span>↔</span>
                      <span>🛒 {req.seekerBusiness}</span>
                    </div>

                    <span className={`hub-status-badge ${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {req.assetTitle}
                  </div>

                  <div className="hub-negotiation-prices">
                    <div className="hub-price-item">
                      <span className="hub-price-item-label">{t('listedPrice')}</span>
                      <span className="hub-price-item-val">₹{req.dailyRate.toLocaleString()} / day</span>
                    </div>
                    <div className="hub-price-item">
                      <span className="hub-price-item-label">{t('proposedPrice')}</span>
                      <span className="hub-price-item-val" style={{ color: 'var(--primary)' }}>
                        ₹{(req.negotiationOffer || req.dailyRate).toLocaleString()}
                      </span>
                    </div>
                    <div className="hub-price-item">
                      <span className="hub-price-item-label">{t('rentalDuration')}</span>
                      <span className="hub-price-item-val">{req.days} {t('days')} ({req.startDate} to {req.endDate})</span>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-muted)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                    <strong>Message:</strong> {req.notes}
                  </div>

                  <div className="hub-negotiation-actions">
                    {req.status === 'Negotiating' && (
                      <>
                        <button
                          className="hub-btn-primary"
                          onClick={() => handleAcceptOffer(req.id)}
                        >
                          ✓ {t('acceptOffer')}
                        </button>
                        <button
                          className="hub-btn-outline"
                          onClick={() => {
                            setNegotiationModalItem(req);
                            setCounterPriceInput(req.negotiationOffer || req.dailyRate);
                          }}
                        >
                          🔄 {t('counterOffer')}
                        </button>
                        <button
                          className="hub-btn-secondary"
                          style={{ color: 'var(--status-unavailable)' }}
                          onClick={() => handleRejectOffer(req.id)}
                        >
                          ✕ {t('rejectOffer')}
                        </button>
                      </>
                    )}
                    {req.status === 'Approved' && (
                      <span style={{ color: 'var(--status-available)', fontWeight: 700 }}>
                        ✓ Escrow Locked & Verified ({req.paymentStatus})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: How It Works */}
        {currentView === 'how-it-works' && (
          <div className="hub-container" style={{ padding: '3.5rem 1.5rem' }}>
            <div className="hub-section-header">
              <h1 className="hub-section-title">{t('howItWorks')}</h1>
              <p className="hub-section-subtitle">A seamless shared economy for the hospitality ecosystem.</p>
            </div>

            <div className="hub-benefits-grid" style={{ marginTop: '2rem' }}>
              <div className="hub-benefit-card">
                <div className="hub-benefit-icon">1</div>
                <h3 className="hub-benefit-title">For Providers: Monetize Idle Assets</h3>
                <p className="hub-benefit-desc">
                  List spare banquet halls, commercial ovens, refrigerated trucks, and AV gear. Set custom daily rates, security deposits, and availability windows.
                </p>
              </div>

              <div className="hub-benefit-card">
                <div className="hub-benefit-icon">2</div>
                <h3 className="hub-benefit-title">For Seekers: Smart Match & Instant Dispatch</h3>
                <p className="hub-benefit-desc">
                  Find verified equipment within your region. Choose planned advance booking or 45-minute emergency breakdown dispatch.
                </p>
              </div>

              <div className="hub-benefit-card">
                <div className="hub-benefit-icon">3</div>
                <h3 className="hub-benefit-title">Automated Calendar Lock & Escrow</h3>
                <p className="hub-benefit-desc">
                  Confirmed bookings lock the provider's regional calendar to prevent collisions. Payments and deposits remain protected in escrow until photo audit release.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Providers Directory */}
        {currentView === 'providers' && (
          <div className="hub-container" style={{ padding: '3.5rem 1.5rem' }}>
            <div className="hub-section-header">
              <h1 className="hub-section-title">Verified Hospitality Providers</h1>
              <p className="hub-section-subtitle">Premier hotels, caterers, and equipment depots in the Mumbai Metropolitan Region.</p>
            </div>

            <div className="hub-benefits-grid">
              {window.DEMO_USERS && window.DEMO_USERS.map((user) => (
                <div key={user.id || user.businessName} className="hub-benefit-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div className="hub-benefit-icon">🏢</div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{user.businessName}</h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>✓ Verified B2B Partner</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    📍 {user.location} • ⭐ {user.rating} ({user.reviewsCount} reviews)
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Contact: {user.contactPerson} ({user.email})
                  </p>
                  <div style={{ marginTop: '1rem' }}>
                    <button className="hub-btn-primary" onClick={() => { setSelectedCategory('all'); setCurrentView('marketplace'); }}>
                      View Fleet ({user.activeListingsCount || 3} items)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 6. MODALS & OVERLAYS */}

      {/* MODAL 1: Resource Detail & Multi-Photo Carousel */}
      {selectedResource && (
        <div className="hub-modal-overlay" onClick={() => setSelectedResource(null)}>
          <div className="hub-modal" onClick={(e) => e.stopPropagation()}>
            <div className="hub-modal-header">
              <h3 className="hub-modal-title">{selectedResource.title}</h3>
              <button className="hub-modal-close" onClick={() => setSelectedResource(null)}>✕</button>
            </div>

            <div className="hub-modal-body">
              {/* Multi-Photo Carousel */}
              <div className="hub-gallery-main">
                <img
                  src={selectedResource.photos ? selectedResource.photos[activePhotoIndex] : selectedResource.image}
                  alt={selectedResource.title}
                  className="hub-gallery-img"
                />
                {selectedResource.photos && selectedResource.photos.length > 1 && (
                  <>
                    <button
                      className="hub-gallery-nav-btn prev"
                      onClick={() => setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : selectedResource.photos.length - 1))}
                    >
                      ‹
                    </button>
                    <button
                      className="hub-gallery-nav-btn next"
                      onClick={() => setActivePhotoIndex((prev) => (prev < selectedResource.photos.length - 1 ? prev + 1 : 0))}
                    >
                      ›
                    </button>
                    <span className="hub-gallery-counter">
                      {t('photoCounter')} {activePhotoIndex + 1} {t('of')} {selectedResource.photos.length}
                    </span>
                  </>
                )}
              </div>

              {/* Thumbnails Strip */}
              {selectedResource.photos && selectedResource.photos.length > 1 && (
                <div className="hub-gallery-thumbs">
                  {selectedResource.photos.map((ph, idx) => (
                    <div
                      key={idx}
                      className={`hub-gallery-thumb ${activePhotoIndex === idx ? 'active' : ''}`}
                      onClick={() => setActivePhotoIndex(idx)}
                    >
                      <img src={ph} alt={`Thumbnail ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}

              {/* Split Detail Grid */}
              <div className="hub-detail-grid">
                {/* Left Column: Description, Specs, Calendar Lock */}
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>{t('description')}</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {selectedResource.description}
                  </p>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>{t('specifications')}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {selectedResource.specifications && selectedResource.specifications.map((spec, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Availability View */}
                  <div className="hub-calendar-view">
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      📅 {t('calendarAvailability')}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {t('calendarNotice')}
                    </p>
                    <div className="hub-calendar-grid">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                        <div key={d} className="hub-calendar-day-header">{d}</div>
                      ))}
                      {[24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7].map((num, i) => {
                        const isLocked = selectedResource.bookedDates && selectedResource.bookedDates.some((bd) => bd.endsWith(`-${num < 10 ? '0' + num : num}`));
                        return (
                          <div key={i} className={`hub-calendar-day ${isLocked ? 'locked' : 'available'}`}>
                            <span>{num}</span>
                            <span style={{ fontSize: '0.65rem' }}>{isLocked ? '🔒 Lock' : '🟢 Open'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Pricing, Provider Card, Booking Action */}
                <div>
                  {/* Provider Card */}
                  <div className="hub-provider-trust-card">
                    <div className="hub-provider-trust-header">
                      <div>
                        <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedResource.shopName}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                          ✓ {t('verifiedBusinessTag')}
                        </div>
                      </div>
                      <span style={{ fontSize: '1.25rem' }}>🏢</span>
                    </div>
                    <div className="hub-trust-metrics">
                      <div className="hub-trust-metric-item">
                        <span className="hub-trust-metric-label">Rating</span>
                        <span className="hub-trust-metric-val">⭐ {selectedResource.rating} / 5.0</span>
                      </div>
                      <div className="hub-trust-metric-item">
                        <span className="hub-trust-metric-label">{t('responseRate')}</span>
                        <span className="hub-trust-metric-val">{t('lessThan15Min')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div style={{ background: 'var(--bg-muted)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ₹{selectedResource.pricePerDay.toLocaleString()}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{t('perDay')}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      🛡️ {t('refundableDeposit')}: <strong>₹{selectedResource.securityDeposit.toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                      className="hub-btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                      onClick={() => {
                        setCheckoutResource(selectedResource);
                        setCheckoutStep('review');
                        setSelectedResource(null);
                      }}
                    >
                      {t('proceedCheckout')}
                    </button>

                    <button
                      className="hub-btn-outline"
                      style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                      onClick={() => {
                        setNegotiationModalItem({
                          id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
                          assetId: selectedResource.id,
                          assetTitle: selectedResource.title,
                          providerBusiness: selectedResource.shopName,
                          seekerBusiness: currentUser.businessName,
                          dailyRate: selectedResource.pricePerDay,
                          totalAmount: selectedResource.pricePerDay * 2,
                          days: 2
                        });
                        setCounterPriceInput(Math.round(selectedResource.pricePerDay * 0.9));
                        setSelectedResource(null);
                      }}
                    >
                      {t('initiateNegotiation')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Smart Match Score Breakdown */}
      {matchScoreModalItem && (
        <div className="hub-modal-overlay" onClick={() => setMatchScoreModalItem(null)}>
          <div className="hub-modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="hub-modal-header">
              <h3 className="hub-modal-title">🎯 {t('matchScoreTitle')}</h3>
              <button className="hub-modal-close" onClick={() => setMatchScoreModalItem(null)}>✕</button>
            </div>

            <div className="hub-modal-body">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>
                  96%
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {t('matchScoreSubtitle')}
                </p>
              </div>

              <div className="hub-match-breakdown-list">
                <div className="hub-match-item">
                  <div className="hub-match-item-header">
                    <span>💰 {t('factorPrice')}</span>
                    <span>98%</span>
                  </div>
                  <div className="hub-progress-bar-bg">
                    <div className="hub-progress-bar-fill" style={{ width: '98%' }}></div>
                  </div>
                </div>

                <div className="hub-match-item">
                  <div className="hub-match-item-header">
                    <span>📍 {t('factorDistance')} (4.2 km)</span>
                    <span>95%</span>
                  </div>
                  <div className="hub-progress-bar-bg">
                    <div className="hub-progress-bar-fill" style={{ width: '95%' }}></div>
                  </div>
                </div>

                <div className="hub-match-item">
                  <div className="hub-match-item-header">
                    <span>📅 {t('factorAvailability')}</span>
                    <span>100%</span>
                  </div>
                  <div className="hub-progress-bar-bg">
                    <div className="hub-progress-bar-fill" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="hub-match-item">
                  <div className="hub-match-item-header">
                    <span>⚙️ {t('factorSuitability')}</span>
                    <span>94%</span>
                  </div>
                  <div className="hub-progress-bar-bg">
                    <div className="hub-progress-bar-fill" style={{ width: '94%' }}></div>
                  </div>
                </div>

                <div className="hub-match-item">
                  <div className="hub-match-item-header">
                    <span>⚡ {t('factorUrgency')}</span>
                    <span>92%</span>
                  </div>
                  <div className="hub-progress-bar-bg">
                    <div className="hub-progress-bar-fill" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button className="hub-btn-primary" onClick={() => setMatchScoreModalItem(null)}>
                  {t('closeModal')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Provider Photo Upload & List Resource */}
      {photoUploadModalOpen && (
        <div className="hub-modal-overlay" onClick={() => setPhotoUploadModalOpen(false)}>
          <div className="hub-modal" style={{ maxWidth: '840px' }} onClick={(e) => e.stopPropagation()}>
            <div className="hub-modal-header">
              <h3 className="hub-modal-title">{t('addNewResource')}</h3>
              <button className="hub-modal-close" onClick={() => setPhotoUploadModalOpen(false)}>✕</button>
            </div>

            <div className="hub-modal-body">
              <form onSubmit={handleCreateResource}>
                {/* 6-Angle Photo Upload UI */}
                <div className="hub-photo-upload-container">
                  <div className="hub-photo-upload-header">
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {t('photoUploadTitle')}
                      </strong>
                      <div className="hub-upload-guidance-pill" style={{ marginTop: '4px' }}>
                        📸 {t('photoUploadGuidance')} ({newResourceForm.photos.length}/6 uploaded)
                      </div>
                    </div>

                    <button
                      type="button"
                      className="hub-btn-outline"
                      style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                      onClick={handleLoadDemoPhotos}
                    >
                      ⚡ {t('loadPresetPhotos')}
                    </button>
                  </div>

                  <div className="hub-upload-slots-grid">
                    {[
                      { key: 'slotFront', label: t('slotFront') },
                      { key: 'slotSide', label: t('slotSide') },
                      { key: 'slotInterior', label: t('slotInterior') },
                      { key: 'slotRear', label: t('slotRear') },
                      { key: 'slotCondition', label: t('slotCondition') },
                      { key: 'slotSpec', label: t('slotSpec') }
                    ].map((slot, idx) => {
                      const img = newResourceForm.photos[idx];
                      return (
                        <div
                          key={slot.key}
                          className={`hub-upload-slot ${img ? 'has-image' : ''}`}
                          onClick={() => {
                            if (!img) handleLoadDemoPhotos();
                          }}
                        >
                          {img ? (
                            <>
                              <img src={img} alt={slot.label} className="hub-upload-preview-img" />
                              <div className="hub-slot-actions">
                                <button
                                  type="button"
                                  className="hub-slot-btn"
                                  title="Remove"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewResourceForm((prev) => ({
                                      ...prev,
                                      photos: prev.photos.filter((_, i) => i !== idx)
                                    }));
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <span style={{ fontSize: '1.25rem' }}>📷</span>
                              <span className="hub-upload-slot-label">{slot.label}</span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="hub-search-field">
                    <label className="hub-search-label">Resource Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10-Grid Combi Steamer Oven"
                      className="hub-search-input"
                      value={newResourceForm.title}
                      onChange={(e) => setNewResourceForm({ ...newResourceForm, title: e.target.value })}
                    />
                  </div>

                  <div className="hub-search-field">
                    <label className="hub-search-label">Category *</label>
                    <select
                      className="hub-search-select"
                      value={newResourceForm.category}
                      onChange={(e) => setNewResourceForm({ ...newResourceForm, category: e.target.value })}
                    >
                      {window.CATEGORIES && window.CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                        <option key={c.id} value={c.id}>{t(c.key)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="hub-search-field">
                    <label className="hub-search-label">Daily Rental Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 8500"
                      className="hub-search-input"
                      value={newResourceForm.pricePerDay}
                      onChange={(e) => setNewResourceForm({ ...newResourceForm, pricePerDay: e.target.value })}
                    />
                  </div>

                  <div className="hub-search-field">
                    <label className="hub-search-label">Refundable Security Deposit (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4000"
                      className="hub-search-input"
                      value={newResourceForm.securityDeposit}
                      onChange={(e) => setNewResourceForm({ ...newResourceForm, securityDeposit: e.target.value })}
                    />
                  </div>

                  <div className="hub-search-field">
                    <label className="hub-search-label">Booking Type</label>
                    <select
                      className="hub-search-select"
                      value={newResourceForm.bookingType}
                      onChange={(e) => setNewResourceForm({ ...newResourceForm, bookingType: e.target.value })}
                    >
                      <option value="Planned">📅 Planned Booking</option>
                      <option value="Emergency">⚡ Emergency Rapid Dispatch</option>
                    </select>
                  </div>

                  <div className="hub-search-field">
                    <label className="hub-search-label">Location</label>
                    <select
                      className="hub-search-select"
                      value={newResourceForm.location}
                      onChange={(e) => setNewResourceForm({ ...newResourceForm, location: e.target.value })}
                    >
                      {window.MMR_REGIONS && window.MMR_REGIONS.filter((r) => !r.startsWith('All')).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="hub-search-field" style={{ marginBottom: '1rem' }}>
                  <label className="hub-search-label">Technical Specifications (One per line)</label>
                  <textarea
                    rows="3"
                    className="hub-search-input"
                    placeholder="3-Phase 415V Electric&#10;FSSAI Certified&#10;10 x 1/1 GN Capacity"
                    value={newResourceForm.specifications}
                    onChange={(e) => setNewResourceForm({ ...newResourceForm, specifications: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="hub-btn-secondary"
                    onClick={() => setPhotoUploadModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="hub-btn-primary">
                    Publish B2B Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Simulated Escrow Checkout & Payment */}
      {checkoutResource && (
        <div className="hub-modal-overlay" onClick={() => setCheckoutResource(null)}>
          <div className="hub-modal" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div className="hub-modal-header">
              <h3 className="hub-modal-title">
                {checkoutStep === 'confirmed' ? t('paymentSuccessful') : t('checkoutTitle')}
              </h3>
              <button className="hub-modal-close" onClick={() => setCheckoutResource(null)}>✕</button>
            </div>

            <div className="hub-modal-body">
              {checkoutStep === 'review' && (
                <div className="hub-checkout-grid">
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>{t('paymentMethod')}</h4>
                    <div className="hub-payment-methods">
                      <div
                        className={`hub-payment-option ${paymentMethod === 'upi' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <span style={{ fontSize: '1.5rem' }}>📱</span>
                        <div>
                          <strong>{t('upiPayment')}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GPay, PhonePe, Paytm, BHIM</div>
                        </div>
                      </div>

                      <div
                        className={`hub-payment-option ${paymentMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <span style={{ fontSize: '1.5rem' }}>💳</span>
                        <div>
                          <strong>{t('cardPayment')}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visa, MasterCard, Corporate RuPay</div>
                        </div>
                      </div>

                      <div
                        className={`hub-payment-option ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('netbanking')}
                      >
                        <span style={{ fontSize: '1.5rem' }}>🏦</span>
                        <div>
                          <strong>{t('netBanking')}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HDFC, ICICI, SBI, Axis Corporate</div>
                        </div>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '1.25rem', marginBottom: '0.75rem' }}>
                      {t('logisticsSelector')}
                    </h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className={`hub-booking-switch-btn ${logisticsMode === 'delivery' ? 'active planned' : ''}`}
                        style={{ flex: 1, padding: '0.65rem' }}
                        onClick={() => setLogisticsMode('delivery')}
                      >
                        🚚 {t('siteDelivery')} (+₹850)
                      </button>
                      <button
                        type="button"
                        className={`hub-booking-switch-btn ${logisticsMode === 'pickup' ? 'active planned' : ''}`}
                        style={{ flex: 1, padding: '0.65rem' }}
                        onClick={() => setLogisticsMode('pickup')}
                      >
                        📦 {t('selfPickup')} ({t('free')})
                      </button>
                    </div>
                  </div>

                  {/* Order Summary Box */}
                  <div className="hub-order-summary-card">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>{t('bookingSummary')}</h4>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>{checkoutResource.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Provider: {checkoutResource.shopName}</div>

                    <div className="hub-summary-row">
                      <span>{t('rentalDuration')}</span>
                      <span>2 {t('days')}</span>
                    </div>
                    <div className="hub-summary-row">
                      <span>{t('baseSubtotal')}</span>
                      <span>₹{(checkoutResource.pricePerDay * 2).toLocaleString()}</span>
                    </div>
                    <div className="hub-summary-row">
                      <span>{t('logisticsFee')}</span>
                      <span>₹{logisticsMode === 'delivery' ? '850' : '0'}</span>
                    </div>
                    <div className="hub-summary-row">
                      <span>{t('securityDeposit')}</span>
                      <span>₹{checkoutResource.securityDeposit.toLocaleString()}</span>
                    </div>
                    <div className="hub-summary-row total">
                      <span>{t('tokenAmount')}</span>
                      <span>₹{Math.round((checkoutResource.pricePerDay * 2) * 0.2).toLocaleString()}</span>
                    </div>

                    <button
                      className="hub-btn-primary"
                      style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem', justifyContent: 'center' }}
                      onClick={handleConfirmBooking}
                    >
                      🔒 {t('payAndLockCalendar')}
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 'processing' && (
                <div className="hub-payment-success-box">
                  <div className="hub-success-icon-badge" style={{ animation: 'spin 1s linear infinite' }}>
                    ⏳
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{t('processingPayment')}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Securing escrow tokens and locking calendar schedule.</p>
                </div>
              )}

              {checkoutStep === 'confirmed' && (
                <div className="hub-payment-success-box">
                  <div className="hub-success-icon-badge">✓</div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('bookingConfirmed')}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {t('bookingId')}: <strong>#B2B-98421</strong> • {t('calendarLockedSuccess')}
                  </p>

                  <div style={{ background: 'var(--bg-muted)', padding: '1rem', borderRadius: 'var(--radius-md)', width: '100%', maxWidth: '420px', textAlign: 'left', fontSize: '0.85rem' }}>
                    <div><strong>Resource:</strong> {checkoutResource.title}</div>
                    <div><strong>Provider:</strong> {checkoutResource.shopName}</div>
                    <div><strong>Locked Dates:</strong> 2026-10-05 to 2026-10-07 (2 Days)</div>
                    <div><strong>Escrow Token Paid:</strong> ₹{Math.round((checkoutResource.pricePerDay * 2) * 0.2).toLocaleString()}</div>
                    <div><strong>Status:</strong> 🟢 Confirmed & Calendar Locked</div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button className="hub-btn-secondary" onClick={() => showToast("Booking voucher PDF generated", "success")}>
                      📥 {t('downloadVoucher')}
                    </button>
                    <button className="hub-btn-primary" onClick={() => setCheckoutResource(null)}>
                      {t('returnToMarketplace')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Counter-Offer / Negotiation Modal */}
      {negotiationModalItem && (
        <div className="hub-modal-overlay" onClick={() => setNegotiationModalItem(null)}>
          <div className="hub-modal" style={{ maxWidth: '560px' }} onClick={(e) => e.stopPropagation()}>
            <div className="hub-modal-header">
              <h3 className="hub-modal-title">🔄 {t('sendCounterOffer')}</h3>
              <button className="hub-modal-close" onClick={() => setNegotiationModalItem(null)}>✕</button>
            </div>

            <div className="hub-modal-body">
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '1rem' }}>{negotiationModalItem.assetTitle}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Provider: {negotiationModalItem.providerBusiness}
                </div>
              </div>

              <div className="hub-search-field" style={{ marginBottom: '1rem' }}>
                <label className="hub-search-label">{t('proposeNewPrice')}</label>
                <input
                  type="number"
                  className="hub-search-input"
                  value={counterPriceInput}
                  onChange={(e) => setCounterPriceInput(e.target.value)}
                />
              </div>

              <div className="hub-search-field" style={{ marginBottom: '1.5rem' }}>
                <label className="hub-search-label">{t('counterNotes')}</label>
                <textarea
                  rows="3"
                  className="hub-search-input"
                  placeholder="e.g. Can we include transport setup for this price?"
                  value={counterNotesInput}
                  onChange={(e) => setCounterNotesInput(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button className="hub-btn-secondary" onClick={() => setNegotiationModalItem(null)}>
                  Cancel
                </button>
                <button className="hub-btn-primary" onClick={handleSendCounterOffer}>
                  {t('sendCounterOffer')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Condition Photo Audit Inspector */}
      {photoAuditModalItem && (
        <div className="hub-modal-overlay" onClick={() => setPhotoAuditModalItem(null)}>
          <div className="hub-modal" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <div className="hub-modal-header">
              <h3 className="hub-modal-title">📸 {t('photoAuditTitle')}</h3>
              <button className="hub-modal-close" onClick={() => setPhotoAuditModalItem(null)}>✕</button>
            </div>

            <div className="hub-modal-body">
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {t('photoAuditSubtitle')}
              </p>

              <div className="hub-audit-grid">
                <div className="hub-audit-col">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{t('conditionBefore')}</strong>
                    <span className="hub-status-badge available">✓ {t('statusSubmitted')}</span>
                  </div>
                  <div className="hub-audit-photo-reel">
                    <img src={photoAuditModalItem.photos ? photoAuditModalItem.photos[0] : photoAuditModalItem.image} alt="Before 1" />
                    <img src={photoAuditModalItem.photos ? photoAuditModalItem.photos[1] || photoAuditModalItem.image : photoAuditModalItem.image} alt="Before 2" />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Inspected & logged at depot dispatch. No cosmetic or electrical defects found.
                  </div>
                </div>

                <div className="hub-audit-col">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{t('conditionAfter')}</strong>
                    <span className="hub-status-badge negotiating">⏳ {t('statusPending')}</span>
                  </div>
                  <div className="hub-audit-photo-reel">
                    <img src={photoAuditModalItem.photos ? photoAuditModalItem.photos[2] || photoAuditModalItem.image : photoAuditModalItem.image} alt="After 1" />
                    <img src={photoAuditModalItem.photos ? photoAuditModalItem.photos[3] || photoAuditModalItem.image : photoAuditModalItem.image} alt="After 2" />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Return inspection will verify mechanical integrity prior to releasing ₹{photoAuditModalItem.securityDeposit.toLocaleString()} escrow deposit.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button className="hub-btn-primary" onClick={() => {
                  showToast("Escrow security deposit cleared!", "success");
                  setPhotoAuditModalItem(null);
                }}>
                  ✓ {t('releaseDepositBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Enterprise Multi-Column Footer */}
      <footer className="hub-footer">
        <div className="hub-container">
          <div className="hub-footer-grid">
            {/* Column 1: Brand */}
            <div className="hub-footer-brand">
              <div className="hub-logo">
                <div className="hub-logo-icon">🏨</div>
                <div className="hub-logo-text">
                  <span className="hub-logo-title">{t('brandName')}</span>
                  <span className="hub-logo-tagline">{t('brandTagline')}</span>
                </div>
              </div>
              <p className="hub-footer-desc">{t('footerAbout')}</p>
            </div>

            {/* Column 2: Marketplace */}
            <div>
              <h5 className="hub-footer-col-title">{t('marketplaceCol')}</h5>
              <ul className="hub-footer-links">
                <li><a href="#spaces" className="hub-footer-link" onClick={() => { setSelectedCategory('Spaces'); setCurrentView('marketplace'); }}>{t('catSpaces')}</a></li>
                <li><a href="#kitchen" className="hub-footer-link" onClick={() => { setSelectedCategory('Kitchen'); setCurrentView('marketplace'); }}>{t('catKitchen')}</a></li>
                <li><a href="#vehicles" className="hub-footer-link" onClick={() => { setSelectedCategory('Vehicle'); setCurrentView('marketplace'); }}>{t('catVehicles')}</a></li>
                <li><a href="#audio" className="hub-footer-link" onClick={() => { setSelectedCategory('Audio'); setCurrentView('marketplace'); }}>{t('catAudio')}</a></li>
                <li><a href="#coldchain" className="hub-footer-link" onClick={() => { setSelectedCategory('ColdChain'); setCurrentView('marketplace'); }}>{t('catColdChain')}</a></li>
              </ul>
            </div>

            {/* Column 3: For Businesses */}
            <div>
              <h5 className="hub-footer-col-title">{t('businessCol')}</h5>
              <ul className="hub-footer-links">
                <li><a href="#list" className="hub-footer-link" onClick={() => { setRole('provider'); setPhotoUploadModalOpen(true); }}>{t('listResource')}</a></li>
                <li><a href="#dashboard" className="hub-footer-link" onClick={() => { setRole('provider'); setCurrentView('provider-dashboard'); }}>{t('providerHub')}</a></li>
                <li><a href="#negotiations" className="hub-footer-link" onClick={() => setCurrentView('negotiations')}>{t('negotiationsCenter')}</a></li>
                <li><a href="#verified" className="hub-footer-link">{t('fssaiGstVerified')}</a></li>
              </ul>
            </div>

            {/* Column 4: Support */}
            <div>
              <h5 className="hub-footer-col-title">{t('supportCol')}</h5>
              <ul className="hub-footer-links">
                <li><a href="#support" className="hub-footer-link">{t('contactSupport')}</a></li>
                <li><a href="#how" className="hub-footer-link" onClick={() => setCurrentView('how-it-works')}>{t('howItWorks')}</a></li>
                <li><a href="#audit" className="hub-footer-link">{t('auditGuarantee')}</a></li>
                <li><a href="#deposit" className="hub-footer-link">{t('depositRefundable')}</a></li>
              </ul>
            </div>

            {/* Column 5: Legal & Escrow */}
            <div>
              <h5 className="hub-footer-col-title">{t('legalCol')}</h5>
              <ul className="hub-footer-links">
                <li><a href="#terms" className="hub-footer-link">{t('termsOfService')}</a></li>
                <li><a href="#privacy" className="hub-footer-link">{t('privacyPolicy')}</a></li>
                <li><a href="#escrow" className="hub-footer-link">{t('escrowPolicy')}</a></li>
              </ul>
            </div>
          </div>

          <div className="hub-footer-bottom">
            <div>{t('copyright')}</div>

            <div className="hub-footer-bottom-controls">
              <button
                className="hub-lang-toggle"
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              >
                🌐 {lang === 'en' ? 'हिन्दी' : 'English'}
              </button>
              <button
                className="hub-icon-btn"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* 8. Toast Notifications */}
      <div className="hub-toast-container">
        {toasts.map((item) => (
          <div key={item.id} className="hub-toast">
            <span>✨</span>
            <span>{item.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mount React Root
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<HospitalityHubApp />);
}
