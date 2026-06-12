# Business Center Demo Design Showcase

A frontend demo that presents one business center at three levels of website
implementation. It is meant to help a client see the difference between a simple
landing page, a corporate multi-page site, and a full platform with a CRM, and
then pick the option that fits their budget and needs.

The project runs entirely in the browser. There is no backend. All data is mock
data kept in `localStorage`, so any changes you make survive a page reload but
are local to your machine.

## Purpose

This is a portfolio and sales tool, not a production SaaS. The home page is a
package selector. From there you open any of the three demos and explore them as
if they were real websites. The content is realistic but exists only for
demonstration.

## Packages

The application contains three independent showcase versions.

### Package 1: Landing Page

Route: `/landing`

A single page focused on lead generation. It is the simplest and fastest option
for a client who mainly wants to collect rental enquiries.

Sections: hero, about, benefits, available offices, gallery preview,
testimonials, contact information, lead form, and a closing call to action.

### Package 2: Corporate Website

Route: `/corporate`

A multi-page informational website. More complete than the landing page, without
any management tools.

Pages: Home, About, Offices, Gallery, Services, News, and Contact. It includes an
office catalog, an amenities section, a news section with article pages, and
inquiry forms.

### Package 3: Premium Platform

Route: `/platform`

The most advanced package. It combines the public website with an authenticated
area and a full CRM.

It includes:

- Public website with offices, gallery, services, news, and contact pages
- Authentication with a dedicated login route
- Role based access for three roles (Admin, Manager, Tenant)
- CRM dashboard with leads, bookings, and maintenance requests
- Tenant management and office management
- Tenant portal with leased spaces and invoices
- Analytics style overview dashboards

Demo accounts for Package 3:

| Role    | Email            | Password    |
| ------- | ---------------- | ----------- |
| Admin   | admin@crm.kz     | admin123    |
| Manager | manager@crm.kz   | manager123  |
| Tenant  | viewer@crm.kz    | viewer123   |

On the login screen you can click an account to fill the form, then sign in.

## Features

- Three independent website demos behind one selector
- Multi language support with i18next (Russian, Kazakh, English). Russian is the
  default. The language switcher is in the navbar of every package.
- Theme system with six color themes (Corporate Blue, Emerald Green, Executive
  Gold, Graphite Black, Modern Gray, Business Brown). The theme switcher is in the
  navbar and applies across the whole application.
- Responsive layout for mobile, tablet, and desktop, including working mobile
  navigation and forms.
- Mock backend in `localStorage`, with a reset option in the platform settings.

## Technology stack

- React 18 with TypeScript (strict mode)
- Vite for development and build
- React Router for routing
- Zustand for state and the mock store
- i18next and react-i18next for translations
- Tailwind CSS with CSS variable based themes
- lucide-react for icons

## Project structure

```
src/
  app/                 App root and router
  i18n/                i18next config and ru, kk, en resources
  pages/showcase/      Package selector (home page)
  packages/landing/    Package 1
  packages/corporate/  Package 2
  pages/public/        Package 3 public website
  pages/auth/          Package 3 login
  pages/dashboard/     Package 3 CRM and tenant portal
  store/               Zustand stores (offices, tenants, leads, theme, ...)
  data/seed.ts         Demo seed data
  shared/              Shared UI, layout, and marketing components
```

## Local launch

Requirements: Node 18 or newer.

```bash
npm install
npm run dev
```

Then open the URL printed by Vite, usually `http://localhost:5173`.

Other scripts:

```bash
npm run build     # type check and build for production
npm run preview   # serve the production build locally
npm run lint      # type check only
```

## Deployment

The build output is a static site, so it can be hosted on any static host.

```bash
npm run build
```

This creates a `dist` folder. Upload it to your host of choice, for example
GitHub Pages, Netlify, or Vercel.

The app uses hash based routing, so it works on static hosts and subpaths without
extra server configuration. The Vite `base` is set to `./` for the same reason.

## Screenshots

Add screenshots here.

- Package selector: `docs/screenshot-selector.png`
- Package 1 landing page: `docs/screenshot-landing.png`
- Package 2 corporate website: `docs/screenshot-corporate.png`
- Package 3 platform dashboard: `docs/screenshot-platform.png`

## Notes

This is a demonstration project. The data is fictional and no real transactions
take place.
