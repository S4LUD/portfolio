import { isSupabaseConfigured, supabase } from './client'

const FUNCTION_NAME =
  import.meta.env.VITE_SUPABASE_VIEW_TRACKING_FUNCTION?.trim() || 'track-portfolio-view'

function isPrivateHostname(hostname) {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    /^192\.168\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
  )
}

function getSessionStorageKey(pathname) {
  const today = new Date().toISOString().slice(0, 10)
  return `portfolio-view-tracked:${today}:${pathname}`
}

export async function trackPortfolioView() {
  if (
    typeof window === 'undefined' ||
    !isSupabaseConfigured ||
    !supabase ||
    isPrivateHostname(window.location.hostname)
  ) {
    return
  }

  const storageKey = getSessionStorageKey(window.location.pathname)

  if (window.sessionStorage.getItem(storageKey) === '1') {
    return
  }

  const payload = {
    path: window.location.pathname,
    referrer: document.referrer || null,
    source: 'portfolio',
    screen: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timezone:
      typeof Intl !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone || null
        : null,
  }

  const { error } = await supabase.functions.invoke(FUNCTION_NAME, {
    body: payload,
  })

  if (error) {
    throw new Error(error.message || 'Failed to track portfolio view.')
  }

  window.sessionStorage.setItem(storageKey, '1')
}
