import { NavLink } from 'react-router-dom';
import { ADMIN_NAV_ITEMS } from '../../utils/adminRoles';

const AdminSidebar = ({ role, onNavigate }) => {
  return (
    <aside
      className="text-white p-3"
      style={{
        width: '260px',
        backgroundColor: '#1B1B1B',
        borderRight: '1px solid rgba(201, 162, 39, 0.2)',
      }}
    >
      <h5 className="text-gold mb-4">Ala Turqa Admin</h5>
      <nav className="nav flex-column gap-1">
        {ADMIN_NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `nav-link rounded px-3 py-2 ${isActive ? 'fw-bold' : ''}`
            }
            style={({ isActive }) => ({
              color: isActive ? '#111111' : '#FFFFFF',
              backgroundColor: isActive ? '#C9A227' : 'transparent',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
