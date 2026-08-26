import { Link } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer id="contact" className="bg-dark-secondary text-white pt-5 pb-4 mt-auto border-top" style={{ borderColor: 'rgba(201, 162, 39, 0.2)' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h3 className="text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>A La Turqa</h3>
            <p className="text-muted">Experience the authentic taste of Turkey. Our chefs bring centuries of culinary tradition to your table, prepared with the finest ingredients and boundless passion.</p>
            <div className="mt-4">
              <a href="https://www.instagram.com/a_la_turqa_?igsi=MXF2NW95bHNiaW95Mw==" target="_blank" rel="noopener noreferrer" className="text-gold me-3 fs-5"><FaInstagram /></a>
              <a href="https://www.tiktok.com/@a.la.turqa?_r=1&_t=ZS-997T4mCG896" target="_blank" rel="noopener noreferrer" className="text-gold fs-5"><FaTiktok /></a>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <h5 className="text-gold mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/menu" className="text-muted text-decoration-none hover-gold">Our Menu</Link></li>
              <li className="mb-2"><Link to="/reservations" className="text-muted text-decoration-none hover-gold">Book a Table</Link></li>
              <li className="mb-2"><Link to="/reviews" className="text-muted text-decoration-none hover-gold">Guest Reviews</Link></li>
              <li className="mb-2"><Link to="/feedback" className="text-muted text-decoration-none hover-gold">Feedback & Contact</Link></li>
            </ul>
          </div>
          
          <div className="col-md-4 mb-4">
            <h5 className="text-gold mb-4">Contact Info</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-3 d-flex align-items-center">
                <FaMapMarkerAlt className="text-gold me-3 fs-5" />
                <span>Safari Business Arcade</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhoneAlt className="text-gold me-3 fs-5" />
                <span>0140628102</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaEnvelope className="text-gold me-3 fs-5" />
                <span>info@alaturqa.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="row mt-4 pt-4 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="col-md-6 text-center text-md-start">
            <p className="text-muted mb-0">&copy; {new Date().getFullYear()} A La Turqa. All Rights Reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <Link to="/privacy" className="text-muted text-decoration-none me-3">Privacy Policy</Link>
            <Link to="/terms" className="text-muted text-decoration-none">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
