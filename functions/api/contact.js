const jsonHeaders = {
  'Content-Type': 'application/json',
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  })
}

function normalizeDiscordField(value, maxLength = 1024) {
  const normalizedValue = String(value || '').trim()

  if (!normalizedValue) {
    return 'Not provided'
  }

  if (normalizedValue.length <= maxLength) {
    return normalizedValue
  }

  return `${normalizedValue.slice(0, maxLength - 1)}...`
}

async function verifyTurnstile(token, secretKey) {
  const formData = new FormData()
  formData.append('secret', secretKey)
  formData.append('response', token)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  })
  const data = await response.json().catch(() => null)

  return response.ok && data?.success === true
}

export async function onRequestPost({ request, env }) {
  const discordWebhookUrl = env.DISCORD_CONTACT_WEBHOOK_URL
  const cloudflareSecretKey = env.CLOUDFLARE_SECRET_KEY

  if (!discordWebhookUrl || !cloudflareSecretKey) {
    return jsonResponse({ message: 'Contact form is not configured yet.' }, 500)
  }

  let payload

  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ message: 'Invalid contact request.' }, 400)
  }

  const name = String(payload.name || '').trim()
  const email = String(payload.email || '').trim()
  const company = String(payload.company || '').trim()
  const message = String(payload.message || '').trim()
  const source = String(payload.source || 'portfolio').trim()
  const submittedAfterSeconds = Number(payload.submittedAfterSeconds || 0)
  const turnstileToken = String(payload.turnstileToken || '').trim()

  if (!name || !email || !message) {
    return jsonResponse({ message: 'Please complete the required fields.' }, 400)
  }

  if (name.length > 120 || email.length > 160 || company.length > 160 || message.length > 4000) {
    return jsonResponse({ message: 'One or more fields are too long.' }, 400)
  }

  if (!turnstileToken || !(await verifyTurnstile(turnstileToken, cloudflareSecretKey))) {
    return jsonResponse({ message: 'Verification failed. Please try again.' }, 400)
  }

  const discordResponse = await fetch(discordWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: 'New portfolio contact inquiry',
      allowed_mentions: {
        parse: [],
      },
      embeds: [
        {
          title: 'Get In Touch',
          color: 0x5ba9f1,
          fields: [
            {
              name: 'Name',
              value: normalizeDiscordField(name),
              inline: true,
            },
            {
              name: 'Email',
              value: normalizeDiscordField(email),
              inline: true,
            },
            {
              name: 'Company',
              value: normalizeDiscordField(company),
              inline: true,
            },
            {
              name: 'Message',
              value: normalizeDiscordField(message),
            },
            {
              name: 'Source',
              value: normalizeDiscordField(source),
              inline: true,
            },
            {
              name: 'Submitted after',
              value: `${Number.isFinite(submittedAfterSeconds) ? submittedAfterSeconds : 0}s`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  })

  if (!discordResponse.ok) {
    return jsonResponse({ message: 'Discord could not receive the message.' }, 502)
  }

  return jsonResponse({ ok: true })
}
