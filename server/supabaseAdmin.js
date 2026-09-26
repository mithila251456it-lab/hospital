/**
 * HospitalityHub B2B Resource Exchange — Server-Side Supabase Admin Client
 * 
 * Uses the Service Role Key for elevated administrative operations (e.g. user creation,
 * verifying session JWTs, and secure administrative queries).
 * NEVER import or expose this client in client-side code.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || '').trim();

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('http') &&
  supabaseServiceRoleKey &&
  supabaseServiceRoleKey.length > 10
);

let supabaseAdmin = null;
let supabaseAnon = null;

if (isConfigured) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  if (supabaseAnonKey) {
    supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
}

/**
 * Verify Bearer token from authorization header and return authenticated user
 */
async function getUserFromAuthHeader(req) {
  if (!isConfigured || !supabaseAdmin) {
    throw new Error('Supabase is not configured on the server');
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();

  if (!token) {
    return null;
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    return null;
  }

  return user;
}

export {
  supabaseAdmin,
  supabaseAnon,
  isConfigured,
  supabaseUrl,
  getUserFromAuthHeader
};
