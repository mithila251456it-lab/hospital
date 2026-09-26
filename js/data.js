/**
 * HospitalityHub B2B Resource Exchange - Central Data & Localization Layer
 * 
 * Includes:
 * - Complete English & Hindi (EN/HI) UI Dictionary
 * - 10 Standard Hospitality Categories
 * - Verified B2B Inventory across MMR with Multi-Photo Arrays
 * - Real-time Negotiation & Request Seeds
 * - Verified Demo Users
 */

// 1. Translations Dictionary (English & Hindi)
const TRANSLATIONS = {
  en: {
    // Brand & Header
    brandName: "HospitalityHub",
    brandTagline: "B2B Resource Exchange",
    marketplace: "Marketplace",
    resources: "Resources",
    providers: "Providers",
    howItWorks: "How It Works",
    negotiations: "Negotiations",
    seekerMode: "Seeker",
    providerMode: "Provider",
    listResource: "+ List a Resource",
    notifications: "Notifications",
    noNotifications: "No new notifications",
    markAllRead: "Mark all as read",
    signIn: "Sign In",
    switchAccount: "Switch Account",
    
    // Hero Section
    heroEyebrow: "B2B Hospitality Resource Marketplace",
    heroHeading: "Find the Right Hospitality Resource for Your Next Requirement",
    heroSubtext: "Discover verified resources from hospitality businesses, compare availability, negotiate directly and book with confidence.",
    exploreResources: "Explore Resources",
    listYourResource: "List Your Resource",
    verifiedPartnersBadge: "100% Verified Businesses",
    instantDispatchBadge: "Emergency Dispatch Available",
    calendarLockBadge: "Automated Calendar Lock & Escrow",

    // Search Panel
    whatDoYouNeed: "What do you need?",
    searchPlaceholder: "e.g. Combi Oven, 500-Seater Banquet, Reefer Van, Line Array...",
    location: "Location",
    allLocations: "All Locations (MMR)",
    requiredFrom: "Required From",
    requiredUntil: "Required Until",
    quantity: "Quantity",
    bookingType: "Booking Type",
    plannedBooking: "Planned Booking",
    emergencyBooking: "Emergency Booking",
    searchBtn: "Search Resources",
    activeFilters: "Active Filters",
    clearFilters: "Clear All",
    showingResults: "Showing",
    verifiedResourcesFound: "verified resources found",

    // Categories
    allCategories: "All Categories",
    catSpaces: "Spaces",
    catKitchen: "Kitchen & Catering",
    catVehicles: "Vehicles",
    catFurniture: "Furniture",
    catEquipment: "Event Equipment",
    catAudio: "Audio / AV",
    catColdChain: "Cold Chain",
    catLogistics: "Logistics",
    catUtilities: "Utilities",
    catOther: "Other Resources",

    // Resource Card
    verifiedBusiness: "Verified Business",
    matchScore: "Match",
    smartMatch: "Smart Match",
    available: "Available",
    negotiating: "Negotiating",
    preBooked: "Pre-booked",
    unavailable: "Unavailable",
    completed: "Completed",
    perDay: "/ day",
    perHour: "/ hr",
    availableUnits: "Available Units",
    requestRental: "Request Rental",
    negotiate: "Negotiate",
    viewDetails: "View Details",
    refundableDeposit: "Refundable Deposit",
    reviews: "reviews",
    rentalsCompleted: "rentals completed",
    away: "away",

    // Match Score Breakdown
    matchScoreTitle: "Smart Match Score Analysis",
    matchScoreSubtitle: "AI-powered compatibility score based on 5 operational factors:",
    factorPrice: "Price & Budget Fit",
    factorDistance: "Proximity & Logistics",
    factorAvailability: "Calendar Availability",
    factorSuitability: "Technical Suitability",
    factorUrgency: "Urgency / Dispatch Readiness",
    closeModal: "Close",

    // Resource Detail UI
    photoGallery: "Photo Gallery",
    photoCounter: "Photo",
    of: "of",
    specifications: "Technical Specifications",
    description: "Resource Description",
    termsConditions: "Commercial Terms & Conditions",
    providerProfile: "Provider Business Profile",
    responseRate: "Avg. Response Time",
    lessThan15Min: "< 15 minutes",
    memberSince: "Member Since",
    verifiedLicense: "Verified FSSAI / GSTIN / Trade License",
    calendarAvailability: "Live Calendar & Locked Dates",
    calendarNotice: "Dates marked with 🔒 are locked by confirmed bookings.",
    logisticsSelector: "Fulfillment & Logistics",
    siteDelivery: "Dedicated Site Delivery",
    selfPickup: "Depot Self Pickup",
    estimatedDeliveryTime: "Est. Transit Time",
    logisticsFee: "Logistics Fee",
    free: "Free",
    calculateTotal: "Estimated Cost Breakdown",
    rentalDuration: "Rental Duration",
    days: "days",
    baseSubtotal: "Base Rental Subtotal",
    securityDeposit: "Refundable Security Deposit",
    tokenAmount: "Token Advance (20%)",
    totalEstimate: "Total Estimated Booking Value",
    proceedCheckout: "Proceed to Rental Request",
    initiateNegotiation: "Initiate Price Negotiation",

    // Photo Upload UI
    photoUploadTitle: "Upload Resource Photos",
    photoUploadGuidance: "Minimum 3 photos recommended for verified B2B listing",
    slotFront: "Front Angle",
    slotSide: "Side View",
    slotInterior: "Interior / Mechanism",
    slotRear: "Rear / Engine / Back",
    slotCondition: "Current Condition",
    slotSpec: "Specification Plate / NOC",
    setAsCover: "Set as Cover",
    removePhoto: "Remove",
    uploadPlaceholder: "Click or drag photo here",
    photosUploadedCount: "photos uploaded",
    loadPresetPhotos: "Load Demo Photo Set",

    // Role Navigation
    seekerHub: "Seeker Dashboard",
    providerHub: "Provider Dashboard",
    myRequests: "My Requests",
    myNegotiations: "My Negotiations",
    myBookings: "My Bookings",
    savedResources: "Saved Resources",
    compareResources: "Compare Resources",
    
    // Provider Dashboard
    providerOverview: "Provider Performance Overview",
    activeResources: "Active Fleet / Resources",
    bookedResources: "Currently Booked",
    pendingRequests: "Pending Requests",
    utilizationRate: "Fleet Utilization Rate",
    totalRevenue: "Total Gross Revenue",
    monthlyRevenue: "This Month's Revenue",
    myResourceList: "My Listed Resources",
    incomingRequests: "Incoming Requests & Negotiations",
    providerCalendar: "Master Availability Calendar",
    revenueAnalytics: "Revenue & Payout Analytics",
    photoAudits: "Condition Audit Sign-Offs",
    filterAll: "All",
    filterAvailable: "Available",
    filterPending: "Pending",
    filterNegotiating: "Negotiating",
    filterPreBooked: "Pre-booked",
    filterOngoing: "Ongoing",
    filterCompleted: "Completed",
    filterRejected: "Rejected",
    addNewResource: "+ Add New Resource",

    // Negotiations Tab
    negotiationsCenter: "B2B Negotiation Center",
    incomingOffers: "Incoming Offers",
    outgoingOffers: "Outgoing Offers",
    counterOffers: "Counter Offers",
    acceptedOffers: "Accepted",
    rejectedOffers: "Rejected",
    expiredOffers: "Expired",
    listedPrice: "Listed Price",
    proposedPrice: "Proposed Price",
    priceDifference: "Price Difference",
    acceptOffer: "Accept Offer",
    rejectOffer: "Reject Offer",
    counterOffer: "Counter Offer",
    sendCounterOffer: "Send Counter Offer",
    proposeNewPrice: "Propose New Daily Price (₹)",
    counterNotes: "Message / Terms for Counter-Offer",
    counterSuccess: "Counter-offer sent successfully!",

    // Payment & Checkout
    checkoutTitle: "Simulated B2B Escrow Checkout",
    checkoutSubtitle: "Secure token payment to lock calendar dates with verified escrow protection.",
    bookingSummary: "Booking Summary",
    paymentMethod: "Select Payment Method",
    upiPayment: "UPI (Instant QR / VPA)",
    cardPayment: "Corporate Card (Visa / MC / RuPay)",
    netBanking: "Net Banking (IMPS / NEFT)",
    payAndLockCalendar: "Pay Token & Lock Calendar",
    processingPayment: "Verifying Escrow & Locking Calendar...",
    paymentSuccessful: "Payment Successful!",
    bookingConfirmed: "Booking Confirmed & Verified",
    bookingId: "Booking ID",
    calendarLockedSuccess: "Calendar dates locked on provider's schedule.",
    downloadVoucher: "Download Booking Voucher",
    returnToMarketplace: "Return to Marketplace",

    // Security & Trust
    securityTitle: "Enterprise Trust & Protection",
    verifiedBusinessTag: "100% Verified Business",
    fssaiGstVerified: "GSTIN, FSSAI & Trade License Verified",
    escrowProtection: "Escrow Protected Payment",
    auditGuarantee: "2-Step Condition Audit Guarantee",
    depositRefundable: "100% Refundable Security Deposit",

    // Photo Audit UI
    photoAuditTitle: "Resource Condition Audit",
    photoAuditSubtitle: "Mandatory 2-step photo audit before dispatch and upon return.",
    conditionBefore: "Condition Before Rental (Pre-Dispatch)",
    conditionAfter: "Condition After Rental (Post-Return)",
    statusSubmitted: "Submitted & Verified",
    statusReviewed: "Reviewed & Approved",
    statusPending: "Pending Review",
    releaseDepositBtn: "Release Escrow Deposit",

    // Trust Benefits Section
    trustHeading: "Why Leading Hospitality Brands Choose HospitalityHub",
    trustSubheading: "Built specifically for hotels, caterers, banquet venues, and event production enterprises.",
    benefit1Title: "Verified Businesses Only",
    benefit1Desc: "Every provider and seeker undergoes strict KYC, GSTIN, and hospitality license checks.",
    benefit2Title: "Smart Match Compatibility",
    benefit2Desc: "Instant matchmaking considering distance, inventory specs, price, and urgent availability.",
    benefit3Title: "Dual Planned & Emergency Booking",
    benefit3Desc: "Book weeks in advance or trigger emergency 45-minute rapid dispatch when equipment fails.",
    benefit4Title: "Direct B2B Negotiation",
    benefit4Desc: "Transparent counter-offers, bulk multi-day discounts, and custom commercial terms.",
    benefit5Title: "Automated Calendar Lock",
    benefit5Desc: "Real-time collision prevention ensures zero double-booking across shared regional assets.",
    benefit6Title: "Secure Escrow & Photo Audits",
    benefit6Desc: "Funds held safely in escrow with 2-step pre-dispatch and post-return condition verification.",

    // Call to Action
    ctaHeading: "Have Resources Sitting Idle?",
    ctaSubheading: "Turn unused banquet halls, commercial kitchens, transport vans, and staging equipment into high-yield revenue.",
    ctaListBtn: "List Your Resource",
    ctaExploreBtn: "Explore Marketplace",

    // Footer
    footerAbout: "HospitalityHub is India's premier B2B hospitality resource exchange, empowering hotels, caterers, venues, and event enterprises to monetize idle capacity and access shared equipment on demand.",
    marketplaceCol: "Marketplace",
    businessCol: "For Businesses",
    supportCol: "Support & Safety",
    legalCol: "Legal & Escrow",
    aboutUs: "About HospitalityHub",
    contactSupport: "24/7 Logistics Desk",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    escrowPolicy: "Escrow & Dispute Policy",
    copyright: "© 2026 HospitalityHub B2B Technologies Pvt Ltd. All rights reserved."
  },

  hi: {
    // Brand & Header
    brandName: "HospitalityHub",
    brandTagline: "बी2बी रिसोर्स एक्सचेंज",
    marketplace: "मार्केटप्लेस",
    resources: "संसाधन",
    providers: "प्रदाता",
    howItWorks: "यह कैसे काम करता है",
    negotiations: "मोलभाव / बातचीत",
    seekerMode: "मांगकर्ता (सीकर)",
    providerMode: "प्रदाता (प्रोवाइडर)",
    listResource: "+ संसाधन सूचीबद्ध करें",
    notifications: "सूचनाएं",
    noNotifications: "कोई नई सूचना नहीं है",
    markAllRead: "सभी को पढ़ा हुआ चिन्हित करें",
    signIn: "साइन इन",
    switchAccount: "खाता बदलें",

    // Hero Section
    heroEyebrow: "बी2बी हॉस्पिटैलिटी रिसोर्स मार्केटप्लेस",
    heroHeading: "अपनी अगली आवश्यकता के लिए सही हॉस्पिटैलिटी संसाधन खोजें",
    heroSubtext: "हॉस्पिटैलिटी व्यवसायों से सत्यापित संसाधन खोजें, उपलब्धता की तुलना करें, सीधे बातचीत करें और विश्वास के साथ बुक करें।",
    exploreResources: "संसाधनों का पता लगाएं",
    listYourResource: "अपना संसाधन सूचीबद्ध करें",
    verifiedPartnersBadge: "100% सत्यापित व्यवसाय",
    instantDispatchBadge: "आपातकालीन डिस्पैच उपलब्ध",
    calendarLockBadge: "स्वचालित कैलेंडर लॉक और एस्क्रो सुरक्षा",

    // Search Panel
    whatDoYouNeed: "आपको क्या चाहिए?",
    searchPlaceholder: "उदा. कॉम्बी ओवन, 500-सीटर बैंक्वेट, रेफ्रिजरेटेड वैन, साउंड सिस्टम...",
    location: "स्थान",
    allLocations: "सभी स्थान (एमएमआर क्षेत्र)",
    requiredFrom: "आवश्यकता तिथि (शुरू)",
    requiredUntil: "आवश्यकता तिथि (समाप्ति)",
    quantity: "मात्रा (इकाइयां)",
    bookingType: "बुकिंग का प्रकार",
    plannedBooking: "नियोजित बुकिंग",
    emergencyBooking: "आपातकालीन बुकिंग",
    searchBtn: "संसाधन खोजें",
    activeFilters: "सक्रिय फ़िल्टर",
    clearFilters: "सभी हटाएं",
    showingResults: "दिखाया जा रहा है",
    verifiedResourcesFound: "सत्यापित संसाधन मिले",

    // Categories
    allCategories: "सभी श्रेणियां",
    catSpaces: "हॉल एवं स्थल",
    catKitchen: "रसोई एवं खानपान",
    catVehicles: "वाहन एवं परिवहन",
    catFurniture: "फर्नीचर",
    catEquipment: "इवेंट उपकरण",
    catAudio: "ऑडियो / एवी सिस्टम",
    catColdChain: "कोल्ड चेन एवं फ्रीजर",
    catLogistics: "लॉजिस्टिक्स",
    catUtilities: "पावर एवं जनरेटर",
    catOther: "अन्य संसाधन",

    // Resource Card
    verifiedBusiness: "सत्यापित व्यवसाय",
    matchScore: "मैच",
    smartMatch: "स्मार्ट मैच",
    available: "उपलब्ध",
    negotiating: "बातचीत जारी",
    preBooked: "पहले से बुक",
    unavailable: "अनुपलब्ध",
    completed: "पूर्ण",
    perDay: "/ दिन",
    perHour: "/ घंटा",
    availableUnits: "उपलब्ध इकाइयाँ",
    requestRental: "किराया अनुरोध",
    negotiate: "मोलभाव करें",
    viewDetails: "विवरण देखें",
    refundableDeposit: "वापसी योग्य सुरक्षा राशि",
    reviews: "समीक्षाएं",
    rentalsCompleted: "किराये पूर्ण",
    away: "दूरी",

    // Match Score Breakdown
    matchScoreTitle: "स्मार्ट मैच स्कोर विश्लेषण",
    matchScoreSubtitle: "5 परिचालन कारकों पर आधारित एआई संगतता स्कोर:",
    factorPrice: "मूल्य एवं बजट उपयुक्तता",
    factorDistance: "दूरी एवं लॉजिस्टिक्स",
    factorAvailability: "कैलेंडर उपलब्धता",
    factorSuitability: "तकनीकी विशिष्टता उपयुक्तता",
    factorUrgency: "आपातकालीन तत्परता",
    closeModal: "बंद करें",

    // Resource Detail UI
    photoGallery: "फोटो गैलरी",
    photoCounter: "फोटो",
    of: "का",
    specifications: "तकनीकी विनिर्देश",
    description: "संसाधन विवरण",
    termsConditions: "व्यावसायिक नियम एवं शर्तें",
    providerProfile: "प्रदाता व्यवसाय प्रोफ़ाइल",
    responseRate: "औसत प्रतिक्रिया समय",
    lessThan15Min: "< 15 मिनट",
    memberSince: "सदस्यता वर्ष",
    verifiedLicense: "सत्यापित एफएसएसएआई / जीएसटी / व्यापार लाइसेंस",
    calendarAvailability: "लाइव कैलेंडर और लॉक की गई तिथियां",
    calendarNotice: "🔒 से चिन्हित तिथियां अन्य बुकिंग द्वारा लॉक हैं।",
    logisticsSelector: "वितरण एवं लॉजिस्टिक्स",
    siteDelivery: "स्थल पर डिलीवरी",
    selfPickup: "डिपो से स्वयं पिकअप",
    estimatedDeliveryTime: "अनुमानित डिलीवरी समय",
    logisticsFee: "लॉजिस्टिक्स शुल्क",
    free: "निःशुल्क",
    calculateTotal: "अनुमानित लागत विवरण",
    rentalDuration: "किराया अवधि",
    days: "दिन",
    baseSubtotal: "मूल किराया उप-योग",
    securityDeposit: "वापसी योग्य सुरक्षा जमा",
    tokenAmount: "अग्रिम टोकन राशि (20%)",
    totalEstimate: "कुल अनुमानित बुकिंग मूल्य",
    proceedCheckout: "किराया अनुरोध के लिए आगे बढ़ें",
    initiateNegotiation: "मूल्य बातचीत शुरू करें",

    // Photo Upload UI
    photoUploadTitle: "संसाधन की तस्वीरें अपलोड करें",
    photoUploadGuidance: "सत्यापित बी2बी लिस्टिंग के लिए न्यूनतम 3 तस्वीरें अनुशंसित हैं",
    slotFront: "सामने का कोण",
    slotSide: "साइड व्यू",
    slotInterior: "आंतरिक / तंत्र",
    slotRear: "पीछे का भाग / इंजन",
    slotCondition: "वर्तमान स्थिति",
    slotSpec: "विशिष्टता प्लेट / प्रमाणपत्र",
    setAsCover: "कवर फोटो बनाएं",
    removePhoto: "हटाएं",
    uploadPlaceholder: "फोटो यहां क्लिक करें या खींचें",
    photosUploadedCount: "तस्वीरें अपलोड की गईं",
    loadPresetPhotos: "डेमो तस्वीरें लोड करें",

    // Role Navigation
    seekerHub: "मांगकर्ता डैशबोर्ड",
    providerHub: "प्रदाता डैशबोर्ड",
    myRequests: "मेरे अनुरोध",
    myNegotiations: "मेरी बातचीत",
    myBookings: "मेरी बुकिंग",
    savedResources: "सहेजे गए संसाधन",
    compareResources: "संसाधनों की तुलना करें",

    // Provider Dashboard
    providerOverview: "प्रदाता प्रदर्शन अवलोकन",
    activeResources: "सक्रिय संसाधन",
    bookedResources: "वर्तमान में बुक",
    pendingRequests: "लंबित अनुरोध",
    utilizationRate: "उपयोग दर (यूटिलाइज़ेशन)",
    totalRevenue: "कुल सकल राजस्व",
    monthlyRevenue: "इस महीने का राजस्व",
    myResourceList: "मेरे सूचीबद्ध संसाधन",
    incomingRequests: "आने वाले अनुरोध और मोलभाव",
    providerCalendar: "मास्टर उपलब्धता कैलेंडर",
    revenueAnalytics: "राजस्व एवं भुगतान विश्लेषण",
    photoAudits: "स्थिति ऑडिट स्वीकृति",
    filterAll: "सभी",
    filterAvailable: "उपलब्ध",
    filterPending: "लंबित",
    filterNegotiating: "बातचीत जारी",
    filterPreBooked: "पहले से बुक",
    filterOngoing: "चालू",
    filterCompleted: "पूर्ण",
    filterRejected: "अस्वीकृत",
    addNewResource: "+ नया संसाधन जोड़ें",

    // Negotiations Tab
    negotiationsCenter: "बी2बी मोलभाव केंद्र",
    incomingOffers: "आने वाले प्रस्ताव",
    outgoingOffers: "भेजे गए प्रस्ताव",
    counterOffers: "जवाबी प्रस्ताव",
    acceptedOffers: "स्वीकृत",
    rejectedOffers: "अस्वीकृत",
    expiredOffers: "समाप्त",
    listedPrice: "सूचीबद्ध मूल्य",
    proposedPrice: "प्रस्तावित मूल्य",
    priceDifference: "मूल्य अंतर / छूट",
    acceptOffer: "प्रस्ताव स्वीकार करें",
    rejectOffer: "प्रस्ताव अस्वीकार करें",
    counterOffer: "जवाबी प्रस्ताव दें",
    sendCounterOffer: "जवाबी प्रस्ताव भेजें",
    proposeNewPrice: "नया दैनिक मूल्य प्रस्तावित करें (₹)",
    counterNotes: "जवाबी प्रस्ताव के नियम / संदेश",
    counterSuccess: "जवाबी प्रस्ताव सफलतापूर्वक भेजा गया!",

    // Payment & Checkout
    checkoutTitle: "सिम्युलेटेड बी2बी एस्क्रो चेकआउट",
    checkoutSubtitle: "सत्यापित एस्क्रो सुरक्षा के साथ कैलेंडर तिथियों को लॉक करने के लिए सुरक्षित टोकन भुगतान।",
    bookingSummary: "बुकिंग सारांश",
    paymentMethod: "भुगतान विधि चुनें",
    upiPayment: "यूपीआई (त्वरित क्यूआर / वीपीए)",
    cardPayment: "कॉर्पोरेट कार्ड (वीज़ा / मास्टरकार्ड / रुपे)",
    netBanking: "नेट बैंकिंग (आईएमपीएस / एनईएफटी)",
    payAndLockCalendar: "टोकन का भुगतान करें और कैलेंडर लॉक करें",
    processingPayment: "एस्क्रो सत्यापित और कैलेंडर लॉक किया जा रहा है...",
    paymentSuccessful: "भुगतान सफल!",
    bookingConfirmed: "बुकिंग पुष्टि एवं सत्यापन पूर्ण",
    bookingId: "बुकिंग आईडी",
    calendarLockedSuccess: "प्रदाता के शेड्यूल पर कैलेंडर तिथियां लॉक कर दी गई हैं।",
    downloadVoucher: "बुकिंग वाउचर डाउनलोड करें",
    returnToMarketplace: "मार्केटप्लेस पर लौटें",

    // Security & Trust
    securityTitle: "एंटरप्राइज विश्वास और सुरक्षा",
    verifiedBusinessTag: "100% सत्यापित व्यवसाय",
    fssaiGstVerified: "जीएसटीआईएन, एफएसएसएआई और व्यापार लाइसेंस सत्यापित",
    escrowProtection: "एस्क्रो संरक्षित भुगतान",
    auditGuarantee: "2-चरणीय स्थिति ऑडिट गारंटी",
    depositRefundable: "100% वापसी योग्य सुरक्षा जमा",

    // Photo Audit UI
    photoAuditTitle: "संसाधन स्थिति ऑडिट",
    photoAuditSubtitle: "डिस्पैच से पहले और वापसी पर अनिवार्य 2-चरणीय फोटो ऑडिट।",
    conditionBefore: "किराये से पहले स्थिति (डिस्पैच पूर्व)",
    conditionAfter: "किराये के बाद स्थिति (वापसी पश्चात)",
    statusSubmitted: "प्रस्तुत एवं सत्यापित",
    statusReviewed: "समीक्षित एवं स्वीकृत",
    statusPending: "समीक्षा लंबित",
    releaseDepositBtn: "एस्क्रो जमा राशि जारी करें",

    // Trust Benefits Section
    trustHeading: "शीर्ष हॉस्पिटैलिटी ब्रांड HospitalityHub क्यों चुनते हैं",
    trustSubheading: "होटलों, कैटरर्स, बैंक्वेट स्थलों और इवेंट प्रोडक्शन उद्यमों के लिए विशेष रूप से निर्मित।",
    benefit1Title: "केवल सत्यापित व्यवसाय",
    benefit1Desc: "प्रत्येक प्रदाता और मांगकर्ता का सख्त केवाईसी, जीएसटी और लाइसेंस सत्यापन होता है।",
    benefit2Title: "स्मार्ट मैच अनुकूलता",
    benefit2Desc: "दूरी, विशिष्टताओं, मूल्य और उपलब्धता के आधार पर त्वरित सर्वोत्तम मैच।",
    benefit3Title: "नियोजित एवं आपातकालीन बुकिंग",
    benefit3Desc: "हफ्तों पहले बुक करें या उपकरण विफलता पर 45 मिनट का त्वरित आपातकालीन डिस्पैच पाएं।",
    benefit4Title: "प्रत्यक्ष बी2बी मोलभाव",
    benefit4Desc: "पारदर्शी जवाबी प्रस्ताव, बहु-दिवसीय थोक छूट और अनुकूलित व्यावसायिक शर्तें।",
    benefit5Title: "स्वचालित कैलेंडर लॉक",
    benefit5Desc: "साझा संसाधनों में दोहराव वाली बुकिंग रोकने के लिए वास्तविक समय का कैलेंडर लॉक।",
    benefit6Title: "सुरक्षित एस्क्रो एवं फोटो ऑडिट",
    benefit6Desc: "धन सुरक्षित एस्क्रो में रहता है और 2-चरणीय फोटो सत्यापन के बाद ही जारी होता है।",

    // Call to Action
    ctaHeading: "क्या आपके संसाधन खाली पड़े हैं?",
    ctaSubheading: "अप्रयुक्त बैंक्वेट हॉल, वाणिज्यिक रसोई, परिवहन वैन और मंच उपकरणों को उच्च आय में बदलें।",
    ctaListBtn: "अपना संसाधन सूचीबद्ध करें",
    ctaExploreBtn: "मार्केटप्लेस देखें",

    // Footer
    footerAbout: "HospitalityHub भारत का प्रमुख बी2बी हॉस्पिटैलिटी रिसोर्स एक्सचेंज है, जो होटलों, कैटरर्स और इवेंट आयोजकों को अपनी अतिरिक्त क्षमता से कमाई करने और मांग पर उपकरण किराए पर लेने में सक्षम बनाता है।",
    marketplaceCol: "मार्केटप्लेस",
    businessCol: "व्यवसायों के लिए",
    supportCol: "सहायता एवं सुरक्षा",
    legalCol: "कानूनी एवं एस्क्रो",
    aboutUs: "HospitalityHub के बारे में",
    contactSupport: "24/7 लॉजिस्टिक्स हेल्पडेस्क",
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    escrowPolicy: "एस्क्रो एवं विवाद नीति",
    copyright: "© 2026 HospitalityHub B2B Technologies Pvt Ltd. सर्वाधिकार सुरक्षित।"
  }
};

