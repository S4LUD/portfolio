export const heroStats = [
  'Agile implementation from rough idea to working product.',
  'Websites, mobile apps, and automation that actually ship.',
  'Build fast, automate early, scale cleanly.',
]

export const marqueeStacks = [
  { label: 'Vercel', icon: 'vercel' },
  { label: 'Next.js', icon: 'nextdotjs' },
  { label: 'React.js', icon: 'react' },
  { label: 'Vite.js', icon: 'vite' },
  { label: 'npm', icon: 'npm' },
  { label: 'Bun', icon: 'bun' },
  { label: 'Yarn', icon: 'yarn' },
  { label: 'Expo', icon: 'expo' },
  { label: 'Supabase', icon: 'supabase' },
  { label: 'MongoDB Atlas', icon: 'mongodb' },
  { label: 'Zapier', icon: 'zapier' },
  { label: 'Make', icon: 'make' },
  { label: 'n8n', icon: 'n8n' },
  { label: 'Airtable', icon: 'airtable' },
  { label: 'Google Sheets', icon: 'googlesheets' },
  { label: 'Slack', icon: 'slack' },
  { label: 'Gmail', icon: 'gmail' },
  { label: 'Twilio', icon: 'twilio' },
  { label: 'Postgres', icon: 'postgresql' },
  { label: 'GraphQL', icon: 'graphql' },
]

export const overviewCards = [
  {
    title: 'Lead Qualification Pipeline',
    meta: 'Event-driven intake and routing',
    stack: ['Zapier', 'n8n', 'Webhook', 'Airtable', 'Slack'],
    note: '1k+ executions/day',
  },
  {
    title: 'Support Ticket Escalation',
    meta: 'Priority scoring and handoff',
    stack: ['Zapier', 'n8n', 'Slack', 'Aideeio'],
    note: '9-minute average response',
  },
  {
    title: 'Daily Metrics Aggregator',
    meta: 'Cross-platform reporting sync',
    stack: ['Zapier', 'Google Sheets', 'Supabase'],
    note: 'Runs every 15 minutes',
  },
]

export const caseStudyPoints = [
  '80% reduction in manual work',
  '0 duplicate entries processed',
  '<2s from trigger to outcome',
]

export const stackGroups = [
  {
    title: 'Web & App',
    items: ['Next.js', 'React.js', 'Vite.js', 'Expo'],
  },
  {
    title: 'Runtime & Deploy',
    items: ['Vercel', 'npm', 'Bun', 'Yarn'],
  },
  {
    title: 'Automation',
    items: ['Zapier', 'Make', 'n8n', 'Webhooks'],
  },
  {
    title: 'Data Layer',
    items: ['Supabase', 'MongoDB Atlas', 'Airtable', 'Google Sheets'],
  },
  {
    title: 'Communication',
    items: ['Slack', 'Gmail', 'Twilio'],
  },
]

export const contactDetails = {
  email: 'your-email@example.com',
  emailSubject: 'Portfolio Inquiry',
  emailBody:
    "Hi Lance,%0D%0A%0D%0AI'd love to connect about your automation and software work.%0D%0A%0D%0AThanks,",
  formTable: 'contact_inquiries',
  functionName: 'contact-inquiry',
}

export const heroWorkflow = {
  tall: true,
  nodes: [
    { label: 'Trigger', tone: 'green', x: '62%', y: '10%' },
    { label: 'Webhook', tone: 'green', x: '18%', y: '32%' },
    { label: 'Action', tone: 'blue', x: '50%', y: '38%' },
    { label: 'Condition', tone: 'pink', x: '83%', y: '32%' },
    { label: 'Airtable', tone: 'violet', x: '18%', y: '72%' },
    { label: 'Condition', tone: 'orange', x: '55%', y: '79%' },
    { label: 'Send Message', tone: 'teal', x: '82%', y: '67%' },
    { label: 'Airtable', tone: 'amber', x: '86%', y: '87%' },
  ],
  lines: [
    { x1: '62%', y1: '18%', x2: '50%', y2: '31%' },
    { x1: '24%', y1: '36%', x2: '42%', y2: '38%' },
    { x1: '58%', y1: '38%', x2: '76%', y2: '32%' },
    { x1: '50%', y1: '46%', x2: '55%', y2: '71%' },
    { x1: '24%', y1: '72%', x2: '47%', y2: '79%' },
    { x1: '62%', y1: '79%', x2: '78%', y2: '70%' },
    { x1: '88%', y1: '39%', x2: '88%', y2: '60%' },
    { x1: '86%', y1: '74%', x2: '86%', y2: '82%' },
  ],
}

export const detailWorkflow = {
  tall: false,
  nodes: [
    { label: 'Webhook', tone: 'green', x: '68%', y: '10%' },
    { label: 'Action', tone: 'blue', x: '68%', y: '33%' },
    { label: 'Slack', tone: 'green', x: '92%', y: '34%' },
    { label: 'Dropoff\nRouting', tone: 'orange', x: '88%', y: '56%' },
    { label: 'AI', tone: 'teal', x: '14%', y: '62%' },
    { label: 'Airtable', tone: 'amber', x: '90%', y: '82%' },
  ],
  lines: [
    { x1: '68%', y1: '18%', x2: '68%', y2: '26%' },
    { x1: '74%', y1: '34%', x2: '84%', y2: '34%' },
    { x1: '68%', y1: '41%', x2: '84%', y2: '55%' },
    { x1: '82%', y1: '57%', x2: '24%', y2: '62%' },
    { x1: '20%', y1: '62%', x2: '82%', y2: '82%' },
    { x1: '90%', y1: '63%', x2: '90%', y2: '75%' },
  ],
}
