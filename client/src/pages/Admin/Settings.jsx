import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { updateUserProfile, changeUserPassword } from '../../services/authService';
import { FaUserEdit, FaLock, FaShieldAlt, FaSignOutAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import MpesaSettings from '../../components/Admin/MpesaSettings';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Form
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');
    }
  }, [currentUser]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg({ type: '', text: '' });

    try {
      await updateUserProfile(displayName, photoURL);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setPasswordSaving(true);
    try {
      await changeUserPassword(currentPassword, newPassword);
      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="container-fluid py-4 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>
          My Settings
        </h2>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#1B1B1B' }}>
            <div className="card-body p-4">
              <h5 className="mb-4 text-gold"><FaUserEdit className="me-2 mb-1" /> Profile Information</h5>
              
              <div className="d-flex align-items-center mb-4 pb-4 border-bottom border-secondary">
                <div 
                  className="rounded-circle bg-dark d-flex align-items-center justify-content-center overflow-hidden border border-warning"
                  style={{ width: '80px', height: '80px' }}
                >
                  {photoURL ? (
                    <img src={photoURL} alt="Avatar" className="w-100 h-100 object-fit-cover" />
                  ) : (
                    <span className="fs-3 fw-bold text-muted">{displayName?.charAt(0)?.toUpperCase() || 'A'}</span>
                  )}
                </div>
                <div className="ms-3">
                  <h5 className="mb-1">{currentUser.displayName || 'Administrator'}</h5>
                  <p className="text-muted mb-0">{currentUser.email}</p>
                </div>
              </div>

              {profileMsg.text && (
                <div className={`alert ${profileMsg.type === 'error' ? 'alert-danger' : 'alert-success'} d-flex align-items-center`}>
                  {profileMsg.type === 'error' ? <FaExclamationCircle className="me-2" /> : <FaCheckCircle className="me-2" />}
                  {profileMsg.text}
                </div>
              )}

              <form onSubmit={handleProfileSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted">Full Name</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Profile Photo URL (Optional)</label>
                  <input
                    type="url"
                    className="form-control bg-dark text-light border-secondary"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted">Email Address</label>
                  <input
                    type="email"
                    className="form-control bg-dark text-muted border-secondary"
                    value={currentUser.email}
                    disabled
                  />
                  <small className="text-muted d-block mt-1">
                    Email address changes require secure re-authentication flows and cannot be changed here directly.
                  </small>
                </div>
                
                <button
                  type="submit"
                  className="btn fw-bold px-4"
                  style={{ backgroundColor: '#C9A227', color: '#111' }}
                  disabled={profileSaving}
                >
                  {profileSaving ? 'Saving...' : 'Update Profile'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Account Security & Password */}
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: '#1B1B1B' }}>
            <div className="card-body p-4">
              <h5 className="mb-4 text-gold"><FaShieldAlt className="me-2 mb-1" /> Account Security</h5>
              
              <div className="d-flex justify-content-between align-items-center p-3 bg-dark rounded mb-2 border border-secondary">
                <div>
                  <h6 className="mb-1">Role</h6>
                  <span className="badge bg-warning text-dark fs-6 rounded-pill text-capitalize">{role || 'Admin'}</span>
                </div>
                <div className="text-end">
                  <h6 className="mb-1">Email Status</h6>
                  {currentUser.emailVerified ? (
                    <span className="text-success"><FaCheckCircle className="me-1" /> Verified</span>
                  ) : (
                    <span className="text-muted">Unverified</span>
                  )}
                </div>
              </div>
              <small className="text-muted">
                Your role determines your access level and cannot be modified from your own profile.
              </small>
            </div>
          </div>

          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#1B1B1B' }}>
            <div className="card-body p-4">
              <h5 className="mb-4 text-gold"><FaLock className="me-2 mb-1" /> Change Password</h5>
              
              {passwordMsg.text && (
                <div className={`alert ${passwordMsg.type === 'error' ? 'alert-danger' : 'alert-success'} d-flex align-items-center`}>
                  {passwordMsg.type === 'error' ? <FaExclamationCircle className="me-2" /> : <FaCheckCircle className="me-2" />}
                  {passwordMsg.text}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted">Current Password</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">New Password</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength="6"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength="6"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn fw-bold px-4 btn-outline-warning"
                  disabled={passwordSaving}
                >
                  {passwordSaving ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>

          {/* Sign Out Action */}
          <div className="mt-4 text-end">
             <button onClick={handleSignOut} className="btn btn-outline-danger px-4 fw-bold">
               <FaSignOutAlt className="me-2 mb-1" /> Sign Out
             </button>
          </div>
        </div>
      </div>

      {/* M-Pesa Settings Section */}
      <div className="row g-4 mt-2">
        <div className="col-12">
          <MpesaSettings />
        </div>
      </div>
    </div>
  );
};

export default Settings;
