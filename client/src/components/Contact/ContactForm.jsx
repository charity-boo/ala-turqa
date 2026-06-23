import { useState } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', contactInfo: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contactInfo || !formData.message) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      setStatus('success');
      setFormData({ name: '', contactInfo: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-luxury p-4 h-100 slide-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Send a Message</h3>
      <p className="text-muted small mb-4">For immediate assistance, please use the Call or WhatsApp buttons above. For other inquiries, drop us a message here.</p>
      
      {status === 'success' && (
        <div className="alert alert-success bg-dark text-success border-success p-2 small mb-4">
          Message sent successfully! We will get back to you shortly.
        </div>
      )}
      {status === 'error' && (
        <div className="alert alert-danger p-2 small mb-4">
          Failed to send message. Please try again or call us.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-light small">Your Name *</label>
          <input 
            type="text" 
            className="form-control bg-dark text-light border-secondary" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <label className="form-label text-light small">Email or Phone *</label>
          <input 
            type="text" 
            className="form-control bg-dark text-light border-secondary" 
            required 
            value={formData.contactInfo}
            onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
          />
        </div>
        <div className="mb-4">
          <label className="form-label text-light small">Message *</label>
          <textarea 
            className="form-control bg-dark text-light border-secondary" 
            rows="4" 
            required
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-gold w-100 py-2" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
