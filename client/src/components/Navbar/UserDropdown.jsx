import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaHistory, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const UserDropdown = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.email === 'admin@alaturqa.com';

  if (!currentUser) {
    return (
      <Link to="/login" className="nav-icon-btn mx-2 text-decoration-none">
        <FaUserCircle />
      </Link>
    );
  }

  return (
    <div className="nav-dropdown ms-2">
      <button className="nav-icon-btn">
        <FaUserCircle />
      </button>
      <div className="nav-dropdown-menu">
        <div className="px-3 py-2 border-bottom border-secondary mb-2">
          <small className="text-muted d-block">Signed in as</small>
          <strong className="text-light">{currentUser.displayName || currentUser.email}</strong>
        </div>
        
        {isAdmin && (
          <Link to="/admin" className="dropdown-item">
            <FaChartLine /> Dashboard
          </Link>
        )}
        
        <Link to="/profile" className="dropdown-item">
          <FaUserCircle /> Profile
        </Link>
        <Link to="/orders" className="dropdown-item">
          <FaHistory /> My Orders
        </Link>
        
        <div className="dropdown-divider border-secondary my-1"></div>
        
        <button onClick={handleLogout} className="dropdown-item text-danger w-100 text-start bg-transparent border-0">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;
