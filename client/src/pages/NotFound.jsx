import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', backgroundColor: 'var(--primary-color)' }}>
      <div className="text-center slide-up">
        <h1 className="display-1 text-gold fw-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>404</h1>
        <h2 className="text-white mb-4">Page Not Found</h2>
        <p className="text-muted mb-5">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <Link to="/" className="btn btn-gold px-4 py-2">Return to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
