import { useState } from 'react';
import { addFeedback } from '../../services/feedbackService';

const FeedbackForm = ({ onFeedbackAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'Feedback',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      setError('Name and Message are required fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const newFeedback = await addFeedback(formData);
      if (onFeedbackAdded) onFeedbackAdded(newFeedback);
      setSuccess(true);
      setFormData({ name: '', phone: '', type: 'Feedback', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-luxury p-4">
      <h4 className="text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Submit Feedback or Complaint</h4>
      
      {error && <div className="alert alert-danger p-2">{error}</div>}
      {success && <div className="alert alert-success p-2">Thank you! Your submission has been received.</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label text-light">Full Name *</label>
            <input 
              type="text" 
              className="form-control bg-dark text-light border-secondary" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-light">Phone Number</label>
            <input 
              type="tel" 
              className="form-control bg-dark text-light border-secondary" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div className="col-12">
            <label className="form-label text-light">Type of Submission</label>
            <select 
              className="form-select bg-dark text-light border-secondary"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Feedback">Feedback</option>
              <option value="Suggestion">Suggestion</option>
              <option value="Complaint">Complaint</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label text-light">Your Message *</label>
            <textarea 
              className="form-control bg-dark text-light border-secondary" 
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your experience..."
              style={{ resize: 'none' }}
            ></textarea>
          </div>
        </div>
        <div className="mt-4">
          <button 
            type="submit" 
            className="btn btn-gold w-100"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
