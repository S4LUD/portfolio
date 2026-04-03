export const heroStats = [
  'Scalable workflows across APIs and no-code platforms',
  'Custom automation layers for lead ops, support, and reporting',
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
    stack: ['Zapier', 'Google Sheets', 'Coda'],
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
    title: 'Orchestration',
    items: ['Zapier', 'Make', 'n8n', 'IFTTT'],
  },
  {
    title: 'Data Layer',
    items: ['Airtable', 'Sheets', 'Coda', 'Postgres'],
  },
  {
    title: 'Communication',
    items: ['Slack', 'Gmail', 'Twilio', 'Webhooks'],
  },
  {
    title: 'API Integration',
    items: ['REST', 'GraphQL', 'OAuth', 'SDKs'],
  },
]

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
