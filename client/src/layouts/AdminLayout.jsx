import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminHeader from '../components/Admin/AdminHeader';
import { Sheet, SheetContent } from '../components/ui/sheet';
import useAuth from '../hooks/useAuth';

const AdminLayout = () => {
  const { role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0 h-full">
        <AdminSidebar role={role} />
      </div>

      {/* Mobile Drawer/Sheet */}
      {mobileOpen && (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <div className="p-0 h-full">
            <AdminSidebar role={role} onNavigate={() => setMobileOpen(false)} />
          </div>
        </Sheet>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminHeader onToggleSidebar={() => setMobileOpen((prev) => !prev)} />
        
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
