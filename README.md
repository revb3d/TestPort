# Portfolio Studio

A customizable portfolio builder with a live admin panel. The portfolio is rendered from editable data, so you can change the theme, text, fonts, section order, visibility, and nested content without touching code.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Admin password

To protect the admin panel on a deployed site, set:

```bash
VITE_ADMIN_PASSWORD=your-password
```

For local development, copy `.env.example` to `.env` and change the value. On Vercel, add `VITE_ADMIN_PASSWORD` in Project Settings -> Environment Variables.

## What You Can Customize

- Identity details: name, role, location, email, and availability.
- Theme: colors, heading font, body font, corner radius, spacing density, and paper grain.
- Sections: add, remove, hide/show, reorder, and change section type or layout.
- Section design: change height, width, padding, text alignment, card columns, background style, card style, media fit, and per-section color overrides.
- Media: import images or videos for whole sections and individual elements, edit alt text, and remove media when needed.
- Elements: add, duplicate, remove, edit, add media to, and reorder nested cards, stats, milestones, services, testimonials, and links.
- Structure helpers: duplicate sections, hide/show them, and reorder them quickly.
- Page enhancements: add a site-wide background image/video layer with opacity and blur controls, and customize a footer CTA area.
- Data portability: export the portfolio configuration as JSON and import it later.

Changes are saved automatically in your browser with `localStorage`. Imported media is stored as data URLs, which is convenient for quick local editing and JSON export. Very large videos can exceed browser storage limits, so shorter clips or compressed images work best.
"# TestPort" 
