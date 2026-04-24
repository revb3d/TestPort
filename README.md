# Portfolio Studio

A customizable portfolio builder with a live admin panel. The portfolio is rendered from editable data, so you can change the theme, text, fonts, section order, visibility, and nested content without touching code.

## Shared backend

To make edits save for everyone, configure these Vercel environment variables and redeploy:

```env
ADMIN_PASSWORD=your-admin-password
ADMIN_SESSION_SECRET=a-long-random-secret
BLOB_READ_WRITE_TOKEN=your-vercel-blob-read-write-token
```

Notes:
- `ADMIN_PASSWORD` protects the live admin panel.
- `ADMIN_SESSION_SECRET` signs the admin cookie on the server.
- `BLOB_READ_WRITE_TOKEN` stores the shared portfolio config in Vercel Blob.
- `VITE_ADMIN_PASSWORD` is now only a local fallback when you run plain `npm run dev`.

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
ADMIN_PASSWORD=your-password
```

For local development, copy `.env.example` to `.env` and change the value. On Vercel, add `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and `BLOB_READ_WRITE_TOKEN` in Project Settings -> Environment Variables.

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
- Shared persistence: when Vercel Blob is configured, edits save to the backend so the live site stays in sync.

Local development still keeps a browser fallback using IndexedDB so plain `npm run dev` works without the backend. On deployed Vercel environments, the app prefers the shared backend automatically.
