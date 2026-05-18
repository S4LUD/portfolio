/// <reference types="vite/client" />

type TurnstileRenderOptions = {
  sitekey: string
  theme?: 'auto' | 'light' | 'dark'
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
}

type TurnstileApi = {
  render: (container: HTMLElement | string, options: TurnstileRenderOptions) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

interface Window {
  turnstile?: TurnstileApi
}
