import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { canAccessByRole } from '../../utils/adminRoles';

const AdminAuthGuard = ({ allowedRoles = null, children }) => {
  const { currentUser, loading, isAdmin, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center text-light py-5">Loading authentication...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/access-denied" replace />;
  }

  if (allowedRoles?.length && !canAccessByRole(role, allowedRoles)) {
    return <Navigate to="/admin/access-denied" replace />;
  }

  return children ?? <Outlet />;
};

export default AdminAuthGuard;
