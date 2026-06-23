import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FaBars, FaChevronDown, FaStar, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import CartBadge from './CartBadge';
import UserDropdown from './UserDropdown';
import MobileMenu from './MobileMenu';
import './Navbar.css';

const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileOpen]);

  // Temporary mock cart count. Should use CartContext.
  const cartCount = 0;

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top luxury-navbar">
        <div className="container h-100 d-flex align-items-center justify-content-between">
          
          {/* LEFT: Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img 
              src="/logo.png" 
              alt="Ala Turqa Logo" 
              style={{ height: '40px', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="text-gold fw-bold fs-4 ms-2" style={{ fontFamily: 'Playfair Display, serif', display: 'none' }}>
              Ala Turqa
            </span>
          </Link>

          {/* CENTER: Primary Links (Desktop) */}
          <div className="d-none d-lg-flex align-items-center justify-content-end flex-grow-1 pe-4">
            <NavLink to="/" className="luxury-nav-link">Home</NavLink>
            <NavLink to="/about" className="luxury-nav-link">About</NavLink>
            <NavLink to="/menu" className="luxury-nav-link">Menu</NavLink>
            <NavLink to="/gallery" className="luxury-nav-link">Gallery</NavLink>
            <NavLink to="/reservations" className="luxury-nav-link">Reservations</NavLink>
            <NavLink to="/contact" className="luxury-nav-link">Contact</NavLink>

            {/* Experience Dropdown */}
            <div className="nav-dropdown ms-2">
              <button className="luxury-nav-link bg-transparent border-0 d-flex align-items-center gap-1">
                Experience <FaChevronDown size={10} className="mt-1" />
              </button>
              <div className="nav-dropdown-menu">
                <Link to="/reviews" className="dropdown-item">
                  <FaStar className="text-gold" /> Reviews
                </Link>
                <Link to="/feedback" className="dropdown-item">
                  <FaExclamationTriangle className="text-warning" /> Support
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: Cart, Auth, CTA */}
          <div className="d-flex align-items-center gap-2">
            <CartBadge count={cartCount} />
            
            <div className="d-none d-lg-block">
              <UserDropdown />
            </div>



            {/* Hamburger (Mobile) */}
            <button 
              className="hamburger-btn ms-2 d-lg-none"
              onClick={() => setIsMobileOpen(true)}
            >
              <FaBars />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <MobileMenu isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />
    </>
  );
};

export default Navbar;
