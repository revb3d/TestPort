import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  Eye,
  EyeOff,
  GripVertical,
  LayoutDashboard,
  PanelRightClose,
  PanelRightOpen,
  Palette,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { loadStoredPortfolio, saveStoredPortfolio } from "./storage.js";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD?.trim() ?? "";
const ADMIN_UNLOCK_KEY = "portfolio-studio-admin-unlocked";

const sectionTypes = [
  "hero",
  "about",
  "projects",
  "services",
  "experience",
  "testimonials",
  "contact",
  "stats",
  "marquee",
  "custom",
];

const fontChoices = [
  { label: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
  { label: "Fraunces", value: "'Fraunces', serif" },
  { label: "Bricolage", value: "'Bricolage Grotesque', sans-serif" },
  { label: "Instrument Serif", value: "'Instrument Serif', serif" },
  { label: "Sora", value: "'Sora', sans-serif" },
  { label: "Manrope", value: "'Manrope', sans-serif" },
  { label: "Anton", value: "'Anton', sans-serif" },
  { label: "Bebas Neue", value: "'Bebas Neue', sans-serif" },
  { label: "DM Serif", value: "'DM Serif Display', serif" },
  { label: "Fira Code", value: "'Fira Code', monospace" },
  { label: "IBM Plex Mono", value: "'IBM Plex Mono', monospace" },
  { label: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Oswald", value: "'Oswald', sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Syne", value: "'Syne', sans-serif" },
  { label: "Unbounded", value: "'Unbounded', sans-serif" },
];

const defaultPortfolio = {
  meta: {
    name: "Maya Chen",
    role: "Independent Product Designer",
    location: "Austin, Texas",
    email: "hello@mayachen.studio",
    availability: "Available for select 2026 collaborations",
  },
  footer: {
    visible: true,
    eyebrow: "Now booking",
    title: "Let's build something memorable.",
    body: "Use this footer as a final call-to-action, copyright area, or closing note.",
    ctaLabel: "Email me",
    ctaHref: "mailto:hello@mayachen.studio",
    note: "© 2026 Maya Chen. All rights reserved.",
  },
  header: {
    visible: true,
    nameOverride: "",
    roleOverride: "",
    logo: null,
    logoSize: 42,
    showText: true,
    navItems: 5,
    width: 1160,
    fullWidth: false,
    align: "center",
    position: "normal",
    paddingX: 16,
    paddingY: 14,
    offsetY: 0,
    radius: 28,
    background: "",
    textColor: "",
    mutedColor: "",
    borderColor: "",
    navStyle: "pills",
    showRole: true,
    uppercaseNav: true,
  },
  theme: {
    background: "#f5efe4",
    surface: "#fffaf0",
    surfaceAlt: "#17120d",
    text: "#17120d",
    muted: "#705f4f",
    primary: "#d95f30",
    secondary: "#256b5f",
    accent: "#f4bf4f",
    headingFont: "'Fraunces', serif",
    bodyFont: "'Manrope', sans-serif",
    radius: 28,
    density: 22,
    sectionGap: 64,
    grain: true,
    grainOpacity: 14,
    grainSize: 18,
    grainColor: "#17120d",
    grainPattern: "paper",
    noise: true,
    noiseOpacity: 18,
    noiseSize: 120,
    pageMedia: null,
    pageMediaOpacity: 24,
    pageMediaBlur: 0,
  },
  sections: [
    {
      id: "hero",
      type: "hero",
      visible: true,
      eyebrow: "Portfolio Studio",
      title: "Designing products that feel vivid, useful, and alive.",
      body:
        "I partner with early teams to turn scattered ideas into memorable digital products, brand systems, and launch-ready experiences.",
      layout: "spotlight",
      settings: {
        minHeight: 610,
        padding: 44,
        maxWidth: 1160,
        textAlign: "left",
        columns: 3,
        backgroundMode: "soft",
        cardStyle: "glass",
        mediaFit: "cover",
      },
      media: null,
      ctaLabel: "Start a project",
      ctaHref: "mailto:hello@mayachen.studio",
      items: [
        { id: "hero-chip-1", label: "Product Strategy", value: "0-1 launches" },
        { id: "hero-chip-2", label: "Visual Systems", value: "Brand-led UI" },
        { id: "hero-chip-3", label: "Motion", value: "Polished flows" },
      ],
    },
    {
      id: "stats",
      type: "stats",
      visible: true,
      eyebrow: "Signal",
      title: "A compact snapshot",
      body: "Use stats to quickly shape credibility, momentum, or personality.",
      layout: "grid",
      settings: {
        minHeight: 260,
        padding: 44,
        maxWidth: 1160,
        textAlign: "left",
        columns: 4,
        backgroundMode: "plain",
        cardStyle: "solid",
        mediaFit: "cover",
      },
      items: [
        { id: "stat-1", label: "Years", value: "8+" },
        { id: "stat-2", label: "Launches", value: "34" },
        { id: "stat-3", label: "Retention lift", value: "27%" },
        { id: "stat-4", label: "Time zones", value: "6" },
      ],
    },
    {
      id: "about",
      type: "about",
      visible: true,
      eyebrow: "About",
      title: "I build the bridge between taste, research, and shipping.",
      body:
        "My process blends founder interviews, fast prototypes, design systems, and pragmatic handoff. The result is work that looks distinct and survives real product constraints.",
      layout: "split",
      settings: {
        minHeight: 360,
        padding: 44,
        maxWidth: 1160,
        textAlign: "left",
        columns: 2,
        backgroundMode: "plain",
        cardStyle: "solid",
        mediaFit: "cover",
      },
      items: [
        {
          id: "about-1",
          label: "What I value",
          value: "Clarity, restraint, and brave visual decisions.",
        },
        {
          id: "about-2",
          label: "How I work",
          value: "Weekly momentum, sharp artifacts, and calm collaboration.",
        },
      ],
    },
    {
      id: "projects",
      type: "projects",
      visible: true,
      eyebrow: "Selected Work",
      title: "Recent projects with measurable shape.",
      body: "Replace these cards with your own work, links, metrics, and visuals.",
      layout: "cards",
      settings: {
        minHeight: 420,
        padding: 44,
        maxWidth: 1160,
        textAlign: "left",
        columns: 3,
        backgroundMode: "plain",
        cardStyle: "solid",
        mediaFit: "cover",
      },
      items: [
        {
          id: "project-1",
          label: "Northstar OS",
          value: "Rebuilt onboarding for a climate analytics platform.",
          tag: "SaaS",
          href: "#",
        },
        {
          id: "project-2",
          label: "Parcel Club",
          value: "Created an identity and storefront for a boutique logistics brand.",
          tag: "Brand + Web",
          href: "#",
        },
        {
          id: "project-3",
          label: "Muse Labs",
          value: "Designed an AI workspace with a calmer daily-use interaction model.",
          tag: "AI Product",
          href: "#",
        },
      ],
    },
    {
      id: "services",
      type: "services",
      visible: true,
      eyebrow: "Services",
      title: "Choose the sections that match your offer.",
      body: "Every service, project, testimonial, and milestone can be added, removed, edited, or reordered.",
      layout: "grid",
      settings: {
        minHeight: 360,
        padding: 44,
        maxWidth: 1160,
        textAlign: "left",
        columns: 3,
        backgroundMode: "plain",
        cardStyle: "solid",
        mediaFit: "cover",
      },
      items: [
        { id: "service-1", label: "Product Sprint", value: "From messy brief to validated clickable prototype." },
        { id: "service-2", label: "Design System", value: "Reusable components, tokens, and documentation." },
        { id: "service-3", label: "Launch Site", value: "A punchy page that explains, persuades, and converts." },
      ],
    },
    {
      id: "experience",
      type: "experience",
      visible: true,
      eyebrow: "Timeline",
      title: "A career arc you can reshape.",
      body: "Add milestones, education, awards, press, or past roles.",
      layout: "timeline",
      settings: {
        minHeight: 360,
        padding: 44,
        maxWidth: 980,
        textAlign: "left",
        columns: 1,
        backgroundMode: "plain",
        cardStyle: "minimal",
        mediaFit: "cover",
      },
      items: [
        { id: "xp-1", label: "2026", value: "Independent studio focused on product storytelling." },
        { id: "xp-2", label: "2024", value: "Led growth design for a developer tools startup." },
        { id: "xp-3", label: "2021", value: "Built design systems across fintech and creator platforms." },
      ],
    },
    {
      id: "testimonials",
      type: "testimonials",
      visible: true,
      eyebrow: "Proof",
      title: "Words from collaborators.",
      body: "Swap these with client quotes, recommendations, or social proof.",
      layout: "cards",
      settings: {
        minHeight: 340,
        padding: 44,
        maxWidth: 1160,
        textAlign: "left",
        columns: 2,
        backgroundMode: "plain",
        cardStyle: "solid",
        mediaFit: "cover",
      },
      items: [
        {
          id: "quote-1",
          label: "Ari Patel, Founder",
          value: "Maya gave our product the confidence it was missing and kept the team moving every week.",
        },
        {
          id: "quote-2",
          label: "Lena Ortiz, Head of Product",
          value: "The final system was beautiful, but the real value was how easy it made decisions.",
        },
      ],
    },
    {
      id: "marquee",
      type: "marquee",
      visible: true,
      eyebrow: "Ticker",
      title: "ASHTROS",
      body: "ASHTROS",
      layout: "marquee",
      settings: {
        minHeight: 78,
        padding: 0,
        maxWidth: 1160,
        fullWidth: true,
        textAlign: "center",
        columns: 3,
        backgroundMode: "plain",
        cardStyle: "solid",
        mediaFit: "cover",
        accentColor: "#f35a12",
        backgroundColor: "#f35a12",
        marqueeSpeed: 24,
        marqueeDirection: "left",
        marqueeGap: 52,
        marqueeSize: 18,
        marqueeSeparator: "✦",
      },
      media: null,
      ctaLabel: "",
      ctaHref: "",
      items: [
        { id: "marquee-1", label: "ASHTROS", value: "ASHTROS" },
        { id: "marquee-2", label: "ASHTROS", value: "ASHTROS" },
        { id: "marquee-3", label: "ASHTROS", value: "ASHTROS" },
      ],
    },
    {
      id: "contact",
      type: "contact",
      visible: true,
      eyebrow: "Contact",
      title: "Have a sharp problem or strange idea?",
      body: "Send a note with the outcome you want, the timeline, and what has already been tried.",
      layout: "banner",
      settings: {
        minHeight: 320,
        padding: 44,
        maxWidth: 1160,
        textAlign: "left",
        columns: 2,
        backgroundMode: "dark",
        cardStyle: "glass",
        mediaFit: "cover",
      },
      ctaLabel: "Email me",
      ctaHref: "mailto:hello@mayachen.studio",
      items: [
        { id: "contact-1", label: "Email", value: "hello@mayachen.studio" },
        { id: "contact-2", label: "Location", value: "Austin, Texas" },
      ],
    },
  ],
};

function clonePortfolio(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

const defaultSectionSettings = {
  minHeight: 320,
  padding: 44,
  maxWidth: 1160,
  textAlign: "left",
  columns: 3,
  backgroundMode: "plain",
  cardStyle: "solid",
  mediaFit: "cover",
  fullWidth: false,
  marqueeSpeed: 24,
  marqueeDirection: "left",
  marqueeGap: 52,
  marqueeSize: 18,
  marqueeSeparator: "✦",
  accentColor: "",
  backgroundColor: "",
};

function normalizePortfolio(value) {
  if (!value || typeof value !== "object") {
    return clonePortfolio(defaultPortfolio);
  }

  const meta = {
    ...defaultPortfolio.meta,
    ...(value.meta && typeof value.meta === "object" ? value.meta : {}),
  };
  const footer = {
    ...defaultPortfolio.footer,
    ...(value.footer && typeof value.footer === "object" ? value.footer : {}),
  };
  const header = {
    ...defaultPortfolio.header,
    ...(value.header && typeof value.header === "object" ? value.header : {}),
  };
  const theme = {
    ...defaultPortfolio.theme,
    ...(value.theme && typeof value.theme === "object" ? value.theme : {}),
  };
  const sections = Array.isArray(value.sections) && value.sections.length > 0
    ? value.sections
    : defaultPortfolio.sections;

  return {
    meta,
    footer,
    header,
    theme,
    sections: sections.map((section, index) => ({
      id: section.id || createId(`section-${index}`),
      type: section.type || "custom",
      visible: section.visible !== false,
      eyebrow: section.eyebrow ?? "Section",
      title: section.title ?? "Untitled section",
      body: section.body ?? "",
      layout: section.layout || "cards",
      settings: {
        ...defaultSectionSettings,
        ...(section.settings && typeof section.settings === "object" ? section.settings : {}),
      },
      media: normalizeMedia(section.media),
      ctaLabel: section.ctaLabel ?? "",
      ctaHref: section.ctaHref ?? "",
      items: Array.isArray(section.items)
        ? section.items.map((item, itemIndex) => ({
            id: item.id || createId(`item-${itemIndex}`),
            label: item.label ?? "Untitled item",
            value: item.value ?? "",
            tag: item.tag ?? "",
            href: item.href ?? "",
            media: normalizeMedia(item.media),
          }))
        : [],
    })),
  };
}

function normalizeMedia(media) {
  if (!media || typeof media !== "object" || !media.src) return null;
  return {
    src: media.src,
    type: media.type || "image",
    name: media.name || "Imported media",
    alt: media.alt || "",
  };
}

function createId(prefix = "item") {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now()}`;
}

function makeSection(type = "custom") {
  return {
    id: createId(type),
    type,
    visible: true,
    eyebrow: type === "custom" ? "New Section" : type,
    title: `Your ${type} section`,
    body: "Edit this copy from the admin panel, add items, and move the section anywhere.",
    layout: type === "experience" ? "timeline" : type === "contact" ? "banner" : type === "marquee" ? "marquee" : "cards",
    settings: {
      ...defaultSectionSettings,
      ...(type === "marquee"
        ? {
            minHeight: 78,
            padding: 0,
            fullWidth: true,
            backgroundColor: "#f35a12",
            accentColor: "#f35a12",
          }
        : {}),
    },
    media: null,
    ctaLabel: type === "contact" ? "Get in touch" : "",
    ctaHref: "",
    items: [
      {
        id: createId("item"),
        label: "Editable item",
        value: "Change this text, add more items, or remove it entirely.",
        tag: "",
        href: "",
        media: null,
      },
    ],
  };
}

function getStarterSection(type = "custom") {
  const starter = defaultPortfolio.sections.find((section) => section.type === type);
  return starter ? clonePortfolio(starter) : makeSection(type);
}

function App() {
  const [portfolio, setPortfolio] = useState(() => clonePortfolio(defaultPortfolio));
  const [selectedId, setSelectedId] = useState(portfolio.sections[0]?.id ?? "");
  const [activePanel, setActivePanel] = useState("sections");
  const [adminHidden, setAdminHidden] = useState(true);
  const [adminUnlocked, setAdminUnlocked] = useState(() => {
    if (!ADMIN_PASSWORD) return true;
    try {
      return globalThis.sessionStorage?.getItem(ADMIN_UNLOCK_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminPasswordError, setAdminPasswordError] = useState("");
  const [importValue, setImportValue] = useState("");
  const [notice, setNotice] = useState("Saved automatically");
  const [isReadyToPersist, setIsReadyToPersist] = useState(false);
  const isFirstPersist = useRef(true);

  const selectedSection = useMemo(
    () => portfolio.sections.find((section) => section.id === selectedId) ?? portfolio.sections[0],
    [portfolio.sections, selectedId],
  );

  useEffect(() => {
    let cancelled = false;

    async function hydratePortfolio() {
      const stored = await loadStoredPortfolio();
      if (cancelled) return;

      if (stored) {
        const normalized = normalizePortfolio(stored);
        setPortfolio(normalized);
        setSelectedId(normalized.sections[0]?.id ?? "");
      }

      setIsReadyToPersist(true);
    }

    hydratePortfolio();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isReadyToPersist) return;
    if (isFirstPersist.current) {
      isFirstPersist.current = false;
      return;
    }

    let cancelled = false;

    async function persistPortfolio() {
      try {
        await saveStoredPortfolio(portfolio);
        if (!cancelled) {
          setNotice("Saved automatically");
        }
      } catch (error) {
        if (!cancelled) {
          const message = error?.name === "QuotaExceededError"
            ? "This file is too large to autosave. Try a shorter/compressed video."
            : "Autosave failed";
          setNotice(message);
        }
      }
    }

    persistPortfolio();

    return () => {
      cancelled = true;
    };
  }, [portfolio, isReadyToPersist]);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(portfolio.theme).forEach(([key, value]) => {
      const cssKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
      const cssValue = key === "grainOpacity" || key === "noiseOpacity"
        ? String(Number(value) / 100)
        : key === "grainSize" || key === "noiseSize" || key === "sectionGap"
          ? `${value}px`
          : String(value);
      root.style.setProperty(`--${cssKey}`, cssValue);
    });
  }, [portfolio.theme]);

  function updatePortfolio(updater) {
    setPortfolio((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      return clonePortfolio(next);
    });
  }

  function updateTheme(key, value) {
    updatePortfolio((current) => ({
      ...current,
      theme: { ...current.theme, [key]: value },
    }));
  }

  function updateThemePatch(patch) {
    updatePortfolio((current) => ({
      ...current,
      theme: { ...current.theme, ...patch },
    }));
  }

  function updateMeta(key, value) {
    updatePortfolio((current) => ({
      ...current,
      meta: { ...current.meta, [key]: value },
    }));
  }

  function updateHeader(key, value) {
    updatePortfolio((current) => ({
      ...current,
      header: { ...defaultPortfolio.header, ...(current.header ?? {}), [key]: value },
    }));
  }

  function updateFooter(key, value) {
    updatePortfolio((current) => ({
      ...current,
      footer: { ...defaultPortfolio.footer, ...(current.footer ?? {}), [key]: value },
    }));
  }

  function resetMeta() {
    updatePortfolio((current) => ({ ...current, meta: clonePortfolio(defaultPortfolio.meta) }));
  }

  function resetHeader() {
    updatePortfolio((current) => ({ ...current, header: clonePortfolio(defaultPortfolio.header) }));
  }

  function resetFooter() {
    updatePortfolio((current) => ({ ...current, footer: clonePortfolio(defaultPortfolio.footer) }));
  }

  function resetSectionContent(sectionId) {
    updatePortfolio((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const starter = getStarterSection(section.type);
        return {
          ...section,
          eyebrow: starter.eyebrow,
          title: starter.title,
          body: starter.body,
          layout: starter.layout,
          ctaLabel: starter.ctaLabel,
          ctaHref: starter.ctaHref,
          type: starter.type,
        };
      }),
    }));
  }

  function resetSectionDesign(sectionId) {
    updatePortfolio((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const starter = getStarterSection(section.type);
        return { ...section, settings: clonePortfolio(starter.settings ?? defaultSectionSettings) };
      }),
    }));
  }

  function resetSectionMedia(sectionId) {
    updateSection(sectionId, { media: null });
  }

  function resetSectionItems(sectionId) {
    updatePortfolio((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const starter = getStarterSection(section.type);
        return {
          ...section,
          items: clonePortfolio(starter.items ?? []),
        };
      }),
    }));
  }

  function updateSection(sectionId, patch) {
    updatePortfolio((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId ? { ...section, ...patch } : section,
      ),
    }));
  }

  function updateItem(sectionId, itemId, patch) {
    updatePortfolio((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          items: section.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
        };
      }),
    }));
  }

  function moveSection(sectionId, direction) {
    updatePortfolio((current) => {
      const sections = [...current.sections];
      const index = sections.findIndex((section) => section.id === sectionId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= sections.length) return current;
      [sections[index], sections[nextIndex]] = [sections[nextIndex], sections[index]];
      return { ...current, sections };
    });
  }

  function duplicateSection(sectionId) {
    updatePortfolio((current) => {
      const sections = [...current.sections];
      const index = sections.findIndex((section) => section.id === sectionId);
      if (index < 0) return current;
      const source = clonePortfolio(sections[index]);
      const duplicate = {
        ...source,
        id: createId(source.type),
        items: source.items.map((item) => ({ ...item, id: createId("item") })),
      };
      sections.splice(index + 1, 0, duplicate);
      return { ...current, sections };
    });
  }

  function moveItem(sectionId, itemId, direction) {
    updatePortfolio((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const items = [...section.items];
        const index = items.findIndex((item) => item.id === itemId);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return section;
        [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
        return { ...section, items };
      }),
    }));
  }

  function duplicateItem(sectionId, itemId) {
    updatePortfolio((current) => ({
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const index = section.items.findIndex((item) => item.id === itemId);
        if (index < 0) return section;
        const source = clonePortfolio(section.items[index]);
        const duplicate = { ...source, id: createId("item") };
        const items = [...section.items];
        items.splice(index + 1, 0, duplicate);
        return { ...section, items };
      }),
    }));
  }

  function addSection(type) {
    const section = makeSection(type);
    updatePortfolio((current) => ({ ...current, sections: [...current.sections, section] }));
    setSelectedId(section.id);
    setActivePanel("edit");
  }

  function removeSection(sectionId) {
    updatePortfolio((current) => {
      const sections = current.sections.filter((section) => section.id !== sectionId);
      if (selectedId === sectionId) setSelectedId(sections[0]?.id ?? "");
      return { ...current, sections };
    });
  }

  function addItem(sectionId) {
    updatePortfolio((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: [
                ...section.items,
                {
                  id: createId("item"),
                  label: "New item",
                  value: "Describe this item.",
                  tag: "",
                  href: "",
                  media: null,
                },
              ],
            }
          : section,
      ),
    }));
  }

  function removeItem(sectionId, itemId) {
    updatePortfolio((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? { ...section, items: section.items.filter((item) => item.id !== itemId) }
          : section,
      ),
    }));
  }

  function exportConfig() {
    const blob = new Blob([JSON.stringify(portfolio, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "portfolio-config.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function importConfig() {
    try {
      const parsed = JSON.parse(importValue);
      if (!parsed.theme || !Array.isArray(parsed.sections)) {
        throw new Error("Missing required portfolio fields.");
      }
      const normalized = normalizePortfolio(parsed);
      setPortfolio(normalized);
      setSelectedId(normalized.sections[0]?.id ?? "");
      setNotice("Imported new portfolio");
      setImportValue("");
    } catch (error) {
      setNotice(`Import failed: ${error.message}`);
    }
  }

  function resetConfig() {
    setPortfolio(clonePortfolio(defaultPortfolio));
    setSelectedId(defaultPortfolio.sections[0].id);
    setNotice("Reset to starter content");
  }

  function unlockAdmin(event) {
    event.preventDefault();
    if (!ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      return;
    }

    if (adminPasswordInput === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      setAdminPasswordError("");
      setAdminPasswordInput("");
      try {
        globalThis.sessionStorage?.setItem(ADMIN_UNLOCK_KEY, "true");
      } catch {
        // Ignore sessionStorage failures.
      }
      return;
    }

    setAdminPasswordError("Incorrect password");
  }

  function lockAdmin() {
    if (!ADMIN_PASSWORD) return;
    setAdminUnlocked(false);
    setAdminHidden(false);
    try {
      globalThis.sessionStorage?.removeItem(ADMIN_UNLOCK_KEY);
    } catch {
      // Ignore sessionStorage failures.
    }
  }

  return (
    <main className={`studio-shell ${adminHidden ? "admin-is-hidden" : ""}`}>
      <PortfolioPreview
        portfolio={portfolio}
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          setActivePanel("edit");
        }}
      />

      {adminHidden && (
        <button className="show-admin-button" onClick={() => setAdminHidden(false)}>
          <PanelRightOpen size={17} />
          {adminUnlocked || !ADMIN_PASSWORD ? "Show admin" : "Admin"}
        </button>
      )}

      {!adminHidden && !adminUnlocked && ADMIN_PASSWORD && (
        <aside className="admin-panel admin-lock-panel" aria-label="Admin login">
          <div className="admin-heading">
            <div>
              <p className="admin-kicker">Admin Locked</p>
              <h1>Enter password</h1>
            </div>
          </div>
          <form className="panel-scroll" onSubmit={unlockAdmin}>
            <div className="tool-card">
              <p>The live editor is protected. Enter the admin password to unlock customization tools.</p>
              <label>
                Password
                <input
                  type="password"
                  value={adminPasswordInput}
                  onChange={(event) => {
                    setAdminPasswordInput(event.target.value);
                    setAdminPasswordError("");
                  }}
                />
              </label>
              {adminPasswordError && <p className="admin-error">{adminPasswordError}</p>}
              <button className="wide-action" type="submit">
                Unlock admin
              </button>
            </div>
          </form>
        </aside>
      )}

      {!adminHidden && adminUnlocked && (
        <aside className="admin-panel" aria-label="Portfolio admin panel">
        <div className="admin-heading">
          <div>
            <p className="admin-kicker">Admin Studio</p>
            <h1>Customize everything</h1>
          </div>
          <div className="admin-heading-actions">
            <span className="save-pill">
              <Save size={14} />
              {notice}
            </span>
            {ADMIN_PASSWORD && (
              <button className="lock-admin-button" onClick={lockAdmin}>
                Lock
              </button>
            )}
            <button className="hide-admin-button" onClick={() => setAdminHidden(true)}>
              <PanelRightClose size={16} />
              Hide
            </button>
          </div>
        </div>

        <div className="panel-tabs" role="tablist" aria-label="Admin tools">
          <button className={activePanel === "sections" ? "active" : ""} onClick={() => setActivePanel("sections")}>
            <LayoutDashboard size={16} />
            Sections
          </button>
          <button className={activePanel === "edit" ? "active" : ""} onClick={() => setActivePanel("edit")}>
            <GripVertical size={16} />
            Edit
          </button>
          <button className={activePanel === "theme" ? "active" : ""} onClick={() => setActivePanel("theme")}>
            <Palette size={16} />
            Theme
          </button>
        </div>

        {activePanel === "sections" && (
          <SectionsPanel
            sections={portfolio.sections}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onMove={moveSection}
            onDuplicate={duplicateSection}
            onToggle={(section) => updateSection(section.id, { visible: !section.visible })}
            onRemove={removeSection}
            onAdd={addSection}
          />
        )}

        {activePanel === "edit" && selectedSection && (
          <EditPanel
            section={selectedSection}
            meta={portfolio.meta}
            footer={portfolio.footer ?? defaultPortfolio.footer}
            header={portfolio.header ?? defaultPortfolio.header}
            onMeta={updateMeta}
            onFooter={updateFooter}
            onHeader={updateHeader}
            onResetMeta={resetMeta}
            onResetFooter={resetFooter}
            onResetHeader={resetHeader}
            onResetSectionContent={resetSectionContent}
            onResetSectionDesign={resetSectionDesign}
            onResetSectionMedia={resetSectionMedia}
            onResetSectionItems={resetSectionItems}
            onSection={updateSection}
            onItem={updateItem}
            onAddItem={addItem}
            onDuplicateItem={duplicateItem}
            onRemoveItem={removeItem}
            onMoveItem={moveItem}
          />
        )}

        {activePanel === "theme" && (
          <ThemePanel
            theme={portfolio.theme}
            onTheme={updateTheme}
            onThemePatch={updateThemePatch}
            importValue={importValue}
            onImportValue={setImportValue}
            onImport={importConfig}
            onExport={exportConfig}
            onReset={resetConfig}
          />
        )}
        </aside>
      )}
    </main>
  );
}

function PortfolioPreview({ portfolio, selectedId, onSelect }) {
  const visibleSections = portfolio.sections.filter((section) => section.visible);
  const header = { ...defaultPortfolio.header, ...(portfolio.header ?? {}) };
  const footer = { ...defaultPortfolio.footer, ...(portfolio.footer ?? {}) };
  const headerStyle = {
    "--header-width": `${header.width}px`,
    "--header-align": header.align === "left" ? "0 auto" : header.align === "right" ? "0 0 0 auto" : "0 auto",
    "--header-padding-x": `${header.paddingX}px`,
    "--header-padding-y": `${Math.max(0, header.paddingY)}px`,
    "--header-offset-y": `${header.offsetY + Math.min(0, header.paddingY)}px`,
    "--header-radius": `${header.radius}px`,
    "--header-bg": header.background || "color-mix(in srgb, var(--surface) 82%, transparent)",
    "--header-text": header.textColor || "var(--text)",
    "--header-muted": header.mutedColor || "var(--muted)",
    "--header-border": header.borderColor || "color-mix(in srgb, var(--text) 15%, transparent)",
  };

  return (
    <section
      className={[
        "portfolio-preview",
        header.position === "top" || header.position === "sticky" ? "header-flush-top" : "",
        portfolio.theme.grain ? "with-grain" : "",
        portfolio.theme.noise ? "with-noise" : "",
        portfolio.theme.pageMedia ? "with-page-media" : "",
        `texture-${portfolio.theme.grainPattern || "paper"}`,
      ].join(" ")}
    >
      {portfolio.theme.pageMedia && (
        <MediaPreview
          media={portfolio.theme.pageMedia}
          className="page-media"
          style={{
            "--page-media-opacity": Number(portfolio.theme.pageMediaOpacity) / 100,
            "--page-media-blur": `${portfolio.theme.pageMediaBlur}px`,
          }}
        />
      )}
      {header.visible && (
        <header
          className={[
            "site-nav",
            header.fullWidth ? "header-fullwidth" : "",
            header.position === "sticky" ? "header-sticky" : "",
            header.position === "top" ? "header-top" : "",
            `nav-${header.navStyle}`,
            header.uppercaseNav ? "nav-uppercase" : "",
          ].join(" ")}
          style={headerStyle}
        >
          <div className="brand-block">
            {header.logo && (
              <MediaPreview
                media={header.logo}
                className="header-logo"
                style={{ "--header-logo-size": `${header.logoSize}px` }}
              />
            )}
            {header.showText && (
              <span className="brand-copy">
                <strong>{header.nameOverride || portfolio.meta.name}</strong>
                {header.showRole && <span>{header.roleOverride || portfolio.meta.role}</span>}
              </span>
            )}
          </div>
          <nav aria-label="Portfolio sections">
            {visibleSections.slice(0, header.navItems).map((section) => (
              <a href={`#${section.id}`} key={section.id}>
                {section.eyebrow || section.type}
              </a>
            ))}
          </nav>
        </header>
      )}

      {visibleSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          meta={portfolio.meta}
          selected={selectedId === section.id}
          onSelect={() => onSelect(section.id)}
        />
      ))}

      {footer.visible && (
        <footer className="site-footer">
          <div className="footer-copy">
            <p className="eyebrow">{footer.eyebrow}</p>
            <h2>{footer.title}</h2>
            <p className="section-body">{footer.body}</p>
          </div>
          <div className="footer-actions">
            {footer.ctaLabel && (
              <a className="primary-action" href={footer.ctaHref || "#"}>
                {footer.ctaLabel}
              </a>
            )}
            <p>{footer.note}</p>
          </div>
        </footer>
      )}
    </section>
  );
}

