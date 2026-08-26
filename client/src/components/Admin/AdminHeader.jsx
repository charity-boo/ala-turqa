import { useMemo, useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut, User, Shield } from 'lucide-react';
import NotificationBell from './NotificationBell';
import useAuth from '../../hooks/useAuth';
import { getPageTitleByPath, ROLE_LABELS } from '../../utils/adminRoles';

const AdminHeader = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, role, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const title = useMemo(() => getPageTitleByPath(location.pathname), [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-30 mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight font-sans m-0">{title}</h1>
          <p className="text-xs text-neutral-400 m-0">Ala Turqa Operations</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700/60 hover:bg-neutral-800 text-neutral-200 transition text-sm font-medium"
          >
            <div className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">
              {(currentUser?.displayName || currentUser?.email || 'A')[0].toUpperCase()}
            </div>
            <span className="hidden sm:inline max-w-[140px] truncate">
              {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Admin'}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-neutral-800">
                <p className="font-semibold text-white truncate m-0">
                  {currentUser?.displayName || 'Admin User'}
                </p>
                <p className="text-xs text-neutral-400 truncate m-0">{currentUser?.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gold/10 border border-gold/20 text-[11px] font-semibold text-gold">
                  <Shield className="w-3 h-3" />
                  {ROLE_LABELS[role] || 'Staff'}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/admin/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white flex items-center gap-2 transition"
                >
                  <User className="w-4 h-4 text-neutral-400" />
                  Account Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-950/40 hover:text-red-300 flex items-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
