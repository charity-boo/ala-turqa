import { useState } from 'react';

const Reservations = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: '', time: '', guests: '2', specialRequest: ''
  });

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      // getDay(): 0 is Sunday
      if (selectedDate.getUTCDay() === 0) {
        setError('We are closed on Sundays. Please select another day.');
        return;
      }
    }

    if (formData.time) {
      if (formData.time < '09:00' || formData.time > '22:30') {
        setError('Reservation time must be between 9:00 AM and 10:30 PM.');
        return;
      }
    }

    setError('');
    alert('Reservation requested! (Mock)');
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    if (error) setError('');
  };

  return (
    <div className="reservations-page pb-5 pt-5 mt-5">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-5 mb-5 mb-lg-0 slide-up">
            <h2 className="text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem' }}>Reserve Your Experience</h2>
            <p className="text-muted mb-4">
              Book a table to enjoy a remarkable dining experience. Whether it is an intimate dinner or a celebration, our atmosphere and culinary delights await you.
            </p>
            <div className="bg-dark-secondary p-4 rounded border border-secondary">
              <h5 className="text-white mb-3">Opening Hours</h5>
              <div className="d-flex justify-content-between text-muted mb-2">
                <span>Monday - Saturday</span>
                <span>9:00 AM - 10:30 PM</span>
              </div>
              <div className="d-flex justify-content-between text-muted">
                <span>Sunday</span>
                <span className="text-danger fw-bold">Closed</span>
              </div>
            </div>
          </div>
          
          <div className="col-lg-7 px-lg-5 slide-up">
            <div className="card card-luxury border-0 bg-dark-secondary p-4 p-md-5">
              <h3 className="text-white mb-4 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>Book A Table</h3>
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" className="form-control bg-dark text-white border-secondary" placeholder="Your Name" name="name" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <input type="email" className="form-control bg-dark text-white border-secondary" placeholder="Email Address" name="email" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <input type="tel" className="form-control bg-dark text-white border-secondary" placeholder="Phone Number" name="phone" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <select className="form-select bg-dark text-white border-secondary" name="guests" onChange={handleChange}>
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5">5+ People</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input type="date" className="form-control bg-dark text-white border-secondary" name="date" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <input type="time" className="form-control bg-dark text-white border-secondary" name="time" min="09:00" max="22:30" onChange={handleChange} required />
                    <small className="text-muted">Hours: 9:00 AM - 10:30 PM</small>
                  </div>
                  <div className="col-12">
                    <textarea className="form-control bg-dark text-white border-secondary" rows="3" placeholder="Special Requests" name="specialRequest" onChange={handleChange}></textarea>
                  </div>
                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-gold w-100 py-3">Confirm Reservation</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
