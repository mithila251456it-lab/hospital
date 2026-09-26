/**
 * HospitalityHub B2B Resource Exchange — Field Mappers
 * 
 * Maps between frontend camelCase contracts and Supabase Postgres snake_case column names.
 * Ensures zero breaking changes for the client UI layer.
 */

// ==========================================
// 1. Profile / User Mappers
// ==========================================
export function profileToClient(row, email = '') {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email || email,
    businessName: row.business_name,
    businessType: row.business_type,
    role: row.role,
    accountType: row.account_type,
    location: row.location,
    contactPhone: row.contact_phone,
    phone: row.contact_phone,
    contactPerson: row.contact_person,
    gstin: row.gstin,
    fssaiLicense: row.fssai_license,
    tradeLicense: row.trade_license,
    bio: row.bio,
    verificationStatus: row.verification_status,
    verified: row.verified,
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 0),
    completedRentals: Number(row.completed_rentals || 0),
    activeFleetCount: Number(row.active_fleet_count || 0),
    photos: row.photos || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function profileToDb(client) {
  if (!client) return {};
  const db = {};
  if (client.businessName !== undefined) db.business_name = client.businessName;
  if (client.businessType !== undefined) db.business_type = client.businessType;
  if (client.role !== undefined) db.role = client.role;
  if (client.accountType !== undefined) db.account_type = client.accountType;
  if (client.location !== undefined) db.location = client.location;
  if (client.contactPhone !== undefined || client.phone !== undefined) {
    db.contact_phone = client.contactPhone || client.phone || '';
  }
  if (client.contactPerson !== undefined) db.contact_person = client.contactPerson;
  if (client.gstin !== undefined) db.gstin = client.gstin;
  if (client.fssaiLicense !== undefined) db.fssai_license = client.fssaiLicense;
  if (client.tradeLicense !== undefined) db.trade_license = client.tradeLicense;
  if (client.bio !== undefined) db.bio = client.bio;
  if (client.verificationStatus !== undefined) db.verification_status = client.verificationStatus;
  if (client.verified !== undefined) db.verified = Boolean(client.verified);
  if (client.photos !== undefined) db.photos = client.photos;
  db.updated_at = new Date().toISOString();
  return db;
}

