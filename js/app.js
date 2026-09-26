/**
 * HospitalityHub — Smart B2B Marketplace for Shared Hospitality Resources
 * Production-Ready Vanilla JS Application Controller
 * 
 * Zero-dependency, 100% resilient across file:/// and http:// protocols.
 * Supports:
 * - Light & Dark Theme Engine
 * - Full English & Hindi Localization
 * - Provider ↔ Seeker Dual Role Experiences
 * - Cinematic Hero & Floating Search Panel
 * - 10 Standard Hospitality Categories
 * - 5-Factor Smart Match Score Breakdown
 * - Multi-Photo Gallery & Carousel Modal
 * - Provider 6-Angle Photo Upload UI (Min 3 photos rule)
 * - Planned vs Emergency Rapid Dispatch Booking
 * - Calendar Lock & Collision Prevention System
 * - Multi-Tab Negotiation Center & Counter-Offer Modal
 * - Simulated Escrow Payment & Booking Confirmation
 * - Condition Audit (Pre-Dispatch vs Post-Return)
 * - Provider Revenue & Fleet Utilization Analytics
 */

(function() {
  'use strict';

  // Central Coordinates (BKC Logistics Hub)
  const DEPOT_COORDS = { lat: 19.0674, lng: 72.8687 };

  // Distance Calculator (Haversine Formula)
  function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 5.4;
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

  // Compatibility Match Score (78% - 99%)
  function calculateMatchScore(item, distKm) {
    let score = 94;
    if (distKm < 6) score += 3;
    else if (distKm > 18) score -= 6;
    if (item.rating >= 4.9) score += 2;
    if (item.instantDispatchAvailable) score += 2;
    if (item.availabilityStatus === 'Pre-booked') score -= 14;
    return Math.min(99, Math.max(78, score));
  }

  class HospitalityHubApp {
    constructor() {
      // 1. Core State
      this.theme = localStorage.getItem('hospitalityhub_theme') || 'light';
      this.lang = localStorage.getItem('hospitalityhub_lang') || 'en';
      this.role = 'seeker'; // 'seeker' | 'provider'
      this.currentView = 'marketplace'; // 'marketplace' | 'resources' | 'providers' | 'how-it-works' | 'negotiations' | 'provider-dashboard'
      
      this.inventory = this.loadInventory();
      this.requests = this.loadRequests();
      this.currentUser = (window.DEMO_USERS && window.DEMO_USERS[0]) || {
        businessName: "Imperial Banquets & Hospitality Ltd",
        email: "procurement@imperialbanquets.in",
        role: "Provider & Seeker",
        location: "Lower Parel, Mumbai",
        rating: 4.9,
        reviewsCount: 42
      };

      // 2. Filter & Search State
      this.selectedCategory = 'all';
      this.searchQuery = '';
      this.searchLocation = 'All Locations (MMR)';
      this.searchStartDate = '';
      this.searchEndDate = '';
      this.searchQuantity = 1;
      this.searchBookingType = 'All'; // 'All' | 'Planned' | 'Emergency'
      this.providerFilterStatus = 'All';
      this.negotiationTab = 'incoming';

      // 3. Modal States
      this.selectedResource = null;
      this.activePhotoIndex = 0;
      this.matchScoreModalItem = null;
      this.checkoutResource = null;
      this.checkoutStep = 'review';
      this.paymentMethod = 'upi';
      this.logisticsMode = 'delivery';
      this.negotiationModalItem = null;
      this.photoUploadModalOpen = false;
      this.photoAuditModalItem = null;
      this.notificationsOpen = false;

      // 4. New Listing State
      this.newListingPhotos = [];

      this.init();
    }

    loadInventory() {
      try {
        const saved = localStorage.getItem('hub_inventory_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
      return window.inventoryData || [];
    }

    saveInventory() {
      try {
        localStorage.setItem('hub_inventory_v2', JSON.stringify(this.inventory));
      } catch (e) {}
    }

    loadRequests() {
      try {
        const saved = localStorage.getItem('hub_requests_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
      return window.INITIAL_REQUESTS || [];
    }

    saveRequests() {
      try {
        localStorage.setItem('hub_requests_v2', JSON.stringify(this.requests));
      } catch (e) {}
    }

    t(key) {
      const dict = window.TRANSLATIONS && window.TRANSLATIONS[this.lang];
      return (dict && dict[key]) || key;
    }

    showToast(message, type = 'info') {
      const container = document.getElementById('hub-toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = 'hub-toast';
      toast.innerHTML = `<span>✨</span><span>${message}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 200ms ease';
        setTimeout(() => toast.remove(), 200);
      }, 3500);
    }

    setTheme(newTheme) {
      this.theme = newTheme;
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('hospitalityhub_theme', newTheme);
      this.render();
    }

    setLang(newLang) {
      this.lang = newLang;
      localStorage.setItem('hospitalityhub_lang', newLang);
      this.render();
    }

    setRole(newRole) {
      this.role = newRole;
      if (newRole === 'provider') {
        this.currentView = 'provider-dashboard';
      } else {
        this.currentView = 'marketplace';
      }
      this.showToast(newRole === 'provider' ? "Switched to Provider Dashboard" : "Switched to Seeker Mode", "info");
      this.render();
    }

    init() {
      document.documentElement.setAttribute('data-theme', this.theme);
      this.render();
    }

    // --- Core Render Routine ---
    render() {
      const root = document.getElementById('root');
      if (!root) return;

      root.innerHTML = `
        <div class="hub-app-wrapper" data-theme="${this.theme}">
          ${this.renderHeader()}
          <main class="hub-main">
            ${this.renderMainView()}
          </main>
          ${this.renderFooter()}
          ${this.renderModals()}
          <div id="hub-toast-container" class="hub-toast-container"></div>
        </div>
      `;

      this.bindEvents();
    }

    // --- Header Component ---
    renderHeader() {
      return `
        <header class="hub-header">
          <div class="hub-container">
            <div class="hub-header-inner">
              <!-- Logo -->
              <div class="hub-logo" id="nav-logo">
                <div class="hub-logo-icon">🏨</div>
                <div class="hub-logo-text">
                  <span class="hub-logo-title">${this.t('brandName')}</span>
                  <span class="hub-logo-tagline">${this.t('brandTagline')}</span>
                </div>
              </div>

              <!-- Navigation Links -->
              <nav class="hub-nav">
                <a href="#marketplace" class="hub-nav-link ${this.currentView === 'marketplace' ? 'active' : ''}" data-view="marketplace">
                  ${this.t('marketplace')}
                </a>
                <a href="#resources" class="hub-nav-link ${this.currentView === 'resources' ? 'active' : ''}" data-view="resources">
                  ${this.t('resources')}
                </a>
                <a href="#providers" class="hub-nav-link ${this.currentView === 'providers' ? 'active' : ''}" data-view="providers">
                  ${this.t('providers')}
                </a>
                <a href="#how-it-works" class="hub-nav-link ${this.currentView === 'how-it-works' ? 'active' : ''}" data-view="how-it-works">
                  ${this.t('howItWorks')}
                </a>
                <a href="#negotiations" class="hub-nav-link ${this.currentView === 'negotiations' ? 'active' : ''}" data-view="negotiations">
                  ${this.t('negotiations')}
                </a>
              </nav>

              <!-- Header Controls Right -->
              <div class="hub-header-actions">
                <!-- Language Switcher -->
                <button class="hub-lang-toggle" id="btn-lang-toggle" title="Switch Language">
                  🌐 ${this.lang === 'en' ? 'हिन्दी' : 'English'}
                </button>

                <!-- Theme Switcher -->
                <button class="hub-icon-btn" id="btn-theme-toggle" title="Toggle Light/Dark Theme">
                  ${this.theme === 'light' ? '🌙' : '☀️'}
                </button>

                <!-- Role Switcher (Provider ↔ Seeker) -->
                <div class="hub-role-switch">
                  <button class="hub-role-btn ${this.role === 'seeker' ? 'active' : ''}" id="btn-role-seeker">
                    🔍 ${this.t('seekerMode')}
                  </button>
                  <button class="hub-role-btn ${this.role === 'provider' ? 'active' : ''}" id="btn-role-provider">
                    💼 ${this.t('providerMode')}
                  </button>
                </div>

                <!-- Notifications Bell -->
                <div style="position: relative;">
                  <button class="hub-icon-btn" id="btn-notifications-toggle" title="${this.t('notifications')}">
                    🔔
                    <span class="hub-badge-count">${this.requests.length}</span>
                  </button>

                  ${this.notificationsOpen ? `
                    <div class="hub-notifications-dropdown" style="position: absolute; top: 48px; right: 0; width: 320px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); padding: 1rem; z-index: 1100;">
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                        <strong style="font-size: 0.9rem;">${this.t('notifications')}</strong>
                        <span style="font-size: 0.75rem; color: var(--primary); cursor: pointer;" id="btn-close-notifs">✕</span>
                      </div>
                      <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 260px; overflow-y: auto;">
                        ${this.requests.slice(0, 4).map(r => `
                          <div style="padding: 0.65rem; border-radius: var(--radius-sm); background: var(--bg-muted); font-size: 0.78rem;">
                            <div style="font-weight: 700; color: var(--text-primary);">${r.assetTitle}</div>
                            <div style="color: var(--text-secondary); margin-top: 2px;">${r.notes}</div>
                            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">Status: ${r.status} • ${r.paymentStatus}</div>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>

                <!-- Primary CTA: List a Resource -->
                <button class="hub-btn-primary" id="btn-header-list-resource">
                  ${this.t('listResource')}
                </button>
              </div>
            </div>
          </div>
        </header>
      `;
    }

    // --- Main View Dispatcher ---
    renderMainView() {
      if (this.currentView === 'provider-dashboard') {
        return this.renderProviderDashboard();
      }
      if (this.currentView === 'negotiations') {
        return this.renderNegotiationsCenter();
      }
      if (this.currentView === 'how-it-works') {
        return this.renderHowItWorks();
      }
      if (this.currentView === 'providers') {
        return this.renderProvidersDirectory();
      }
      return this.renderMarketplace();
    }

    // --- Marketplace View ---
    renderMarketplace() {
      const filtered = this.getFilteredInventory();

      return `
        <!-- 1. Cinematic Hero Section -->
        <section class="hub-hero">
          <div class="hub-container">
            <div class="hub-hero-content">
              <div class="hub-hero-eyebrow">
                <span>✨</span> ${this.t('heroEyebrow')}
              </div>
              <h1 class="hub-hero-heading">${this.t('heroHeading')}</h1>
              <p class="hub-hero-subtext">${this.t('heroSubtext')}</p>

              <div class="hub-hero-ctas">
                <button class="hub-btn-primary" id="hero-btn-explore" style="padding: 0.75rem 1.75rem; font-size: 1rem;">
                  ${this.t('exploreResources')}
                </button>
                <button class="hub-btn-secondary" id="hero-btn-list" style="padding: 0.75rem 1.75rem; font-size: 1rem; background: rgba(255,255,255,0.15); color: #ffffff; border-color: rgba(255,255,255,0.3);">
                  ${this.t('listYourResource')}
                </button>
              </div>

              <div class="hub-hero-badges">
                <div class="hub-hero-badge-item">
                  <span>✓</span> ${this.t('verifiedPartnersBadge')}
                </div>
                <div class="hub-hero-badge-item">
                  <span>⚡</span> ${this.t('instantDispatchBadge')}
                </div>
                <div class="hub-hero-badge-item">
                  <span>🔒</span> ${this.t('calendarLockBadge')}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Floating Search Panel -->
        <div class="hub-container" id="search-section">
          <div class="hub-search-wrapper">
            <div class="hub-search-panel">
              <div class="hub-search-grid">
                <!-- What do you need? -->
                <div class="hub-search-field">
                  <label class="hub-search-label">🔍 ${this.t('whatDoYouNeed')}</label>
                  <input
                    type="text"
                    id="search-query-input"
                    class="hub-search-input"
                    placeholder="${this.t('searchPlaceholder')}"
                    value="${this.escapeHtml(this.searchQuery)}"
                  />
                </div>

                <!-- Location -->
                <div class="hub-search-field">
                  <label class="hub-search-label">📍 ${this.t('location')}</label>
                  <select id="search-location-select" class="hub-search-select">
                    ${(window.MMR_REGIONS || []).map(loc => `
                      <option value="${loc}" ${this.searchLocation === loc ? 'selected' : ''}>${loc}</option>
                    `).join('')}
                  </select>
                </div>

                <!-- Required From -->
                <div class="hub-search-field">
                  <label class="hub-search-label">📅 ${this.t('requiredFrom')}</label>
                  <input type="date" id="search-start-date" class="hub-search-input" value="${this.searchStartDate}" />
                </div>

                <!-- Required Until -->
                <div class="hub-search-field">
                  <label class="hub-search-label">📅 ${this.t('requiredUntil')}</label>
                  <input type="date" id="search-end-date" class="hub-search-input" value="${this.searchEndDate}" />
                </div>

                <!-- Quantity -->
                <div class="hub-search-field">
                  <label class="hub-search-label">🔢 ${this.t('quantity')}</label>
                  <input type="number" min="1" max="50" id="search-quantity-input" class="hub-search-input" value="${this.searchQuantity}" />
                </div>

                <!-- Booking Type Toggle -->
                <div class="hub-booking-toggle">
                  <label class="hub-search-label">⚡ ${this.t('bookingType')}</label>
                  <div class="hub-booking-switch-box">
                    <button type="button" class="hub-booking-switch-btn ${this.searchBookingType === 'Planned' ? 'active planned' : ''}" id="btn-toggle-planned">
                      📅 ${this.t('plannedBooking')}
                    </button>
                    <button type="button" class="hub-booking-switch-btn ${this.searchBookingType === 'Emergency' ? 'active emergency' : ''}" id="btn-toggle-emergency">
                      ⚡ ${this.t('emergencyBooking')}
                    </button>
                  </div>
                </div>

                <!-- Search Submit Button -->
                <button class="hub-search-submit-btn" id="btn-submit-search">
                  ${this.t('searchBtn')}
                </button>
              </div>
            </div>
          </div>

          <!-- 3. Horizontal Category Navigation Bar -->
          <div class="hub-category-nav-wrapper">
            <div class="hub-category-nav">
              ${(window.CATEGORIES || []).map(cat => `
                <button class="hub-category-pill ${this.selectedCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                  <span class="hub-category-emoji">${cat.emoji}</span>
                  <span>${this.t(cat.key)}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Results Header & Active Filters -->
          <div class="hub-results-meta">
            <div class="hub-results-count">
              ${this.t('showingResults')} <strong>${filtered.length}</strong> ${this.t('verifiedResourcesFound')}
            </div>

            ${(this.selectedCategory !== 'all' || this.searchBookingType !== 'All' || this.searchQuery) ? `
              <button class="hub-btn-outline" id="btn-clear-filters">
                ✕ ${this.t('clearFilters')}
              </button>
            ` : ''}
          </div>

          <!-- 4. Resource Cards Grid -->
          <div class="hub-resource-grid">
            ${filtered.map(item => this.renderResourceCard(item)).join('')}
          </div>
        </div>

        <!-- 5. Trust & Benefits Feature Row -->
        <section class="hub-trust-section">
          <div class="hub-container">
            <div class="hub-section-header">
              <h2 class="hub-section-title">${this.t('trustHeading')}</h2>
              <p class="hub-section-subtitle">${this.t('trustSubheading')}</p>
            </div>

            <div class="hub-benefits-grid">
              <div class="hub-benefit-card">
                <div class="hub-benefit-icon">🛡️</div>
                <h4 class="hub-benefit-title">${this.t('benefit1Title')}</h4>
                <p class="hub-benefit-desc">${this.t('benefit1Desc')}</p>
              </div>
              <div class="hub-benefit-card">
                <div class="hub-benefit-icon">🎯</div>
                <h4 class="hub-benefit-title">${this.t('benefit2Title')}</h4>
                <p class="hub-benefit-desc">${this.t('benefit2Desc')}</p>
              </div>
              <div class="hub-benefit-card">
                <div class="hub-benefit-icon">⚡</div>
                <h4 class="hub-benefit-title">${this.t('benefit3Title')}</h4>
                <p class="hub-benefit-desc">${this.t('benefit3Desc')}</p>
              </div>
              <div class="hub-benefit-card">
                <div class="hub-benefit-icon">🤝</div>
                <h4 class="hub-benefit-title">${this.t('benefit4Title')}</h4>
                <p class="hub-benefit-desc">${this.t('benefit4Desc')}</p>
              </div>
              <div class="hub-benefit-card">
                <div class="hub-benefit-icon">🔒</div>
                <h4 class="hub-benefit-title">${this.t('benefit5Title')}</h4>
                <p class="hub-benefit-desc">${this.t('benefit5Desc')}</p>
              </div>
              <div class="hub-benefit-card">
                <div class="hub-benefit-icon">📸</div>
                <h4 class="hub-benefit-title">${this.t('benefit6Title')}</h4>
                <p class="hub-benefit-desc">${this.t('benefit6Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 6. Idle Resources Call to Action Banner -->
        <section class="hub-cta-section">
          <div class="hub-container">
            <div class="hub-cta-inner">
              <h2 class="hub-cta-title">${this.t('ctaHeading')}</h2>
              <p class="hub-cta-subtitle">${this.t('ctaSubheading')}</p>
              <div class="hub-cta-buttons">
                <button class="hub-btn-primary" id="cta-btn-list" style="padding: 0.85rem 2rem; font-size: 1.05rem;">
                  ${this.t('ctaListBtn')}
                </button>
                <button class="hub-btn-secondary" id="cta-btn-explore" style="padding: 0.85rem 2rem; font-size: 1.05rem; background: rgba(255,255,255,0.1); color: #ffffff; border-color: rgba(255,255,255,0.25);">
                  ${this.t('ctaExploreBtn')}
                </button>
              </div>
            </div>
          </div>
        </section>
      `;
    }

    // --- Single Resource Card ---
    renderResourceCard(item) {
      const dist = calculateDistanceKm(DEPOT_COORDS.lat, DEPOT_COORDS.lng, item.coordinates.lat, item.coordinates.lng);
      const matchScore = calculateMatchScore(item, dist);

      return `
        <div class="hub-card" data-id="${item.id}">
          <!-- Media Header -->
          <div class="hub-card-media" data-action="view-detail" data-id="${item.id}" style="cursor: pointer;">
            <img src="${item.image}" alt="${item.title}" class="hub-card-img" />

            <div class="hub-card-badges-top">
              <span class="hub-badge hub-badge-verified">
                ✓ ${this.t('verifiedBusiness')}
              </span>

              <span class="hub-badge hub-badge-match" data-action="view-match" data-id="${item.id}" title="View Match Breakdown">
                🎯 ${matchScore}% ${this.t('matchScore')}
              </span>
            </div>

            <span class="hub-badge-booking-type">
              ${item.bookingType === 'Emergency' ? '⚡ ' + this.t('emergencyBooking') : '📅 ' + this.t('plannedBooking')}
            </span>

            <span class="hub-badge-photos-count">
              📷 ${item.photos ? item.photos.length : 1}
            </span>
          </div>

          <!-- Body Content -->
          <div class="hub-card-body">
            <div class="hub-card-meta-top">
              <span class="hub-card-location">
                📍 ${item.location} • ${dist} km ${this.t('away')}
              </span>

              <span class="hub-status-badge ${item.availabilityStatus.toLowerCase()}">
                ${item.availabilityStatus === 'Available' ? '🟢 ' + this.t('available') : ''}
                ${item.availabilityStatus === 'Negotiating' ? '🟡 ' + this.t('negotiating') : ''}
                ${item.availabilityStatus === 'Pre-booked' ? '🔵 ' + this.t('preBooked') : ''}
                ${item.availabilityStatus === 'Unavailable' ? '🔴 ' + this.t('unavailable') : ''}
                ${item.availabilityStatus === 'Completed' ? '⚪ ' + this.t('completed') : ''}
              </span>
            </div>

            <h3 class="hub-card-title" data-action="view-detail" data-id="${item.id}" style="cursor: pointer;">
              ${item.title}
            </h3>

            <div class="hub-card-provider">
              🏢 ${item.shopName}
            </div>

            <div class="hub-card-rating">
              <span class="hub-card-rating-star">⭐</span>
              <span>${item.rating}</span>
              <span class="hub-card-reviews-count">(${item.reviewsCount} ${this.t('reviews')}) • ${item.completedRentals} ${this.t('rentalsCompleted')}</span>
            </div>

            <div class="hub-card-specs">
              ${(item.specifications || []).slice(0, 2).map(s => `
                <span class="hub-card-spec-tag">✓ ${s}</span>
              `).join('')}
            </div>

            <div class="hub-card-footer">
              <div class="hub-card-price-row">
                <div>
                  <span class="hub-card-price-value">₹${item.pricePerDay.toLocaleString()}</span>
                  <span class="hub-card-price-unit"> ${this.t('perDay')}</span>
                </div>
                <div class="hub-card-quantity">
                  ${this.t('availableUnits')}: ${item.quantityAvailable}
                </div>
              </div>

              <div class="hub-card-actions">
                <button class="hub-btn-primary" data-action="request-rental" data-id="${item.id}">
                  ${this.t('requestRental')}
                </button>
                <button class="hub-btn-outline" data-action="negotiate" data-id="${item.id}">
                  ${this.t('negotiate')}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // --- Provider Dashboard View ---
    renderProviderDashboard() {
      const providerItems = this.inventory.filter(item => {
        if (this.providerFilterStatus === 'All') return true;
        return item.availabilityStatus.toLowerCase() === this.providerFilterStatus.toLowerCase();
      });

      return `
        <div class="hub-container" style="padding: 2.5rem 1.5rem;">
          <div class="hub-dashboard-header">
            <div>
              <h1 class="hub-dashboard-title">${this.t('providerOverview')}</h1>
              <p style="color: var(--text-secondary); margin-top: 0.25rem;">
                Managing enterprise listings for <strong>${this.currentUser.businessName}</strong> (GSTIN: 27AAACI1234A1Z5)
              </p>
            </div>

            <button class="hub-btn-primary" id="btn-provider-add-resource">
              ${this.t('addNewResource')}
            </button>
          </div>

          <!-- Metrics Row -->
          <div class="hub-metrics-grid">
            <div class="hub-metric-card">
              <div class="hub-metric-header">
                <span class="hub-metric-label">${this.t('activeResources')}</span>
                <div class="hub-metric-icon" style="background: var(--primary-subtle); color: var(--primary);">📦</div>
              </div>
              <div class="hub-metric-val">${providerItems.length}</div>
            </div>

            <div class="hub-metric-card">
              <div class="hub-metric-header">
                <span class="hub-metric-label">${this.t('bookedResources')}</span>
                <div class="hub-metric-icon" style="background: var(--status-prebooked-bg); color: var(--status-prebooked);">🔒</div>
              </div>
              <div class="hub-metric-val">2</div>
            </div>

            <div class="hub-metric-card">
              <div class="hub-metric-header">
                <span class="hub-metric-label">${this.t('pendingRequests')}</span>
                <div class="hub-metric-icon" style="background: var(--accent-gold-subtle); color: var(--accent-gold);">⏳</div>
              </div>
              <div class="hub-metric-val">${this.requests.filter(r => r.status === 'Negotiating').length}</div>
            </div>

            <div class="hub-metric-card">
              <div class="hub-metric-header">
                <span class="hub-metric-label">${this.t('utilizationRate')}</span>
                <div class="hub-metric-icon" style="background: var(--status-available-bg); color: var(--status-available);">📈</div>
              </div>
              <div class="hub-metric-val">84.2%</div>
            </div>

            <div class="hub-metric-card">
              <div class="hub-metric-header">
                <span class="hub-metric-label">${this.t('totalRevenue')}</span>
                <div class="hub-metric-icon" style="background: var(--primary-subtle); color: var(--primary);">💰</div>
              </div>
              <div class="hub-metric-val">₹1,88,400</div>
            </div>
          </div>

          <!-- Provider Filter Tabs -->
          <div class="hub-tabs">
            ${['All', 'Available', 'Negotiating', 'Pre-booked', 'Completed'].map(status => `
              <button class="hub-tab-btn ${this.providerFilterStatus === status ? 'active' : ''}" data-status="${status}">
                ${status === 'All' ? this.t('filterAll') : ''}
                ${status === 'Available' ? this.t('filterAvailable') : ''}
                ${status === 'Negotiating' ? this.t('filterNegotiating') : ''}
                ${status === 'Pre-booked' ? this.t('filterPreBooked') : ''}
                ${status === 'Completed' ? this.t('filterCompleted') : ''}
              </button>
            `).join('')}
          </div>

          <!-- Provider Resource Cards -->
          <div class="hub-resource-grid">
            ${providerItems.map(item => `
              <div class="hub-card" data-id="${item.id}">
                <div class="hub-card-media" data-action="view-detail" data-id="${item.id}">
                  <img src="${item.image}" alt="${item.title}" class="hub-card-img" />
                  <span class="hub-status-badge ${item.availabilityStatus.toLowerCase()}" style="position: absolute; top: 0.75rem; left: 0.75rem;">
                    ${item.availabilityStatus}
                  </span>
                </div>
                <div class="hub-card-body">
                  <h4 class="hub-card-title">${item.title}</h4>
                  <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                    Category: <strong>${item.category}</strong> • ${item.location}
                  </div>
                  <div style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem;">
                    ₹${item.pricePerDay.toLocaleString()} / day
                  </div>
                  <div class="hub-card-actions">
                    <button class="hub-btn-secondary" data-action="view-detail" data-id="${item.id}">
                      ${this.t('viewDetails')}
                    </button>
                    <button class="hub-btn-outline" data-action="view-audit" data-id="${item.id}">
                      📸 Photo Audit
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // --- Negotiations Center View ---
    renderNegotiationsCenter() {
      return `
        <div class="hub-container" style="padding: 2.5rem 1.5rem;">
          <div class="hub-dashboard-header">
            <div>
              <h1 class="hub-dashboard-title">${this.t('negotiationsCenter')}</h1>
              <p style="color: var(--text-secondary); margin-top: 0.25rem;">
                Direct B2B negotiation, counter-offers, and custom contracts.
              </p>
            </div>
          </div>

          <div class="hub-tabs">
            <button class="hub-tab-btn ${this.negotiationTab === 'incoming' ? 'active' : ''}" data-neg-tab="incoming">
              📥 ${this.t('incomingOffers')} (${this.requests.length})
            </button>
            <button class="hub-tab-btn ${this.negotiationTab === 'counter' ? 'active' : ''}" data-neg-tab="counter">
              🔄 ${this.t('counterOffers')}
            </button>
            <button class="hub-tab-btn ${this.negotiationTab === 'accepted' ? 'active' : ''}" data-neg-tab="accepted">
              ✅ ${this.t('acceptedOffers')}
            </button>
          </div>

          <div class="hub-negotiation-grid">
            ${this.requests.map(req => `
              <div class="hub-negotiation-card">
                <div class="hub-negotiation-header">
                  <div class="hub-negotiation-parties">
                    <span>🏢 ${req.providerBusiness}</span>
                    <span>↔</span>
                    <span>🛒 ${req.seekerBusiness}</span>
                  </div>

                  <span class="hub-status-badge ${req.status.toLowerCase()}">
                    ${req.status}
                  </span>
                </div>

                <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">
                  ${req.assetTitle}
                </div>

                <div class="hub-negotiation-prices">
                  <div class="hub-price-item">
                    <span class="hub-price-item-label">${this.t('listedPrice')}</span>
                    <span class="hub-price-item-val">₹${req.dailyRate.toLocaleString()} / day</span>
                  </div>
                  <div class="hub-price-item">
                    <span class="hub-price-item-label">${this.t('proposedPrice')}</span>
                    <span class="hub-price-item-val" style="color: var(--primary);">
                      ₹${(req.negotiationOffer || req.dailyRate).toLocaleString()}
                    </span>
                  </div>
                  <div class="hub-price-item">
                    <span class="hub-price-item-label">${this.t('rentalDuration')}</span>
                    <span class="hub-price-item-val">${req.days} ${this.t('days')} (${req.startDate} to ${req.endDate})</span>
                  </div>
                </div>

                <div style="background: var(--bg-muted); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.85rem;">
                  <strong>Message:</strong> ${req.notes}
                </div>

                <div class="hub-negotiation-actions">
                  ${req.status === 'Negotiating' ? `
                    <button class="hub-btn-primary" data-action="accept-offer" data-req-id="${req.id}">
                      ✓ ${this.t('acceptOffer')}
                    </button>
                    <button class="hub-btn-outline" data-action="open-counter" data-req-id="${req.id}">
                      🔄 ${this.t('counterOffer')}
                    </button>
                    <button class="hub-btn-secondary" style="color: var(--status-unavailable);" data-action="reject-offer" data-req-id="${req.id}">
                      ✕ ${this.t('rejectOffer')}
                    </button>
                  ` : `
                    <span style="color: var(--status-available); font-weight: 700;">
                      ✓ Escrow Verified (${req.paymentStatus})
                    </span>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // --- How It Works View ---
    renderHowItWorks() {
      return `
        <div class="hub-container" style="padding: 3.5rem 1.5rem;">
          <div class="hub-section-header">
            <h1 class="hub-section-title">${this.t('howItWorks')}</h1>
            <p class="hub-section-subtitle">A seamless shared economy for the hospitality ecosystem.</p>
          </div>

          <div class="hub-benefits-grid" style="margin-top: 2rem;">
            <div class="hub-benefit-card">
              <div class="hub-benefit-icon">1</div>
              <h3 class="hub-benefit-title">For Providers: Monetize Idle Assets</h3>
              <p class="hub-benefit-desc">
                List banquet halls, commercial kitchens, refrigerated transport, and staging gear. Set custom daily rates, security deposits, and availability windows.
              </p>
            </div>

            <div class="hub-benefit-card">
              <div class="hub-benefit-icon">2</div>
              <h3 class="hub-benefit-title">For Seekers: Smart Match & Instant Dispatch</h3>
              <p class="hub-benefit-desc">
                Find verified resources across Mumbai, Thane, and Navi Mumbai. Choose planned advance booking or 45-minute emergency rapid dispatch.
              </p>
            </div>

            <div class="hub-benefit-card">
              <div class="hub-benefit-icon">3</div>
              <h3 class="hub-benefit-title">Automated Calendar Lock & Escrow</h3>
              <p class="hub-benefit-desc">
                Confirmed bookings lock the provider's schedule to prevent double-bookings. Payments and security deposits remain protected in escrow until photo audit completion.
              </p>
            </div>
          </div>
        </div>
      `;
    }

    // --- Providers Directory View ---
    renderProvidersDirectory() {
      return `
        <div class="hub-container" style="padding: 3.5rem 1.5rem;">
          <div class="hub-section-header">
            <h1 class="hub-section-title">Verified Hospitality Providers</h1>
            <p class="hub-section-subtitle">Premier hotels, caterers, and equipment depots across the Mumbai Metropolitan Region.</p>
          </div>

          <div class="hub-benefits-grid">
            ${(window.DEMO_USERS || []).map(user => `
              <div class="hub-benefit-card">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
                  <div class="hub-benefit-icon">🏢</div>
                  <div>
                    <h3 style="font-size: 1.15rem; font-weight: 800;">${user.businessName}</h3>
                    <span style="font-size: 0.78rem; color: var(--primary); font-weight: 700;">✓ Verified B2B Partner</span>
                  </div>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
                  📍 ${user.location} • ⭐ ${user.rating} (${user.reviewsCount} reviews)
                </p>
                <p style="font-size: 0.85rem; color: var(--text-muted);">
                  Contact: ${user.contactPerson} (${user.email})
                </p>
                <div style="margin-top: 1rem;">
                  <button class="hub-btn-primary" data-action="explore-provider-fleet" data-name="${user.businessName}">
                    View Fleet (${user.activeListingsCount || 3} items)
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // --- Footer Component ---
    renderFooter() {
      return `
        <footer class="hub-footer">
          <div class="hub-container">
            <div class="hub-footer-grid">
              <div class="hub-footer-brand">
                <div class="hub-logo">
                  <div class="hub-logo-icon">🏨</div>
                  <div class="hub-logo-text">
                    <span class="hub-logo-title">${this.t('brandName')}</span>
                    <span class="hub-logo-tagline">${this.t('brandTagline')}</span>
                  </div>
                </div>
                <p class="hub-footer-desc">${this.t('footerAbout')}</p>
              </div>

              <div>
                <h5 class="hub-footer-col-title">${this.t('marketplaceCol')}</h5>
                <ul class="hub-footer-links">
                  <li><a href="#spaces" class="hub-footer-link" data-cat="Spaces">${this.t('catSpaces')}</a></li>
                  <li><a href="#kitchen" class="hub-footer-link" data-cat="Kitchen">${this.t('catKitchen')}</a></li>
                  <li><a href="#vehicles" class="hub-footer-link" data-cat="Vehicle">${this.t('catVehicles')}</a></li>
                  <li><a href="#audio" class="hub-footer-link" data-cat="Audio">${this.t('catAudio')}</a></li>
                  <li><a href="#coldchain" class="hub-footer-link" data-cat="ColdChain">${this.t('catColdChain')}</a></li>
                </ul>
              </div>

              <div>
                <h5 class="hub-footer-col-title">${this.t('businessCol')}</h5>
                <ul class="hub-footer-links">
                  <li><a href="#list" class="hub-footer-link" id="footer-link-list">${this.t('listResource')}</a></li>
                  <li><a href="#dashboard" class="hub-footer-link" id="footer-link-dash">${this.t('providerHub')}</a></li>
                  <li><a href="#negotiations" class="hub-footer-link" id="footer-link-neg">${this.t('negotiationsCenter')}</a></li>
                  <li><a href="#verified" class="hub-footer-link">${this.t('fssaiGstVerified')}</a></li>
                </ul>
              </div>

              <div>
                <h5 class="hub-footer-col-title">${this.t('supportCol')}</h5>
                <ul class="hub-footer-links">
                  <li><a href="#support" class="hub-footer-link">${this.t('contactSupport')}</a></li>
                  <li><a href="#how" class="hub-footer-link" data-view="how-it-works">${this.t('howItWorks')}</a></li>
                  <li><a href="#audit" class="hub-footer-link">${this.t('auditGuarantee')}</a></li>
                  <li><a href="#deposit" class="hub-footer-link">${this.t('depositRefundable')}</a></li>
                </ul>
              </div>

              <div>
                <h5 class="hub-footer-col-title">${this.t('legalCol')}</h5>
                <ul class="hub-footer-links">
                  <li><a href="#terms" class="hub-footer-link">${this.t('termsOfService')}</a></li>
                  <li><a href="#privacy" class="hub-footer-link">${this.t('privacyPolicy')}</a></li>
                  <li><a href="#escrow" class="hub-footer-link">${this.t('escrowPolicy')}</a></li>
                </ul>
              </div>
            </div>

            <div class="hub-footer-bottom">
              <div>${this.t('copyright')}</div>

              <div class="hub-footer-bottom-controls">
                <button class="hub-lang-toggle" id="btn-footer-lang">
                  🌐 ${this.lang === 'en' ? 'हिन्दी' : 'English'}
                </button>
                <button class="hub-icon-btn" id="btn-footer-theme">
                  ${this.theme === 'light' ? '🌙' : '☀️'}
                </button>
              </div>
            </div>
          </div>
        </footer>
      `;
    }

    // --- Modals Renderer ---
    renderModals() {
      return `
        ${this.renderDetailModal()}
        ${this.renderMatchScoreModal()}
        ${this.renderCheckoutModal()}
        ${this.renderPhotoUploadModal()}
        ${this.renderCounterOfferModal()}
        ${this.renderPhotoAuditModal()}
      `;
    }

    // Modal: Detail & Carousel
    renderDetailModal() {
      if (!this.selectedResource) return '';
      const item = this.selectedResource;
      const photos = item.photos || [item.image];
      const activePhoto = photos[this.activePhotoIndex] || item.image;

      return `
        <div class="hub-modal-overlay" id="modal-detail-overlay">
          <div class="hub-modal">
            <div class="hub-modal-header">
              <h3 class="hub-modal-title">${item.title}</h3>
              <button class="hub-modal-close" id="btn-close-detail">✕</button>
            </div>

            <div class="hub-modal-body">
              <!-- Multi-Photo Carousel -->
              <div class="hub-gallery-main">
                <img src="${activePhoto}" alt="${item.title}" class="hub-gallery-img" />
                ${photos.length > 1 ? `
                  <button class="hub-gallery-nav-btn prev" id="btn-gallery-prev">‹</button>
                  <button class="hub-gallery-nav-btn next" id="btn-gallery-next">›</button>
                  <span class="hub-gallery-counter">
                    ${this.t('photoCounter')} ${this.activePhotoIndex + 1} ${this.t('of')} ${photos.length}
                  </span>
                ` : ''}
              </div>

              <!-- Thumbnails -->
              ${photos.length > 1 ? `
                <div class="hub-gallery-thumbs">
                  ${photos.map((ph, idx) => `
                    <div class="hub-gallery-thumb ${this.activePhotoIndex === idx ? 'active' : ''}" data-thumb-idx="${idx}">
                      <img src="${ph}" alt="Thumb" />
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <!-- Split Details -->
              <div class="hub-detail-grid">
                <div>
                  <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem;">${this.t('description')}</h4>
                  <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
                    ${item.description}
                  </p>

                  <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem;">${this.t('specifications')}</h4>
                  <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
                    ${(item.specifications || []).map(s => `
                      <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
                        <span style="color: var(--primary); font-weight: 700;">✓</span>
                        <span>${s}</span>
                      </div>
                    `).join('')}
                  </div>

                  <!-- Calendar View -->
                  <div class="hub-calendar-view">
                    <h4 style="font-size: 0.95rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">
                      📅 ${this.t('calendarAvailability')}
                    </h4>
                    <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
                      ${this.t('calendarNotice')}
                    </p>
                    <div class="hub-calendar-grid">
                      ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `
                        <div class="hub-calendar-day-header">${d}</div>
                      `).join('')}
                      ${[24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7].map(num => {
                        const isLocked = item.bookedDates && item.bookedDates.some(bd => bd.endsWith(`-${num < 10 ? '0' + num : num}`));
                        return `
                          <div class="hub-calendar-day ${isLocked ? 'locked' : 'available'}">
                            <span>${num}</span>
                            <span style="font-size: 0.65rem;">${isLocked ? '🔒 Lock' : '🟢 Open'}</span>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                </div>

                <div>
                  <div class="hub-provider-trust-card">
                    <div class="hub-provider-trust-header">
                      <div>
                        <strong style="font-size: 1rem; color: var(--text-primary);">${item.shopName}</strong>
                        <div style="font-size: 0.78rem; color: var(--primary); font-weight: 700;">
                          ✓ ${this.t('verifiedBusinessTag')}
                        </div>
                      </div>
                      <span style="font-size: 1.25rem;">🏢</span>
                    </div>
                    <div class="hub-trust-metrics">
                      <div class="hub-trust-metric-item">
                        <span class="hub-trust-metric-label">Rating</span>
                        <span class="hub-trust-metric-val">⭐ ${item.rating} / 5.0</span>
                      </div>
                      <div class="hub-trust-metric-item">
                        <span class="hub-trust-metric-label">${this.t('responseRate')}</span>
                        <span class="hub-trust-metric-val">${this.t('lessThan15Min')}</span>
                      </div>
                    </div>
                  </div>

                  <div style="background: var(--bg-muted); padding: 1.25rem; border-radius: var(--radius-lg); margin-bottom: 1.25rem;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                      <span style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">
                        ₹${item.pricePerDay.toLocaleString()}
                      </span>
                      <span style="color: var(--text-muted);">${this.t('perDay')}</span>
                    </div>
                    <div style="font-size: 0.82rem; color: var(--text-secondary);">
                      🛡️ ${this.t('refundableDeposit')}: <strong>₹${item.securityDeposit.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <button class="hub-btn-primary" id="btn-detail-checkout" style="width: 100%; justify-content: center; padding: 0.75rem;">
                      ${this.t('proceedCheckout')}
                    </button>
                    <button class="hub-btn-outline" id="btn-detail-negotiate" style="width: 100%; justify-content: center; padding: 0.75rem;">
                      ${this.t('initiateNegotiation')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Modal: Match Score Breakdown
    renderMatchScoreModal() {
      if (!this.matchScoreModalItem) return '';
      return `
        <div class="hub-modal-overlay" id="modal-match-overlay">
          <div class="hub-modal" style="maxWidth: 580px;">
            <div class="hub-modal-header">
              <h3 class="hub-modal-title">🎯 ${this.t('matchScoreTitle')}</h3>
              <button class="hub-modal-close" id="btn-close-match">✕</button>
            </div>
            <div class="hub-modal-body">
              <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="font-size: 3rem; font-weight: 900; color: var(--primary);">96%</div>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">
                  ${this.t('matchScoreSubtitle')}
                </p>
              </div>

              <div class="hub-match-breakdown-list">
                <div class="hub-match-item">
                  <div class="hub-match-item-header">
                    <span>💰 ${this.t('factorPrice')}</span>
                    <span>98%</span>
                  </div>
                  <div class="hub-progress-bar-bg"><div class="hub-progress-bar-fill" style="width: 98%;"></div></div>
                </div>
                <div class="hub-match-item">
                  <div class="hub-match-item-header">
                    <span>📍 ${this.t('factorDistance')} (4.2 km)</span>
                    <span>95%</span>
                  </div>
                  <div class="hub-progress-bar-bg"><div class="hub-progress-bar-fill" style="width: 95%;"></div></div>
                </div>
                <div class="hub-match-item">
                  <div class="hub-match-item-header">
                    <span>📅 ${this.t('factorAvailability')}</span>
                    <span>100%</span>
                  </div>
                  <div class="hub-progress-bar-bg"><div class="hub-progress-bar-fill" style="width: 100%;"></div></div>
                </div>
                <div class="hub-match-item">
                  <div class="hub-match-item-header">
                    <span>⚙️ ${this.t('factorSuitability')}</span>
                    <span>94%</span>
                  </div>
                  <div class="hub-progress-bar-bg"><div class="hub-progress-bar-fill" style="width: 94%;"></div></div>
                </div>
                <div class="hub-match-item">
                  <div class="hub-match-item-header">
                    <span>⚡ ${this.t('factorUrgency')}</span>
                    <span>92%</span>
                  </div>
                  <div class="hub-progress-bar-bg"><div class="hub-progress-bar-fill" style="width: 92%;"></div></div>
                </div>
              </div>

              <div style="margin-top: 2rem; text-align: right;">
                <button class="hub-btn-primary" id="btn-close-match-sub">
                  ${this.t('closeModal')}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Modal: Escrow Checkout Simulator
    renderCheckoutModal() {
      if (!this.checkoutResource) return '';
      const item = this.checkoutResource;

      return `
        <div class="hub-modal-overlay" id="modal-checkout-overlay">
          <div class="hub-modal" style="max-width: 780px;">
            <div class="hub-modal-header">
              <h3 class="hub-modal-title">
                ${this.checkoutStep === 'confirmed' ? this.t('paymentSuccessful') : this.t('checkoutTitle')}
              </h3>
              <button class="hub-modal-close" id="btn-close-checkout">✕</button>
            </div>

            <div class="hub-modal-body">
              ${this.checkoutStep === 'review' ? `
                <div class="hub-checkout-grid">
                  <div>
                    <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.75rem;">${this.t('paymentMethod')}</h4>
                    <div class="hub-payment-methods">
                      <div class="hub-payment-option ${this.paymentMethod === 'upi' ? 'active' : ''}" data-pm="upi">
                        <span style="font-size: 1.5rem;">📱</span>
                        <div>
                          <strong>${this.t('upiPayment')}</strong>
                          <div style="font-size: 0.75rem; color: var(--text-muted);">GPay, PhonePe, Paytm, BHIM</div>
                        </div>
                      </div>
                      <div class="hub-payment-option ${this.paymentMethod === 'card' ? 'active' : ''}" data-pm="card">
                        <span style="font-size: 1.5rem;">💳</span>
                        <div>
                          <strong>${this.t('cardPayment')}</strong>
                          <div style="font-size: 0.75rem; color: var(--text-muted);">Visa, MasterCard, Corporate RuPay</div>
                        </div>
                      </div>
                      <div class="hub-payment-option ${this.paymentMethod === 'netbanking' ? 'active' : ''}" data-pm="netbanking">
                        <span style="font-size: 1.5rem;">🏦</span>
                        <div>
                          <strong>${this.t('netBanking')}</strong>
                          <div style="font-size: 0.75rem; color: var(--text-muted);">HDFC, ICICI, SBI, Axis Corporate</div>
                        </div>
                      </div>
                    </div>

                    <h4 style="font-size: 1.05rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.75rem;">
                      ${this.t('logisticsSelector')}
                    </h4>
                    <div style="display: flex; gap: 0.5rem;">
                      <button type="button" class="hub-booking-switch-btn ${this.logisticsMode === 'delivery' ? 'active planned' : ''}" id="btn-checkout-del" style="flex: 1; padding: 0.65rem;">
                        🚚 ${this.t('siteDelivery')} (+₹850)
                      </button>
                      <button type="button" class="hub-booking-switch-btn ${this.logisticsMode === 'pickup' ? 'active planned' : ''}" id="btn-checkout-pick" style="flex: 1; padding: 0.65rem;">
                        📦 ${this.t('selfPickup')} (${this.t('free')})
                      </button>
                    </div>
                  </div>

                  <div class="hub-order-summary-card">
                    <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem;">${this.t('bookingSummary')}</h4>
                    <div style="font-size: 0.9rem; font-weight: 700; margin-bottom: 0.5rem;">${item.title}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">Provider: ${item.shopName}</div>

                    <div class="hub-summary-row">
                      <span>${this.t('rentalDuration')}</span>
                      <span>2 ${this.t('days')}</span>
                    </div>
                    <div class="hub-summary-row">
                      <span>${this.t('baseSubtotal')}</span>
                      <span>₹${(item.pricePerDay * 2).toLocaleString()}</span>
                    </div>
                    <div class="hub-summary-row">
                      <span>${this.t('logisticsFee')}</span>
                      <span>₹${this.logisticsMode === 'delivery' ? '850' : '0'}</span>
                    </div>
                    <div class="hub-summary-row">
                      <span>${this.t('securityDeposit')}</span>
                      <span>₹${item.securityDeposit.toLocaleString()}</span>
                    </div>
                    <div class="hub-summary-row total">
                      <span>${this.t('tokenAmount')}</span>
                      <span>₹${Math.round((item.pricePerDay * 2) * 0.2).toLocaleString()}</span>
                    </div>

                    <button class="hub-btn-primary" id="btn-confirm-pay" style="width: 100%; margin-top: 1.5rem; padding: 0.85rem; justify-content: center;">
                      🔒 ${this.t('payAndLockCalendar')}
                    </button>
                  </div>
                </div>
              ` : ''}

              ${this.checkoutStep === 'processing' ? `
                <div class="hub-payment-success-box">
                  <div class="hub-success-icon-badge" style="font-size: 2rem;">⏳</div>
                  <h3 style="font-size: 1.35rem; font-weight: 800;">${this.t('processingPayment')}</h3>
                  <p style="color: var(--text-secondary);">Securing escrow tokens and locking calendar schedule.</p>
                </div>
              ` : ''}

              ${this.checkoutStep === 'confirmed' ? `
                <div class="hub-payment-success-box">
                  <div class="hub-success-icon-badge">✓</div>
                  <h3 style="font-size: 1.5rem; font-weight: 800;">${this.t('bookingConfirmed')}</h3>
                  <p style="color: var(--text-secondary);">
                    ${this.t('bookingId')}: <strong>#B2B-98421</strong> • ${this.t('calendarLockedSuccess')}
                  </p>

                  <div style="background: var(--bg-muted); padding: 1rem; border-radius: var(--radius-md); width: 100%; max-width: 420px; text-align: left; font-size: 0.85rem;">
                    <div><strong>Resource:</strong> ${item.title}</div>
                    <div><strong>Provider:</strong> ${item.shopName}</div>
                    <div><strong>Locked Dates:</strong> 2026-10-05 to 2026-10-07 (2 Days)</div>
                    <div><strong>Escrow Token Paid:</strong> ₹${Math.round((item.pricePerDay * 2) * 0.2).toLocaleString()}</div>
                    <div><strong>Status:</strong> 🟢 Confirmed & Calendar Locked</div>
                  </div>

                  <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
                    <button class="hub-btn-secondary" id="btn-voucher-download">
                      📥 ${this.t('downloadVoucher')}
                    </button>
                    <button class="hub-btn-primary" id="btn-return-market">
                      ${this.t('returnToMarketplace')}
                    </button>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }

    // Modal: 6-Angle Photo Upload & Resource Creation
    renderPhotoUploadModal() {
      if (!this.photoUploadModalOpen) return '';

      return `
        <div class="hub-modal-overlay" id="modal-upload-overlay">
          <div class="hub-modal" style="max-width: 840px;">
            <div class="hub-modal-header">
              <h3 class="hub-modal-title">${this.t('addNewResource')}</h3>
              <button class="hub-modal-close" id="btn-close-upload">✕</button>
            </div>

            <div class="hub-modal-body">
              <form id="form-create-resource">
                <!-- 6-Angle Photo Upload Section -->
                <div class="hub-photo-upload-container">
                  <div class="hub-photo-upload-header">
                    <div>
                      <strong style="font-size: 1rem; color: var(--text-primary);">${this.t('photoUploadTitle')}</strong>
                      <div class="hub-upload-guidance-pill" style="margin-top: 4px;">
                        📸 ${this.t('photoUploadGuidance')} (${this.newListingPhotos.length}/6 uploaded)
                      </div>
                    </div>

                    <button type="button" class="hub-btn-outline" id="btn-load-demo-photos" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">
                      ⚡ ${this.t('loadPresetPhotos')}
                    </button>
                  </div>

                  <div class="hub-upload-slots-grid">
                    ${[
                      { key: 'slotFront', label: this.t('slotFront') },
                      { key: 'slotSide', label: this.t('slotSide') },
                      { key: 'slotInterior', label: this.t('slotInterior') },
                      { key: 'slotRear', label: this.t('slotRear') },
                      { key: 'slotCondition', label: this.t('slotCondition') },
                      { key: 'slotSpec', label: this.t('slotSpec') }
                    ].map((slot, idx) => {
                      const img = this.newListingPhotos[idx];
                      return `
                        <div class="hub-upload-slot ${img ? 'has-image' : ''}" data-slot-idx="${idx}">
                          ${img ? `
                            <img src="${img}" alt="${slot.label}" class="hub-upload-preview-img" />
                            <div class="hub-slot-actions">
                              <button type="button" class="hub-slot-btn" data-action="remove-photo" data-idx="${idx}" title="Remove">✕</button>
                            </div>
                          ` : `
                            <span style="font-size: 1.25rem;">📷</span>
                            <span class="hub-upload-slot-label">${slot.label}</span>
                          `}
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <!-- Fields -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                  <div class="hub-search-field">
                    <label class="hub-search-label">Resource Title *</label>
                    <input type="text" id="new-res-title" required placeholder="e.g. 10-Grid Combi Steamer Oven" class="hub-search-input" />
                  </div>

                  <div class="hub-search-field">
                    <label class="hub-search-label">Category *</label>
                    <select id="new-res-cat" class="hub-search-select">
                      ${(window.CATEGORIES || []).filter(c => c.id !== 'all').map(c => `
                        <option value="${c.id}">${this.t(c.key)}</option>
                      `).join('')}
                    </select>
                  </div>

                  <div class="hub-search-field">
                    <label class="hub-search-label">Daily Rental Price (₹) *</label>
                    <input type="number" id="new-res-price" required placeholder="e.g. 8500" class="hub-search-input" />
                  </div>

                  <div class="hub-search-field">
                    <label class="hub-search-label">Refundable Security Deposit (₹)</label>
                    <input type="number" id="new-res-deposit" placeholder="e.g. 4000" class="hub-search-input" />
                  </div>

                  <div class="hub-search-field">
                    <label class="hub-search-label">Booking Type</label>
                    <select id="new-res-btype" class="hub-search-select">
                      <option value="Planned">📅 Planned Booking</option>
                      <option value="Emergency">⚡ Emergency Rapid Dispatch</option>
                    </select>
                  </div>

                  <div class="hub-search-field">
                    <label class="hub-search-label">Location</label>
                    <select id="new-res-loc" class="hub-search-select">
                      ${(window.MMR_REGIONS || []).filter(r => !r.startsWith('All')).map(r => `
                        <option value="${r}">${r}</option>
                      `).join('')}
                    </select>
                  </div>
                </div>

                <div class="hub-search-field" style="margin-bottom: 1rem;">
                  <label class="hub-search-label">Technical Specifications (One per line)</label>
                  <textarea rows="3" id="new-res-specs" class="hub-search-input" placeholder="3-Phase 415V Electric&#10;FSSAI Certified&#10;10 x 1/1 GN Capacity"></textarea>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                  <button type="button" class="hub-btn-secondary" id="btn-cancel-upload">Cancel</button>
                  <button type="submit" class="hub-btn-primary">Publish B2B Listing</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;
    }

    // Modal: Counter Offer
    renderCounterOfferModal() {
      if (!this.negotiationModalItem) return '';
      const req = this.negotiationModalItem;

      return `
        <div class="hub-modal-overlay" id="modal-counter-overlay">
          <div class="hub-modal" style="max-width: 560px;">
            <div class="hub-modal-header">
              <h3 class="hub-modal-title">🔄 ${this.t('sendCounterOffer')}</h3>
              <button class="hub-modal-close" id="btn-close-counter">✕</button>
            </div>

            <div class="hub-modal-body">
              <div style="margin-bottom: 1rem;">
                <strong style="font-size: 1rem;">${req.assetTitle}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Provider: ${req.providerBusiness}</div>
              </div>

              <div class="hub-search-field" style="margin-bottom: 1rem;">
                <label class="hub-search-label">${this.t('proposeNewPrice')}</label>
                <input type="number" id="counter-price-val" class="hub-search-input" value="${req.negotiationOffer || Math.round(req.dailyRate * 0.9)}" />
              </div>

              <div class="hub-search-field" style="margin-bottom: 1.5rem;">
                <label class="hub-search-label">${this.t('counterNotes')}</label>
                <textarea rows="3" id="counter-notes-val" class="hub-search-input" placeholder="e.g. Can we include transport setup for this price?"></textarea>
              </div>

              <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                <button class="hub-btn-secondary" id="btn-cancel-counter">Cancel</button>
                <button class="hub-btn-primary" id="btn-submit-counter">${this.t('sendCounterOffer')}</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Modal: Photo Audit
    renderPhotoAuditModal() {
      if (!this.photoAuditModalItem) return '';
      const item = this.photoAuditModalItem;

      return `
        <div class="hub-modal-overlay" id="modal-audit-overlay">
          <div class="hub-modal" style="max-width: 780px;">
            <div class="hub-modal-header">
              <h3 class="hub-modal-title">📸 ${this.t('photoAuditTitle')}</h3>
              <button class="hub-modal-close" id="btn-close-audit">✕</button>
            </div>

            <div class="hub-modal-body">
              <p style="color: var(--text-secondary); font-size: 0.9rem;">
                ${this.t('photoAuditSubtitle')}
              </p>

              <div class="hub-audit-grid">
                <div class="hub-audit-col">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${this.t('conditionBefore')}</strong>
                    <span class="hub-status-badge available">✓ ${this.t('statusSubmitted')}</span>
                  </div>
                  <div class="hub-audit-photo-reel">
                    <img src="${item.photos ? item.photos[0] : item.image}" alt="Before 1" />
                    <img src="${item.photos && item.photos[1] ? item.photos[1] : item.image}" alt="Before 2" />
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">
                    Inspected & logged at depot dispatch. No cosmetic or electrical defects found.
                  </div>
                </div>

                <div class="hub-audit-col">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${this.t('conditionAfter')}</strong>
                    <span class="hub-status-badge negotiating">⏳ ${this.t('statusPending')}</span>
                  </div>
                  <div class="hub-audit-photo-reel">
                    <img src="${item.photos && item.photos[2] ? item.photos[2] : item.image}" alt="After 1" />
                    <img src="${item.photos && item.photos[3] ? item.photos[3] : item.image}" alt="After 2" />
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">
                    Return inspection verifies mechanical integrity prior to releasing ₹${item.securityDeposit.toLocaleString()} escrow deposit.
                  </div>
                </div>
              </div>

              <div style="margin-top: 1.5rem; text-align: right;">
                <button class="hub-btn-primary" id="btn-release-escrow">
                  ✓ ${this.t('releaseDepositBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // --- Filter Logic ---
    getFilteredInventory() {
      return this.inventory.filter(item => {
        if (this.selectedCategory !== 'all' && item.category !== this.selectedCategory) return false;

        if (this.searchLocation && this.searchLocation !== 'All Locations (MMR)') {
          const locPrefix = this.searchLocation.split(',')[0];
          if (!item.location.includes(locPrefix)) return false;
        }

        if (this.searchBookingType !== 'All' && item.bookingType !== this.searchBookingType) {
          return false;
        }

        if (this.searchQuery.trim()) {
          const q = this.searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchShop = item.shopName.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchSpecs = item.specifications && item.specifications.some(s => s.toLowerCase().includes(q));
          if (!matchTitle && !matchShop && !matchDesc && !matchSpecs) return false;
        }

        return true;
      });
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
      });
    }

    // --- Interactive Event Bindings ---
    bindEvents() {
      const root = document.getElementById('root');
      if (!root) return;

      // Theme toggle
      const btnTheme = document.getElementById('btn-theme-toggle');
      if (btnTheme) btnTheme.onclick = () => this.setTheme(this.theme === 'light' ? 'dark' : 'light');

      const btnFooterTheme = document.getElementById('btn-footer-theme');
      if (btnFooterTheme) btnFooterTheme.onclick = () => this.setTheme(this.theme === 'light' ? 'dark' : 'light');

      // Lang toggle
      const btnLang = document.getElementById('btn-lang-toggle');
      if (btnLang) btnLang.onclick = () => this.setLang(this.lang === 'en' ? 'hi' : 'en');

      const btnFooterLang = document.getElementById('btn-footer-lang');
      if (btnFooterLang) btnFooterLang.onclick = () => this.setLang(this.lang === 'en' ? 'hi' : 'en');

      // Role switcher
      const btnRoleSeeker = document.getElementById('btn-role-seeker');
      if (btnRoleSeeker) btnRoleSeeker.onclick = () => this.setRole('seeker');

      const btnRoleProvider = document.getElementById('btn-role-provider');
      if (btnRoleProvider) btnRoleProvider.onclick = () => this.setRole('provider');

      // Logo
      const logo = document.getElementById('nav-logo');
      if (logo) logo.onclick = () => { this.currentView = 'marketplace'; this.render(); };

      // Nav links
      document.querySelectorAll('.hub-nav-link, [data-view]').forEach(link => {
        link.onclick = (e) => {
          e.preventDefault();
          const v = link.getAttribute('data-view');
          if (v) {
            this.currentView = v;
            this.render();
          }
        };
      });

      // Notifications toggle
      const btnNotifs = document.getElementById('btn-notifications-toggle');
      if (btnNotifs) btnNotifs.onclick = () => { this.notificationsOpen = !this.notificationsOpen; this.render(); };

      const btnCloseNotifs = document.getElementById('btn-close-notifs');
      if (btnCloseNotifs) btnCloseNotifs.onclick = () => { this.notificationsOpen = false; this.render(); };

      // List a resource button
      const btnList = document.getElementById('btn-header-list-resource');
      if (btnList) btnList.onclick = () => { this.photoUploadModalOpen = true; this.render(); };

      const heroBtnList = document.getElementById('hero-btn-list');
      if (heroBtnList) heroBtnList.onclick = () => { this.photoUploadModalOpen = true; this.render(); };

      const ctaBtnList = document.getElementById('cta-btn-list');
      if (ctaBtnList) ctaBtnList.onclick = () => { this.photoUploadModalOpen = true; this.render(); };

      const heroBtnExplore = document.getElementById('hero-btn-explore');
      if (heroBtnExplore) heroBtnExplore.onclick = () => {
        const sec = document.getElementById('search-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      };

      const ctaBtnExplore = document.getElementById('cta-btn-explore');
      if (ctaBtnExplore) ctaBtnExplore.onclick = () => {
        const sec = document.getElementById('search-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      };

      // Search Inputs
      const qInput = document.getElementById('search-query-input');
      if (qInput) {
        qInput.oninput = (e) => {
          this.searchQuery = e.target.value;
        };
        qInput.onkeydown = (e) => {
          if (e.key === 'Enter') this.render();
        };
      }

      const locSelect = document.getElementById('search-location-select');
      if (locSelect) locSelect.onchange = (e) => { this.searchLocation = e.target.value; this.render(); };

      const startDateInput = document.getElementById('search-start-date');
      if (startDateInput) startDateInput.onchange = (e) => { this.searchStartDate = e.target.value; };

      const endDateInput = document.getElementById('search-end-date');
      if (endDateInput) endDateInput.onchange = (e) => { this.searchEndDate = e.target.value; };

      const qtyInput = document.getElementById('search-quantity-input');
      if (qtyInput) qtyInput.oninput = (e) => { this.searchQuantity = Math.max(1, parseInt(e.target.value, 10) || 1); };

      const btnTogglePlanned = document.getElementById('btn-toggle-planned');
      if (btnTogglePlanned) btnTogglePlanned.onclick = () => {
        this.searchBookingType = this.searchBookingType === 'Planned' ? 'All' : 'Planned';
        this.render();
      };

      const btnToggleEmergency = document.getElementById('btn-toggle-emergency');
      if (btnToggleEmergency) btnToggleEmergency.onclick = () => {
        this.searchBookingType = this.searchBookingType === 'Emergency' ? 'All' : 'Emergency';
        this.render();
      };

      const btnSubmitSearch = document.getElementById('btn-submit-search');
      if (btnSubmitSearch) btnSubmitSearch.onclick = () => {
        this.render();
        this.showToast(`Found ${this.getFilteredInventory().length} verified resources`, "info");
      };

      const btnClearFilters = document.getElementById('btn-clear-filters');
      if (btnClearFilters) btnClearFilters.onclick = () => {
        this.selectedCategory = 'all';
        this.searchBookingType = 'All';
        this.searchQuery = '';
        this.searchLocation = 'All Locations (MMR)';
        this.render();
      };

      // Category Navigation Pills
      document.querySelectorAll('.hub-category-pill, [data-cat]').forEach(pill => {
        pill.onclick = () => {
          const cat = pill.getAttribute('data-cat');
          if (cat) {
            this.selectedCategory = cat;
            this.currentView = 'marketplace';
            this.render();
          }
        };
      });

      // Provider Dashboard Tabs
      document.querySelectorAll('.hub-tab-btn[data-status]').forEach(tab => {
        tab.onclick = () => {
          this.providerFilterStatus = tab.getAttribute('data-status');
          this.render();
        };
      });

      // Negotiation Tabs
      document.querySelectorAll('.hub-tab-btn[data-neg-tab]').forEach(tab => {
        tab.onclick = () => {
          this.negotiationTab = tab.getAttribute('data-neg-tab');
          this.render();
        };
      });

      // Card action delegation
      document.querySelectorAll('[data-action]').forEach(el => {
        el.onclick = (e) => {
          e.stopPropagation();
          const act = el.getAttribute('data-action');
          const id = el.getAttribute('data-id');
          const item = this.inventory.find(x => x.id === id);

          if (act === 'view-detail' && item) {
            this.selectedResource = item;
            this.activePhotoIndex = 0;
            this.render();
          }
          if (act === 'view-match' && item) {
            this.matchScoreModalItem = item;
            this.render();
          }
          if (act === 'request-rental' && item) {
            this.checkoutResource = item;
            this.checkoutStep = 'review';
            this.render();
          }
          if (act === 'negotiate' && item) {
            this.negotiationModalItem = {
              id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
              assetId: item.id,
              assetTitle: item.title,
              providerBusiness: item.shopName,
              seekerBusiness: this.currentUser.businessName,
              dailyRate: item.pricePerDay,
              totalAmount: item.pricePerDay * 2,
              days: 2
            };
            this.render();
          }
          if (act === 'view-audit' && item) {
            this.photoAuditModalItem = item;
            this.render();
          }
        };
      });

      // Detail Modal Actions
      const btnCloseDetail = document.getElementById('btn-close-detail');
      if (btnCloseDetail) btnCloseDetail.onclick = () => { this.selectedResource = null; this.render(); };

      const overlayDetail = document.getElementById('modal-detail-overlay');
      if (overlayDetail) overlayDetail.onclick = (e) => {
        if (e.target === overlayDetail) { this.selectedResource = null; this.render(); }
      };

      const btnGalPrev = document.getElementById('btn-gallery-prev');
      if (btnGalPrev && this.selectedResource) {
        btnGalPrev.onclick = () => {
          const photos = this.selectedResource.photos || [this.selectedResource.image];
          this.activePhotoIndex = this.activePhotoIndex > 0 ? this.activePhotoIndex - 1 : photos.length - 1;
          this.render();
        };
      }

      const btnGalNext = document.getElementById('btn-gallery-next');
      if (btnGalNext && this.selectedResource) {
        btnGalNext.onclick = () => {
          const photos = this.selectedResource.photos || [this.selectedResource.image];
          this.activePhotoIndex = this.activePhotoIndex < photos.length - 1 ? this.activePhotoIndex + 1 : 0;
          this.render();
        };
      }

      document.querySelectorAll('.hub-gallery-thumb[data-thumb-idx]').forEach(th => {
        th.onclick = () => {
          this.activePhotoIndex = parseInt(th.getAttribute('data-thumb-idx'), 10);
          this.render();
        };
      });

      const btnDetailCheckout = document.getElementById('btn-detail-checkout');
      if (btnDetailCheckout && this.selectedResource) {
        btnDetailCheckout.onclick = () => {
          this.checkoutResource = this.selectedResource;
          this.checkoutStep = 'review';
          this.selectedResource = null;
          this.render();
        };
      }

      const btnDetailNegotiate = document.getElementById('btn-detail-negotiate');
      if (btnDetailNegotiate && this.selectedResource) {
        btnDetailNegotiate.onclick = () => {
          this.negotiationModalItem = {
            id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
            assetId: this.selectedResource.id,
            assetTitle: this.selectedResource.title,
            providerBusiness: this.selectedResource.shopName,
            seekerBusiness: this.currentUser.businessName,
            dailyRate: this.selectedResource.pricePerDay,
            totalAmount: this.selectedResource.pricePerDay * 2,
            days: 2
          };
          this.selectedResource = null;
          this.render();
        };
      }

      // Match Score Modal Actions
      const btnCloseMatch = document.getElementById('btn-close-match');
      if (btnCloseMatch) btnCloseMatch.onclick = () => { this.matchScoreModalItem = null; this.render(); };

      const btnCloseMatchSub = document.getElementById('btn-close-match-sub');
      if (btnCloseMatchSub) btnCloseMatchSub.onclick = () => { this.matchScoreModalItem = null; this.render(); };

      // Checkout Modal Actions
      const btnCloseCheckout = document.getElementById('btn-close-checkout');
      if (btnCloseCheckout) btnCloseCheckout.onclick = () => { this.checkoutResource = null; this.render(); };

      document.querySelectorAll('.hub-payment-option[data-pm]').forEach(opt => {
        opt.onclick = () => {
          this.paymentMethod = opt.getAttribute('data-pm');
          this.render();
        };
      });

      const btnCheckoutDel = document.getElementById('btn-checkout-del');
      if (btnCheckoutDel) btnCheckoutDel.onclick = () => { this.logisticsMode = 'delivery'; this.render(); };

      const btnCheckoutPick = document.getElementById('btn-checkout-pick');
      if (btnCheckoutPick) btnCheckoutPick.onclick = () => { this.logisticsMode = 'pickup'; this.render(); };

      const btnConfirmPay = document.getElementById('btn-confirm-pay');
      if (btnConfirmPay && this.checkoutResource) {
        btnConfirmPay.onclick = () => {
          this.checkoutStep = 'processing';
          this.render();

          setTimeout(() => {
            const bookingId = `B2B-${Math.floor(10000 + Math.random() * 90000)}`;
            const newReq = {
              id: bookingId,
              assetId: this.checkoutResource.id,
              assetTitle: this.checkoutResource.title,
              category: this.checkoutResource.category,
              providerBusiness: this.checkoutResource.shopName,
              seekerBusiness: this.currentUser.businessName,
              startDate: "2026-10-05",
              endDate: "2026-10-07",
              days: 2,
              quantity: this.searchQuantity || 1,
              dailyRate: this.checkoutResource.pricePerDay,
              totalAmount: this.checkoutResource.pricePerDay * 2,
              tokenAmount: Math.round(this.checkoutResource.pricePerDay * 2 * 0.2),
              escrowDeposit: this.checkoutResource.securityDeposit,
              bookingMode: this.checkoutResource.bookingType || "Planned",
              deliveryMode: this.logisticsMode === 'delivery' ? 'Dedicated Site Delivery' : 'Depot Self Pickup',
              status: "Approved",
              paymentStatus: "Paid (Token Verified)",
              paymentMethod: this.paymentMethod.toUpperCase(),
              notes: `Confirmed via ${this.paymentMethod.toUpperCase()} escrow. Calendar locked.`,
              history: []
            };

            this.requests.unshift(newReq);
            this.saveRequests();

            this.inventory = this.inventory.map(item => {
              if (item.id === this.checkoutResource.id) {
                const locked = item.bookedDates ? [...item.bookedDates, "2026-10-05", "2026-10-06", "2026-10-07"] : ["2026-10-05", "2026-10-06", "2026-10-07"];
                return { ...item, availabilityStatus: "Pre-booked", bookedDates: locked };
              }
              return item;
            });
            this.saveInventory();

            this.checkoutStep = 'confirmed';
            this.showToast("Payment verified & calendar dates locked!", "success");
            this.render();
          }, 1200);
        };
      }

      const btnVoucher = document.getElementById('btn-voucher-download');
      if (btnVoucher) btnVoucher.onclick = () => this.showToast("PDF Booking Voucher generated & downloaded", "success");

      const btnReturnMarket = document.getElementById('btn-return-market');
      if (btnReturnMarket) btnReturnMarket.onclick = () => { this.checkoutResource = null; this.render(); };

      // Photo Upload / Add Resource Actions
      const btnCloseUpload = document.getElementById('btn-close-upload');
      if (btnCloseUpload) btnCloseUpload.onclick = () => { this.photoUploadModalOpen = false; this.render(); };

      const btnCancelUpload = document.getElementById('btn-cancel-upload');
      if (btnCancelUpload) btnCancelUpload.onclick = () => { this.photoUploadModalOpen = false; this.render(); };

      const btnLoadDemoPhotos = document.getElementById('btn-load-demo-photos');
      if (btnLoadDemoPhotos) {
        btnLoadDemoPhotos.onclick = () => {
          this.newListingPhotos = [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80"
          ];
          this.showToast("Loaded 4 verified demo photos", "success");
          this.render();
        };
      }

      document.querySelectorAll('[data-action="remove-photo"]').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          this.newListingPhotos = this.newListingPhotos.filter((_, i) => i !== idx);
          this.render();
        };
      });

      const formCreate = document.getElementById('form-create-resource');
      if (formCreate) {
        formCreate.onsubmit = (e) => {
          e.preventDefault();
          const title = document.getElementById('new-res-title').value;
          const cat = document.getElementById('new-res-cat').value;
          const price = parseInt(document.getElementById('new-res-price').value, 10);
          const deposit = parseInt(document.getElementById('new-res-deposit').value, 10) || Math.round(price * 0.4);
          const btype = document.getElementById('new-res-btype').value;
          const loc = document.getElementById('new-res-loc').value;
          const specsRaw = document.getElementById('new-res-specs').value;

          const specs = specsRaw ? specsRaw.split('\n').filter(s => s.trim()) : ["Commercial Grade", "FSSAI / Safety Tested"];
          const photos = this.newListingPhotos.length > 0 ? this.newListingPhotos : ["https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"];

          const newItem = {
            id: `hub-${Math.floor(100 + Math.random() * 900)}`,
            title,
            category: cat,
            shopName: this.currentUser.businessName,
            vendorType: "Hospitality Partner",
            location: loc,
            fulfillmentType: "Dedicated Site Delivery",
            pricePerDay: price,
            securityDeposit: deposit,
            quantityAvailable: 1,
            availabilityStatus: "Available",
            bookingType: btype,
            verified: true,
            rating: 5.0,
            reviewsCount: 1,
            completedRentals: 0,
            description: "Newly listed verified hospitality resource.",
            specifications: specs,
            photos: photos,
            image: photos[0],
            coordinates: DEPOT_COORDS,
            instantDispatchAvailable: btype === 'Emergency',
            bookedDates: [],
            timeSlots: ["Full Day (24 Hrs)"]
          };

          this.inventory.unshift(newItem);
          this.saveInventory();
          this.photoUploadModalOpen = false;
          this.newListingPhotos = [];
          this.showToast("Resource listed successfully!", "success");
          this.render();
        };
      }

      // Counter Offer Modal Actions
      const btnCloseCounter = document.getElementById('btn-close-counter');
      if (btnCloseCounter) btnCloseCounter.onclick = () => { this.negotiationModalItem = null; this.render(); };

      const btnCancelCounter = document.getElementById('btn-cancel-counter');
      if (btnCancelCounter) btnCancelCounter.onclick = () => { this.negotiationModalItem = null; this.render(); };

      const btnSubmitCounter = document.getElementById('btn-submit-counter');
      if (btnSubmitCounter && this.negotiationModalItem) {
        btnSubmitCounter.onclick = () => {
          const val = parseInt(document.getElementById('counter-price-val').value, 10);
          const notes = document.getElementById('counter-notes-val').value;

          this.requests = this.requests.map(r => {
            if (r.id === this.negotiationModalItem.id) {
              return {
                ...r,
                status: "Negotiating",
                negotiationOffer: val,
                notes: notes || `Counter-offer proposed at ₹${val.toLocaleString()} / day.`
              };
            }
            return r;
          });
          this.saveRequests();
          this.negotiationModalItem = null;
          this.showToast(this.t('counterSuccess'), "success");
          this.render();
        };
      }

      // Offer Accept / Reject
      document.querySelectorAll('[data-action="accept-offer"]').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-req-id');
          this.requests = this.requests.map(r => r.id === id ? { ...r, status: "Approved" } : r);
          this.saveRequests();
          this.showToast("Offer accepted! Escrow token generated.", "success");
          this.render();
        };
      });

      document.querySelectorAll('[data-action="reject-offer"]').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-req-id');
          this.requests = this.requests.map(r => r.id === id ? { ...r, status: "Rejected" } : r);
          this.saveRequests();
          this.showToast("Offer declined.", "info");
          this.render();
        };
      });

      document.querySelectorAll('[data-action="open-counter"]').forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute('data-req-id');
          const req = this.requests.find(r => r.id === id);
          if (req) {
            this.negotiationModalItem = req;
            this.render();
          }
        };
      });

      // Photo Audit Release Escrow
      const btnReleaseEscrow = document.getElementById('btn-release-escrow');
      if (btnReleaseEscrow) {
        btnReleaseEscrow.onclick = () => {
          this.showToast("Escrow security deposit cleared & released!", "success");
          this.photoAuditModalItem = null;
          this.render();
        };
      }

      const btnCloseAudit = document.getElementById('btn-close-audit');
      if (btnCloseAudit) btnCloseAudit.onclick = () => { this.photoAuditModalItem = null; this.render(); };
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.hospitalityHubApp = new HospitalityHubApp();
    });
  } else {
    window.hospitalityHubApp = new HospitalityHubApp();
  }
})();
