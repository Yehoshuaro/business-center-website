import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Role } from '@/shared/types';
import { useAuthStore } from '@/store/auth';

/** Requires any authenticated session. Redirects guests to /login. */
export const RequireAuth = () => {
  const session = useAuthStore((s) => s.session);
  const location = useLocation();
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
};

/** Requires the session role to be one of `roles`. Otherwise sends to /dashboard. */
export const RequireRole = ({ roles }: { roles: Role[] }) => {
  const session = useAuthStore((s) => s.session);
  const location = useLocation();
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (!roles.includes(session.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};
