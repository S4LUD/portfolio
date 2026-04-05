import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Blocks,
  BrainCircuit,
  Cable,
  ChevronLeft,
  ChevronRight,
  Globe,
  Smartphone,
  X,
} from "lucide-react";
import { projectFilters, projects } from "../../../data/portfolioData";
import {
  chipClass,
  contentWidthClass,
  sectionTitleClass,
  strongBadgeClass,
  subtleBadgeClass,
  subtlePanelClass,
} from "../../ui/shared/uiClasses";

const projectTypeMeta = {
  Mobile: {
    icon: Smartphone,
    iconClass: "text-[#86b9ff]",
    profileLabel: "Mobile-first build",
    glowVar: "var(--project-glow-mobile)",
    badgeVar: "var(--project-badge-mobile)",
  },
  Web: {
    icon: Globe,
    iconClass: "text-[#9fb4ff]",
    profileLabel: "Web platform",
    glowVar: "var(--project-glow-web)",
    badgeVar: "var(--project-badge-web)",
  },
  Automation: {
    icon: Cable,
    iconClass: "text-[#8fd9bb]",
    profileLabel: "Integration system",
    glowVar: "var(--project-glow-automation)",
    badgeVar: "var(--project-badge-automation)",
  },
};

const featuredFocusPoints = {
  "quantum-nexus": [
    "Game systems",
    "AI turns",
    "Realtime-ready",
    "Multilingual",
  ],
  "medical-avenue": [
    "Native flows",
    "Secure access",
    "Notifications",
    "Mobile infra",
  ],
  "medical-avenue-core": [
    "Admin tooling",
    "Structured data",
    "Auth flows",
    "Web ops",
  ],
  "ghl-xendit-backend-v2": [
    "OAuth flow",
    "Webhooks",
    "Checkout",
    "Outbox delivery",
  ],
};

function getProjectMeta(type) {
  return projectTypeMeta[type] ?? projectTypeMeta.Web;
}

function clampChannel(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function rgbaFromColor(color, alpha) {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

function sampleAmbientColors(image) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return null;
  }

  const sampleWidth = 48;
  const sampleHeight = Math.max(
    64,
    Math.round((image.naturalHeight / image.naturalWidth) * sampleWidth),
  );
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;
  context.drawImage(image, 0, 0, sampleWidth, sampleHeight);

  const { data } = context.getImageData(0, 0, sampleWidth, sampleHeight);
  const left = { r: 0, g: 0, b: 0, count: 0 };
  const right = { r: 0, g: 0, b: 0, count: 0 };
  const center = { r: 0, g: 0, b: 0, count: 0 };

  for (let y = 0; y < sampleHeight; y += 1) {
    for (let x = 0; x < sampleWidth; x += 1) {
      const offset = (y * sampleWidth + x) * 4;
      const alpha = data[offset + 3];

      if (alpha < 12) {
        continue;
      }

      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const brightness = red + green + blue;

      if (brightness < 28) {
        continue;
      }

      const saturation =
        Math.max(red, green, blue) - Math.min(red, green, blue);
      const weight = 1 + saturation / 255;
      let target = center;

      if (x < sampleWidth * 0.28) {
        target = left;
      } else if (x > sampleWidth * 0.72) {
        target = right;
      }

      target.r += red * weight;
      target.g += green * weight;
      target.b += blue * weight;
      target.count += weight;
    }
  }

  const fallback = { r: 115, g: 150, b: 230 };
  const normalize = (bucket, tint) => {
    if (!bucket.count) {
      return tint;
    }

    return {
      r: clampChannel((bucket.r / bucket.count) * 1.12 + tint.r * 0.18),
      g: clampChannel((bucket.g / bucket.count) * 1.12 + tint.g * 0.18),
      b: clampChannel((bucket.b / bucket.count) * 1.12 + tint.b * 0.18),
    };
  };

  return {
    left: normalize(left, { r: 190, g: 104, b: 255 }),
    right: normalize(right, { r: 40, g: 198, b: 255 }),
    center: normalize(center, fallback),
  };
}

