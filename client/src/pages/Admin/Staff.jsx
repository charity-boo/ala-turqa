import React, { useState, useEffect } from 'react';
import { getStaffMembers, createStaffMember } from '../../services/adminService';
import { FaUserPlus, FaUsers, FaSpinner, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: ''
  });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await getStaffMembers();
      setStaff(data);
    } catch (err) {
      setError('Failed to load staff members: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    try {
      await createStaffMember(formData);
      setSuccess('Staff member created successfully!');
      setFormData({ displayName: '', email: '', password: '' });
      fetchStaff(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-4 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>
          <FaShieldAlt className="me-2 mb-1" /> Staff Management
        </h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-4">
        {/* Create Staff Form */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#1B1B1B' }}>
            <div className="card-body p-4">
              <h5 className="mb-4" style={{ color: '#C9A227' }}><FaUserPlus className="me-2" /> Add New Staff</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control bg-dark text-light border-secondary" 
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control bg-dark text-light border-secondary" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control bg-dark text-light border-secondary" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="6"
                    required 
                  />
                  <small className="text-muted">Minimum 6 characters</small>
                </div>
                <button 
                  type="submit" 
                  className="btn w-100 fw-bold" 
                  style={{ backgroundColor: '#C9A227', color: '#111' }}
                  disabled={submitting}
                >
                  {submitting ? <FaSpinner className="fa-spin" /> : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Staff List */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#1B1B1B' }}>
            <div className="card-body p-4">
              <h5 className="mb-4" style={{ color: '#C9A227' }}><FaUsers className="me-2" /> Current Staff Members</h5>
              
              {loading ? (
                <div className="text-center py-5">
                  <FaSpinner className="fa-spin fs-2 text-warning" />
                </div>
              ) : staff.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  No staff members found.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staff.map(user => (
                        <tr key={user.id}>
                          <td className="fw-bold">{user.displayName}</td>
                          <td><FaEnvelope className="me-2 text-muted" />{user.email}</td>
                          <td><span className="badge bg-warning text-dark px-3 py-2 rounded-pill">Admin</span></td>
                          <td className="text-muted">
                            {user.createdAt ? new Date(user.createdAt._seconds * 1000 || user.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
