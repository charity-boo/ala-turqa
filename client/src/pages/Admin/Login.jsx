import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const Login = () => {
  const { login, currentUser, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/has-setup`)
      .then(res => res.json())
      .then(data => {
        if (!data.hasSetup) {
          navigate('/admin/setup', { replace: true });
        } else {
          setCheckingSetup(false);
        }
      })
      .catch(err => {
        console.error('Failed to check setup:', err);
        setCheckingSetup(false);
      });
  }, [navigate]);

  useEffect(() => {
    if (!loading && currentUser && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [loading, currentUser, isAdmin, navigate]);

  if (checkingSetup || (loading && !currentUser)) {
    return <div className="container py-5 text-center text-light">Loading...</div>;
  }

  if (!loading && currentUser && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      const redirectTo = location.state?.from || '/admin';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to login. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5 text-light" style={{ minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card border-0" style={{ backgroundColor: '#1B1B1B' }}>
            <div className="card-body p-4">
              <h3 className="text-gold mb-3">Admin Login</h3>
              <p className="text-muted mb-4">Sign in with your staff account.</p>
              {error ? <div className="alert alert-danger">{error}</div> : null}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control bg-dark text-light border-secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control bg-dark text-light border-secondary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  className="btn w-100 fw-bold mt-2"
                  style={{ backgroundColor: '#C9A227', color: '#111111' }}
                  disabled={submitting}
                >
                  {submitting ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
