# Ultra Clap - B2B Manufacturing Platform

Frontend for Ultra Clap, a B2B marketplace connecting buyers with verified manufacturers and industrial suppliers.

## Tech Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React, React Icons
- **Routing:** React Router DOM
- **Backend:** Node.js / Express (separate repo)

## Getting Started

```bash
npm install
npm run dev
```

By default the app connects to the production backend at `https://manu-back-bpob.onrender.com/api`. For local development:

```bash
npm run dev:local
```

This sets `VITE_API_URL=http://localhost:5001/api`.

## Project Structure

```
src/
├── api/          # API config & helpers
├── components/   # Shared UI components (BannerSlider, Toast, modals, etc.)
├── pages/        # Route pages
│   ├── Admin/    # Admin dashboard, partner details, modals
│   └── Partner/  # Seller dashboard, KYC, layout
└── App.jsx       # Root with routes
```

## Key Features

- **Home:** Banner slider, featured products, manufacturing banners, category grid
- **Partner Portal:** Login/signup modal, dashboard with stats, KYC verification, product listings
- **Admin Panel:** Manage products, categories, users, leads, orders, partners, subscribers
- **Forgot Password:** Email-based reset flow
