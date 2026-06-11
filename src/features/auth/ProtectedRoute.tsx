import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from './store';

export const ProtectedRoute = () => {
  const session = useAuthStore((s) => s.session);
  const location = useLocation();

  if (!session) {
    return <Navigate to="/site/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
};