const projectSurfaceClass = `${subtlePanelClass} rounded-[20px] shadow-[0_18px_40px_var(--project-panel-shadow),inset_0_1px_0_var(--project-panel-inset)]`;

const automationWorkflowMain = [
  { app: "Google Forms", kind: "Trigger", title: "New Form Response" },
  { app: "Filter by Zapier", kind: "Filter", title: "Filter conditions" },
  { app: "Formatter by Zapier", kind: "Formatter", title: "Text" },
  { app: "Code by Zapier", kind: "Code", title: "Run Javascript" },
  { app: "Airtable", kind: "Lookup", title: "Find Record" },
  { app: "Filter by Zapier", kind: "Filter", title: "Filter conditions" },
  { app: "Airtable", kind: "Create", title: "Create Record" },
  { app: "Formatter by Zapier", kind: "Utilities", title: "Utilities" },
  { app: "Paths", kind: "Router", title: "Split into paths" },
];

const automationWorkflowBranches = [
  {
    title: "Path A",
    steps: [
      { app: "Paths", kind: "Router", title: "Split into paths" },
      { app: "Airtable", kind: "Update", title: "Update Record" },
      { app: "Slack", kind: "Notify", title: "Send Channel Message" },
      { app: "Airtable", kind: "Update", title: "Update Record" },
      { app: "Gmail", kind: "Send", title: "Send Email" },
    ],
  },
  {
    title: "Path B",
    steps: [
      { app: "Paths", kind: "Router", title: "Split into paths" },
      { app: "Airtable", kind: "Update", title: "Update Record" },
      { app: "Airtable", kind: "Lookup", title: "Find Record" },
      { app: "Filter by Zapier", kind: "Filter", title: "Filter conditions" },
      { app: "Airtable", kind: "Lookup", title: "Find Record" },
      { app: "Airtable", kind: "Update", title: "Update Record" },
    ],
  },
];

const workflowStepMeta = {
  "Google Forms": { badge: "rgba(111, 207, 151, 0.18)" },
  "Filter by Zapier": { badge: "rgba(255, 173, 91, 0.16)" },
  "Formatter by Zapier": { badge: "rgba(255, 123, 123, 0.15)" },
  "Code by Zapier": { badge: "rgba(111, 168, 255, 0.16)" },
  Airtable: { badge: "rgba(255, 214, 102, 0.14)" },
  Paths: { badge: "rgba(170, 150, 255, 0.16)" },
  Slack: { badge: "rgba(139, 92, 246, 0.16)" },
  Gmail: { badge: "rgba(239, 68, 68, 0.14)" },
}

function getWorkflowStepMeta(app) {
  return (
    workflowStepMeta[app] ?? {
      badge: "rgba(111, 168, 255, 0.14)",
    }
  );
}

