import quantumNexusDemo1 from '../assets/quantum-nexus/demo_image_1.jpg'
import quantumNexusDemo2 from '../assets/quantum-nexus/demo_image_2.jpg'
import quantumNexusDemo3 from '../assets/quantum-nexus/demo_image_3.jpg'
import quantumNexusDemo4 from '../assets/quantum-nexus/demo_image_4.jpg'
import quantumNexusDemo5 from '../assets/quantum-nexus/demo_image_5.jpg'
import quantumNexusDemo6 from '../assets/quantum-nexus/demo_image_6.jpg'
import macroHokDemo1 from '../assets/macrohok/demo_image_1.png'

export const heroStats = [
  '6+ projects delivered across mobile, web, and automation.',
  'Healthcare platforms, payment integrations, and production apps.',
  'From React Native to Zapier — built to ship, every time.',
]

export const contactDetails = {
  email: 'your-email@example.com',
  emailSubject: 'Portfolio Inquiry',
  emailBody:
    "Hi Lance,%0D%0A%0D%0AI'd love to connect about your automation and software work.%0D%0A%0D%0AThanks,",
}

export const projectFilters = ['All', 'Automation', 'Web', 'Mobile']

export const projects = [
  {
    id: 'medical-avenue-core',
    featured: false,
    type: 'Web',
    engagement: 'Corporate Experience',
    title: 'Medical Avenue Core',
    sidePanel: 'client-note',
    clientNote: 'Built under NDA for a healthcare client. Full case study available on request.',
    summary:
      'A healthcare web platform built to support secure account flows, structured operations, and production-ready admin experiences.',
    challenge:
      'The product needed to support a wide operational surface area across secure access, content administration, structured records, and day-to-day web reliability.',
    solution:
      'Built the platform with Next.js, Prisma, Supabase, and modular admin tooling, backed by structured data models and maintainable delivery workflows.',
    outcome:
      'Delivered a stronger web foundation for healthcare operations, with clearer internal tooling and a more scalable application architecture.',
    stack: ['Next.js', 'Prisma', 'Supabase', 'Tailwind CSS', 'TypeScript'],
    githubUrl: undefined,
    demoUrl: undefined,
  },
  {
    id: 'quantum-nexus',
    featured: true,
    type: 'Mobile',
    engagement: 'Personal',
    title: 'Quantum Nexus',
    sidePanel: 'snapshot',
    summary:
      'A mobile-first strategy game built with React Native and Expo, centered on custom gameplay systems, AI turns, and multiplayer-ready architecture.',
    challenge:
      'The project needed to bring together game systems design, polished mobile UX, and scalable architecture in one cohesive mobile experience.',
    solution:
      'Built the game with Expo Router, TypeScript, custom gameplay logic, AI turn handling, internationalization, and a dedicated server foundation for realtime support.',
    outcome:
      'Delivered a structured game experience with reusable UI systems, scalable game logic, and backend-ready realtime foundations.',
    snapshotImages: [
      quantumNexusDemo1,
      quantumNexusDemo2,
      quantumNexusDemo3,
      quantumNexusDemo4,
      quantumNexusDemo5,
      quantumNexusDemo6,
    ],
    stack: ['React Native', 'Expo', 'Expo Router', 'TypeScript', 'Socket.IO'],
    githubUrl: undefined,
    demoUrl: undefined,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.miruza.quantumnexus&hl=en',
  },
  {
    id: 'medical-avenue',
    featured: false,
    type: 'Mobile',
    engagement: 'Corporate Experience',
    title: 'Medical Avenue',
    sidePanel: 'client-note',
    clientNote: 'Built under NDA for a healthcare client. Full case study available on request.',
    summary:
      'A healthcare mobile product built with React Native and Expo, combining patient-facing flows, native integrations, and production-ready mobile infrastructure.',
    challenge:
      'The app needed to support real healthcare interactions while staying reliable across secure access, notifications, file handling, and device-specific mobile behavior.',
    solution:
      'Built the app with Expo Router, React Native, Supabase, Firebase services, native auth integrations, and a modular screen architecture for scalable feature delivery.',
    outcome:
      'Delivered a stronger mobile product foundation with secure access flows, native capabilities, and backend-connected patient experience workflows.',
    stack: ['React Native', 'Expo', 'Expo Router', 'Supabase', 'Firebase'],
    githubUrl: undefined,
    demoUrl: undefined,
  },
  {
    id: 'ghl-xendit-backend-v2',
    featured: false,
    type: 'Automation',
    engagement: 'Freelance',
    title: 'Custom GHL Payment Method',
    sidePanel: 'client-note',
    clientNote: 'Built under NDA for a client.',
    summary:
      'A backend integration system connecting GoHighLevel and Xendit for OAuth, payments, webhooks, and branded checkout flows.',
    challenge:
      'The system needed to handle tenant-aware payment configuration, webhook reliability, OAuth flows, and operational visibility across multiple moving parts.',
    solution:
      'Built the backend with Bun, Express, Supabase, and a dedicated frontend workspace, with encrypted credential handling, durable outbox dispatch, health checks, and payment lifecycle routing.',
    outcome:
      'Delivered a stronger integration foundation for payment operations, subscription event delivery, and embedded checkout experiences.',
    stack: ['Bun', 'Express', 'Supabase', 'GoHighLevel', 'Xendit'],
    githubUrl: undefined,
    demoUrl: undefined,
  },
  {
    id: 'zapier-intake-routing-system',
    featured: false,
    type: 'Automation',
    engagement: 'Personal',
    title: 'Lead Intake & Routing Automation',
    sidePanel: 'workflow',
    summary:
      'A Zapier-based intake workflow connecting Google Forms, Airtable, Slack, and Gmail through validation, branching logic, and automated record handling.',
    challenge:
      'The intake process needed to reduce manual review, avoid inconsistent record handling, and route submissions reliably across multiple follow-up outcomes.',
    solution:
      'Built a multi-step automation using filters, formatter steps, custom JavaScript, Airtable lookups and updates, and path-based branching to control routing and notifications.',
    outcome:
      'Delivered a cleaner intake pipeline with more reliable data handling, conditional routing, internal alerts, and automated email follow-up.',
    stack: ['Zapier', 'Google Forms', 'Airtable', 'Slack', 'Gmail', 'JavaScript'],
    githubUrl: undefined,
    demoUrl: undefined,
  },
  {
    id: 'macrohok',
    featured: false,
    type: 'Automation',
    engagement: 'Personal',
    title: 'MacroHok',
    externalUrl: 'https://sourceforge.net/projects/macrohok/',
    sidePanel: 'snapshot',
    summary:
      'A Python desktop automation utility for configurable mouse, keyboard, and scroll workflows, with hotkeys, presets, live logging, and packaged Windows releases.',
    challenge:
      'I wanted a more complete desktop automation tool than one-off scripts could offer, with reusable workflows, controlled execution, and a UI that made macro setup easier to manage.',
    solution:
      'Built a Python app with a Tkinter GUI, global hotkeys, preset storage, action editing, execution controls, logging, and release packaging for Windows distribution.',
    outcome:
      'Delivered a reusable desktop automation utility with configurable macro behavior, saved presets, structured execution flow, and production-style packaging and test coverage.',
    snapshotImages: [macroHokDemo1],
    stack: ['Python', 'Tkinter', 'Pynput', 'PyDirectInput', 'PyGetWindow', 'PyInstaller'],
    githubUrl: undefined,
    demoUrl: undefined,
  },
]
