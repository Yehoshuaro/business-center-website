import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Showcase selector
import { ShowcaseSelectorPage } from '@/pages/showcase/ShowcaseSelectorPage';

// Package 1 — Landing
import { LandingPage } from '@/packages/landing/LandingPage';

// Package 2 — Corporate multi-page site
import { CorporateLayout } from '@/packages/corporate/CorporateLayout';
import { CorporateHome } from '@/packages/corporate/pages/CorporateHome';
import { CorporateAbout } from '@/packages/corporate/pages/CorporateAbout';
import { CorporateOffices } from '@/packages/corporate/pages/CorporateOffices';
import { CorporateGallery } from '@/packages/corporate/pages/CorporateGallery';
import { CorporateServices } from '@/packages/corporate/pages/CorporateServices';
import { CorporateNews } from '@/packages/corporate/pages/CorporateNews';
import { CorporateNewsDetail } from '@/packages/corporate/pages/CorporateNewsDetail';
import { CorporateContact } from '@/packages/corporate/pages/CorporateContact';

// Package 3 — Premium Platform (public site)
import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { HomePage } from '@/pages/public/HomePage';
import { AboutPage } from '@/pages/public/AboutPage';
import { OfficesPage } from '@/pages/public/OfficesPage';
import { OfficeDetailPage } from '@/pages/public/OfficeDetailPage';
import { GalleryPage } from '@/pages/public/GalleryPage';
import { ServicesPage } from '@/pages/public/ServicesPage';
import { NewsPage } from '@/pages/public/NewsPage';
import { NewsDetailPage } from '@/pages/public/NewsDetailPage';
import { ContactPage } from '@/pages/public/ContactPage';

// Package 3 — Premium Platform (auth + CRM)
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { RequireAuth, RequireRole } from '@/features/access/guards';
import { OverviewPage } from '@/pages/dashboard/OverviewPage';
import { SpacesPage } from '@/pages/dashboard/SpacesPage';
import { TenantsPage } from '@/pages/dashboard/TenantsPage';
import { LeadsPage } from '@/pages/dashboard/LeadsPage';
import { BookingsPage } from '@/pages/dashboard/BookingsPage';
import { MaintenancePage } from '@/pages/dashboard/MaintenancePage';
import { UsersPage } from '@/pages/dashboard/UsersPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';
import { MySpacesPage } from '@/pages/dashboard/MySpacesPage';
import { InvoicesPage } from '@/pages/dashboard/InvoicesPage';

export const AppRouter = () => (
  <HashRouter>
    <Routes>
      {/* ===== Showcase selector (homepage) ===== */}
      <Route index element={<ShowcaseSelectorPage />} />

      {/* ===== Package 1 — Landing Page ===== */}
      <Route path="landing" element={<LandingPage />} />

      {/* ===== Package 2 — Corporate Website ===== */}
      <Route path="corporate" element={<CorporateLayout />}>
        <Route index element={<CorporateHome />} />
        <Route path="about" element={<CorporateAbout />} />
        <Route path="offices" element={<CorporateOffices />} />
        <Route path="gallery" element={<CorporateGallery />} />
        <Route path="services" element={<CorporateServices />} />
        <Route path="news" element={<CorporateNews />} />
        <Route path="news/:slug" element={<CorporateNewsDetail />} />
        <Route path="contact" element={<CorporateContact />} />
      </Route>

      {/* ===== Package 3 — Premium Platform (public website) ===== */}
      <Route element={<PublicLayout />}>
        <Route path="platform" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="offices" element={<OfficesPage />} />
        <Route path="offices/:id" element={<OfficeDetailPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="news/:slug" element={<NewsDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Package 3 — dedicated auth route */}
      <Route path="login" element={<LoginPage />} />

      {/* Package 3 — protected CRM / tenant area */}
      <Route element={<RequireAuth />}>
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />

          {/* Tenant (viewer) self-service */}
          <Route element={<RequireRole roles={['viewer']} />}>
            <Route path="my-spaces" element={<MySpacesPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
          </Route>

          {/* CRM management — manager + admin */}
          <Route element={<RequireRole roles={['admin', 'manager']} />}>
            <Route path="spaces" element={<SpacesPage />} />
            <Route path="tenants" element={<TenantsPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
          </Route>

          {/* Maintenance — all authenticated roles (viewer sees own) */}
          <Route path="maintenance" element={<MaintenancePage />} />

          {/* Administration — admin only */}
          <Route element={<RequireRole roles={['admin']} />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </HashRouter>
);
