import React from 'react';

const MenuFilters = ({ filters, setFilters }) => {
  const handleToggle = (filterName) => {
    setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  return (
    <div className="d-flex flex-wrap gap-3 justify-content-center mb-4">
      <div className="form-check form-switch">
        <input 
          className="form-check-input" 
          type="checkbox" 
          id="spicyFilter" 
          checked={filters.spicy || false} 
          onChange={() => handleToggle('spicy')} 
          style={{ cursor: 'pointer' }}
        />
        <label className="form-check-label text-light" htmlFor="spicyFilter" style={{ fontFamily: '"Poppins", sans-serif', cursor: 'pointer' }}>Spicy</label>
      </div>
    </div>
  );
};

export default MenuFilters;
