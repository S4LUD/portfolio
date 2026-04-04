import { memo, useEffect, useId, useRef } from 'react'

const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script'

function ensureTurnstileScript() {
  if (document.getElementById(TURNSTILE_SCRIPT_ID)) {
    return
  }

  const script = document.createElement('script')
  script.id = TURNSTILE_SCRIPT_ID
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
  script.async = true
  script.defer = true
  document.head.appendChild(script)
}

function TurnstileWidget({ siteKey, onTokenChange, onExpired, onError }) {
  const containerId = useId().replace(/:/g, '-')
  const widgetIdRef = useRef(null)

  useEffect(() => {
    if (!siteKey) {
      return undefined
    }

    ensureTurnstileScript()

    let cancelled = false
    let intervalId = null

    const renderWidget = () => {
      if (cancelled || !window.turnstile) {
        return
      }

      const container = document.getElementById(containerId)
      if (!container || widgetIdRef.current !== null) {
        return
      }

      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: siteKey,
        theme: 'auto',
        callback: (token) => onTokenChange(token),
        'expired-callback': () => {
          onTokenChange('')
          onExpired?.()
        },
        'error-callback': () => {
          onTokenChange('')
          onError?.()
        },
      })
    }

    intervalId = window.setInterval(() => {
      if (window.turnstile) {
        renderWidget()
        if (widgetIdRef.current !== null && intervalId) {
          window.clearInterval(intervalId)
        }
      }
    }, 250)

    renderWidget()

    return () => {
      cancelled = true
      if (intervalId) {
        window.clearInterval(intervalId)
      }
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [containerId, onError, onExpired, onTokenChange, siteKey])

  useEffect(() => {
    if (!siteKey) {
      onTokenChange('')
    }
  }, [onTokenChange, siteKey])

  if (!siteKey) {
    return (
      <div className="rounded-[16px] bg-[#fff2f2] px-4 py-3 text-[0.9rem] text-[#be4d4d]">
        Add `VITE_CLOUDFLARE_SITE_KEY` to enable bot protection.
      </div>
    )
  }

  return <div id={containerId} className="min-h-[65px]" />
}

export default memo(TurnstileWidget)