// 2. Central 10 Categories Definition with Icons and Localized IDs
const CATEGORIES = [
  { id: "all", key: "allCategories", icon: "layout-grid", emoji: "🏢" },
  { id: "Spaces", key: "catSpaces", icon: "building-2", emoji: "🏨" },
  { id: "Kitchen", key: "catKitchen", icon: "utensils-crossed", emoji: "🍽️" },
  { id: "Vehicle", key: "catVehicles", icon: "truck", emoji: "🚐" },
  { id: "Furniture", key: "catFurniture", icon: "armchair", emoji: "🪑" },
  { id: "Equipment", key: "catEquipment", icon: "tent", emoji: "🎪" },
  { id: "Audio", key: "catAudio", icon: "volume-2", emoji: "🔊" },
  { id: "ColdChain", key: "catColdChain", icon: "snowflake", emoji: "❄️" },
  { id: "Logistics", key: "catLogistics", icon: "package-check", emoji: "🚚" },
  { id: "Utilities", key: "catUtilities", icon: "zap", emoji: "⚡" },
  { id: "Other", key: "catOther", icon: "box", emoji: "📦" }
];

const MMR_CLIENT_ORIGIN = {
  name: "Bandra Kurla Complex (BKC) Central Logistics Depot",
  coordinates: { lat: 19.0674, lng: 72.8687 }
};

