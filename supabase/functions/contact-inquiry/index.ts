import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

function jsonResponse(body: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  try {
    const cloudflareSecretKey = Deno.env.get('CLOUDFLARE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseSecretKey = Deno.env.get('SUPABASE_SECRET_KEY')
    const contactTable = Deno.env.get('SUPABASE_CONTACT_TABLE') || 'contact_inquiries'

    if (!cloudflareSecretKey || !supabaseUrl || !supabaseSecretKey) {
      return jsonResponse({ error: 'Server configuration is incomplete.' }, 500)
    }

    const {
      name = '',
      email = '',
      company = '',
      message = '',
      source = '',
      turnstileToken = '',
      submittedAfterSeconds = 0,
    } = await req.json()

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof company !== 'string' ||
      typeof message !== 'string' ||
      typeof source !== 'string' ||
      typeof turnstileToken !== 'string'
    ) {
      return jsonResponse({ error: 'Invalid request payload.' }, 400)
    }

    if (source !== 'portfolio') {
      return jsonResponse({ error: 'Invalid submission source.' }, 400)
    }

    if (
      name.trim().length < 1 ||
      name.trim().length > 120 ||
      email.trim().length < 3 ||
      email.trim().length > 160 ||
      !emailPattern.test(email.trim()) ||
      company.trim().length > 160 ||
      message.trim().length < 10 ||
      message.trim().length > 4000
    ) {
      return jsonResponse({ error: 'Please review the form fields and try again.' }, 400)
    }

    if (!turnstileToken) {
      return jsonResponse({ error: 'Verification is required.' }, 400)
    }

    if (Number(submittedAfterSeconds) < 3) {
      return jsonResponse({ error: 'Submission rejected as suspicious.' }, 429)
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('cf-connecting-ip') ||
      ''

    const turnstileResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: cloudflareSecretKey,
          response: turnstileToken,
          remoteip: ip,
        }),
      },
    )

    const turnstileData = await turnstileResponse.json()

    if (!turnstileResponse.ok || !turnstileData.success) {
      return jsonResponse({ error: 'Verification failed. Please try again.' }, 400)
    }

    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: { persistSession: false },
    })

    const { error } = await supabase.from(contactTable).insert({
      name: name.trim(),
      email: email.trim(),
      company: company.trim() || null,
      message: message.trim(),
      source,
    })

    if (error) {
      return jsonResponse({ error: error.message || 'Failed to save inquiry.' }, 500)
    }

    return jsonResponse({ message: 'Inquiry submitted successfully.' })
  } catch (_error) {
    return jsonResponse({ error: 'Unexpected server error.' }, 500)
  }
})