function SectionRenderer({ section, meta, selected, onSelect }) {
  const settings = { ...defaultSectionSettings, ...(section.settings ?? {}) };
  const className = [
    "portfolio-section",
    `section-${section.type}`,
    `layout-${section.layout}`,
    `bg-${settings.backgroundMode}`,
    `cards-${settings.cardStyle}`,
    settings.fullWidth ? "section-fullwidth" : "",
    selected ? "selected" : "",
  ].join(" ");
  const sectionStyle = {
    "--section-padding": `${settings.padding}px`,
    "--section-min-height": `${settings.minHeight}px`,
    "--section-max-width": `${settings.maxWidth}px`,
    "--section-align": settings.textAlign,
    "--section-columns": settings.columns,
    "--section-accent": settings.accentColor || "var(--primary)",
    "--section-bg": settings.backgroundColor || "transparent",
  };

  if (section.type === "hero") {
    return (
      <section id={section.id} className={className} style={sectionStyle} onClick={onSelect}>
        <div className="hero-copy">
          <p className="eyebrow">{section.eyebrow}</p>
          <h2>{section.title}</h2>
          <p className="section-body">{section.body}</p>
          <div className="hero-actions">
            {section.ctaLabel && (
              <a className="primary-action" href={section.ctaHref || "#"}>
                {section.ctaLabel}
              </a>
            )}
            <span>{meta.availability}</span>
          </div>
        </div>
        <div className={`hero-card media-fit-${settings.mediaFit}`}>
          {section.media ? (
            <>
              <MediaPreview media={section.media} className="hero-media" />
              <div className="hero-media-overlay">
                <Sparkles size={28} />
                <p>{meta.location}</p>
              </div>
            </>
          ) : (
            <>
              <Sparkles size={32} />
              <p>{meta.location}</p>
              <div className="chip-cloud">
                {section.items.map((item) => (
                  <span key={item.id}>
                    {item.label}: {item.value}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "contact") {
    return (
      <section id={section.id} className={className} style={sectionStyle} onClick={onSelect}>
        <div>
          <p className="eyebrow">{section.eyebrow}</p>
          <h2>{section.title}</h2>
          <p className="section-body">{section.body}</p>
        </div>
        <div className="contact-card">
          {section.media && <MediaPreview media={section.media} className={`section-media media-fit-${settings.mediaFit}`} />}
          {section.items.map((item) => (
            <p key={item.id}>
              <strong>{item.label}</strong>
              <span>{item.value}</span>
            </p>
          ))}
          {section.ctaLabel && (
            <a className="primary-action" href={section.ctaHref || `mailto:${meta.email}`}>
              {section.ctaLabel}
            </a>
          )}
        </div>
      </section>
    );
  }

  if (section.type === "marquee") {
    const words = section.items.length > 0 ? section.items : [{ id: "fallback", label: section.title, value: section.body }];
    const repeatedWords = Array.from({ length: 12 }, (_, copyIndex) =>
      words.map((item) => ({
        ...item,
        repeatKey: `${copyIndex}-${item.id}`,
      })),
    ).flat();
    return (
      <section id={section.id} className={className} style={sectionStyle} onClick={onSelect}>
        <div
          className={`marquee-track ${settings.marqueeDirection === "right" ? "marquee-right" : ""}`}
          style={{
            "--marquee-speed": `${settings.marqueeSpeed}s`,
            "--marquee-gap": `${settings.marqueeGap}px`,
            "--marquee-size": `${settings.marqueeSize}px`,
          }}
        >
          {[0, 1].map((loop) => (
            <div className="marquee-line" key={loop} aria-hidden={loop === 1}>
              {repeatedWords.map((item) => (
                <span className="marquee-item" key={`${loop}-${item.repeatKey}`}>
                  <strong>{item.label || item.value}</strong>
                  <em>{settings.marqueeSeparator}</em>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id={section.id} className={className} style={sectionStyle} onClick={onSelect}>
      <div className="section-intro">
        <p className="eyebrow">{section.eyebrow}</p>
        <h2>{section.title}</h2>
        <p className="section-body">{section.body}</p>
      </div>
      {section.media && <MediaPreview media={section.media} className={`section-media media-fit-${settings.mediaFit}`} />}
      <div className={`section-items items-${section.layout}`}>
        {section.items.map((item) => (
          <article className={`content-card media-fit-${settings.mediaFit}`} key={item.id}>
            {item.media && <MediaPreview media={item.media} className="card-media" />}
            {item.tag && <span className="tag">{item.tag}</span>}
            <h3>{item.label}</h3>
            <p>{item.value}</p>
            {item.href && item.href !== "#" && <a href={item.href}>View detail</a>}
          </article>
        ))}
      </div>
    </section>
  );
}

function MediaPreview({ media, className = "", style }) {
  if (!media?.src) return null;

  if (media.type === "video") {
    return (
      <video className={className} style={style} src={media.src} controls muted playsInline>
        Your browser does not support this video.
      </video>
    );
  }

  return <img className={className} style={style} src={media.src} alt={media.alt || media.name || ""} />;
}

function SectionsPanel({ sections, selectedId, onSelect, onMove, onDuplicate, onToggle, onRemove, onAdd }) {
  const [newType, setNewType] = useState("custom");

  return (
    <div className="panel-scroll">
      <div className="tool-card">
        <h2>Page structure</h2>
        <p>Click a section to edit it. Use arrows to move blocks and the eye to hide without deleting.</p>
      </div>

      <div className="section-list">
        {sections.map((section, index) => (
          <div className={`section-row ${selectedId === section.id ? "active" : ""}`} key={section.id}>
            <button className="section-main" onClick={() => onSelect(section.id)}>
              <GripVertical size={16} />
              <span>
                <strong>{section.eyebrow || section.type}</strong>
                <small>{section.type} - {section.items.length} item(s)</small>
              </span>
            </button>
            <button aria-label="Move section up" onClick={() => onMove(section.id, -1)} disabled={index === 0}>
              <ArrowUp size={15} />
            </button>
            <button aria-label="Move section down" onClick={() => onMove(section.id, 1)} disabled={index === sections.length - 1}>
              <ArrowDown size={15} />
            </button>
            <button aria-label="Duplicate section" onClick={() => onDuplicate(section.id)}>
              <Plus size={15} />
            </button>
            <button aria-label="Toggle section visibility" onClick={() => onToggle(section)}>
              {section.visible ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
            <button aria-label="Remove section" onClick={() => onRemove(section.id)}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="tool-card inline-tool">
        <label>
          Add a section
          <select value={newType} onChange={(event) => setNewType(event.target.value)}>
            {sectionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <button className="wide-action" onClick={() => onAdd(newType)}>
          <Plus size={16} />
          Add section
        </button>
      </div>
    </div>
  );
}

function EditPanel({
  section,
  meta,
  footer,
  header,
  onMeta,
  onFooter,
  onHeader,
  onResetMeta,
  onResetFooter,
  onResetHeader,
  onResetSectionContent,
  onResetSectionDesign,
  onResetSectionMedia,
  onResetSectionItems,
  onSection,
  onItem,
  onAddItem,
  onDuplicateItem,
  onRemoveItem,
  onMoveItem,
}) {
  const settings = { ...defaultSectionSettings, ...(section.settings ?? {}) };
  const updateSettings = (patch) => onSection(section.id, { settings: { ...settings, ...patch } });
  const headerSettings = { ...defaultPortfolio.header, ...(header ?? {}) };

  return (
    <div className="panel-scroll">
      <div className="tool-card">
        <div className="card-title-row">
          <h2>Identity</h2>
          <ResetButton onClick={onResetMeta} />
        </div>
        <TextInput label="Name" value={meta.name} onChange={(value) => onMeta("name", value)} />
        <TextInput label="Role" value={meta.role} onChange={(value) => onMeta("role", value)} />
        <TextInput label="Location" value={meta.location} onChange={(value) => onMeta("location", value)} />
        <TextInput label="Email" value={meta.email} onChange={(value) => onMeta("email", value)} />
        <TextInput label="Availability" value={meta.availability} onChange={(value) => onMeta("availability", value)} />
      </div>

      <div className="tool-card">
        <div className="card-title-row">
          <h2>Header</h2>
          <ResetButton onClick={onResetHeader} />
        </div>
        <label className="toggle-row">
          <input type="checkbox" checked={headerSettings.visible} onChange={(event) => onHeader("visible", event.target.checked)} />
          Show header
        </label>
        <div className="two-column">
          <TextInput label="Header name" value={headerSettings.nameOverride} onChange={(value) => onHeader("nameOverride", value)} />
          <TextInput label="Header role" value={headerSettings.roleOverride} onChange={(value) => onHeader("roleOverride", value)} />
        </div>
        <div className="two-column">
          <label>
            Align
            <select value={headerSettings.align} onChange={(event) => onHeader("align", event.target.value)}>
              <option value="left">left</option>
              <option value="center">center</option>
              <option value="right">right</option>
            </select>
          </label>
          <label>
            Position
            <select value={headerSettings.position} onChange={(event) => onHeader("position", event.target.value)}>
          <option value="normal">normal</option>
          <option value="sticky">sticky</option>
          <option value="top">stick to very top</option>
        </select>
      </label>
          <label>
            Nav style
            <select value={headerSettings.navStyle} onChange={(event) => onHeader("navStyle", event.target.value)}>
              <option value="pills">pills</option>
              <option value="plain">plain</option>
              <option value="tabs">tabs</option>
            </select>
          </label>
          <Range label="Nav links" value={headerSettings.navItems} min="0" max="8" unit="" onChange={(value) => onHeader("navItems", value)} />
        </div>
        <Range label="Header width" value={headerSettings.width} min="420" max="1800" onChange={(value) => onHeader("width", value)} />
        <label className="toggle-row">
          <input type="checkbox" checked={headerSettings.fullWidth} onChange={(event) => onHeader("fullWidth", event.target.checked)} />
          Fit header to full screen width
        </label>
        <div className="two-column">
          <Range label="Side padding" value={headerSettings.paddingX} min="0" max="80" onChange={(value) => onHeader("paddingX", value)} />
          <Range label="Top padding" value={headerSettings.paddingY} min="-80" max="60" onChange={(value) => onHeader("paddingY", value)} />
          <Range label="Top offset" value={headerSettings.offsetY} min="-80" max="80" onChange={(value) => onHeader("offsetY", value)} />
          <Range label="Header radius" value={headerSettings.radius} min="0" max="60" onChange={(value) => onHeader("radius", value)} />
        </div>
        <MediaInput
          media={headerSettings.logo}
          label="Upload logo"
          accept="image/*"
          onChange={(media) => onHeader("logo", media)}
        />
        <Range label="Logo size" value={headerSettings.logoSize} min="18" max="120" onChange={(value) => onHeader("logoSize", value)} />
        <label className="toggle-row">
          <input type="checkbox" checked={headerSettings.showText} onChange={(event) => onHeader("showText", event.target.checked)} />
          Show name and role beside logo
        </label>
        <div className="two-column">
          <ColorInput label="Header background" value={headerSettings.background} fallback="#fffaf0" onChange={(value) => onHeader("background", value)} />
          <ColorInput label="Header text" value={headerSettings.textColor} fallback="#17120d" onChange={(value) => onHeader("textColor", value)} />
          <ColorInput label="Header muted" value={headerSettings.mutedColor} fallback="#705f4f" onChange={(value) => onHeader("mutedColor", value)} />
          <ColorInput label="Header border" value={headerSettings.borderColor} fallback="#d8cfc0" onChange={(value) => onHeader("borderColor", value)} />
        </div>
        <label className="toggle-row">
          <input type="checkbox" checked={headerSettings.showRole} onChange={(event) => onHeader("showRole", event.target.checked)} />
          Show role text
        </label>
        <label className="toggle-row">
          <input type="checkbox" checked={headerSettings.uppercaseNav} onChange={(event) => onHeader("uppercaseNav", event.target.checked)} />
          Uppercase navigation
        </label>
      </div>

      <div className="tool-card">
        <div className="card-title-row">
          <h2>Footer</h2>
          <ResetButton onClick={onResetFooter} />
        </div>
        <label className="toggle-row">
          <input type="checkbox" checked={footer.visible} onChange={(event) => onFooter("visible", event.target.checked)} />
          Show footer
        </label>
        <TextInput label="Footer eyebrow" value={footer.eyebrow} onChange={(value) => onFooter("eyebrow", value)} />
        <TextInput label="Footer title" value={footer.title} onChange={(value) => onFooter("title", value)} />
        <TextArea label="Footer body" value={footer.body} onChange={(value) => onFooter("body", value)} />
        <div className="two-column">
          <TextInput label="Footer button label" value={footer.ctaLabel} onChange={(value) => onFooter("ctaLabel", value)} />
          <TextInput label="Footer button link" value={footer.ctaHref} onChange={(value) => onFooter("ctaHref", value)} />
        </div>
        <TextInput label="Footer note" value={footer.note} onChange={(value) => onFooter("note", value)} />
      </div>

      <div className="tool-card">
        <div className="card-title-row">
          <h2>Selected section</h2>
          <ResetButton onClick={() => onResetSectionContent(section.id)} />
        </div>
        <div className="two-column">
          <label>
            Type
            <select value={section.type} onChange={(event) => onSection(section.id, { type: event.target.value })}>
              {sectionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Layout
            <select value={section.layout} onChange={(event) => onSection(section.id, { layout: event.target.value })}>
              <option value="cards">cards</option>
              <option value="grid">grid</option>
              <option value="split">split</option>
              <option value="timeline">timeline</option>
          <option value="banner">banner</option>
          <option value="spotlight">spotlight</option>
          <option value="marquee">marquee</option>
        </select>
      </label>
        </div>
        <TextInput label="Eyebrow" value={section.eyebrow} onChange={(value) => onSection(section.id, { eyebrow: value })} />
        <TextInput label="Title" value={section.title} onChange={(value) => onSection(section.id, { title: value })} />
        <TextArea label="Body" value={section.body} onChange={(value) => onSection(section.id, { body: value })} />
        <div className="two-column">
          <TextInput label="CTA label" value={section.ctaLabel ?? ""} onChange={(value) => onSection(section.id, { ctaLabel: value })} />
          <TextInput label="CTA link" value={section.ctaHref ?? ""} onChange={(value) => onSection(section.id, { ctaHref: value })} />
        </div>
      </div>

      <div className="tool-card">
        <div className="card-title-row">
          <h2>Section media</h2>
          <ResetButton onClick={() => onResetSectionMedia(section.id)} />
        </div>
        <p>Import an image or video for the selected section. It will be saved with your exported JSON.</p>
        <MediaInput
          media={section.media}
          label="Section media"
          onChange={(media) => onSection(section.id, { media })}
        />
      </div>

      <div className="tool-card">
        <div className="card-title-row">
          <h2>Section design</h2>
          <ResetButton onClick={() => onResetSectionDesign(section.id)} />
        </div>
        <div className="two-column">
          <label>
            Text align
            <select value={settings.textAlign} onChange={(event) => updateSettings({ textAlign: event.target.value })}>
              <option value="left">left</option>
              <option value="center">center</option>
              <option value="right">right</option>
            </select>
          </label>
          <label>
            Background
            <select value={settings.backgroundMode} onChange={(event) => updateSettings({ backgroundMode: event.target.value })}>
              <option value="plain">plain</option>
              <option value="soft">soft glow</option>
              <option value="dark">dark</option>
              <option value="outline">outline</option>
            </select>
          </label>
          <label>
            Card style
            <select value={settings.cardStyle} onChange={(event) => updateSettings({ cardStyle: event.target.value })}>
              <option value="solid">solid</option>
              <option value="glass">glass</option>
              <option value="minimal">minimal</option>
              <option value="loud">loud</option>
            </select>
          </label>
          <label>
            Media fit
            <select value={settings.mediaFit} onChange={(event) => updateSettings({ mediaFit: event.target.value })}>
              <option value="cover">cover</option>
              <option value="contain">contain</option>
            </select>
          </label>
        </div>
        <Range label="Section height" value={settings.minHeight} min="24" max="900" onChange={(value) => updateSettings({ minHeight: value })} />
        <Range label="Section padding" value={settings.padding} min="12" max="96" onChange={(value) => updateSettings({ padding: value })} />
        <Range label="Section width" value={settings.maxWidth} min="680" max="1500" onChange={(value) => updateSettings({ maxWidth: value })} />
        <label className="toggle-row">
          <input type="checkbox" checked={settings.fullWidth} onChange={(event) => updateSettings({ fullWidth: event.target.checked })} />
          Fit this section to the full screen width
        </label>
        <Range label="Card columns" value={settings.columns} min="1" max="5" unit="" onChange={(value) => updateSettings({ columns: value })} />
        <div className="two-column">
          <ColorInput label="Accent override" value={settings.accentColor} fallback="#d95f30" onChange={(value) => updateSettings({ accentColor: value })} />
          <ColorInput label="Background override" value={settings.backgroundColor} fallback="#fffaf0" onChange={(value) => updateSettings({ backgroundColor: value })} />
        </div>
        {section.type === "marquee" && (
          <div className="marquee-controls">
            <h3>Marquee animation</h3>
            <div className="two-column">
              <label>
                Direction
                <select value={settings.marqueeDirection} onChange={(event) => updateSettings({ marqueeDirection: event.target.value })}>
                  <option value="left">left</option>
                  <option value="right">right</option>
                </select>
              </label>
              <TextInput label="Separator" value={settings.marqueeSeparator} onChange={(value) => updateSettings({ marqueeSeparator: value })} />
            </div>
            <Range label="Loop speed" value={settings.marqueeSpeed} min="6" max="80" unit="s" onChange={(value) => updateSettings({ marqueeSpeed: value })} />
            <Range label="Word spacing" value={settings.marqueeGap} min="12" max="160" onChange={(value) => updateSettings({ marqueeGap: value })} />
            <Range label="Text size" value={settings.marqueeSize} min="10" max="72" onChange={(value) => updateSettings({ marqueeSize: value })} />
          </div>
        )}
      </div>

      <div className="tool-card">
        <div className="card-title-row">
          <h2>Elements</h2>
          <span className="title-actions">
            <ResetButton onClick={() => onResetSectionItems(section.id)} />
            <button onClick={() => onAddItem(section.id)}>
              <Plus size={15} />
              Add
            </button>
          </span>
        </div>

        <div className="item-stack">
          {section.items.map((item, index) => (
            <div className="item-editor" key={item.id}>
              <div className="item-toolbar">
                <strong>Element {index + 1}</strong>
                <span>
                  <button onClick={() => onMoveItem(section.id, item.id, -1)} disabled={index === 0}>
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => onMoveItem(section.id, item.id, 1)} disabled={index === section.items.length - 1}>
                    <ArrowDown size={14} />
                  </button>
                  <button onClick={() => onDuplicateItem(section.id, item.id)}>
                    <Plus size={14} />
                  </button>
                  <button onClick={() => onRemoveItem(section.id, item.id)}>
                    <Trash2 size={14} />
                  </button>
                </span>
              </div>
              <TextInput label="Label" value={item.label} onChange={(value) => onItem(section.id, item.id, { label: value })} />
              <TextArea label="Value" value={item.value} onChange={(value) => onItem(section.id, item.id, { value })} />
              <div className="two-column">
                <TextInput label="Tag" value={item.tag ?? ""} onChange={(value) => onItem(section.id, item.id, { tag: value })} />
                <TextInput label="Link" value={item.href ?? ""} onChange={(value) => onItem(section.id, item.id, { href: value })} />
              </div>
              <MediaInput
                media={item.media}
                label="Element media"
                onChange={(media) => onItem(section.id, item.id, { media })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemePanel({ theme, onTheme, onThemePatch, importValue, onImportValue, onImport, onExport, onReset }) {
  const resetThemeKeys = (keys) => {
    const patch = Object.fromEntries(keys.map((key) => [key, defaultPortfolio.theme[key]]));
    onThemePatch(patch);
  };

  return (
    <div className="panel-scroll">
      <div className="tool-card">
        <div className="card-title-row">
          <h2>Colors</h2>
          <ResetButton onClick={() => resetThemeKeys(["background", "surface", "surfaceAlt", "text", "muted", "primary", "secondary", "accent"])} />
        </div>
        <div className="swatch-grid">
          {["background", "surface", "surfaceAlt", "text", "muted", "primary", "secondary", "accent"].map((key) => (
            <label key={key}>
              {key}
              <input type="color" value={theme[key]} onChange={(event) => onTheme(key, event.target.value)} />
            </label>
          ))}
        </div>
      </div>

      <div className="tool-card">
        <div className="card-title-row">
          <h2>Page background media</h2>
          <ResetButton onClick={() => resetThemeKeys(["pageMedia", "pageMediaOpacity", "pageMediaBlur"])} />
        </div>
        <p>Add a site-wide background image or looping video behind every section.</p>
        <MediaInput media={theme.pageMedia} label="Page background media" onChange={(media) => onTheme("pageMedia", media)} />
        <Range label="Background media opacity" value={theme.pageMediaOpacity} min="0" max="100" unit="%" onChange={(value) => onTheme("pageMediaOpacity", value)} />
        <Range label="Background media blur" value={theme.pageMediaBlur} min="0" max="30" onChange={(value) => onTheme("pageMediaBlur", value)} />
      </div>

      <div className="tool-card texture-card">
        <div className="card-title-row">
          <h2>Paper texture</h2>
          <ResetButton onClick={() => resetThemeKeys(["grain", "grainOpacity", "grainSize", "grainColor", "grainPattern"])} />
        </div>
        <p>This controls the visible pattern overlay on the portfolio preview.</p>
        <label className="toggle-row">
          <input type="checkbox" checked={theme.grain} onChange={(event) => onTheme("grain", event.target.checked)} />
          Show paper pattern
        </label>
        <div className="two-column">
          <label>
            Pattern
            <select value={theme.grainPattern} onChange={(event) => onTheme("grainPattern", event.target.value)}>
              <option value="paper">paper grid</option>
              <option value="dots">dots</option>
              <option value="crosshatch">crosshatch</option>
              <option value="scanlines">scanlines</option>
            </select>
          </label>
          <ColorInput label="Texture color" value={theme.grainColor} fallback="#17120d" onChange={(value) => onTheme("grainColor", value || "#17120d")} />
        </div>
        <Range label="Texture intensity" value={theme.grainOpacity} min="0" max="85" unit="%" onChange={(value) => onTheme("grainOpacity", value)} />
        <Range label="Texture scale" value={theme.grainSize} min="6" max="56" onChange={(value) => onTheme("grainSize", value)} />
      </div>

      <div className="tool-card texture-card">
        <div className="card-title-row">
          <h2>Film grain</h2>
          <ResetButton onClick={() => resetThemeKeys(["noise", "noiseOpacity", "noiseSize"])} />
        </div>
        <p>This adds fine randomized speckle/noise, separate from the paper pattern.</p>
        <label className="toggle-row">
          <input type="checkbox" checked={theme.noise} onChange={(event) => onTheme("noise", event.target.checked)} />
          Show grain overlay
        </label>
        <Range label="Grain intensity" value={theme.noiseOpacity} min="0" max="90" unit="%" onChange={(value) => onTheme("noiseOpacity", value)} />
        <Range label="Grain size" value={theme.noiseSize} min="40" max="240" onChange={(value) => onTheme("noiseSize", value)} />
      </div>

      <div className="tool-card">
        <div className="card-title-row">
          <h2>Typography and shape</h2>
          <ResetButton onClick={() => resetThemeKeys(["headingFont", "bodyFont", "radius", "density", "sectionGap"])} />
        </div>
        <label>
          Heading font
          <select value={theme.headingFont} onChange={(event) => onTheme("headingFont", event.target.value)}>
            {fontChoices.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Body font
          <select value={theme.bodyFont} onChange={(event) => onTheme("bodyFont", event.target.value)}>
            {fontChoices.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </label>
        <Range label="Corner radius" value={theme.radius} min="0" max="44" onChange={(value) => onTheme("radius", value)} />
        <Range label="Spacing density" value={theme.density} min="12" max="36" onChange={(value) => onTheme("density", value)} />
        <Range label="Space between sections" value={theme.sectionGap} min="0" max="120" onChange={(value) => onTheme("sectionGap", value)} />
      </div>

      <div className="tool-card">
        <div className="card-title-row">
          <h2>Import and export</h2>
          <ResetButton label="Reset all" onClick={onReset} />
        </div>
        <p>Export your configuration as JSON, or paste a previous export to restore a version.</p>
        <div className="action-row">
          <button onClick={onExport}>
            <Download size={15} />
            Export
          </button>
        </div>
        <TextArea label="Paste JSON config" value={importValue} onChange={onImportValue} />
        <button className="wide-action" onClick={onImport}>
          <Upload size={16} />
          Import config
        </button>
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function ResetButton({ label = "Reset", onClick }) {
  return (
    <button className="reset-action" type="button" onClick={onClick}>
      <RotateCcw size={14} />
      {label}
    </button>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label>
      {label}
      <textarea value={value ?? ""} onChange={(event) => onChange(event.target.value)} rows={4} />
    </label>
  );
}

function MediaInput({ label, media, accept = "image/*,video/*", onChange }) {
  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        src: reader.result,
        type: file.type.startsWith("video/") ? "video" : "image",
        name: file.name,
        alt: file.name.replace(/\.[^.]+$/, ""),
      });
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <div className="media-input">
      <label>
        {label}
        <input type="file" accept={accept} onChange={handleFile} />
      </label>
      {media?.src && (
        <div className="media-input-preview">
          <MediaPreview media={media} />
          <div>
            <strong>{media.name}</strong>
            <TextInput label="Alt text" value={media.alt} onChange={(value) => onChange({ ...media, alt: value })} />
            <button onClick={() => onChange(null)}>
              <X size={15} />
              Remove media
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorInput({ label, value, fallback, onChange }) {
  return (
    <div className="color-override">
      <label>
        {label}
        <input type="color" value={value || fallback} onChange={(event) => onChange(event.target.value)} />
      </label>
      <button onClick={() => onChange("")}>Use theme</button>
    </div>
  );
}

function Range({ label, value, min, max, unit = "px", onChange }) {
  return (
    <label>
      <span className="range-label">
        {label}
        <strong>{value}{unit}</strong>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

export default App;
