import React from 'react';
import { FaSearch } from 'react-icons/fa';

const MenuSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="input-group mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <span className="input-group-text border-0" style={{ backgroundColor: '#1B1B1B', color: '#C9A227', borderRadius: '25px 0 0 25px' }}>
        <FaSearch />
      </span>
      <input
        type="text"
        className="form-control border-0 shadow-none"
        placeholder="Search for your favorite dish..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ backgroundColor: '#1B1B1B', color: '#FFFFFF', borderRadius: '0 25px 25px 0', fontFamily: '"Poppins", sans-serif' }}
      />
    </div>
  );
};

export default MenuSearch;
