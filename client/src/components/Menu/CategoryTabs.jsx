import React from 'react';
import { MENU_CATEGORIES } from '../../utils/constants';

const CategoryTabs = ({ activeCategory, setActiveCategory, categories = [] }) => {
  const displayCategories = categories.length > 0 ? categories : MENU_CATEGORIES;

  return (
    <div className="category-tabs-container mb-4" style={{ overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '10px' }}>
      <div className="d-flex gap-2">
        <button
          className={`btn ${activeCategory === 'All' ? 'active' : ''}`}
          style={{
            backgroundColor: activeCategory === 'All' ? '#C9A227' : 'transparent',
            color: activeCategory === 'All' ? '#111111' : '#FFFFFF',
            border: `1px solid ${activeCategory === 'All' ? '#C9A227' : '#555'}`,
            borderRadius: '25px',
            padding: '8px 20px',
            fontFamily: '"Poppins", sans-serif',
            transition: 'all 0.3s'
          }}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {displayCategories.map((category) => (
          <button
            key={category}
            className={`btn ${activeCategory === category ? 'active' : ''}`}
            style={{
              backgroundColor: activeCategory === category ? '#C9A227' : 'transparent',
              color: activeCategory === category ? '#111111' : '#FFFFFF',
              border: `1px solid ${activeCategory === category ? '#C9A227' : '#555'}`,
              borderRadius: '25px',
              padding: '8px 20px',
              fontFamily: '"Poppins", sans-serif',
              transition: 'all 0.3s'
            }}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
