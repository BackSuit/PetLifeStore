# Pretty Long — Self-help & Wellness Articles for Women

Pretty Long is a focused article and blog frontend built with Next.js. It targets self-help, wellness and lifestyle topics for women, providing curated articles and resources organized by predefined categories (see `contents/site-settings.json`). The frontend integrates with the Backsuit backend service (https://backsuit.com) for content, comments and user management; the backend handles persistence and storage, so no database setup is required in this repository.

## 🌟 Features

- Focused on self-help, wellness and lifestyle content for women
- Integrates with the Backsuit backend service (https://backsuit.com) for content, comments and auth
- SEO-friendly: dynamic `sitemap.xml`, `robots.txt`, and meta tags
- PWA support and responsive, mobile-first UI
- Category system: use backend categories or predefined categories in `contents/site-settings.json`
- Gallery and article listing with social sharing and reading-time indicators
- Client-side and server-side rendering patterns where appropriate
- Auto-generated site icons via the included script

---

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ and npm/yarn
- Backend API service: this frontend expects a REST API — this project is integrated with Backsuit (https://backsuit.com). The backend handles data persistence, comments, users and all storage; no database setup is required in this repository.

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/bi-kash/PrettyLong.git
   cd PrettyLong
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure your site** (see [Configuration](#-configuration))

   Edit `contents/site-settings.json` with your site information.

4. **Set up environment variables**

   Create a `.env.local` file and configure the backend URL and tenant settings. Example:

   ```env
   NEXT_PUBLIC_API_URL=https://api.backsuit.com
   NEXT_PUBLIC_TENANT_ID=your_tenant_id
   NEXT_PUBLIC_CLIENT_URL=https://prettylong.com

   # NextAuth (if used)
   NEXTAUTH_URL=https://prettylong.com
   NEXTAUTH_SECRET=your_secret_key
   ```

5. **Generate icons**

   ```bash
   npm run generate-icons
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

The primary configuration file is `contents/site-settings.json`. It contains the site title, logo text, base URL, description and category settings. This repository supports two category modes:

- `use_api_categories: true` — fetch categories from the backend
- `use_api_categories: false` — use `predefined_categories` defined inside `site-settings.json`

Edit `contents/site-settings.json` to update site name, description and categories.

### What This Controls

- **Logo Display** - Logo component reads from `logo_text`
- **SEO Meta Tags** - Site name, title, and description
- **Sitemap.xml** - Uses `base_url` for all URLs
- **Robots.txt** - Uses `base_url` for sitemap reference
- **Manifest.json** - PWA name and description
- **Icons** - Generated from `site_name`
- **Categories** - API vs predefined categories setting

### Changing Site Name

1. Edit `site_name` in `contents/site-settings.json`
2. Run `npm run generate-icons` to regenerate favicons
3. Done! Logo, manifest, and all references update automatically

---

## 🎨 Dynamic Icon Generation

Icons are automatically generated based on your site name, styled exactly like your logo.

### Generate Icons

```bash
npm run generate-icons
```

This creates:

- `favicon.ico` (32×32) - Browser tab icon
- `apple-touch-icon.png` (180×180) - iOS home screen
- `logo-512.png` (512×512) - Large PWA icon
- `maskable_icon_x192.png` (192×192) - Android PWA
- `maskable_icon_x512.png` (512×512) - Android PWA large

### How It Works

The script reads your `site_name` from `site-settings.json`, splits it on the first space, and creates icons with:

- White background
- Black text
- Top line: italic, medium weight
- Bottom line: bold, extra weight
- Proportional spacing (same as Logo.js component)

Example: "Pretty Long" → Shows "Pretty" (italic) on top, "Long" (bold) below

---

## 📄 Dynamic Files

### Sitemap.xml - `/sitemap.xml`

**Automatically generated** XML sitemap for SEO.

**What it includes:**

- All static pages (home, about, gallery, etc.)
- All published articles from API
- All categories (from API or predefined)
- Current timestamps
- Proper priority and changefreq values

**How it works:**

1. Reads `base_url` from site-settings.json
2. Fetches all published articles via API
3. Fetches categories (API or predefined based on `use_api_categories`)
4. Generates XML with correct structure
5. Caches for 1 hour

**Access:** `https://yoursite.com/sitemap.xml`

### Robots.txt - `/robots.txt`

**Automatically generated** robots.txt for search engines.

**What it includes:**

- Allow all crawlers
- Sitemap URL (using `base_url`)
- Host directive

**Access:** `https://yoursite.com/robots.txt`

### Manifest.json - `/manifest.json`

**Automatically generated** PWA manifest.

**What it includes:**

- Site name and short name
- Site description
- Icon references
- Display mode and theme colors

**Access:** `https://yoursite.com/manifest.json`

---

## 🔗 Backend Service

This frontend integrates with a backend REST API that provides content, comments, authors and user features. In this project we use Backsuit (https://backsuit.com) as the backend service. The backend handles all data storage and persistence — there is no database configuration in this repository.

Refer to `API_DOCUMENTATION.md` for the exact endpoints expected by the frontend. If you host your own backend, ensure `NEXT_PUBLIC_API_URL` points to your API base URL.

---

## 📁 Project Structure

```
PrettyLong/
├── contents/                 # Content configuration
│   ├── site-settings.json   # Main site configuration
│   ├── bulletins.json       # Bulletin archive data
│   ├── magazines.json       # Magazine archive data
│   └── teams.json          # Team member data
├── public/                  # Static assets
│   ├── meta/               # Favicons and PWA icons
│   ├── images/             # Site images
│   ├── sitemap.xml         # (old static - now dynamic)
│   ├── robots.txt          # (old static - now dynamic)
│   └── manifest.json       # (old static - now dynamic)
├── src/
│   ├── components/         # React components
│   │   ├── article/       # Article-related components
│   │   ├── auth/          # Authentication components
│   │   ├── comment/       # Comment system
│   │   ├── home/          # Homepage sections
│   │   ├── layout/        # Layout components
│   │   ├── magazine/      # Magazine components
│   │   ├── sections/      # Header, footer, logo
│   │   └── team/          # Team components
│   ├── libs/              # Utility libraries
│   │   ├── api.js         # API functions
│   │   ├── comments.js    # Comment helpers
│   │   ├── date.js        # Date formatting
│   │   └── markdownToHTML.js
│   ├── models/            # Local model helpers (frontend-only)
│   │   ├── Comment.js
│   │   ├── Post.js
│   │   └── User.js
│   ├── pages/             # Next.js pages
│   │   ├── api/          # API routes
│   │   ├── auth/         # Auth pages
│   │   ├── category/     # Category pages
│   │   ├── read/         # Article pages
│   │   ├── sitemap.xml.js  # Dynamic sitemap
│   │   ├── robots.txt.js   # Dynamic robots.txt
│   │   ├── manifest.json.js # Dynamic manifest
│   │   └── index.js      # Homepage
│   ├── theme/            # Chakra UI theme
│   └── utils/            # Utilities
├── scripts/              # Build scripts
│   ├── generate-icons.js # Icon generation script
│   └── test-icon-generation.js
├── package.json
└── next.config.js
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Icon Generation
npm run generate-icons   # Generate all favicons and PWA icons

# Code Quality
npm run format           # Format code with Prettier
npm run lint             # Run ESLint
npm run check-all        # Check formatting and linting

# Export
npm run export           # Build and export as static site
```

---

## 🔧 Advanced Configuration

### Category Management

**Option 1: API Categories** (Recommended)

Set in `site-settings.json`:

```json
{
  "use_api_categories": true
}
```

Categories are fetched from backend API: `GET /api/v1/categories`

**Option 2: Predefined Categories**

Set in `site-settings.json`:

```json
{
  "use_api_categories": false,
  "predefined_categories": [
    {
      "id": 1,
      "name": "Beauty",
      "slug": "beauty"
    },
    {
      "id": 2,
      "name": "Hair",
      "slug": "hair"
    }
  ]
}
```

### Article Management

Articles are managed through the backend API. The frontend automatically fetches and displays:

- Featured articles (homepage)
- Latest articles
- Category-filtered articles
- Individual article pages
- Author profiles with their articles

### Comment System

Comments are stored in MongoDB and managed through the local Next.js API:

- `/api/post/[slug]/comments` - Get/Post comments
- `/api/user/profile` - User profiles for comments

### Authentication

Uses Next-Auth for authentication:

- Google OAuth (configure in `.env.local`)
- Email/Password (custom provider)
- Session management

---

## 🎯 Customization

### Changing Colors

Edit `src/theme/index.js` to customize Chakra UI theme colors.

### Changing Fonts

Fonts are loaded from `@fontsource` in `src/pages/_app.js`:

- Montserrat (headings)
- Karla (body)
- Lora (serif)

### Adding New Pages

1. Create file in `src/pages/`
2. Add to sitemap in `src/pages/sitemap.xml.js`
3. Add navigation link in `src/components/sections/header.js`

### Custom Icon Style

Edit `scripts/generate-icons.js` to customize:

- Background color (line 30)
- Text color (line 42)
- Font sizes (lines 38-39)
- Font weights (lines 48, 57)

---

## 📊 SEO Optimization

### Automatic SEO Features

- ✅ Dynamic sitemap.xml with all content
- ✅ Dynamic robots.txt
- ✅ Meta tags for each page
- ✅ Open Graph tags for social sharing
- ✅ Structured data (JSON-LD schema)
- ✅ Canonical URLs
- ✅ Image alt texts

### Google Analytics

Configure in `.env.local`:

```env
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_tracking_id
```

Analytics is automatically included in production builds.

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy!

### Other Platforms

Works with any Node.js hosting:

- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Heroku
- Your own VPS

Build command: `npm run build`  
Start command: `npm run start`

---

## 🔒 Environment Variables

### Required

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
NEXTAUTH_URL=https://yoursite.com
NEXTAUTH_SECRET=random_secret_key
```

### Optional

```env
# Backend API
NEXT_PUBLIC_API_URL=https://api.yoursite.com
NEXT_PUBLIC_TENANT_ID=your_tenant_id

# Google Analytics
NEXT_PUBLIC_GA_TRACKING_ID=UA-XXXXXXXXX-X

# OAuth (NextAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 📖 Documentation

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- Check inline comments in code for detailed explanations
- Component props are documented with JSDoc

---

## 🤝 Support & Services

### Get Professional Backend API

Save months of development time with our production-ready backend service.

**Contact us:**

- 📧 Email: prettylong@gmail.com
- 📱 Phone: +905050280533
- 📍 Location: Bursa, Turkey

**Services we offer:**

- ✅ Complete backend API setup
- ✅ Custom feature development
- ✅ Deployment assistance
- ✅ Technical support
- ✅ Training and documentation
- ✅ Multi-tenant SaaS solutions

### Collaboration

- Found a bug? [Open an issue](https://github.com/bi-kash/PrettyLong/issues)
- Want a feature? [Request it](https://github.com/bi-kash/PrettyLong/issues)
- Want to contribute? Pull requests welcome!

---

## 📱 Social Media

- Instagram: [@prettylong](https://instagram.com/prettylong)
- Twitter: [@prettylong](https://twitter.com/prettylong)
- Facebook: [Pretty Long](https://facebook.com/prettylong)
- Email: prettylong@gmail.com

---

## 📝 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

## 🙏 Credits

Built with:

- [Next.js](https://nextjs.org/) - React framework
- [Chakra UI](https://chakra-ui.com/) - Component library
- [MongoDB](https://www.mongodb.com/) - Database
- [Next-Auth](https://next-auth.js.org/) - Authentication
- [Sharp](https://sharp.pixelplumbing.com/) - Image processing

---

**Made with ❤️ by the Pretty Long team**

_Transform your digital magazine today!_
