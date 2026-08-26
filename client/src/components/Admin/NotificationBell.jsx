import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notificationService';
import { Bell, CheckCheck, Clock, CircleAlert } from 'lucide-react';

const timeAgo = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToNotifications((notifs) => {
      setNotifications(notifs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);
    }
    setIsOpen(false);
    navigate('/admin/orders', { state: { orderId: notification.orderId } });
  };

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    await markAllNotificationsAsRead(notifications);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gold" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white m-0">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-xs font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-gold hover:text-gold-light font-medium flex items-center gap-1 transition"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>
          
          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-neutral-800/60">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-neutral-400 text-sm">
                <CircleAlert className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                No notifications right now
              </div>
            ) : (
              notifications.map(notif => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full text-left p-3.5 transition flex items-start gap-3 hover:bg-neutral-800/60 ${
                    notif.isRead ? 'bg-neutral-900/50 opacity-70' : 'bg-neutral-800/30'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.isRead ? 'bg-transparent' : 'bg-gold'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-semibold text-neutral-100 truncate m-0">{notif.title}</p>
                      <span className="text-[10px] text-neutral-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-2 m-0">{notif.message}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
