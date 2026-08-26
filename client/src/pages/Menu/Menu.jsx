import React, { useState, useEffect } from 'react';
import MenuSearch from '../../components/Menu/MenuSearch';
import CategoryTabs from '../../components/Menu/CategoryTabs';
import MenuFilters from '../../components/Menu/MenuFilters';
import MenuCard from '../../components/Menu/MenuCard';
import { getAllMenuItems } from '../../services/menuService';
import { getCategories } from '../../services/categoryService';
import { FaDatabase } from 'react-icons/fa';


const Menu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filters, setFilters] = useState({
    spicy: false
  });

  useEffect(() => {

    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [data, catData] = await Promise.all([
        getAllMenuItems(),
        getCategories()
      ]);
      setItems(data);
      setCategories(catData.filter(c => c.isActive).map(c => c.name));
    } catch (error) {
      console.error("Failed to fetch menu items", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const trimmedTerm = (searchTerm || '').trim().toLowerCase();

    // Search match (name, title, description, category)
    if (trimmedTerm) {
      const name = (item.name || item.title || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      
      const matchSearch = name.includes(trimmedTerm) || desc.includes(trimmedTerm) || cat.includes(trimmedTerm);
      if (!matchSearch) return false;
    }

    // Category match
    if (activeCategory !== 'All') {
      const itemCat = (item.category || '').toLowerCase();
      if (itemCat !== activeCategory.toLowerCase()) {
        return false;
      }
    }

    // Filters match
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
        </div>
        
        <MenuSearch 
          searchTerm={searchTerm} 
          setSearchTerm={(term) => {
            setSearchTerm(term);
            if (term && activeCategory !== 'All') {
              setActiveCategory('All');
            }
          }} 
        />

        <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} categories={categories} />
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
