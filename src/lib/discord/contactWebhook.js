const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_API_ENDPOINT?.trim() || '/api/contact'

export const isDiscordContactConfigured = Boolean(CONTACT_ENDPOINT)

export async function sendContactWebhook(payload) {
  if (!isDiscordContactConfigured) {
    throw new Error('Form submissions are not configured yet.')
  }

  const response = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.message || 'Discord could not receive the message. Please try again in a moment.')
  }
}
