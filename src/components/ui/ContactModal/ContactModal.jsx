import { AlertCircle, Check, Copy, Download, Mail, Send, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import cvFile from '../../../assets/Lance-Ivan-Salud-CV.pdf'
import { contactDetails } from '../../../data/portfolioData'
import {
  createContactInquiry,
} from '../../../lib/supabase/contactInquiries'
import { isSupabaseConfigured } from '../../../lib/supabase/client'
import TurnstileWidget from '../TurnstileWidget/TurnstileWidget'

const initialFormState = {
  name: '',
  email: '',
  company: '',
  message: '',
}

function ContactModal({ open, onClose, onSubmitSuccess }) {
  const [formState, setFormState] = useState(initialFormState)
  const [submitState, setSubmitState] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [emailCopyState, setEmailCopyState] = useState('')
  const openedAtRef = useRef(Date.now())
  const copyFeedbackTimeoutRef = useRef(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const contactSiteKey = import.meta.env.VITE_CLOUDFLARE_SITE_KEY?.trim() ?? ''
  const isClipboardSupported =
    typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function'

  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim() || contactDetails.email
  const isPlaceholderEmail = contactEmail === contactDetails.email
  const isContactFormConfigured = Boolean(contactSiteKey) && isSupabaseConfigured

  const handleTurnstileExpired = useCallback(() => {
    setSubmitState({
      type: 'error',
      message: 'Verification expired. Please complete it again.',
    })
  }, [])

  const handleTurnstileError = useCallback(() => {
    setSubmitState({
      type: 'error',
      message: 'Verification failed to load. Please try again.',
    })
  }, [])

  useEffect(() => {
    if (!open) {
      setSubmitState({ type: '', message: '' })
      setTurnstileToken('')
      setEmailCopyState('')
      return undefined
    }

    previouslyFocusedRef.current = document.activeElement
    openedAtRef.current = Date.now()
    setTurnstileToken('')
    setEmailCopyState('')
    setSubmitState({ type: '', message: '' })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return
      }

      const focusableElements = dialogRef.current.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

      if (!focusableElements.length) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedRef.current?.focus?.()
    }
  }, [onClose, open])

  useEffect(() => () => {
    if (copyFeedbackTimeoutRef.current) {
      window.clearTimeout(copyFeedbackTimeoutRef.current)
    }
  }, [])

  if (!open) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormState((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleEmailCopy = async () => {
    if (!contactEmail || isPlaceholderEmail || !isClipboardSupported) {
      return
    }

    try {
      await navigator.clipboard.writeText(contactEmail)
      setEmailCopyState('Copied')
    } catch {
      setEmailCopyState('Copy failed')
    }

    if (copyFeedbackTimeoutRef.current) {
      window.clearTimeout(copyFeedbackTimeoutRef.current)
    }

    copyFeedbackTimeoutRef.current = window.setTimeout(() => {
      setEmailCopyState('')
    }, 1800)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const elapsedSeconds = Math.round((Date.now() - openedAtRef.current) / 1000)

    if (!turnstileToken) {
      setSubmitState({
        type: 'error',
        message: !contactSiteKey
          ? 'Bot protection is not configured yet. Add VITE_CLOUDFLARE_SITE_KEY to enable submissions.'
          : 'Complete the bot check before sending your message.',
      })
      return
    }

    if (!isSupabaseConfigured) {
      setSubmitState({
        type: 'error',
        message:
          'Form submissions are not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to enable sending.',
      })
      return
    }

    setIsSubmitting(true)
    setSubmitState({ type: '', message: '' })

    try {
      await createContactInquiry({
        name: formState.name,
        email: formState.email,
        company: formState.company,
        message: formState.message,
        source: 'portfolio',
        turnstileToken,
        submittedAfterSeconds: elapsedSeconds,
      })

      setFormState(initialFormState)
      setTurnstileToken('')
      setSubmitState({
        type: 'success',
        message: 'Your message was sent successfully.',
      })
      onSubmitSuccess?.('Your message was sent successfully.')
      onClose()
    } catch (error) {
      setSubmitState({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong while sending your message.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const EmailActionIcon = isPlaceholderEmail || !isClipboardSupported
    ? AlertCircle
    : emailCopyState === 'Copied'
      ? Check
      : emailCopyState === 'Copy failed'
        ? AlertCircle
        : Copy

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(34,45,67,0.45)] p-4 backdrop-blur-[6px] max-sm:p-2">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close contact modal"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-description"
        className="relative z-[1] w-[min(920px,100%)] rounded-[26px] bg-[var(--modal-bg)] p-5 shadow-[0_24px_60px_var(--panel-shadow)] max-sm:max-h-[calc(100dvh-1rem)] max-sm:w-full max-sm:overflow-y-auto max-sm:rounded-[22px] max-sm:p-4"
      >

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--button-subtle-bg)] text-[var(--button-subtle-text)] transition-colors duration-200 hover:bg-[var(--theme-toggle-hover-bg)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--modal-bg)]"
          aria-label="Close contact modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 max-w-[36rem] pr-12 max-sm:mb-4 max-sm:pr-14">
          <p className="mb-2 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
            Get In Touch
          </p>
          <h2
            id="contact-modal-title"
            className="m-0 text-[clamp(1.45rem,2.4vw,2rem)] leading-[1.15] font-bold text-[var(--text-strong)]"
          >
            Pick the fastest way to reach out.
          </h2>
          <p id="contact-modal-description" className="mt-3 mb-0 text-[0.98rem] leading-7 text-[var(--text-muted)]">
            Send a quick message, copy my email instantly, or download the latest CV.
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] gap-4 max-md:grid-cols-1 max-sm:gap-3">
          <form
            onSubmit={handleSubmit}
            className="rounded-[22px] bg-[var(--modal-subtle-bg)] p-4 shadow-[inset_0_0_0_1px_var(--panel-border)] max-sm:p-3.5"
          >
            <div className="grid gap-3.5">
              <label className="grid gap-2 text-[0.92rem] font-semibold text-[var(--text-soft)]">
                Name
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  maxLength={120}
                  className="min-h-12 rounded-[16px] border border-[var(--panel-border)] bg-[var(--input-bg)] px-4 text-[var(--text-strong)] outline-hidden transition-shadow duration-200 focus:shadow-[0_0_0_3px_var(--input-focus-ring)]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
                <label className="grid gap-2 text-[0.92rem] font-semibold text-[var(--text-soft)]">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    minLength={3}
                    maxLength={160}
                    className="min-h-12 rounded-[16px] border border-[var(--panel-border)] bg-[var(--input-bg)] px-4 text-[var(--text-strong)] outline-hidden transition-shadow duration-200 focus:shadow-[0_0_0_3px_var(--input-focus-ring)]"
                  />
                </label>

                <label className="grid gap-2 text-[0.92rem] font-semibold text-[var(--text-soft)]">
                  Company
                  <input
                    type="text"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    autoComplete="organization"
                    maxLength={160}
                    className="min-h-12 rounded-[16px] border border-[var(--panel-border)] bg-[var(--input-bg)] px-4 text-[var(--text-strong)] outline-hidden transition-shadow duration-200 focus:shadow-[0_0_0_3px_var(--input-focus-ring)]"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-[0.92rem] font-semibold text-[var(--text-soft)]">
                Message
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  minLength={10}
                  maxLength={4000}
                  className="rounded-[16px] border border-[var(--panel-border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-strong)] outline-hidden transition-shadow duration-200 focus:shadow-[0_0_0_3px_var(--input-focus-ring)]"
                />
              </label>

              <div className="grid gap-2">
                <TurnstileWidget
                  siteKey={contactSiteKey}
                  onTokenChange={setTurnstileToken}
                  onExpired={handleTurnstileExpired}
                  onError={handleTurnstileError}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !turnstileToken || !isContactFormConfigured}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-linear-to-br from-[var(--button-primary-from)] to-[var(--button-primary-to)] px-5 font-semibold text-white shadow-[0_12px_24px_var(--button-primary-shadow)] transition-transform duration-200 hover:-translate-y-px focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--modal-bg)] disabled:cursor-not-allowed disabled:opacity-70 max-sm:w-full"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {!isContactFormConfigured ? (
                <p className="m-0 rounded-[14px] bg-[#fff2f2] px-4 py-3 text-[0.9rem] text-[#be4d4d]">
                  {!contactSiteKey
                    ? 'Add VITE_CLOUDFLARE_SITE_KEY to enable the protected contact form.'
                    : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to enable submissions.'}
                </p>
              ) : null}

              {submitState.message ? (
                <p
                  aria-live="polite"
                  className={`m-0 rounded-[14px] px-4 py-3 text-[0.9rem] ${
                    submitState.type === 'success'
                      ? 'bg-[#eefbf4] text-[#2f7d51]'
                      : 'bg-[#fff2f2] text-[#be4d4d]'
                  }`}
                >
                  {submitState.message}
                </p>
              ) : null}
            </div>
          </form>

          <div className="grid content-start gap-4">
            <div className="rounded-[22px] bg-[var(--modal-subtle-bg)] p-4 shadow-[inset_0_0_0_1px_var(--panel-border)] max-sm:p-3.5">
              <h3 className="m-0 text-[1.02rem] font-bold text-[var(--text-strong)]">Quick actions</h3>
              <div className="mt-3.5 grid gap-3">
                <button
                  type="button"
                  onClick={handleEmailCopy}
                  className={`inline-flex min-h-12 items-center justify-between rounded-[18px] px-4 py-3 no-underline transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--modal-subtle-bg)] max-sm:w-full ${
                    isPlaceholderEmail || !isClipboardSupported
                      ? 'cursor-not-allowed bg-[#f4f6fb] text-[#95a3bc]'
                      : 'bg-[var(--input-bg)] text-[var(--text-soft)] shadow-[inset_0_0_0_1px_var(--panel-border)] hover:bg-[var(--theme-toggle-hover-bg)]'
                  }`}
                  disabled={isPlaceholderEmail || !isClipboardSupported}
                  aria-label={
                    isPlaceholderEmail
                      ? 'Email copy unavailable until a contact email is configured'
                      : !isClipboardSupported
                        ? 'Email copy unavailable because clipboard access is not supported'
                        : `Copy email address ${contactEmail}`
                  }
                >
                  <span className="inline-flex min-w-0 items-center gap-3 text-left">
                    <Mail className="h-4 w-4" />
                    <span className="grid min-w-0 gap-0.5">
                      <span>Email me directly</span>
                      <span className="truncate text-[0.82rem] opacity-80 max-sm:break-all max-sm:whitespace-normal">
                        {isPlaceholderEmail ? 'Set your email' : contactEmail}
                      </span>
                    </span>
                  </span>
                  <span
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isPlaceholderEmail || !isClipboardSupported
                        ? 'bg-[#eef2f8] text-[#95a3bc]'
                        : emailCopyState === 'Copied'
                          ? 'bg-[#eefbf4] text-[#2f7d51]'
                          : emailCopyState === 'Copy failed'
                            ? 'bg-[#fff2f2] text-[#be4d4d]'
                            : 'bg-[var(--button-subtle-bg)] text-[var(--button-subtle-text)]'
                    }`}
                    aria-hidden="true"
                  >
                    <EmailActionIcon className="h-4 w-4" />
                  </span>
                </button>
                <span className="sr-only" aria-live="polite">
                  {emailCopyState ? `Email action: ${emailCopyState}.` : ''}
                </span>

                <a
                  href={cvFile}
                  download="Lance-Ivan-Salud-CV.pdf"
                  className="inline-flex min-h-12 items-center justify-between rounded-[18px] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-soft)] no-underline shadow-[inset_0_0_0_1px_var(--panel-border)] transition-colors duration-200 hover:bg-[var(--theme-toggle-hover-bg)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--modal-subtle-bg)] max-sm:w-full"
                  aria-label="Download Lance Ivan Salud CV as PDF"
                >
                  <span className="inline-flex items-center gap-3">
                    <Download className="h-4 w-4" />
                    Download CV
                  </span>
                  <span className="text-[0.82rem]">PDF</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ContactModal