function WorkflowNode({ step, compact = false }) {
  const meta = getWorkflowStepMeta(step.app);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-[10px] border border-[var(--project-panel-border)] bg-[var(--input-bg)] px-2 py-1.5 text-left shadow-[0_10px_24px_rgba(5,10,20,0.08),inset_0_1px_0_var(--project-panel-inset)] ${
          compact ? "w-[10.5rem]" : "min-w-[8.5rem]"
        }`}
      >
        <div className="mb-1 flex items-center justify-between gap-2">
          <span
            className="inline-flex rounded-[6px] px-1.5 py-0.5 text-[0.55rem] font-bold text-[var(--text-soft)]"
            style={{ backgroundColor: meta.badge }}
          >
            {step.app}
          </span>
          <span className="text-[0.8rem] text-[var(--text-faint)]">⋮</span>
        </div>
        <p className="m-0 text-[0.72rem] font-semibold text-[var(--text-strong)]">
          {step.title}
        </p>
        <p className="mt-0.5 mb-0 text-[0.58rem] text-[var(--text-faint)]">
          {step.kind}
        </p>
      </div>
    </div>
  );
}

function AutomationWorkflowPreview() {
  return (
    <div className="rounded-[14px] bg-linear-to-br from-[var(--input-bg)] to-[var(--project-panel-bg)] p-3 shadow-[inset_0_1px_0_var(--project-panel-inset)]">
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[34rem]">
          <div className="mx-auto flex max-w-[10.5rem] flex-col items-center">
            {automationWorkflowMain.map((step, index) => (
              <div
                key={`${step.app}-${step.title}`}
                className="flex w-full flex-col items-center"
              >
                <WorkflowNode step={step} />
                {index < automationWorkflowMain.length - 1 ? (
                  <div className="my-1.5 flex h-4 items-center">
                    <span className="h-full w-px bg-[#7a6cff]/55" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-center">
            <div className="h-4 w-px bg-[#7a6cff]/55" />
          </div>

          <div className="mx-auto w-[22.5rem]">
            <div className="flex items-center justify-center">
              <div className="relative h-px w-full bg-[#7a6cff]/55">
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-6">
              {automationWorkflowBranches.map((branch) => (
                <div key={branch.title} className="flex w-[10.5rem] shrink-0 flex-col items-center">
                  <div className="mb-1.5 flex w-full justify-center">
                    <span className="inline-flex rounded-full border border-[#b6a8ff]/50 bg-[#7a6cff]/10 px-2.5 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.08em] text-[#b7b0ff]">
                      {branch.title}
                    </span>
                  </div>
                  <div className="grid w-full justify-items-center gap-1.5">
                    {branch.steps.map((step, index) => (
                      <div key={`${branch.title}-${step.app}-${step.title}`} className="w-full">
                        {index > 0 ? (
                          <div className="mb-1.5 flex h-3 items-center justify-center">
                            <span className="h-full w-px bg-[#7a6cff]/55" />
                          </div>
                        ) : null}
                        <WorkflowNode step={step} compact />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowPreviewModal({ open, onClose }) {
  if (!open) {
    return null;
  }

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--gallery-backdrop)] p-4 backdrop-blur-[10px] max-sm:p-2">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close workflow preview"
      />

      <div className="relative z-[1] inline-flex max-h-[88vh] w-[min(100%,68rem)] flex-col p-4 max-sm:max-h-[92vh] max-sm:p-3">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gallery-control-bg)] text-[var(--gallery-control-text)] shadow-[0_10px_24px_var(--soft-shadow)] backdrop-blur-[6px]"
          aria-label="Close workflow preview"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-3 pr-12">
          <p className="m-0 text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--gallery-title-text)]">
            Lead Intake & Routing Automation
          </p>
          <p className="mt-1 mb-0 text-[0.95rem] text-[var(--gallery-meta-text)]">
            Workflow Preview
          </p>
        </div>

        <div className="overflow-auto pr-1">
          <AutomationWorkflowPreview />
        </div>
      </div>
    </div>
  );
}

function FeaturedProjectCard({
  featuredProject,
  featuredMeta,
  featuredFocus,
  onOpenWorkflowPreview,
}) {
  const [activeSnapshot, setActiveSnapshot] = useState(0);
  const [isSnapshotPaused, setIsSnapshotPaused] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryAmbient, setGalleryAmbient] = useState(null);

  const featuredSnapshots = useMemo(
    () => featuredProject.snapshotImages ?? [],
    [featuredProject.snapshotImages],
  );

  useEffect(() => {
    if (featuredSnapshots.length <= 1 || isSnapshotPaused || isGalleryOpen) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveSnapshot((current) => (current + 1) % featuredSnapshots.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [featuredSnapshots.length, isGalleryOpen, isSnapshotPaused]);

  useEffect(() => {
    if (!isGalleryOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsGalleryOpen(false);
        return;
      }

      if (featuredSnapshots.length <= 1) {
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveSnapshot(
          (current) => (current + 1) % featuredSnapshots.length,
        );
      } else if (event.key === "ArrowLeft") {
        setActiveSnapshot(
          (current) =>
            (current - 1 + featuredSnapshots.length) % featuredSnapshots.length,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [featuredSnapshots.length, isGalleryOpen]);

  useEffect(() => {
    if (!featuredSnapshots.length) {
      return undefined;
    }

    let cancelled = false;
    const image = new window.Image();

    image.onload = () => {
      if (cancelled) {
        return;
      }

      setGalleryAmbient(sampleAmbientColors(image));
    };

    image.onerror = () => {
      if (!cancelled) {
        setGalleryAmbient(null);
      }
    };

    image.src = featuredSnapshots[activeSnapshot];

    return () => {
      cancelled = true;
    };
  }, [activeSnapshot, featuredSnapshots]);

  const showPreviousSnapshot = () => {
    setActiveSnapshot(
      (current) =>
        (current - 1 + featuredSnapshots.length) % featuredSnapshots.length,
    );
  };

  const showNextSnapshot = () => {
    setActiveSnapshot((current) => (current + 1) % featuredSnapshots.length);
  };

  return (
    <>
      <article
        className={`${projectSurfaceClass} relative mb-4 overflow-hidden p-5 max-sm:p-4`}
      >
        <div
          style={{
            opacity: "var(--project-glow-opacity)",
            backgroundImage: featuredMeta?.glowVar,
          }}
          className="pointer-events-none absolute inset-x-0 top-0 h-28 blur-2xl"
        />

        <div className="relative grid grid-cols-[minmax(0,1.18fr)_minmax(300px,0.82fr)] gap-5 max-lg:grid-cols-1">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={strongBadgeClass}>{featuredProject.type}</span>
              <span className={subtleBadgeClass}>
                {featuredProject.engagement}
              </span>
            </div>

            <div className="mt-4 flex items-start gap-4 max-sm:flex-col max-sm:gap-3">
                <div
                  className={`inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-[18px] bg-[var(--button-subtle-bg)] shadow-[0_12px_24px_var(--soft-shadow)] ${featuredMeta?.iconClass ?? ""}`}
                  style={{ backgroundImage: featuredMeta?.badgeVar }}
                >
                {featuredMeta?.icon ? (
                  <featuredMeta.icon className="h-6 w-6" />
                ) : null}
              </div>

              <div>
                <p className="m-0 text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                  {featuredMeta?.profileLabel}
                </p>
                <h3 className="mt-2 mb-3 text-[1.65rem] leading-[1.08] font-bold text-[var(--text-strong)] max-sm:text-[1.4rem]">
                  {featuredProject.title}
                </h3>
                <p className="m-0 max-w-[42rem] text-[1rem] leading-8 text-[var(--text-muted)]">
                  {featuredProject.summary}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-5">
              <div>
                <p className="mb-1.5 text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                  What it is
                </p>
                <p className="m-0 text-[0.96rem] leading-7 text-[var(--text-muted)]">
                  {featuredProject.challenge}
                </p>
              </div>

              <div>
                <p className="mb-1.5 text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                  What I built
                </p>
                <p className="m-0 text-[0.96rem] leading-7 text-[var(--text-muted)]">
                  {featuredProject.solution}
                </p>
              </div>

              <div>
                <p className="mb-1.5 text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                  Why it matters
                </p>
                <p className="m-0 text-[0.96rem] leading-7 text-[var(--text-muted)]">
                  {featuredProject.outcome}
                </p>
              </div>
            </div>
          </div>

          <div className="grid content-start gap-3.5 self-start">
            <div className={`${subtlePanelClass} rounded-[16px] p-5`}>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[10px] bg-[var(--input-bg)] px-4 py-3 shadow-[inset_0_1px_0_var(--project-panel-inset)]">
                    <p className="m-0 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                      Type
                    </p>
                    <p className="mt-1 m-0 text-[0.95rem] font-semibold text-[var(--text-strong)]">
                      {featuredProject.type}
                    </p>
                  </div>

                  <div className="rounded-[10px] bg-[var(--input-bg)] px-4 py-3 shadow-[inset_0_1px_0_var(--project-panel-inset)]">
                    <p className="m-0 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                      Origin
                    </p>
                    <p className="mt-1 m-0 text-[0.95rem] font-semibold text-[var(--text-strong)]">
                      {featuredProject.engagement}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="m-0 text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                    Focus
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
                    {featuredFocus.map((item) => (
                      <div
                        key={item}
                        className="inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-[var(--input-bg)] px-3.5 text-[0.88rem] font-semibold text-[var(--text-soft)] shadow-[inset_0_1px_0_var(--project-panel-inset)]"
                      >
                        <BrainCircuit className="h-4 w-4 text-[var(--button-subtle-text)]" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="m-0 text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                    Stack
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {featuredProject.stack.map((item) => (
                      <span key={item} className={chipClass}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {featuredProject.sidePanel === "snapshot" ? (
              <div className={`${subtlePanelClass} rounded-[20px] p-5`}>
                <p className="mb-2 text-[0.85rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                  Screens
                </p>
                  <div className="rounded-[16px] p-4">
                  {featuredSnapshots.length ? (
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => setIsGalleryOpen(true)}
                        className="group block w-full overflow-hidden rounded-[14px] bg-[var(--input-bg)] shadow-[inset_0_1px_0_var(--project-panel-inset)]"
                        aria-label="Open Quantum Nexus screenshot gallery"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <img
                            src={featuredSnapshots[0]}
                            alt="Quantum Nexus screen preview"
                            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                            draggable="false"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[rgba(9,14,24,0.72)] via-[rgba(9,14,24,0.16)] to-transparent" />
                          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3">
                            <div>
                              <p className="m-0 text-[0.78rem] font-extrabold uppercase tracking-[0.08em] text-white/80">
                                Quantum Nexus
                              </p>
                              <p className="mt-1 mb-0 text-[0.84rem] font-semibold text-white">
                                6 gameplay and UI screens
                              </p>
                            </div>
                            <span className="inline-flex min-h-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.16)] px-3 text-[0.78rem] font-semibold text-white backdrop-blur-[6px]">
                              Open Gallery
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  ) : null}

                  <p className="m-0 text-[0.95rem] leading-7 text-[var(--text-muted)]">
                    Gameplay, UI flow, and in-app screens from Quantum Nexus.
                  </p>
                </div>
              </div>
            ) : featuredProject.sidePanel === "client-note" ? (
              <div className={`${subtlePanelClass} rounded-[20px] p-5`}>
                <p className="mb-2 text-[0.85rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                  Client Scope
                </p>
                <p className="m-0 text-[0.96rem] leading-7 text-[var(--text-muted)]">
                  {featuredProject.clientNote}
                </p>
              </div>
            ) : featuredProject.sidePanel === "workflow" ? (
              <div className={`${subtlePanelClass} rounded-[20px] p-5`}>
                <p className="mb-2 text-[0.85rem] font-extrabold uppercase tracking-[0.08em] text-[var(--accent-text)]">
                  Workflow Preview
                </p>
                <button
                  type="button"
                  onClick={onOpenWorkflowPreview}
                  className="block w-full text-left"
                  aria-label="Open workflow preview"
                >
                  <AutomationWorkflowPreview />
                </button>
                <p className="mt-4 m-0 text-[0.95rem] leading-7 text-[var(--text-muted)]">
                  Structured intake, routing, and follow-up logic across form capture, Airtable operations, internal alerts, and outbound email.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </article>

      {isGalleryOpen && featuredSnapshots.length ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--gallery-backdrop)] p-4 backdrop-blur-[10px] max-sm:p-2">
          <button
            type="button"
            onClick={() => setIsGalleryOpen(false)}
            className="absolute inset-0"
            aria-label="Close Quantum Nexus screenshot gallery"
          />

          <div className="relative z-[1] inline-flex max-w-full flex-col p-4 max-sm:p-3">
            <button
              type="button"
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gallery-control-bg)] text-[var(--gallery-control-text)] shadow-[0_10px_24px_var(--soft-shadow)] backdrop-blur-[6px]"
              aria-label="Close Quantum Nexus screenshot gallery"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-3 pr-12">
              <p className="m-0 text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[var(--gallery-title-text)]">
                Quantum Nexus
              </p>
              <p className="mt-1 mb-0 text-[0.95rem] text-[var(--gallery-meta-text)]">
                Screenshot {activeSnapshot + 1} of {featuredSnapshots.length}
              </p>
            </div>

            <div
              className="flex justify-center"
              onMouseEnter={() => setIsSnapshotPaused(true)}
              onMouseLeave={() => setIsSnapshotPaused(false)}
            >
              <div className="relative w-[min(100%,34rem)] px-14 max-sm:w-full max-sm:px-10">
                {featuredSnapshots.length > 1 ? (
                  <button
                    type="button"
                    onClick={showPreviousSnapshot}
                    className="absolute top-1/2 left-0 z-[2] inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--gallery-control-bg)] text-[var(--gallery-control-text)] shadow-[0_10px_24px_var(--soft-shadow)] backdrop-blur-[6px]"
                    aria-label="Show previous Quantum Nexus screenshot"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                ) : null}

                <div className="pointer-events-none absolute inset-x-6 top-1/2 z-0 h-[70vh] -translate-y-1/2 blur-[110px] max-sm:inset-x-3 max-sm:h-[60vh]">
                  <div
                    className="absolute top-[10%] left-0 h-[54%] w-[54%] rounded-full"
                    style={{
                      backgroundImage: `radial-gradient(circle, ${rgbaFromColor(galleryAmbient?.left ?? { r: 190, g: 104, b: 255 }, 0.7)} 0%, ${rgbaFromColor(galleryAmbient?.left ?? { r: 190, g: 104, b: 255 }, 0.28)} 36%, transparent 74%)`,
                    }}
                  />
                  <div
                    className="absolute top-[14%] right-0 h-[54%] w-[54%] rounded-full"
                    style={{
                      backgroundImage: `radial-gradient(circle, ${rgbaFromColor(galleryAmbient?.right ?? { r: 40, g: 198, b: 255 }, 0.62)} 0%, ${rgbaFromColor(galleryAmbient?.right ?? { r: 40, g: 198, b: 255 }, 0.24)} 36%, transparent 74%)`,
                    }}
                  />
                  <div
                    className="absolute inset-x-[18%] bottom-[6%] h-[34%] rounded-full"
                    style={{
                      backgroundImage: `radial-gradient(circle, ${rgbaFromColor(galleryAmbient?.center ?? { r: 115, g: 150, b: 230 }, 0.34)} 0%, ${rgbaFromColor(galleryAmbient?.center ?? { r: 115, g: 150, b: 230 }, 0.12)} 44%, transparent 78%)`,
                    }}
                  />
                </div>

                <div className="mx-auto flex h-[74vh] w-[22rem] max-w-full items-center justify-center overflow-hidden rounded-[22px] p-2 max-sm:h-[70vh] max-sm:w-[18.5rem] max-sm:max-w-full">
                  <img
                    src={featuredSnapshots[activeSnapshot]}
                    alt={`Quantum Nexus screenshot ${activeSnapshot + 1}`}
                    className="block h-full w-full object-contain"
                    draggable="false"
                  />
                </div>

                {featuredSnapshots.length > 1 ? (
                  <button
                    type="button"
                    onClick={showNextSnapshot}
                    className="absolute top-1/2 right-0 z-[2] inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--gallery-control-bg)] text-[var(--gallery-control-text)] shadow-[0_10px_24px_var(--soft-shadow)] backdrop-blur-[6px]"
                    aria-label="Show next Quantum Nexus screenshot"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
            </div>

            {featuredSnapshots.length > 1 ? (
              <div className="mt-4 flex items-center justify-center gap-2">
                {featuredSnapshots.map((imageSrc, index) => (
                  <button
                    key={`${imageSrc}-gallery-dot-${index}`}
                    type="button"
                    onClick={() => setActiveSnapshot(index)}
                    className={`h-2.5 rounded-full transition-all duration-200 ${
                      activeSnapshot === index
                        ? "w-6 bg-[var(--accent-strong)]"
                        : "w-2.5 bg-[var(--indicator-muted)]"
                    }`}
                    aria-label={`Show Quantum Nexus screenshot ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const filterRefs = useRef([]);

  useEffect(() => {
    if (!isWorkflowModalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isWorkflowModalOpen]);

  const filteredProjects = useMemo(
    () =>
      activeFilter === "All"
        ? projects
        : projects.filter((project) => project.type === activeFilter),
    [activeFilter],
  );

  const featuredProject =
    filteredProjects.find((project) => project.featured) ?? filteredProjects[0];
  const gridProjects = filteredProjects.filter(
    (project) => project.id !== featuredProject?.id,
  );

  const featuredMeta = featuredProject
    ? getProjectMeta(featuredProject.type)
    : null;
  const featuredFocus = featuredProject
    ? (featuredFocusPoints[featuredProject.id] ?? [])
    : [];

  const handleFilterKeyDown = (event, index) => {
    if (!projectFilters.length) {
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      filterRefs.current[(index + 1) % projectFilters.length]?.focus();
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      filterRefs.current[
        (index - 1 + projectFilters.length) % projectFilters.length
      ]?.focus();
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      filterRefs.current[0]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      filterRefs.current[projectFilters.length - 1]?.focus();
    }
  };

  return (
    <section
      className={`relative mt-8 mb-10 px-5 max-sm:mt-7 max-sm:mb-8 max-sm:px-3 ${contentWidthClass}`}
    >
      <div className="mb-4">
        <h2 className={`${sectionTitleClass} max-w-[40rem]`}>
          Automation systems, web apps, and mobile products built for real-world
          execution.
        </h2>
      </div>

      <div
        className="mb-4 flex flex-wrap gap-2.5"
        role="toolbar"
        aria-label="Project filters"
      >
        {projectFilters.map((filter) => {
          const isActive = filter === activeFilter;
          const filterIndex = projectFilters.indexOf(filter);

          return (
            <button
              key={filter}
              ref={(element) => {
                filterRefs.current[filterIndex] = element;
              }}
              type="button"
              onClick={() => setActiveFilter(filter)}
              onKeyDown={(event) => handleFilterKeyDown(event, filterIndex)}
              aria-pressed={isActive}
              className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 text-[0.85rem] font-semibold focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)] ${
                isActive
                  ? "bg-[var(--button-primary-from)] text-white shadow-[0_10px_20px_var(--button-primary-shadow)]"
                  : "bg-[var(--button-subtle-bg)] text-[var(--button-subtle-text)] hover:bg-[var(--theme-toggle-hover-bg)]"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {featuredProject ? (
        <FeaturedProjectCard
          key={featuredProject.id}
          featuredProject={featuredProject}
          featuredMeta={featuredMeta}
          featuredFocus={featuredFocus}
          onOpenWorkflowPreview={() => setIsWorkflowModalOpen(true)}
        />
      ) : null}

      <div className="columns-3 gap-4 max-lg:columns-2 max-sm:columns-1">
        {gridProjects.map((project) => {
          const meta = getProjectMeta(project.type);
          const Icon = meta.icon;

          return (
            <article
              key={project.id}
              className={`${projectSurfaceClass} mb-4 inline-block w-full break-inside-avoid p-[1.1rem] align-top max-sm:p-4`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-[14px] ${meta.iconClass}`}
                  style={{ backgroundImage: meta.badgeVar }}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className={strongBadgeClass}>{project.type}</span>
                <span className={subtleBadgeClass}>{project.engagement}</span>
              </div>

              <h3 className="mt-3.5 mb-2 text-[1.08rem] font-bold text-[var(--text-strong)]">
                {project.title}
              </h3>
              <p className="m-0 text-[0.95rem] leading-7 text-[var(--text-muted)]">
                {project.summary}
              </p>

              <div className="mt-3.5 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className={chipClass}>
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--project-panel-border)] pt-4">
                <span className="inline-flex items-center gap-2 text-[0.84rem] font-semibold text-[var(--text-soft)]">
                  <Blocks className="h-4 w-4 text-[var(--button-subtle-text)]" />
                  {project.sidePanel === "workflow"
                    ? "Workflow preview"
                    : project.engagement === "Personal"
                      ? "Independent build"
                      : project.clientNote}
                </span>
                {project.sidePanel === "workflow" ? (
                  <button
                    type="button"
                    onClick={() => setIsWorkflowModalOpen(true)}
                    className="inline-flex min-h-9 items-center justify-center rounded-full bg-[var(--button-subtle-bg)] px-3 text-[0.78rem] font-semibold text-[var(--button-subtle-text)]"
                    aria-label="Open workflow preview"
                  >
                    View Flow
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <WorkflowPreviewModal
        open={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
      />
    </section>
  );
}

export default memo(ProjectsSection);
