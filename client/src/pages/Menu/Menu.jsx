import React, { useState, useEffect } from 'react';
import MenuSearch from '../../components/Menu/MenuSearch';
import CategoryTabs from '../../components/Menu/CategoryTabs';
import MenuFilters from '../../components/Menu/MenuFilters';
import MenuCard from '../../components/Menu/MenuCard';
import { getAllMenuItems } from '../../services/menuService';
import { seedMenuDatabase } from '../../utils/seedData';
import { FaDatabase } from 'react-icons/fa';


const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filters, setFilters] = useState({
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false
  });
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {

    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getAllMenuItems();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch menu items", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (window.confirm("Are you sure you want to seed the database?")) {
      setIsSeeding(true);
      const result = await seedMenuDatabase();
      setIsSeeding(false);
      if (result.success) {
        alert("Database seeded successfully!");
        fetchItems(); // refresh the list
      } else {
        alert("Failed to seed database.");
      }
    }
  };

  const filteredItems = items.filter(item => {

    // Category match
    if (activeCategory !== 'All' && item.category !== activeCategory) {
      return false;
    }
    // Search match
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      const matchName = item.name.toLowerCase().includes(lowerTerm);
      const matchDesc = item.description && item.description.toLowerCase().includes(lowerTerm);
      if (!matchName && !matchDesc) return false;
    }
    // Filters match
    if (filters.featured && !item.featured) return false;
    if (filters.popular && !item.popular) return false;
    if (filters.vegetarian && !item.vegetarian) return false;
    if (filters.spicy && !item.spicy) return false;

    return true;
  });

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', paddingTop: '80px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="d-flex justify-content-center align-items-center mb-5 position-relative">
          <h1 className="text-center mb-0" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227', fontWeight: 'bold' }}>
            Our Menu
          </h1>
          {items.length === 0 && (
            <button 
              className="btn btn-outline-warning position-absolute end-0"
              onClick={handleSeed}
              disabled={isSeeding}
            >
              <FaDatabase className="me-2" /> {isSeeding ? 'Seeding...' : 'DEV: Seed Database'}
            </button>
          )}
        </div>
        
        <MenuSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <MenuFilters filters={filters} setFilters={setFilters} />

        {loading ? (
          <div className="text-center text-light mt-5">
            <div className="spinner-border" style={{ color: '#C9A227' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4 mt-2">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div key={item.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <MenuCard item={item} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center text-light mt-5">
                <h3 style={{ fontFamily: '"Playfair Display", serif' }}>No dishes found</h3>
                <p className="text-muted" style={{ fontFamily: '"Poppins", sans-serif' }}>Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
