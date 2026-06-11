import { Navigate, Outlet } from 'react-router-dom';
import { useCrmStore } from '@/features/crm/store';

export const CrmProtectedRoute = () => {
  const session = useCrmStore((s) => s.session);
  if (!session) return <Navigate to="/crm/login" replace />;
  return <Outlet />;
};
