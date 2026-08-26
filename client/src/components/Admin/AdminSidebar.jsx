import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  FolderKanban, 
  Bell, 
  Settings, 
  Users, 
  UserCheck, 
  Truck, 
  CreditCard, 
  BarChart3, 
  MessageSquareText, 
  Star 
} from 'lucide-react';
import { ADMIN_NAV_ITEMS } from '../../utils/adminRoles';

const navIconMap = {
  dashboard: LayoutDashboard,
  orders: ShoppingBag,
  menu: UtensilsCrossed,
  categories: FolderKanban,
  customers: Users,
  staff: UserCheck,
  deliveries: Truck,
  payments: CreditCard,
  notifications: Bell,
  reports: BarChart3,
  settings: Settings,
  feedback: MessageSquareText,
  reviews: Star,
};

const AdminSidebar = ({ role, onNavigate }) => {
  const allowedItems = ADMIN_NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 h-full bg-neutral-900 border-r border-neutral-800 flex flex-col p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-neutral-800">
        <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold text-lg">
          AT
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-wide font-sans m-0">Ala Turqa</h2>
          <p className="text-xs text-neutral-400 font-medium m-0">Admin Portal</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {allowedItems.map((item) => {
          const Icon = navIconMap[item.key] || LayoutDashboard;

          return (
            <NavLink
              key={item.key}
              to={item.path}
              onClick={onNavigate}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gold text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer Info */}
      <div className="pt-4 border-t border-neutral-800 text-center">
        <p className="text-[11px] text-neutral-500 font-medium m-0">Ala Turqa Admin v2.0</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
