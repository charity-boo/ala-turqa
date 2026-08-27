import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { saveUserProfile, fetchUserProfile } from '../../services/userService';
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaPhone, FaArrowRight, FaShieldAlt } from 'react-icons/fa';

const CustomerAuth = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const { login, register, googleLogin, currentUser, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const redirectPath = location.state?.from || '/profile';

  useEffect(() => {
    if (!loading && currentUser) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirectPath, { replace: true });
      }
    }
  }, [currentUser, isAdmin, loading, navigate, redirectPath]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const user = await login(loginEmail, loginPassword);
      // Ensure Firestore user document exists/updates
      const existingProfile = await fetchUserProfile(user.uid);
      if (!existingProfile) {
        await saveUserProfile(user.uid, {
          displayName: user.displayName || user.email.split('@')[0],
          email: user.email,
          role: 'customer'
        });
      }
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const user = await register(regEmail, regPassword);
      await saveUserProfile(user.uid, {
        displayName: regName || regEmail.split('@')[0],
        email: regEmail,
        phone: regPhone || '',
        role: 'customer',
        createdAt: new Date().toISOString()
      });
      setSuccessMsg('Account created successfully! Welcome to Ala Turqa.');
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSubmitting(true);
    try {
      const user = await googleLogin();
      const existingProfile = await fetchUserProfile(user.uid);
      if (!existingProfile) {
        await saveUserProfile(user.uid, {
          displayName: user.displayName || user.email.split('@')[0],
          email: user.email,
          phone: user.phoneNumber || '',
          photoURL: user.photoURL || '',
          role: 'customer',
          createdAt: new Date().toISOString()
        });
      }
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-gold" style={{ minHeight: '60vh', color: '#C9A227' }}>
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-4 text-light" style={{ minHeight: '80vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          
          <div className="text-center mb-4">
            <h2 style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227', fontWeight: '700' }}>
              Welcome to A La Turqa
            </h2>
            <p className="text-muted">Sign in or create an account to manage your profile and orders.</p>
          </div>

          <div className="card border-0 shadow-lg" style={{ backgroundColor: '#1B1B1B', borderRadius: '16px', overflow: 'hidden' }}>
            
            {/* Tabs */}
            <div className="d-flex border-bottom border-secondary" style={{ backgroundColor: '#141414' }}>
              <button
                className={`btn flex-fill py-3 fw-bold rounded-0 text-uppercase letter-spacing-1 ${activeTab === 'login' ? 'border-bottom border-3 border-warning text-gold' : 'text-muted'}`}
                style={{ color: activeTab === 'login' ? '#C9A227' : '#888', backgroundColor: 'transparent', fontSize: '0.9rem' }}
                onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); }}
              >
                Sign In
              </button>
              <button
                className={`btn flex-fill py-3 fw-bold rounded-0 text-uppercase letter-spacing-1 ${activeTab === 'register' ? 'border-bottom border-3 border-warning text-gold' : 'text-muted'}`}
                style={{ color: activeTab === 'register' ? '#C9A227' : '#888', backgroundColor: 'transparent', fontSize: '0.9rem' }}
                onClick={() => { setActiveTab('register'); setError(''); setSuccessMsg(''); }}
              >
                Create Account
              </button>
            </div>

            <div className="card-body p-4 p-md-5">
              
              {error && <div className="alert alert-danger mb-4 text-center">{error}</div>}
              {successMsg && <div className="alert alert-success mb-4 text-center">{successMsg}</div>}

              {/* Google Sign In Button */}
              <button
                type="button"
                className="btn w-100 py-3 mb-4 d-flex align-items-center justify-content-center gap-2 fw-bold text-light"
                style={{ backgroundColor: '#2A2A2A', border: '1px solid #444', borderRadius: '8px', transition: 'all 0.2s ease' }}
                onClick={handleGoogleSignIn}
                disabled={submitting}
              >
                <FaGoogle style={{ color: '#EA4335' }} /> Continue with Google
              </button>

              <div className="d-flex align-items-center mb-4">
                <hr className="flex-grow-1 border-secondary" />
                <span className="px-3 text-muted small text-uppercase">or email</span>
                <hr className="flex-grow-1 border-secondary" />
              </div>

              {/* LOGIN FORM */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-gold" style={{ color: '#C9A227' }}><FaEnvelope /></span>
                      <input
                        type="email"
                        className="form-control bg-dark text-light border-secondary p-3"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-gold" style={{ color: '#C9A227' }}><FaLock /></span>
                      <input
                        type="password"
                        className="form-control bg-dark text-light border-secondary p-3"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: '#C9A227', color: '#111111', borderRadius: '8px', fontSize: '1rem' }}
                    disabled={submitting}
                  >
                    {submitting ? 'Signing in...' : <>Sign In <FaArrowRight /></>}
                  </button>
                </form>
              )}

              {/* REGISTER FORM */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Full Name *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-gold" style={{ color: '#C9A227' }}><FaUser /></span>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary p-3"
                        placeholder="John Doe"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Email Address *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-gold" style={{ color: '#C9A227' }}><FaEnvelope /></span>
                      <input
                        type="email"
                        className="form-control bg-dark text-light border-secondary p-3"
                        placeholder="your@email.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Phone Number (Optional)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-gold" style={{ color: '#C9A227' }}><FaPhone /></span>
                      <input
                        type="tel"
                        className="form-control bg-dark text-light border-secondary p-3"
                        placeholder="0712345678"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold">Password *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-gold" style={{ color: '#C9A227' }}><FaLock /></span>
                      <input
                        type="password"
                        className="form-control bg-dark text-light border-secondary p-3"
                        placeholder="Minimum 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        minLength={6}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: '#C9A227', color: '#111111', borderRadius: '8px', fontSize: '1rem' }}
                    disabled={submitting}
                  >
                    {submitting ? 'Creating Account...' : <>Register Account <FaArrowRight /></>}
                  </button>
                </form>
              )}

            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/admin/login" className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1">
              <FaShieldAlt style={{ color: '#C9A227' }} /> Staff Member? Sign in to Admin Portal
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerAuth;