const MMR_REGIONS = [
  "All Locations (MMR)",
  "Lower Parel, Mumbai",
  "Bandra West, Mumbai",
  "Andheri East, Mumbai",
  "Ghatkopar West, Mumbai",
  "Dadar West, Mumbai",
  "Majiwada, Thane",
  "Kalyan West, Thane",
  "Dombivli East, Thane",
  "Vashi, Navi Mumbai",
  "Panvel, Navi Mumbai",
  "Bhiwandi Industrial Hub",
  "Vasai East, Extended MMR"
];

const BUSINESS_TYPES = [
  "Hotel & Resort",
  "Catering Enterprise",
  "Banquet Venue",
  "Event Planner & Production",
  "Cloud Kitchen Network",
  "Logistics & Cold Storage",
  "Institutional Hospitality"
];

// 3. Comprehensive Curated B2B Hospitality Inventory (20 Items across 10 Categories)
let inventoryData = [
  // 1. SPACES (Venues & Banquets)
  {
    id: "hub-01",
    title: "500-Seater Grand Banquet Hall & Manicured Lawn",
    category: "Spaces",
    shopName: "Imperial Banquets & Hospitality Ltd",
    vendorType: "Hotel & Banquet Venue",
    location: "Lower Parel, Mumbai",
    fulfillmentType: "Depot Self Pickup",
    pricePerDay: 28000,
    securityDeposit: 12000,
    quantityAvailable: 1,
    availabilityStatus: "Available",
    bookingType: "Planned",
    verified: true,
    rating: 4.9,
    reviewsCount: 42,
    completedRentals: 56,
    description: "Centrally air-conditioned grand luxury ballroom with an attached 8,000 sq.ft private landscaped lawn. Features dedicated VIP dressing suites, high-voltage 3-phase power line for staging/concert audio, and valet parking for 120+ executive vehicles.",
    specifications: [
      "500 Seated / 850 Floating Guest Capacity",
      "Central HVAC Climate Controlled Ceiling (18ft height)",
      "Dedicated Bridal & VIP Green Rooms with en-suite baths",
      "125 kVA Silent Generator Backup Included",
      "Valet Parking Bay for 120+ Vehicles"
    ],
    photos: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 18.9986, lng: 72.8311 },
    instantDispatchAvailable: false,
    bookedDates: ["2026-09-12", "2026-09-13", "2026-09-14", "2026-09-15"],
    timeSlots: ["Morning (8 AM – 2 PM)", "Evening (5 PM – 12 AM)", "Full Day (24 Hrs)"]
  },
  {
    id: "hub-02",
    title: "Pillarless Corporate Ballroom & Conference Center",
    category: "Spaces",
    shopName: "The Westside Grand Hotel & Suites",
    vendorType: "Hotel & Resort",
    location: "Bandra West, Mumbai",
    fulfillmentType: "Depot Self Pickup",
    pricePerDay: 35000,
    securityDeposit: 15000,
    quantityAvailable: 1,
    availabilityStatus: "Available",
    bookingType: "Planned",
    verified: true,
    rating: 4.8,
    reviewsCount: 36,
    completedRentals: 48,
    description: "Architectural masterpiece pillarless hall equipped with motorized acoustic partition screens, crystal chandeliers, built-in dual 4K laser projection screens, and high-speed dedicated gigabit fiber connection for hybrid summits.",
    specifications: [
      "Pillarless 6,500 sq.ft Hall with 20ft Clear Height",
      "Dual 4K Laser Projectors & Drop-Down Screens",
      "Commercial Warming Kitchen & Service Alley",
      "Dedicated Service Elevator for Heavy Rigging",
      "FSSAI Certified In-House Food Preparation Area"
    ],
    photos: [
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 19.0596, lng: 72.8295 },
    instantDispatchAvailable: false,
    bookedDates: [],
    timeSlots: ["Full Day (8 AM – 10 PM)", "Evening Gala (5 PM – 1 AM)"]
  },

  // 2. KITCHEN & CATERING
  {
    id: "hub-03",
    title: "10-Tray Commercial Rational Combi Oven & Steamer",
    category: "Kitchen",
    shopName: "Royal Kitchens & Equipment Depot",
    vendorType: "Catering Enterprise",
    location: "Ghatkopar West, Mumbai",
    fulfillmentType: "Dedicated Site Delivery",
    pricePerDay: 9500,
    securityDeposit: 4500,
    quantityAvailable: 3,
    availabilityStatus: "Available",
    bookingType: "Emergency",
    verified: true,
    rating: 4.9,
    reviewsCount: 38,
    completedRentals: 62,
    description: "Heavy-duty 10-grid programmable Rational Combi Oven with steam injection, core temperature probe, and self-cleaning cycle. Perfect for high-volume banquet production, baking, and precision sous-vide finishing.",
    specifications: [
      "10 x 1/1 GN Pan Capacity",
      "3-Phase 415V Electric Power with Industrial Plug",
      "Integrated Automatic Wash System with CareControl",
      "Digital Touchscreen with 1,200 Recipe Presets",
      "Supplied with Stainless Trolley Stand & Water Softener"
    ],
    photos: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1590725140246-20acdee442be?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 19.0860, lng: 72.9090 },
    instantDispatchAvailable: true,
    bookedDates: ["2026-09-08", "2026-09-09", "2026-09-10"],
    timeSlots: ["24-Hour Production Block", "Multi-Day Event Rental"]
  },
  {
    id: "hub-04",
    title: "Industrial 4-Burner High-Pressure Gas Bank & Deep Fryers",
    category: "Kitchen",
    shopName: "Metro Catering Logistics Network",
    vendorType: "Catering Enterprise",
    location: "Kalyan West, Thane",
    fulfillmentType: "Dedicated Site Delivery",
    pricePerDay: 4200,
    securityDeposit: 2000,
    quantityAvailable: 4,
    availabilityStatus: "Available",
    bookingType: "Emergency",
    verified: true,
    rating: 4.8,
    reviewsCount: 29,
    completedRentals: 44,
    description: "Modular mobile commercial cooking bank. 4 heavy cast-iron burners with pilot ignition, twin 15L commercial deep fryers, and integrated drip trays. Sanitized and safety-certified prior to every dispatch.",
    specifications: [
      "4-Burner High BTU Commercial Gas Range",
      "Twin 15L Double Basket Fryer Units",
      "Heavy Duty 304 Food-Grade Stainless Steel Body",
      "High-Pressure LPG Manifold & Regulator Included",
      "Castor Wheels with Safety Floor Foot Brakes"
    ],
    photos: [
      "https://images.unsplash.com/photo-1590725140246-20acdee442be?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1590725140246-20acdee442be?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 19.2437, lng: 73.1355 },
    instantDispatchAvailable: true,
    bookedDates: [],
    timeSlots: ["Single Day Rental", "Multi-Day Event Pack"]
  },

  // 3. VEHICLES (Hospitality Fleet)
  {
    id: "hub-05",
    title: "7-Seater Executive Hospitality Van (Luxury MPV)",
    category: "Vehicle",
    shopName: "TransMMR Hospitality Fleet",
    vendorType: "Logistics Partner",
    location: "Panvel, Navi Mumbai",
    fulfillmentType: "Dedicated Site Delivery",
    pricePerDay: 4800,
    securityDeposit: 2500,
    quantityAvailable: 2,
    availabilityStatus: "Available",
    bookingType: "Emergency",
    verified: true,
    rating: 4.9,
    reviewsCount: 45,
    completedRentals: 68,
    description: "Executive 7-seater MPV with plush reclining captain seats, dual-zone air conditioning, ambient interior LED lighting, and large rear luggage space for VIP guest airport transfers and executive summit delegations.",
    specifications: [
      "7-Seater (Reclining Captain Chairs with Armrests)",
      "Dual-Zone Independent Climate Control AC",
      "Commercial Yellow Plate All-Maharashtra Permit",
      "Uniformed Chauffeur with Verified KYC Background",
      "Sanitized Interior, Complimentary Bottled Water & Wi-Fi"
    ],
    photos: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 18.9894, lng: 73.1175 },
    instantDispatchAvailable: true,
    bookedDates: [],
    timeSlots: ["8 Hours / 80 Km", "12 Hours / 120 Km", "Outstation 24-Hr"]
  },
  {
    id: "hub-06",
    title: "Refrigerated Catering Transport Van (3 Ton Thermo-King)",
    category: "Vehicle",
    shopName: "Apex Catering Logistics",
    vendorType: "Logistics Partner",
    location: "Bhiwandi Industrial Hub",
    fulfillmentType: "Dedicated Site Delivery",
    pricePerDay: 5200,
    securityDeposit: 2500,
    quantityAvailable: 3,
    availabilityStatus: "Available",
    bookingType: "Emergency",
    verified: true,
    rating: 4.8,
    reviewsCount: 51,
    completedRentals: 74,
    description: "Insulated thermo-king reefer truck specifically equipped for perishable catering transportation, gourmet dairy, prepared banquet courses, and iced dessert buffets across Mumbai and surrounding regions.",
    specifications: [
      "3-Ton Payload Insulated Container Body",
      "Thermo-King Chiller Unit (-5°C to +4°C)",
      "Real-Time GPS & Digital Temperature Telematics",
      "Driver + Heavy Loading Helper Included",
      "24/7 Roadside Assistance & Fleet NOC"
    ],
    photos: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 19.2967, lng: 73.0631 },
    instantDispatchAvailable: true,
    bookedDates: ["2026-09-24", "2026-09-25", "2026-09-26"],
    timeSlots: ["Morning Shift (6 AM – 2 PM)", "Evening Shift (3 PM – 11 PM)", "Full Day (24 Hrs)"]
  },

  // 4. FURNITURE
  {
    id: "hub-07",
    title: "Gold Chiavari Banquet Chairs & Velvet Cushions (Set of 200)",
    category: "Furniture",
    shopName: "Elite Furniture Depot",
    vendorType: "Rental Depot",
    location: "Dadar West, Mumbai",
    fulfillmentType: "Dedicated Site Delivery",
    pricePerDay: 7500,
    securityDeposit: 3000,
    quantityAvailable: 6,
    availabilityStatus: "Available",
    bookingType: "Planned",
    verified: true,
    rating: 4.8,
    reviewsCount: 33,
    completedRentals: 52,
    description: "Classic high-density resin gold Chiavari chairs paired with stain-resistant ivory velvet padded cushions. Stacked and shrink-wrapped in protective canvas covers for zero-scratch transportation.",
    specifications: [
      "200 Heavy Resin Gold Chiavari Chairs",
      "High-Density Sponge Ivory Velvet Tie-on Cushions",
      "Load Bearing Tested to 250 kg per Chair",
      "Protective Waterproof Transit Covers Included",
      "Setup & Stacking Team Available on Request"
    ],
    photos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 19.0178, lng: 72.8478 },
    instantDispatchAvailable: true,
    bookedDates: [],
    timeSlots: ["12-Hour Event Duration", "24-Hour Rental Block"]
  },
  {
    id: "hub-08",
    title: "Round Solid Banquet Dining Tables (60-inch, Set of 25)",
    category: "Furniture",
    shopName: "Elite Furniture Depot",
    vendorType: "Rental Depot",
    location: "Dadar West, Mumbai",
    fulfillmentType: "Dedicated Site Delivery",
    pricePerDay: 5500,
    securityDeposit: 2500,
    quantityAvailable: 4,
    availabilityStatus: "Available",
    bookingType: "Planned",
    verified: true,
    rating: 4.7,
    reviewsCount: 25,
    completedRentals: 39,
    description: "Commercial 5ft (60-inch) heavy wooden round banquet tables with self-locking steel folding legs. Accommodates 8-10 dinner guests comfortably. Includes champagne table skirts and linen.",
    specifications: [
      "25 Solid Marine-Plywood Round Tables (60-inch)",
      "Heavy-Gauge Powder-Coated Steel Folding Legs",
      "Vinyl Edge Bumper Guarding for Impact Protection",
      "Complete with 25 Champagne Satin Tablecloths",
      "Collapsible Trolley Racks for Rapid Unloading"
    ],
    photos: [
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 19.0178, lng: 72.8478 },
    instantDispatchAvailable: false,
    bookedDates: [],
    timeSlots: ["Full Day (24 Hrs)"]
  },

  // 5. EVENT EQUIPMENT
  {
    id: "hub-09",
    title: "Outdoor Waterproof German Pagoda Canopy Tents (50x30ft)",
    category: "Equipment",
    shopName: "Suburban Tent & Staging House",
    vendorType: "Event Planner & Production",
    location: "Dombivli East, Thane",
    fulfillmentType: "Dedicated Site Delivery",
    pricePerDay: 12000,
    securityDeposit: 5000,
    quantityAvailable: 2,
    availabilityStatus: "Pre-booked",
    bookingType: "Planned",
    verified: true,
    rating: 4.8,
    reviewsCount: 31,
    completedRentals: 46,
    description: "Heavy-duty aluminum-framed German pagoda marquee marquee structure. 100% waterproof, flame retardant 650 GSM PVC fabric, and engineered to withstand heavy monsoon gusts up to 80 km/h.",
    specifications: [
      "50 x 30 Feet High-Grade Extruded Aluminium Frame",
      "650 GSM Fire-Retardant & UV-Shielded PVC Fabric",
      "Side Flaps with Clear French Window Sightlines",
      "Complete Heavy Steel Base Ground Anchor Pins",
      "3-Hour Assembly Crew Dispatched with Unit"
    ],
    photos: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 19.2184, lng: 73.0867 },
    instantDispatchAvailable: false,
    bookedDates: ["2026-09-28", "2026-09-29", "2026-09-30"],
    timeSlots: ["Multi-Day Event Setup"]
  },

  // 6. AUDIO / AV
  {
    id: "hub-10",
    title: "High-Capacity Dual 8-inch Line Array Rig & Subwoofers",
    category: "Audio",
    shopName: "Grand Event Supplies & Audio",
    vendorType: "Event Planner & Production",
    location: "Andheri East, Mumbai",
    fulfillmentType: "Dedicated Site Delivery",
    pricePerDay: 16500,
    securityDeposit: 8000,
    quantityAvailable: 2,
    availabilityStatus: "Available",
    bookingType: "Emergency",
    verified: true,
    rating: 4.9,
    reviewsCount: 58,
    completedRentals: 82,
    description: "Tour-grade dual 8-inch active line array system (8 tops + 4 dual 18-inch subwoofers) paired with 16 DMX motorized moving heads and a digital 32-channel Behringer sound console with certified sound technician.",
    specifications: [
      "15 kW RMS Line Array Tops & Ground Subs",
      "Behringer X32 32-Channel Digital Sound Console",
      "16 Moving Head Beam/Spot Lights + DMX Controller",
      "Heavy Aluminium Box Truss Rigging Hardware Included",
      "Certified On-Site Sound Engineer Included"
    ],
    photos: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 19.1136, lng: 72.8697 },
    instantDispatchAvailable: true,
    bookedDates: ["2026-09-02", "2026-09-03", "2026-09-04"],
    timeSlots: ["Concert / Event Night (4 PM – 1 AM)", "Full 24-Hr Rig Rental"]
  },
  {
    id: "hub-11",
    title: "4K Laser Projectors & Indoor High-Res P2.6 LED Video Wall",
    category: "Audio",
    shopName: "Grand Event Supplies & Audio",
    vendorType: "Event Planner & Production",
    location: "Andheri East, Mumbai",
    fulfillmentType: "Dedicated Site Delivery",
    pricePerDay: 22000,
    securityDeposit: 10000,
    quantityAvailable: 2,
    availabilityStatus: "Available",
    bookingType: "Planned",
    verified: true,
    rating: 4.9,
    reviewsCount: 41,
    completedRentals: 59,
    description: "Ultra-sharp 20x10ft P2.6mm indoor LED wall panels paired with NovaStar 4K video processor and dual 12,000-lumen laser projectors for conferences, luxury weddings, and keynote presentations.",
    specifications: [
      "20 x 10 Feet P2.6 High Refresh Rate Indoor LED Panels",
      "NovaStar VX600 All-in-One 4K Video Processor",
      "Dual 12,000 ANSI Lumen Laser Projectors",
      "Zero Latency HDMI / SDI Switcher Console",
      "Dedicated Visual Display Technicians on Standby"
    ],
    photos: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 19.1136, lng: 72.8697 },
    instantDispatchAvailable: false,
    bookedDates: [],
    timeSlots: ["Full Day Setup & Presentation"]
  },

  // 7. COLD CHAIN
  {
    id: "hub-12",
    title: "Trailer-Mounted Mobile Blast Freezer & Chiller Unit",
    category: "ColdChain",
    shopName: "ColdChain Express Depot",
    vendorType: "Logistics & Cold Storage",
    location: "Anjur Phata, Bhiwandi",
    fulfillmentType: "Dedicated Site Delivery",
    pricePerDay: 7800,
    securityDeposit: 3500,
    quantityAvailable: 2,
    availabilityStatus: "Available",
    bookingType: "Emergency",
    verified: true,
    rating: 4.8,
    reviewsCount: 27,
    completedRentals: 43,
    description: "Mobile containerized blast chiller and deep freezer capable of pulling down hot banquet dishes from 70°C to -18°C in under 90 minutes. Equipped with digital HACCP continuous temperature datalogging.",
    specifications: [
      "-22°C Deep Freeze / -40°C Blast Chilling Mode",
      "Trailer Mounted with Towing Hitch & Stabilizer Jacks",
      "Digital HACCP Compliance Cloud Datalogger",
      "Backup Dual-Fuel Power Connector Ready",
      "Internal Panic Safety Release Lock"
    ],
    photos: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 19.2814, lng: 73.0489 },
    instantDispatchAvailable: true,
    bookedDates: [],
    timeSlots: ["24-Hour Continuous Cooling Block"]
  },

  // 8. LOGISTICS
  {
    id: "hub-13",
    title: "Heavy Cargo Transport Truck with Hydraulic Tail-Lift (5 Ton)",
    category: "Logistics",
    shopName: "TransMMR Hospitality Fleet",
    vendorType: "Logistics Partner",
    location: "Panvel, Navi Mumbai",
    fulfillmentType: "Dedicated Site Delivery",
    pricePerDay: 6000,
    securityDeposit: 3000,
    quantityAvailable: 3,
    availabilityStatus: "Available",
    bookingType: "Emergency",
    verified: true,
    rating: 4.9,
    reviewsCount: 47,
    completedRentals: 71,
    description: "5-ton containerized closed-body logistics vehicle equipped with a 1,500 kg capacity hydraulic rear tail-lift. Ideal for safe, roll-on transport of expensive flight cases, line arrays, and ovens without ramp damage.",
    specifications: [
      "5-Ton Enclosed Container with E-Track Cargo Straps",
      "1,500 kg Hydraulic Cantilever Tail-Lift Platform",
      "Equipped with 2 Hydraulic Pallet Jacks & Heavy Straps",
      "Commercial Heavy Permit with All-MMR Toll Pass",
      "Driver and 2 Certified Rigging Handlers Included"
    ],
    photos: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 18.9894, lng: 73.1175 },
    instantDispatchAvailable: true,
    bookedDates: [],
    timeSlots: ["8 Hours Shift", "24-Hour Event Haulage"]
  },

  // 9. UTILITIES
  {
    id: "hub-14",
    title: "125 kVA Ultra-Silent Acoustic Canopy Diesel Generator",
    category: "Utilities",
    shopName: "PowerGrid Events Solutions",
    vendorType: "Power & Equipment Depot",
    location: "Vasai East, Extended MMR",
    fulfillmentType: "Dedicated Site Delivery",
    pricePerDay: 5800,
    securityDeposit: 2500,
    quantityAvailable: 3,
    availabilityStatus: "Available",
    bookingType: "Emergency",
    verified: true,
    rating: 4.9,
    reviewsCount: 53,
    completedRentals: 77,
    description: "Acoustic canopy enclosed 125 kVA Cummins-powered diesel generator. Operates at whisper-quiet <65 dBA noise level, with automatic mains failure (AMF) changeover panel and continuous 12-hour fuel tank.",
    specifications: [
      "125 kVA / 100 kW 3-Phase Continuous Output",
      "Ultra-Silent Acoustic Canopy (<65 dBA at 1 Meter)",
      "Automatic Mains Failure (AMF) Smart Panel",
      "12-Hour Continuous Run Internal Fuel Reservoir",
      "Delivered with Licensed Electrical Technician"
    ],
    photos: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 19.3919, lng: 72.8397 },
    instantDispatchAvailable: true,
    bookedDates: [],
    timeSlots: ["12-Hour Event Duty", "24-Hour Emergency Standby"]
  },

  // 10. OTHER RESOURCES
  {
    id: "hub-15",
    title: "Fine Bone China Banquet Crockery & Gold Cutlery Set (500 Covers)",
    category: "Other",
    shopName: "Royal Zenith Banqueting Supplies",
    vendorType: "Catering Enterprise",
    location: "Lower Parel, Mumbai",
    fulfillmentType: "Dedicated Site Delivery",
    pricePerDay: 9000,
    securityDeposit: 4000,
    quantityAvailable: 3,
    availabilityStatus: "Available",
    bookingType: "Planned",
    verified: true,
    rating: 4.8,
    reviewsCount: 37,
    completedRentals: 50,
    description: "Premium fine bone china gold-rim dinner plates, side plates, dessert bowls, soup tureens, and heavy 24k electroplated gold cutlery for high-end luxury galas and VVIP banquets.",
    specifications: [
      "500-Cover Full Course Table Setting (5-Piece per Cover)",
      "Premium Bone China with Scratch-Proof Gold Rim",
      "24k Electroplated Stainless Steel Cutlery (Fork, Spoon, Knife)",
      "Sanitized & Shrink-Wrapped in Impact-Proof Dish Crates",
      "Includes Pre-Sorted Breakage Insurance Buffer (+5%)"
    ],
    photos: [
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
    ],
    image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80",
    coordinates: { lat: 18.9986, lng: 72.8311 },
    instantDispatchAvailable: false,
    bookedDates: [],
    timeSlots: ["Full Day Event Usage"]
  }
];

