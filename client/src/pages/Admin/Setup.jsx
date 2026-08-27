import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const Setup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if setup is already done
    fetch(`${API_BASE_URL}/admin/has-setup`)
      .then(res => res.json())
      .then(data => {
        if (data.hasSetup) {
          navigate('/admin/login', { replace: true });
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        setError('Failed to connect to the server.');
        setLoading(false);
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/admin/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Setup failed');
      }
      
      setSuccess('Admin account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/admin/login', { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-light">
        <h4>Checking system setup...</h4>
      </div>
    );
  }

  return (
    <div className="container py-5 text-light" style={{ minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card border-0 shadow-lg" style={{ backgroundColor: '#1B1B1B' }}>
            <div className="card-body p-5">
              <h3 className="text-gold mb-3 text-center" style={{ color: '#C9A227' }}>Initial Setup</h3>
              <p className="text-muted mb-4 text-center">Create the first Owner account to gain access to the Admin Dashboard.</p>
              
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-light border-secondary"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control bg-dark text-light border-secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-100 fw-bold"
                  style={{ backgroundColor: '#C9A227', color: '#111111' }}
                  disabled={submitting}
                >
                  {submitting ? 'Creating Account...' : 'Complete Setup'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;
