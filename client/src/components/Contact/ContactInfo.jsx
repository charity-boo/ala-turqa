import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactInfo = () => {
  return (
    <div className="card-luxury p-4 h-100 slide-up">
      <h3 className="text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Get In Touch</h3>
      
      <div className="d-flex align-items-start mb-4">
        <div className="text-gold fs-4 me-3 mt-1"><FaMapMarkerAlt /></div>
        <div>
          <h6 className="text-white mb-1">Address</h6>
          <p className="text-muted mb-0">Safari Park Business Arcade<br />Thika Road, Nairobi, Kenya</p>
        </div>
      </div>

      <div className="d-flex align-items-start mb-4">
        <div className="text-gold fs-4 me-3 mt-1"><FaPhoneAlt /></div>
        <div>
          <h6 className="text-white mb-1">Phone Number</h6>
          <p className="text-muted mb-0">+254 700 000 000<br />+254 711 111 111</p>
        </div>
      </div>

      <div className="d-flex align-items-start mb-4">
        <div className="text-gold fs-4 me-3 mt-1"><FaEnvelope /></div>
        <div>
          <h6 className="text-white mb-1">Email Address</h6>
          <p className="text-muted mb-0">info@alaturqa.co.ke</p>
        </div>
      </div>

      <div className="d-flex align-items-start border-top border-secondary pt-4 mt-2">
        <div className="text-gold fs-4 me-3 mt-1"><FaClock /></div>
        <div>
          <h6 className="text-white mb-1">Opening Hours</h6>
          <p className="text-muted mb-1"><strong>Mon - Sat:</strong> 9:00 AM - 10:30 PM</p>
          <p className="text-muted mb-0"><strong>Sunday:</strong> Closed</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
