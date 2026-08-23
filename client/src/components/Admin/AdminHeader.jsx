import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import useAuth from '../../hooks/useAuth';
import { getPageTitleByPath, ROLE_LABELS } from '../../utils/adminRoles';

const AdminHeader = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, role, logout } = useAuth();

  const title = useMemo(() => getPageTitleByPath(location.pathname), [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header
      className="d-flex align-items-center justify-content-between p-3 mb-3"
      style={{ borderBottom: '1px solid rgba(201, 162, 39, 0.2)' }}
    >
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-sm btn-outline-light d-md-none" onClick={onToggleSidebar}>
          ☰
        </button>
        <div>
          <div className="text-gold fw-bold">Ala Turqa</div>
          <div className="text-light">{title}</div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <NotificationBell />
        <div className="dropdown">
          <button
            className="btn btn-outline-light btn-sm dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {currentUser?.displayName || currentUser?.email || 'Admin'}
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li className="dropdown-item-text small text-muted">{currentUser?.email}</li>
            <li className="dropdown-item-text small">{ROLE_LABELS[role] || 'Staff'}</li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
