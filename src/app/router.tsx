import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import { PublicLayout } from '@/shared/components/layout/PublicLayout';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';

// Showcase
import { ChooserPage } from '@/pages/chooser/ChooserPage';

// Tier 1 — landing
import { LandingPage } from '@/pages/landing/LandingPage';

// Tier 2 — public pages
import { HomePage } from '@/pages/public/HomePage';
import { OfficesPage } from '@/pages/public/OfficesPage';
import { OfficeDetailPage } from '@/pages/public/OfficeDetailPage';
import { ConferenceRoomsPage } from '@/pages/public/ConferenceRoomsPage';
import { ConferenceRoomDetailPage } from '@/pages/public/ConferenceRoomDetailPage';
import { TenantsPage } from '@/pages/public/TenantsPage';
import { ContactsPage } from '@/pages/public/ContactsPage';
import { NewsPage } from '@/pages/public/NewsPage';
import { NewsDetailPage } from '@/pages/public/NewsDetailPage';
import { LoginPage } from '@/pages/public/LoginPage';

// Tier 2 — admin pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminOfficesPage } from '@/pages/admin/AdminOfficesPage';
import { AdminConferenceRoomsPage } from '@/pages/admin/AdminConferenceRoomsPage';
import { AdminTenantsPage } from '@/pages/admin/AdminTenantsPage';
import { AdminLeadsPage } from '@/pages/admin/AdminLeadsPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminGalleryPage } from '@/pages/admin/AdminGalleryPage';
import { AdminNewsPage } from '@/pages/admin/AdminNewsPage';

// Tier 3 — CRM
import { CrmLoginPage } from '@/pages/crm/CrmLoginPage';
import { CrmLayout } from '@/pages/crm/CrmLayout';
import { CrmProtectedRoute } from '@/pages/crm/CrmProtectedRoute';
import { CrmDashboardPage } from '@/pages/crm/CrmDashboardPage';
import { CrmDealsPage } from '@/pages/crm/CrmDealsPage';
import { CrmClientsPage } from '@/pages/crm/CrmClientsPage';
import { CrmTasksPage } from '@/pages/crm/CrmTasksPage';
import { CrmUsersPage } from '@/pages/crm/CrmUsersPage';
import { CrmSettingsPage } from '@/pages/crm/CrmSettingsPage';

export const AppRouter = () => (
  <HashRouter>
    <Routes>
      {/* Showcase entry — pick a demo */}
      <Route index element={<ChooserPage />} />

      {/* Tier 1 — single-page landing */}
      <Route path="landing" element={<LandingPage />} />

      {/* Tier 2 — multi-page site */}
      <Route path="site" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="offices" element={<OfficesPage />} />
        <Route path="offices/:id" element={<OfficeDetailPage />} />
        <Route path="conference-rooms" element={<ConferenceRoomsPage />} />
        <Route path="conference-rooms/:id" element={<ConferenceRoomDetailPage />} />
        <Route path="tenants" element={<TenantsPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="news/:slug" element={<NewsDetailPage />} />
        <Route path="contacts" element={<ContactsPage />} />
      </Route>

      {/* Tier 2 — standalone login */}
      <Route path="site/login" element={<LoginPage />} />

      {/* Tier 2 — admin */}
      <Route element={<ProtectedRoute />}>
        <Route path="site/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="offices" element={<AdminOfficesPage />} />
          <Route path="conference-rooms" element={<AdminConferenceRoomsPage />} />
          <Route path="tenants" element={<AdminTenantsPage />} />
          <Route path="gallery" element={<AdminGalleryPage />} />
          <Route path="news" element={<AdminNewsPage />} />
          <Route path="leads" element={<AdminLeadsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      {/* Tier 3 — CRM */}
      <Route path="crm/login" element={<CrmLoginPage />} />
      <Route element={<CrmProtectedRoute />}>
        <Route path="crm" element={<CrmLayout />}>
          <Route index element={<CrmDashboardPage />} />
          <Route path="deals" element={<CrmDealsPage />} />
          <Route path="clients" element={<CrmClientsPage />} />
          <Route path="tasks" element={<CrmTasksPage />} />
          <Route path="users" element={<CrmUsersPage />} />
          <Route path="settings" element={<CrmSettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </HashRouter>
);
