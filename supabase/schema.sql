-- ====================================================================
-- HospitalityHub B2B Resource Exchange — Supabase Database Schema
-- Run this in Supabase SQL Editor to initialize all tables, RLS policies,
-- and automated user profile sync triggers.
-- ====================================================================

-- 1. Create Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT DEFAULT 'Hotel & Resort',
  role TEXT DEFAULT 'Seeker', -- 'Seeker', 'Provider', 'Provider & Seeker'
  account_type TEXT DEFAULT 'seeker', -- 'seeker', 'provider'
  location TEXT DEFAULT 'Lower Parel, Mumbai',
  contact_phone TEXT DEFAULT '',
  contact_person TEXT DEFAULT '',
  gstin TEXT DEFAULT '',
  fssai_license TEXT DEFAULT '',
  trade_license TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  verification_status TEXT DEFAULT 'Not Submitted', -- 'Not Submitted', 'Pending Verification', 'Verified', 'Rejected'
  verified BOOLEAN DEFAULT false,
  rating NUMERIC(3,2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  completed_rentals INT DEFAULT 0,
  active_fleet_count INT DEFAULT 0,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Commercial Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_email TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Spaces', 'Kitchen', 'Vehicle', 'Furniture', 'Equipment', 'ColdChain', 'Logistics', 'Utilities', 'Other'
  description TEXT DEFAULT '',
  shop_name TEXT NOT NULL,
  vendor_type TEXT DEFAULT 'Commercial Partner',
  location TEXT NOT NULL,
  fulfillment_type TEXT DEFAULT 'Depot Self Pickup',
  price_per_day NUMERIC NOT NULL CHECK (price_per_day >= 0),
  security_deposit NUMERIC DEFAULT 0,
  quantity_available INT DEFAULT 1 CHECK (quantity_available >= 0),
  availability_status TEXT DEFAULT 'Available', -- 'Available', 'Pre-booked', 'Locked', 'Unavailable'
  booking_type TEXT DEFAULT 'Planned', -- 'Planned', 'Emergency'
  verified BOOLEAN DEFAULT true,
  rating NUMERIC(3,2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  completed_rentals INT DEFAULT 0,
  specifications TEXT[] DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  image TEXT DEFAULT '',
  coordinates JSONB DEFAULT '{"lat": 19.0674, "lng": 72.8687}'::jsonb,
  instant_dispatch_available BOOLEAN DEFAULT false,
  booked_dates TEXT[] DEFAULT '{}',
  time_slots TEXT[] DEFAULT '{"Full Day (24 Hrs)"}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Booking / Rental Requests Table
CREATE TABLE IF NOT EXISTS public.requests (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL,
  asset_title TEXT NOT NULL,
  category TEXT DEFAULT 'Hospitality Resource',
  provider_id UUID REFERENCES auth.users(id),
  provider_email TEXT NOT NULL,
  provider_business TEXT NOT NULL,
  seeker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seeker_email TEXT NOT NULL,
  seeker_business TEXT NOT NULL,
  seeker_phone TEXT DEFAULT '',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INT DEFAULT 1 CHECK (days >= 1),
  daily_rate NUMERIC NOT NULL,
  base_amount NUMERIC NOT NULL,
  security_deposit NUMERIC DEFAULT 0,
  logistics_fee NUMERIC DEFAULT 0,
  token_paid NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'UPI Instant Escrow',
  payment_status TEXT DEFAULT 'Payment Pending',
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Negotiating', 'Approved', 'Confirmed', 'Rejected', 'Completed', 'Cancelled'
  negotiation_offer NUMERIC,
  notes TEXT DEFAULT '',
  audit_status TEXT DEFAULT 'Pending Dispatch',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 6. RLS Policies for Resources
CREATE POLICY "Public resources are viewable by everyone" 
  ON public.resources FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create resources" 
  ON public.resources FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own resources" 
  ON public.resources FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own resources" 
  ON public.resources FOR DELETE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- 7. RLS Policies for Requests
CREATE POLICY "Users can view their own requests as seeker or provider" 
  ON public.requests FOR SELECT 
  TO authenticated 
  USING (auth.uid() = seeker_id OR auth.uid() = provider_id);

CREATE POLICY "Seekers can create rental requests" 
  ON public.requests FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = seeker_id);

CREATE POLICY "Participants can update their requests" 
  ON public.requests FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = seeker_id OR auth.uid() = provider_id);

-- 8. Auth.users -> Profiles Automated Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    business_name,
    business_type,
    role,
    account_type,
    location,
    contact_phone,
    contact_person,
    verification_status,
    verified
  ) VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'business_name', split_part(new.email, '@', 1) || ' Enterprise'),
    COALESCE(new.raw_user_meta_data->>'business_type', 'Hotel & Resort'),
    COALESCE(new.raw_user_meta_data->>'role', 'Seeker'),
    COALESCE(new.raw_user_meta_data->>'account_type', 'seeker'),
    COALESCE(new.raw_user_meta_data->>'location', 'Lower Parel, Mumbai'),
    COALESCE(new.raw_user_meta_data->>'contact_phone', ''),
    COALESCE(new.raw_user_meta_data->>'contact_person', split_part(new.email, '@', 1)),
    CASE WHEN (new.raw_user_meta_data->>'account_type') = 'provider' THEN 'Not Submitted' ELSE 'Verified' END,
    CASE WHEN (new.raw_user_meta_data->>'account_type') = 'provider' THEN false ELSE true END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    business_name = COALESCE(EXCLUDED.business_name, public.profiles.business_name),
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
