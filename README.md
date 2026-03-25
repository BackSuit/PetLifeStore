# Pet Life Store

Pet Life Store — Your Ultimate Pet Care Destination.

Pet Life Store is a curated pet product discovery site publishing in-depth product reviews, buying guides, care articles and recommendations for dog and cat owners. Configuration is driven by `contents/site-settings.json`.

## Features

- Curated pet product reviews and buying guides
- Predefined categories (dogs, cats, health, reviews, lifestyle)
- SEO-friendly dynamic `sitemap.xml`, `robots.txt`, and meta tags
- PWA support and automatic icon generation
- Uses `contents/site-settings.json` for site title, description, categories and contact info

---

## Quick Start

### Prerequisites

- Node.js 14+ and npm/yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/BackSuit/PetLifeStore.git
cd PetLifeStore
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Configure the site

Edit `contents/site-settings.json` (site name, description, base URL, categories, contact info).

4. Generate icons

```bash
npm run generate-icons
```

5. Run the development server

```bash
npm run dev
```

Open http://localhost:3000

---

## Configuration

Primary config: `contents/site-settings.json`.

What it controls:

- Site name, title and description
- `base_url` used in sitemaps and robots
- Predefined categories and navbar groups
- Contact info and social handles (displayed only if present)

### Backend & Data

This frontend uses Backsuit (https://backsuit.com) as the primary backend API provider. The backend handles data storage and all database responsibilities.

### Security: Tenant / API keys

The tenant identifier / API key is a secret value and should NOT be exposed in client-side public environment variables. Store it server-side (e.g., `BACKEND_TENANT_ID` or similar) and never commit it to the repo or place it under `NEXT_PUBLIC_*`.

### Contact & Social

Contact details are taken from `contents/site-settings.json` and shown here only when provided.

- Address: Nepal, Kathmandu
- WhatsApp: +977 9840889975
- Email: bkash.timsina@gmail.com

If a social field is empty in `site-settings.json`, it will be omitted from the site output.

---

## Scripts

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server
npm run generate-icons # Generate favicons and PWA icons
```

---

## Notes

- Update `contents/site-settings.json` to change site text, categories or contact info.
- The README was updated to reflect `contents/site-settings.json` values and to remove outdated "Pretty Long" references.

- Database: handled by Backsuit backend (no MongoDB required here).
- Support & Services: This project uses Backsuit (https://backsuit.com) as the main API provider — visit and register at Backsuit for a free account and API access.
- Tenant/API keys: keep them server-side; do not expose via `NEXT_PUBLIC_*` env vars.

---

If you'd like I can also update other docs (API_DOCUMENTATION.md) or remove any stale references elsewhere.

### Deploying to Vercel

This project includes `vercel.json` and a small `vercel-build.sh` script, so it can be imported
directly into Vercel with no additional configuration.

Quick steps:

- Fork this repository on GitHub
- Open your Vercel dashboard and click **Add New > Project**
- Choose the forked repo and click **Import**
- After import, open **Project Settings > Environment Variables** and add the required variables
  (`NEXT_PUBLIC_API_URL`, `TENANT_ID`, `NEXT_AUTH_SECRET`) one-by-one or import your `.env`
  file directly
- Deploy — the default build and start commands are used (`npm run build`, `npm run start`)

Works with other Node.js hosts as well.

Build command: `npm run build`  
Start command: `npm run start`

---

## 🔒 Environment Variables (Required)

Set the minimal required variables to connect this frontend to a backend (e.g. Backsuit).

```env
# Public backend API base URL (used client-side for OAuth redirects)
NEXT_PUBLIC_API_URL=https://api.yourbackend.com

# Tenant identifier (server-side only — do NOT expose with NEXT_PUBLIC_)
TENANT_ID=your-tenant-id

# NextAuth secret used to sign/encrypt session tokens
NEXT_AUTH_SECRET=generate-with-openssl-rand-base64-32
```

Quick start: sign up at https://backsuit.com, obtain your API base URL and tenant id, set
the three variables above, then build & deploy. This connects the UI to the backend and
lets you demonstrate the full product experience to potential customers.

---

## 📖 Documentation

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- Check inline comments in code for detailed explanations
- Component props are documented with JSDoc

---

## 🤝 Support & Services

### Backend API (Backsuit)

This frontend uses Backsuit (https://backsuit.com) as the primary backend API provider. Backsuit handles storage, multi-tenant features and content APIs — visit and register at Backsuit for a free account and API access.

**Contact & registration:**

- 📧 Email: bkash.timsina@gmail.com
- Visit: https://backsuit.com — register for a free account
- 📱 WhatsApp: +977 9840889975
- 📍 Location: Nepal, Kathmandu

**Services / Notes:**

- Backend API, storage and multi-tenant features provided by Backsuit
- Deployment and support options depend on your Backsuit plan

### Collaboration

- Found a bug? [Open an issue](https://github.com/BackSuit/PetLifeStore/issues)
- Want a feature? [Request it](https://github.com/BackSuit/PetLifeStore/issues)
- Want to contribute? Pull requests welcome!

---

## 📱 Social Media

- Instagram: [@store.petlife](https://instagram.com/store.petlife)
- Facebook: [Pet Life Store](https://facebook.com/profile.php?id=61580847855988)
- Email: bkash.timsina@gmail.com

---

## 📝 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

## 🙏 Credits

Built with:

- [Next.js](https://nextjs.org/) - React framework
- [Chakra UI](https://chakra-ui.com/) - Component library
- Backend services provided by [Backsuit](https://backsuit.com)
- [Next-Auth](https://next-auth.js.org/) - Authentication
- [Sharp](https://sharp.pixelplumbing.com/) - Image processing

---

**Made with ❤️ by the Pet Life Store team**

_Transform your pet shopping experience today!_
