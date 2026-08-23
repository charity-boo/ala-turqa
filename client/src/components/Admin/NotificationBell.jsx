import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notificationService';
import { FaBell, FaCircle, FaCheckDouble } from 'react-icons/fa';

// Simple timeAgo formatter since we don't have date-fns
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

  // Close dropdown on outside click
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
    <div className="position-relative" ref={dropdownRef}>
      <button 
        className="btn btn-link text-white position-relative p-2" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ textDecoration: 'none' }}
      >
        <FaBell size={24} style={{ color: '#C9A227' }} />
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.75rem' }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="dropdown-menu dropdown-menu-end show shadow-lg mt-2 p-0" 
          style={{ 
            position: 'absolute', 
            right: 0, 
            minWidth: '320px', 
            maxHeight: '400px',
            backgroundColor: '#1B1B1B', 
            border: '1px solid #333',
            zIndex: 1050,
            overflowY: 'auto'
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary sticky-top" style={{ backgroundColor: '#1B1B1B' }}>
            <h6 className="mb-0 text-white fw-bold">Notifications</h6>
            {unreadCount > 0 && (
              <button 
                className="btn btn-sm btn-link text-gold p-0 text-decoration-none" 
                style={{ color: '#C9A227', fontSize: '0.85rem' }}
                onClick={handleMarkAllAsRead}
              >
                <FaCheckDouble className="me-1" />
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="list-group list-group-flush">
            {notifications.length === 0 ? (
              <div className="text-center p-4 text-muted">
                No new notifications
              </div>
            ) : (
              notifications.map(notif => (
                <button
                  key={notif.id}
                  className="list-group-item list-group-item-action border-bottom border-secondary p-3 text-start"
                  style={{ 
                    backgroundColor: notif.isRead ? '#1B1B1B' : '#2a2a2a',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="d-flex w-100 justify-content-between align-items-start mb-1">
                    <h6 className="mb-0 text-white" style={{ fontWeight: notif.isRead ? 'normal' : 'bold' }}>
                      {!notif.isRead && <FaCircle className="text-gold me-2 mb-1" style={{ fontSize: '8px', color: '#C9A227' }} />}
                      {notif.title}
                    </h6>
                    <small className="text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                      {timeAgo(notif.createdAt)}
                    </small>
                  </div>
                  <p className="mb-0 text-light" style={{ fontSize: '0.85rem', paddingLeft: notif.isRead ? '0' : '16px' }}>
                    {notif.message}
                  </p>
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
