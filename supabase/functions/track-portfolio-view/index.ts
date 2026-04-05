import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

function jsonResponse(body: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  })
}

async function hashValue(value: string, salt: string) {
  const buffer = new TextEncoder().encode(`${salt}:${value}`)
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const appSupabaseSecretKey =
      Deno.env.get('APP_SUPABASE_SECRET_KEY') || Deno.env.get('SUPABASE_SECRET_KEY')
    const viewsTable = Deno.env.get('PORTFOLIO_VIEWS_TABLE') || 'portfolio_page_views'
    const hashSalt = Deno.env.get('PORTFOLIO_VIEW_HASH_SALT')

    if (!supabaseUrl || !appSupabaseSecretKey || !hashSalt) {
      return jsonResponse({ error: 'Server configuration is incomplete.' }, 500)
    }

    const {
      path = '/',
      referrer = null,
      source = '',
      screen = null,
      viewport = null,
      timezone = null,
    } = await req.json()

    if (
      typeof path !== 'string' ||
      (referrer !== null && typeof referrer !== 'string') ||
      typeof source !== 'string' ||
      (screen !== null && typeof screen !== 'string') ||
      (viewport !== null && typeof viewport !== 'string') ||
      (timezone !== null && typeof timezone !== 'string')
    ) {
      return jsonResponse({ error: 'Invalid request payload.' }, 400)
    }

    if (source !== 'portfolio') {
      return jsonResponse({ error: 'Invalid tracking source.' }, 400)
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-real-ip') ||
      ''

    const ipHash = ip ? await hashValue(ip, hashSalt) : null

    const userAgent = req.headers.get('user-agent') || null
    const acceptLanguage = req.headers.get('accept-language') || null
    const country =
      req.headers.get('cf-ipcountry') ||
      req.headers.get('x-country-code') ||
      req.headers.get('x-vercel-ip-country') ||
      null
    const region =
      req.headers.get('x-region') ||
      req.headers.get('x-vercel-ip-country-region') ||
      null
    const city = req.headers.get('x-vercel-ip-city') || null

    const supabase = createClient(supabaseUrl, appSupabaseSecretKey, {
      auth: { persistSession: false },
    })

    const { error } = await supabase.from(viewsTable).insert({
      path: path.trim() || '/',
      source,
      referrer: referrer?.trim() || null,
      ip_hash: ipHash,
      country,
      region,
      city,
      user_agent: userAgent,
      accept_language: acceptLanguage,
      screen,
      viewport,
      timezone,
    })

    if (error) {
      return jsonResponse({ error: error.message || 'Failed to save page view.' }, 500)
    }

    return jsonResponse({ message: 'View tracked successfully.' })
  } catch (_error) {
    return jsonResponse({ error: 'Unexpected server error.' }, 500)
  }
})
