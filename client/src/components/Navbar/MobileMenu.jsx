import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaHistory, FaTimes, FaStar, FaExclamationTriangle, FaInfoCircle, FaChartLine } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const MobileMenu = ({ isOpen, setIsOpen }) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLinkClick = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <div 
        className={`mobile-menu-overlay ${isOpen ? 'show' : ''} mobile-only`}
        onClick={() => setIsOpen(false)}
      ></div>
      
      <div className={`mobile-menu-drawer ${isOpen ? 'show' : ''} mobile-only`}>
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom border-secondary">
          <span className="text-gold fw-bold fs-4" style={{ fontFamily: 'Playfair Display, serif' }}>Ala Turqa</span>
          <button className="hamburger-btn" onClick={() => setIsOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="flex-grow-1 overflow-auto">
          <nav className="d-flex flex-column py-2">
            <NavLink to="/" className="mobile-nav-link" onClick={handleLinkClick}>Home</NavLink>
            <NavLink to="/menu" className="mobile-nav-link" onClick={handleLinkClick}>Menu</NavLink>
            <NavLink to="/reservations" className="mobile-nav-link" onClick={handleLinkClick}>Reservations</NavLink>
            <NavLink to="/contact" className="mobile-nav-link" onClick={handleLinkClick}>Contact</NavLink>
            
            <div className="text-muted small fw-bold px-4 pt-3 pb-1 text-uppercase letter-spacing-1">Experience</div>
            <NavLink to="/reviews" className="mobile-sub-link" onClick={handleLinkClick}>
              <FaStar className="me-2 text-gold" /> Reviews
            </NavLink>
            <NavLink to="/feedback" className="mobile-sub-link" onClick={handleLinkClick}>
              <FaExclamationTriangle className="me-2 text-warning" /> Support / Feedback
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-top border-secondary">


          {currentUser ? (
            <div>
              <div className="d-flex align-items-center mb-3">
                <FaUserCircle className="text-gold fs-2 me-3" />
                <div>
                  <div className="text-light fw-bold">{currentUser.displayName || 'Guest User'}</div>
                  <div className="text-muted small">{currentUser.email}</div>
                </div>
              </div>
              
              <div className="d-flex flex-column gap-2">
                {isAdmin && (
                  <Link to="/admin" className="btn btn-sm btn-outline-gold text-start" onClick={handleLinkClick}>
                    <FaChartLine className="me-2" /> Admin Dashboard
                  </Link>
                )}
                <Link to="/profile" className="btn btn-sm btn-outline-secondary text-start text-light" onClick={handleLinkClick}>
                  <FaUserCircle className="me-2" /> Profile
                </Link>
                <Link to="/orders" className="btn btn-sm btn-outline-secondary text-start text-light" onClick={handleLinkClick}>
                  <FaHistory className="me-2" /> My Orders
                </Link>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-danger text-start">
                  <FaSignOutAlt className="me-2" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline-gold w-100" onClick={handleLinkClick}>
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
