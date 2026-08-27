import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { fetchUserProfile, saveUserProfile } from '../../services/userService';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHistory, FaCheckCircle, FaSpinner, FaUtensils, FaKey } from 'react-icons/fa';

const Profile = () => {
  const { currentUser, updateUserProfile, changeUserPassword } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    landmark: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (currentUser?.uid) {
        setLoading(true);
        const profile = await fetchUserProfile(currentUser.uid);
        setFormData({
          displayName: profile?.displayName || currentUser.displayName || '',
          email: currentUser.email || '',
          phone: profile?.phone || currentUser.phoneNumber || '',
          landmark: profile?.landmark || ''
        });
        setLoading(false);
      }
    };
    loadProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // 1. Update Firebase Auth display name if changed
      if (formData.displayName !== currentUser.displayName) {
        await updateUserProfile(formData.displayName);
      }

      // 2. Save in Firestore
      await saveUserProfile(currentUser.uid, {
        displayName: formData.displayName,
        phone: formData.phone,
        landmark: formData.landmark,
        email: currentUser.email
      });

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setUpdatingPassword(true);
    try {
      await changeUserPassword(currentPassword, newPassword);
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password. Make sure current password is correct.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-gold" style={{ minHeight: '60vh', color: '#C9A227' }}>
        <FaSpinner className="fa-spin fs-1 mb-3" />
        <h4>Loading profile...</h4>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-4 text-light" style={{ minHeight: '80vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          
          {/* Header */}
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 border-bottom border-secondary pb-3">
            <div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227', fontWeight: 'bold' }}>
                My Account Profile
              </h2>
              <p className="text-muted mb-0">Manage your personal information and delivery preferences.</p>
            </div>
            
            <div className="d-flex gap-2 mt-3 mt-md-0">
              <Link to="/orders" className="btn btn-outline-warning d-inline-flex align-items-center gap-2" style={{ color: '#C9A227', borderColor: '#C9A227' }}>
                <FaHistory /> My Orders
              </Link>
              <Link to="/menu" className="btn btn-warning d-inline-flex align-items-center gap-2" style={{ backgroundColor: '#C9A227', color: '#111', fontWeight: 'bold' }}>
                <FaUtensils /> Order Food
              </Link>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success d-flex align-items-center gap-2"><FaCheckCircle /> {success}</div>}

          {/* Profile Card */}
          <div className="card border-0 shadow-lg" style={{ backgroundColor: '#1B1B1B', borderRadius: '12px' }}>
            <div className="card-body p-4 p-md-5">
              
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  
                  {/* Full Name */}
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-bold">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-gold" style={{ color: '#C9A227' }}><FaUser /></span>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary p-3"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Email (Read only) */}
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-bold">Email Address (Account ID)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-muted"><FaEnvelope /></span>
                      <input
                        type="email"
                        className="form-control bg-dark text-muted border-secondary p-3"
                        value={formData.email}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-bold">Default Phone Number (for M-Pesa & Delivery)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-gold" style={{ color: '#C9A227' }}><FaPhone /></span>
                      <input
                        type="tel"
                        className="form-control bg-dark text-light border-secondary p-3"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 0712345678"
                      />
                    </div>
                  </div>

                  {/* Default Delivery Landmark */}
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-bold">Default Delivery Landmark / Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-gold" style={{ color: '#C9A227' }}><FaMapMarkerAlt /></span>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary p-3"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        placeholder="e.g. Westlands, ABC Place"
                      />
                    </div>
                  </div>

                </div>

                <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between mt-5 gap-3 pt-3 border-top border-secondary">
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    <FaKey /> Change Password
                  </button>

                  <button
                    type="submit"
                    className="btn py-3 px-5 fw-bold"
                    style={{ backgroundColor: '#C9A227', color: '#111111', borderRadius: '8px' }}
                    disabled={saving}
                  >
                    {saving ? 'Saving Changes...' : 'Save Profile Updates'}
                  </button>
                </div>
              </form>

            </div>
          </div>

        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 text-light" style={{ backgroundColor: '#1B1B1B' }}>
              <div className="modal-header border-secondary">
                <h5 className="modal-title" style={{ color: '#C9A227' }}>Change Password</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPasswordModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                {passwordError && <div className="alert alert-danger">{passwordError}</div>}
                {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control bg-dark text-light border-secondary"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control bg-dark text-light border-secondary"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                    <button type="submit" className="btn fw-bold" style={{ backgroundColor: '#C9A227', color: '#111' }} disabled={updatingPassword}>
                      {updatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
