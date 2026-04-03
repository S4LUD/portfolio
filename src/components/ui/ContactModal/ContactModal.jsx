import { Download, Mail, Send, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import cvFile from '../../../assets/Lance-Ivan-Salud-CV.pdf'
import { contactDetails } from '../../../data/portfolioData'
import {
  createContactInquiry,
} from '../../../lib/supabase/contactInquiries'
import { surfaceClass } from '../shared/uiClasses'
import TurnstileWidget from '../TurnstileWidget/TurnstileWidget'

const initialFormState = {
  name: '',
  email: '',
  company: '',
  message: '',
}

function ContactModal({ open, onClose }) {
  const [formState, setFormState] = useState(initialFormState)
  const [submitState, setSubmitState] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const openedAtRef = useRef(Date.now())
  const contactSiteKey = import.meta.env.VITE_CLOUDFLARE_SITE_KEY?.trim() ?? ''

  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim() || contactDetails.email
  const isPlaceholderEmail = contactEmail === contactDetails.email

  const mailtoHref = useMemo(() => {
    if (!contactEmail) {
      return '#'
    }

    return `mailto:${contactEmail}?subject=${contactDetails.emailSubject}&body=${contactDetails.emailBody}`
  }, [contactEmail])

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
      return undefined
    }

    openedAtRef.current = Date.now()
    setTurnstileToken('')
    setSubmitState({ type: '', message: '' })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

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

  const handleSubmit = async (event) => {
    event.preventDefault()

    const elapsedSeconds = Math.round((Date.now() - openedAtRef.current) / 1000)

    if (!turnstileToken) {
      setSubmitState({
        type: 'error',
        message: 'Complete the bot check before sending your message.',
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

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(34,45,67,0.45)] p-4 backdrop-blur-[6px]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close contact modal"
      />

      <div
        className={`${surfaceClass} relative z-[1] w-[min(920px,100%)] rounded-[26px] bg-[rgba(255,255,255,0.96)] p-5 shadow-[0_24px_60px_rgba(103,124,168,0.22)] max-sm:max-h-[92vh] max-sm:overflow-y-auto max-sm:rounded-[22px] max-sm:p-4`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f6ff] text-[#5d739a] transition-colors duration-200 hover:bg-[#e8eefb]"
          aria-label="Close contact modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 max-w-[36rem] pr-12">
          <p className="mb-2 text-[0.82rem] font-extrabold uppercase tracking-[0.08em] text-[#5b79aa]">
            Get In Touch
          </p>
          <h2 className="m-0 text-[clamp(1.45rem,2.4vw,2rem)] leading-[1.15] font-bold text-[#32425f]">
            Pick the fastest way to reach out.
          </h2>
          <p className="mt-3 mb-0 text-[0.98rem] leading-7 text-[#7183a2]">
            Send a quick message, open a direct email draft, or download the latest CV.
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] gap-4 max-md:grid-cols-1">
          <form
            onSubmit={handleSubmit}
            className="rounded-[22px] bg-[#fbfdff] p-4 shadow-[inset_0_0_0_1px_rgba(228,234,245,0.8)]"
          >
            <div className="grid gap-4">
              <label className="grid gap-2 text-[0.92rem] font-semibold text-[#465a7c]">
                Name
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="min-h-12 rounded-[16px] border border-[rgba(225,233,246,0.95)] bg-white px-4 text-[#32425f] outline-hidden transition-shadow duration-200 focus:shadow-[0_0_0_3px_rgba(107,152,255,0.15)]"
                />
              </label>

              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <label className="grid gap-2 text-[0.92rem] font-semibold text-[#465a7c]">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="min-h-12 rounded-[16px] border border-[rgba(225,233,246,0.95)] bg-white px-4 text-[#32425f] outline-hidden transition-shadow duration-200 focus:shadow-[0_0_0_3px_rgba(107,152,255,0.15)]"
                  />
                </label>

                <label className="grid gap-2 text-[0.92rem] font-semibold text-[#465a7c]">
                  Company
                  <input
                    type="text"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    className="min-h-12 rounded-[16px] border border-[rgba(225,233,246,0.95)] bg-white px-4 text-[#32425f] outline-hidden transition-shadow duration-200 focus:shadow-[0_0_0_3px_rgba(107,152,255,0.15)]"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-[0.92rem] font-semibold text-[#465a7c]">
                Message
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="rounded-[16px] border border-[rgba(225,233,246,0.95)] bg-white px-4 py-3 text-[#32425f] outline-hidden transition-shadow duration-200 focus:shadow-[0_0_0_3px_rgba(107,152,255,0.15)]"
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
                  disabled={isSubmitting || !turnstileToken}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-linear-to-br from-[#6b98ff] to-[#4d72e8] px-5 font-semibold text-white shadow-[0_12px_24px_rgba(92,130,229,0.24)] transition-transform duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {submitState.message ? (
                <p
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
            <div className="rounded-[22px] bg-[#fbfdff] p-4 shadow-[inset_0_0_0_1px_rgba(228,234,245,0.8)]">
              <h3 className="m-0 text-[1.02rem] font-bold text-[#32425f]">Quick actions</h3>
              <div className="mt-4 grid gap-3">
                <a
                  href={isPlaceholderEmail ? undefined : mailtoHref}
                  onClick={(event) => {
                    if (isPlaceholderEmail) {
                      event.preventDefault()
                    }
                  }}
                  className={`inline-flex min-h-12 items-center justify-between rounded-[18px] px-4 py-3 no-underline transition-colors duration-200 ${
                    isPlaceholderEmail
                      ? 'cursor-not-allowed bg-[#f4f6fb] text-[#95a3bc]'
                      : 'bg-white text-[#465a7c] shadow-[inset_0_0_0_1px_rgba(228,234,245,0.9)] hover:bg-[#f7faff]'
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <Mail className="h-4 w-4" />
                    Email me directly
                  </span>
                  <span className="text-[0.82rem]">
                    {isPlaceholderEmail ? 'Set your email' : 'Open draft'}
                  </span>
                </a>

                <a
                  href={cvFile}
                  download="Lance-Ivan-Salud-CV.pdf"
                  className="inline-flex min-h-12 items-center justify-between rounded-[18px] bg-white px-4 py-3 text-[#465a7c] no-underline shadow-[inset_0_0_0_1px_rgba(228,234,245,0.9)] transition-colors duration-200 hover:bg-[#f7faff]"
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