// 4. Initial Active Negotiation & Booking Requests
const INITIAL_REQUESTS = [
  {
    id: "REQ-9011",
    assetId: "hub-01",
    assetTitle: "500-Seater Grand Banquet Hall & Manicured Lawn",
    category: "Spaces",
    providerBusiness: "Imperial Banquets & Hospitality Ltd",
    seekerBusiness: "Taj Lands End Banquets & Catering",
    seekerContact: "events@tajhotels.com",
    seekerRating: 4.9,
    seekerLocation: "Bandra West, Mumbai",
    startDate: "2026-09-12",
    endDate: "2026-09-15",
    days: 3,
    quantity: 1,
    timeSlot: "Full Day (24 Hrs)",
    dailyRate: 28000,
    totalAmount: 84000,
    tokenAmount: 16800, // 20%
    escrowDeposit: 12000,
    bookingMode: "Planned",
    deliveryMode: "Depot Self Pickup",
    deliveryFee: 0,
    status: "Approved",
    paymentStatus: "Paid (Token Verified)",
    paymentMethod: "UPI (HDFC Bank)",
    notes: "International Corporate Diamond Gala. 20% Token payment verified via escrow. Calendar locked.",
    auditStatus: "Submitted",
    history: [
      { sender: "seeker", type: "offer", amount: 84000, date: "2026-09-01", message: "Standard planned booking with 20% token deposit." },
      { sender: "provider", type: "accept", amount: 84000, date: "2026-09-02", message: "Booking approved and calendar dates locked." }
    ]
  },
  {
    id: "REQ-9012",
    assetId: "hub-06",
    assetTitle: "Refrigerated Catering Transport Van (3 Ton Thermo-King)",
    category: "Vehicle",
    providerBusiness: "Apex Catering Logistics",
    seekerBusiness: "Gourmet Symphony Caterers",
    seekerContact: "logistics@gourmetsymphony.com",
    seekerRating: 4.8,
    seekerLocation: "Jio World Convention Centre, BKC",
    startDate: "2026-09-24",
    endDate: "2026-09-26",
    days: 2,
    quantity: 1,
    timeSlot: "Full Day (24 Hrs)",
    dailyRate: 5200,
    totalAmount: 10400,
    tokenAmount: 2080,
    escrowDeposit: 2500,
    bookingMode: "Planned",
    deliveryMode: "Dedicated Site Delivery",
    deliveryFee: 1100,
    status: "Negotiating",
    negotiationOffer: 9000,
    seekerOffer: 8500,
    providerCounter: 9000,
    paymentStatus: "Pending Negotiation",
    notes: "Provider counter-offered ₹9,000 for 2 days. Awaiting seeker confirmation.",
    auditStatus: "Pending Review",
    history: [
      { sender: "seeker", type: "offer", amount: 8500, date: "2026-09-20", message: "Proposing ₹8,500 for a 2-day catering delivery." },
      { sender: "provider", type: "counter", amount: 9000, date: "2026-09-21", message: "We can do ₹9,000 including driver overnight allowance." }
    ]
  },
  {
    id: "REQ-9013",
    assetId: "hub-03",
    assetTitle: "10-Tray Commercial Rational Combi Oven & Steamer",
    category: "Kitchen",
    providerBusiness: "Royal Kitchens & Equipment Depot",
    seekerBusiness: "Apex Gourmet Kitchens",
    seekerContact: "kitchen.ops@apexcatering.in",
    seekerRating: 4.9,
    seekerLocation: "Ghatkopar West, Mumbai",
    startDate: "2026-09-08",
    endDate: "2026-09-10",
    days: 2,
    quantity: 1,
    timeSlot: "24-Hour Production Block",
    dailyRate: 9500,
    totalAmount: 19000,
    tokenAmount: 3800,
    escrowDeposit: 4500,
    bookingMode: "Emergency",
    deliveryMode: "Dedicated Site Delivery",
    deliveryFee: 650,
    status: "Approved",
    paymentStatus: "Paid (Token Verified)",
    paymentMethod: "Corporate Card (Visa)",
    notes: "Emergency 45-min fast-track dispatch. Pre-pickup photo audit verified.",
    auditStatus: "Reviewed",
    history: [
      { sender: "seeker", type: "emergency", amount: 19650, date: "2026-09-07", message: "Urgent catering production overflow for corporate banquet." }
    ]
  }
];

