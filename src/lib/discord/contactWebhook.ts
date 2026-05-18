const DISCORD_CONTACT_WEBHOOK_URL =
  import.meta.env.VITE_DISCORD_CONTACT_WEBHOOK_URL?.trim() ?? ''

type ContactWebhookPayload = {
  name: string
  email: string
  company?: string
  message: string
  source: string
  turnstileToken?: string
  submittedAfterSeconds: number
}

function normalizeDiscordField(value: unknown, maxLength = 1024) {
  const normalizedValue = String(value || '').trim()

  if (!normalizedValue) {
    return 'Not provided'
  }

  if (normalizedValue.length <= maxLength) {
    return normalizedValue
  }

  return `${normalizedValue.slice(0, maxLength - 1)}...`
}

export const isDiscordContactConfigured = Boolean(DISCORD_CONTACT_WEBHOOK_URL)

export async function sendContactWebhook(payload: ContactWebhookPayload) {
  if (!isDiscordContactConfigured) {
    throw new Error(
      'Form submissions are not configured yet. Add VITE_DISCORD_CONTACT_WEBHOOK_URL to enable sending.',
    )
  }

  const response = await fetch(DISCORD_CONTACT_WEBHOOK_URL, {
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
              value: normalizeDiscordField(payload.name),
              inline: true,
            },
            {
              name: 'Email',
              value: normalizeDiscordField(payload.email),
              inline: true,
            },
            {
              name: 'Company',
              value: normalizeDiscordField(payload.company),
              inline: true,
            },
            {
              name: 'Message',
              value: normalizeDiscordField(payload.message),
            },
            {
              name: 'Source',
              value: normalizeDiscordField(payload.source),
              inline: true,
            },
            {
              name: 'Submitted after',
              value: `${payload.submittedAfterSeconds}s`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.message || 'Discord could not receive the message. Please try again in a moment.')
  }
}
