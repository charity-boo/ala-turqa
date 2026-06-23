import React from 'react';
import { FaUtensils, FaRedo } from 'react-icons/fa';

const EmptyState = ({ onReset }) => {
  return (
    <div className="text-center py-5 my-5 slide-up">
      <div className="mb-4 opacity-50" style={{ color: '#C9A227' }}>
        <FaUtensils size={64} />
      </div>
      <h3 className="text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>No menu items found</h3>
      <p className="text-muted mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
        We couldn't find any dishes matching your current search and filter criteria.
      </p>
      <button 
        className="btn rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2"
        onClick={onReset}
        style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: 'transparent', color: '#C9A227', border: '1px solid #C9A227', transition: 'all 0.3s ease' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(201, 162, 39, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <FaRedo /> Reset Filters
      </button>
    </div>
  );
};

export default EmptyState;
