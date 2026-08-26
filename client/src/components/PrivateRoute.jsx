import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return children ?? <Outlet />;
};

export default PrivateRoute;

