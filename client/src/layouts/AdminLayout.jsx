import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminHeader from '../components/Admin/AdminHeader';
import useAuth from '../hooks/useAuth';

const AdminLayout = () => {
  const { role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#111111' }}>
      <div className="d-none d-md-block">
        <AdminSidebar role={role} />
      </div>

      {mobileOpen && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1040 }}
            onClick={() => setMobileOpen(false)}
          />
          <div className="position-fixed top-0 start-0 h-100" style={{ zIndex: 1041 }}>
            <AdminSidebar role={role} onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      <main className="flex-grow-1 p-3 p-md-4">
        <AdminHeader onToggleSidebar={() => setMobileOpen((prev) => !prev)} />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