// ==========================================
// 2. Resource Mappers
// ==========================================
export function resourceToClient(row) {
  if (!row) return null;
  return {
    id: row.id,
    ownerId: row.owner_id,
    ownerEmail: row.owner_email,
    title: row.title,
    category: row.category,
    description: row.description || '',
    shopName: row.shop_name,
    vendorType: row.vendor_type,
    location: row.location,
    fulfillmentType: row.fulfillment_type,
    pricePerDay: Number(row.price_per_day),
    securityDeposit: Number(row.security_deposit || 0),
    quantityAvailable: Number(row.quantity_available || 1),
    availabilityStatus: row.availability_status || 'Available',
    bookingType: row.booking_type || 'Planned',
    verified: Boolean(row.verified),
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 0),
    completedRentals: Number(row.completed_rentals || 0),
    specifications: row.specifications || [],
    photos: row.photos || [],
    image: row.image || (row.photos && row.photos[0]) || '',
    coordinates: row.coordinates || { lat: 19.0674, lng: 72.8687 },
    instantDispatchAvailable: Boolean(row.instant_dispatch_available),
    bookedDates: row.booked_dates || [],
    timeSlots: row.time_slots || ["Full Day (24 Hrs)"],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function resourceToDb(client, ownerId, ownerEmail) {
  if (!client) return {};
  return {
    id: client.id || `hub-${Date.now().toString().slice(-6)}`,
    owner_id: ownerId,
    owner_email: ownerEmail || client.ownerEmail,
    title: client.title,
    category: client.category || 'Spaces',
    description: client.description || '',
    shop_name: client.shopName || client.businessName || 'Commercial Partner',
    vendor_type: client.vendorType || 'Commercial Partner',
    location: client.location || 'Lower Parel, Mumbai',
    fulfillment_type: client.fulfillmentType || (client.category === 'Spaces' ? 'Depot Self Pickup' : 'Dedicated Site Delivery'),
    price_per_day: Number(client.pricePerDay || 0),
    security_deposit: Number(client.securityDeposit || 0),
    quantity_available: Number(client.quantityAvailable || 1),
    availability_status: client.availabilityStatus || 'Available',
    booking_type: client.bookingType || (client.instantDispatchAvailable ? 'Emergency' : 'Planned'),
    verified: client.verified !== undefined ? Boolean(client.verified) : true,
    rating: Number(client.rating || 5.0),
    reviews_count: Number(client.reviewsCount || 0),
    completed_rentals: Number(client.completedRentals || 0),
    specifications: Array.isArray(client.specifications) ? client.specifications : (client.specifications ? client.specifications.split('\n').filter(Boolean) : []),
    photos: client.photos || (client.image ? [client.image] : []),
    image: client.image || (client.photos && client.photos[0]) || '',
    coordinates: client.coordinates || { lat: 19.0674, lng: 72.8687 },
    instant_dispatch_available: Boolean(client.instantDispatchAvailable),
    booked_dates: client.bookedDates || [],
    time_slots: client.timeSlots || ["Full Day (24 Hrs)"],
    updated_at: new Date().toISOString()
  };
}

// ==========================================
// 3. Request / Booking Mappers
// ==========================================
export function requestToClient(row) {
  if (!row) return null;
  return {
    id: row.id,
    assetId: row.asset_id,
    assetTitle: row.asset_title,
    category: row.category,
    providerId: row.provider_id,
    providerEmail: row.provider_email,
    providerBusiness: row.provider_business,
    seekerId: row.seeker_id,
    seekerEmail: row.seeker_email,
    seekerBusiness: row.seeker_business,
    seekerPhone: row.seeker_phone || '',
    startDate: typeof row.start_date === 'string' ? row.start_date.split('T')[0] : row.start_date,
    endDate: typeof row.end_date === 'string' ? row.end_date.split('T')[0] : row.end_date,
    days: Number(row.days || 1),
    dailyRate: Number(row.daily_rate),
    baseAmount: Number(row.base_amount || 0),
    securityDeposit: Number(row.security_deposit || 0),
    logisticsFee: Number(row.logistics_fee || 0),
    tokenPaid: Number(row.token_paid || 0),
    totalAmount: Number(row.total_amount),
    paymentMethod: row.payment_method || 'UPI Instant Escrow',
    paymentStatus: row.payment_status || 'Payment Successful (Escrow Locked)',
    status: row.status || 'Pending',
    negotiationOffer: row.negotiation_offer ? Number(row.negotiation_offer) : undefined,
    notes: row.notes || '',
    auditStatus: row.audit_status || 'Pending Dispatch',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function requestToDb(client, seekerId, seekerEmail) {
  if (!client) return {};
  return {
    id: client.id || `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
    asset_id: client.assetId || client.resourceId,
    asset_title: client.assetTitle || client.resourceTitle || 'Hospitality Resource',
    category: client.category || 'Hospitality Resource',
    provider_id: client.providerId || null,
    provider_email: client.providerEmail,
    provider_business: client.providerBusiness || 'Enterprise Provider',
    seeker_id: seekerId,
    seeker_email: seekerEmail || client.seekerEmail,
    seeker_business: client.seekerBusiness || 'Enterprise Seeker',
    seeker_phone: client.seekerPhone || '',
    start_date: client.startDate,
    end_date: client.endDate,
    days: Number(client.days || 1),
    daily_rate: Number(client.dailyRate || 0),
    base_amount: Number(client.baseAmount || client.dailyRate * (client.days || 1)),
    security_deposit: Number(client.securityDeposit || 0),
    logistics_fee: Number(client.logisticsFee || 0),
    token_paid: Number(client.tokenPaid || client.tokenAmount || 0),
    total_amount: Number(client.totalAmount || 0),
    payment_method: client.paymentMethod || 'UPI Instant Escrow',
    payment_status: client.paymentStatus || 'Payment Successful (Escrow Locked)',
    status: client.status || 'Confirmed',
    negotiation_offer: client.negotiationOffer ? Number(client.negotiationOffer) : null,
    notes: client.notes || '',
    audit_status: client.auditStatus || 'Pending Dispatch',
    updated_at: new Date().toISOString()
  };
}
