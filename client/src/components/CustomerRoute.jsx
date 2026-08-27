import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FaSpinner } from 'react-icons/fa';

const CustomerRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center text-gold py-5" style={{ minHeight: '60vh', color: '#C9A227' }}>
        <FaSpinner className="fa-spin fs-1 me-3" />
        <span className="fs-5 fw-bold">Loading account details...</span>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default CustomerRoute;