// 5. Demo B2B Hospitality Accounts
const DEMO_USERS = [
  {
    id: "user-01",
    businessName: "Imperial Banquets & Hospitality Ltd",
    contactPerson: "Rajesh Malhotra (Director of Procurement)",
    email: "procurement@imperialbanquets.in",
    phone: "+91 98200 12345",
    businessType: "Hotel & Banquet Venue",
    role: "Provider & Seeker",
    location: "Lower Parel, Mumbai",
    verified: true,
    rating: 4.9,
    reviewsCount: 42,
    completedRentals: 56,
    activeListingsCount: 3,
    gstin: "27AAACI1234A1Z5",
    fssaiLicense: "11521001000452"
  },
  {
    id: "user-02",
    businessName: "TransMMR Hospitality Fleet",
    contactPerson: "Sandeep Varma (Fleet Operations Head)",
    email: "fleet@transmmr.in",
    phone: "+91 98211 54321",
    businessType: "Logistics Partner",
    role: "Provider",
    location: "Panvel, Navi Mumbai",
    verified: true,
    rating: 4.9,
    reviewsCount: 47,
    completedRentals: 71,
    activeListingsCount: 4,
    gstin: "27AABCT9876C1Z2",
    fssaiLicense: "N/A (Logistics)"
  },
  {
    id: "user-03",
    businessName: "Grand Event Supplies & Audio",
    contactPerson: "Kavita Rao (Lead Technical Producer)",
    email: "production@grandevents.in",
    phone: "+91 98222 98765",
    businessType: "Event Planner & Production",
    role: "Seeker",
    location: "Andheri East, Mumbai",
    verified: true,
    rating: 4.9,
    reviewsCount: 58,
    completedRentals: 82,
    activeListingsCount: 2,
    gstin: "27AAEFG4567H1Z8",
    fssaiLicense: "N/A (AV/Rigging)"
  }
];

// 6. Universal Window & Module Exports
if (typeof window !== 'undefined') {
  window.TRANSLATIONS = TRANSLATIONS;
  window.CATEGORIES = CATEGORIES;
  window.MMR_CLIENT_ORIGIN = MMR_CLIENT_ORIGIN;
  window.MMR_REGIONS = MMR_REGIONS;
  window.BUSINESS_TYPES = BUSINESS_TYPES;
  window.inventoryData = inventoryData;
  window.INITIAL_REQUESTS = INITIAL_REQUESTS;
  window.DEMO_USERS = DEMO_USERS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TRANSLATIONS,
    CATEGORIES,
    MMR_CLIENT_ORIGIN,
    MMR_REGIONS,
    BUSINESS_TYPES,
    inventoryData,
    INITIAL_REQUESTS,
    DEMO_USERS
  };
}
