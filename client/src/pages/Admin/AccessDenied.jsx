import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="container py-5 text-center text-light" style={{ minHeight: '100vh' }}>
      <h2 className="text-gold mb-3">Access Denied</h2>
      <p className="text-muted mb-4">Your account does not have permission to access this admin page.</p>
      <Link className="btn btn-outline-gold" to="/">
        Back to website
      </Link>
    </div>
  );
};

export default AccessDenied;
