

const GalleryFilters = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="gallery-filters-container mb-5 d-flex justify-content-lg-center">
      <div className="d-flex pb-2 px-3 px-lg-0 w-100 justify-content-start justify-content-lg-center" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GalleryFilters;
