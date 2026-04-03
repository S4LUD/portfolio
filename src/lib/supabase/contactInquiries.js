import { contactDetails } from '../../data/portfolioData'
import { isSupabaseConfigured, supabase } from './client'

export async function createContactInquiry(payload) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to enable form submissions.',
    )
  }

  const functionName = import.meta.env.VITE_SUPABASE_CONTACT_FUNCTION || contactDetails.functionName
  const { error } = await supabase.functions.invoke(functionName, {
    body: payload,
  })

  if (error) {
    throw new Error(error.message || 'Failed to submit contact form.')
  }
}
