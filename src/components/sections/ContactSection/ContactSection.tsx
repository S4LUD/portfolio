import { AlertCircle, Check, Copy, Download, Mail, MessageSquareQuote, Send } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import cvFile from '../../../assets/Lance-Ivan-Salud-CV.pdf'
import { contactDetails } from '../../../data/portfolioData'
import {
  isDiscordContactConfigured,
  sendContactWebhook,
} from '../../../lib/discord/contactWebhook'
import TurnstileWidget from '../../ui/TurnstileWidget/TurnstileWidget'
import { contentWidthClass } from '../../ui/shared/uiClasses'
import { useInView } from '../../../hooks/useInView'

const initialFormState = {
  name: '',
  email: '',
  company: '',
  message: '',
}

function ContactSection({ sectionRef }) {
  const [formState, setFormState] = useState(initialFormState)
  const [submitState, setSubmitState] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [emailCopyState, setEmailCopyState] = useState('')
  const [sectionContentRef, sectionInView] = useInView({ threshold: 0.05 })
  const openedAtRef = useRef(Date.now())
  const copyFeedbackTimeoutRef = useRef(null)
  const contactSiteKey = import.meta.env.VITE_CLOUDFLARE_SITE_KEY?.trim() ?? ''
  const isClipboardSupported =
    typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function'

  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim() || contactDetails.email
  const isPlaceholderEmail = contactEmail === contactDetails.email
  const isContactFormConfigured = Boolean(contactSiteKey) && isDiscordContactConfigured

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
    return () => {
      if (copyFeedbackTimeoutRef.current) {
        window.clearTimeout(copyFeedbackTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!turnstileToken) {
      return
    }

    setSubmitState((current) => {
      if (
        current.message === 'Verification expired. Please complete it again.' ||
        current.message === 'Verification failed to load. Please try again.' ||
        current.message === 'Complete the bot check before sending your message.'
      ) {
        return { type: '', message: '' }
      }

      return current
    })
  }, [turnstileToken])

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

    if (!isDiscordContactConfigured) {
      setSubmitState({
        type: 'error',
        message:
          'Form submissions are not configured yet. Add VITE_DISCORD_CONTACT_WEBHOOK_URL to enable sending.',
      })
      return
    }

    setIsSubmitting(true)
    setSubmitState({ type: '', message: '' })

    try {
      await sendContactWebhook({
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
    <section
      ref={sectionRef}
      id="contact"
      className={`relative scroll-mt-6 px-3 sm:px-4 md:px-5 ${contentWidthClass}`}
    >
      <div
        ref={sectionContentRef}
        className="rounded-[24px] md:rounded-[26px]"
      >
        <div
          className="reveal mb-3 max-w-[35rem]"
          data-revealed={sectionInView}
          style={{ transitionDelay: '0ms' }}
        >
          <p className="mb-2 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
            Let&apos;s Talk
          </p>
          <h2 className="m-0 text-[clamp(1.45rem,2.4vw,2rem)] leading-[1.15] font-bold text-[var(--text-strong)]">
            Send a message, grab the CV, or copy my email.
          </h2>
          <p className="mt-2.5 mb-0 text-[0.98rem] leading-6 text-[var(--text-muted)]">
            I&apos;m always open to interesting projects, collaborations, or just
            a conversation about software.
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(248px,0.7fr)] gap-3 max-md:grid-cols-1">
          <form
            onSubmit={handleSubmit}
            className="reveal rounded-[20px] bg-[var(--modal-subtle-bg)] p-3.5 shadow-[inset_0_0_0_1px_var(--panel-border),0_10px_24px_var(--soft-shadow)]"
            data-revealed={sectionInView}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="mb-3.5 flex items-start gap-3 rounded-[16px] border border-[var(--panel-border)] bg-[var(--input-bg)] px-3 py-2.5 shadow-[inset_0_1px_0_var(--panel-inset)]">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--button-subtle-bg)] text-[var(--button-subtle-text)] shadow-[inset_0_1px_0_var(--panel-inset)]">
                <MessageSquareQuote className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="m-0 text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                  Direct Message
                </p>
                <p className="mt-1 mb-0 text-[0.9rem] leading-6 text-[var(--text-muted)]">
                  Share the project, platform, or workflow you want built and I&apos;ll take it from there.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
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
                  className="min-h-11 rounded-[15px] border border-[var(--panel-border)] bg-[var(--input-bg)] px-4 text-[var(--text-strong)] outline-hidden transition-shadow duration-200 focus:shadow-[0_0_0_3px_var(--input-focus-ring)]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
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
                    className="min-h-11 rounded-[15px] border border-[var(--panel-border)] bg-[var(--input-bg)] px-4 text-[var(--text-strong)] outline-hidden transition-shadow duration-200 focus:shadow-[0_0_0_3px_var(--input-focus-ring)]"
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
                    className="min-h-11 rounded-[15px] border border-[var(--panel-border)] bg-[var(--input-bg)] px-4 text-[var(--text-strong)] outline-hidden transition-shadow duration-200 focus:shadow-[0_0_0_3px_var(--input-focus-ring)]"
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
                  rows={5}
                  minLength={10}
                  maxLength={4000}
                  className="rounded-[15px] border border-[var(--panel-border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-strong)] outline-hidden transition-shadow duration-200 focus:shadow-[0_0_0_3px_var(--input-focus-ring)]"
                />
              </label>

              <div className="grid gap-2">
                <p className="m-0 text-[0.84rem] font-semibold text-[var(--text-soft)]">
                  Confirm you&apos;re not a robot.
                </p>
                <TurnstileWidget
                  siteKey={contactSiteKey}
                  onTokenChange={setTurnstileToken}
                  onExpired={handleTurnstileExpired}
                  onError={handleTurnstileError}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting || !turnstileToken || !isContactFormConfigured}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-linear-to-br from-[var(--button-primary-from)] to-[var(--button-primary-to)] px-5 font-semibold text-white shadow-[0_12px_24px_var(--button-primary-shadow)] transition-all duration-200 hover:-translate-y-px focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--modal-bg)] disabled:cursor-not-allowed disabled:opacity-70 max-sm:w-full"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {!isContactFormConfigured ? (
                <p className="m-0 rounded-[14px] bg-[#fff2f2] px-4 py-3 text-[0.9rem] text-[#be4d4d]">
                  {!contactSiteKey
                    ? 'Add VITE_CLOUDFLARE_SITE_KEY to enable the protected contact form.'
                    : 'Add VITE_DISCORD_CONTACT_WEBHOOK_URL to enable submissions.'}
                </p>
              ) : null}

              {submitState.message ? (
                <p
                  aria-live="polite"
                  className={`reveal m-0 rounded-[14px] px-4 py-3 text-[0.9rem] ${
                    submitState.type === 'success'
                      ? 'bg-[#eefbf4] text-[#2f7d51]'
                      : 'bg-[#fff2f2] text-[#be4d4d]'
                  }`}
                  data-revealed={true}
                  style={{ transitionDelay: '0ms' }}
                >
                  {submitState.type === 'success' ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2f7d51]/12">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {submitState.message}
                    </span>
                  ) : (
                    submitState.message
                  )}
                </p>
              ) : null}
            </div>
          </form>

          <div className="grid content-start gap-4">
            <div
              className="reveal rounded-[20px] bg-[var(--modal-subtle-bg)] p-3.5 shadow-[inset_0_0_0_1px_var(--panel-border),0_10px_24px_var(--soft-shadow)]"
              data-revealed={sectionInView}
              style={{ transitionDelay: '200ms' }}
            >
              <h3 className="m-0 text-[1.02rem] font-bold text-[var(--text-strong)]">Quick actions</h3>
              <div className="mt-3 grid gap-2.5">
                <button
                  type="button"
                  onClick={handleEmailCopy}
                  className={`inline-flex min-h-11 items-center justify-between rounded-[16px] px-4 py-3 no-underline transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--modal-subtle-bg)] max-sm:w-full ${
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
                    className={`inline-flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full ${
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
                  className="inline-flex min-h-11 items-center justify-between rounded-[16px] bg-[var(--input-bg)] px-4 py-3 text-[var(--text-soft)] no-underline shadow-[inset_0_0_0_1px_var(--panel-border)] transition-colors duration-200 hover:bg-[var(--theme-toggle-hover-bg)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--modal-subtle-bg)] max-sm:w-full"
                  aria-label="Download Lance Ivan Salud CV as PDF"
                >
                  <span className="inline-flex items-center gap-3">
                    <Download className="h-4 w-4" />
                    Download CV
                  </span>
                  <span className="text-[0.82rem]">PDF</span>
                </a>

                <div className="mt-1 flex items-center gap-3 pt-2">
                  <a
                    href="https://github.com/S4LUD"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--input-bg)] text-[var(--text-soft)] shadow-[inset_0_0_0_1px_var(--panel-border)] transition-colors duration-200 hover:bg-[var(--theme-toggle-hover-bg)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)]"
                    aria-label="GitHub profile"
                  >
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/lance-ivan-salud-429968234"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--input-bg)] text-[var(--text-soft)] shadow-[inset_0_0_0_1px_var(--panel-border)] transition-colors duration-200 hover:bg-[var(--theme-toggle-hover-bg)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)]"
                    aria-label="LinkedIn profile"
                  >
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://v2.onlinejobs.ph/jobseekers/info/4429324"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--input-bg)] text-[var(--text-soft)] shadow-[inset_0_0_0_1px_var(--panel-border)] transition-colors duration-200 hover:bg-[var(--theme-toggle-hover-bg)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)]"
                    aria-label="OnlineJobs.ph profile"
                  >
                    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                  </a>
                  <span className="inline-flex items-center gap-1.5 text-[0.78rem] text-[var(--text-faint)]">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    Available for new projects
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
