import React, { useState, useEffect } from 'react';
import { getAllMenuItems, deleteMenuItem, updateMenuItem } from '../../services/menuService';
import { getCategories } from '../../services/categoryService';
import AddMenuItemModal from './AddMenuItemModal';
import EditMenuItemModal from './EditMenuItemModal';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaDatabase } from 'react-icons/fa';
import { seedMenuDatabase } from '../../utils/seedData';
import { formatPrice } from '../../utils/priceFormatter';

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);

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
      // Filter out derived/inactive categories if we only want active ones, or just show all
      setCategories(catData.filter(c => c.isActive).map(c => c.name));
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this item? Consider toggling Availability instead to retain it for records.")) {
      try {
        await deleteMenuItem(id);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const updatedItem = await updateMenuItem(item.id, { available: !item.available });
      setItems(items.map(i => i.id === item.id ? { ...i, available: !item.available } : i));
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleSeed = async () => {
    if (window.confirm("Are you sure you want to seed the database? This will add all predefined items.")) {
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
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.name?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', padding: '40px 20px', color: '#FFFFFF' }}>
      <div className="container" style={{ backgroundColor: '#1B1B1B', borderRadius: '15px', padding: '30px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>Menu Management</h2>
          <div className="d-flex gap-2">
            <button
              className="btn fw-bold btn-outline-light"
              style={{ borderRadius: '25px', padding: '10px 20px' }}
              onClick={handleSeed}
              disabled={isSeeding}
            >
              <FaDatabase className="me-2" /> {isSeeding ? 'Seeding...' : 'Seed Database'}
            </button>
            <button
              className="btn fw-bold"
              style={{ backgroundColor: '#C9A227', color: '#111111', borderRadius: '25px', padding: '10px 20px' }}
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus className="me-2" /> Add Menu Item
            </button>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row gap-3 mb-4">
          <input
            type="text"
            className="form-control bg-dark text-light border-secondary"
            placeholder="Search items by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select bg-dark text-light border-secondary"
            style={{ minWidth: '200px' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border" style={{ color: '#C9A227' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle" style={{ backgroundColor: '#1B1B1B' }}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th>Featured</th>
                  <th>Popular</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.image || 'https://placehold.co/50/1B1B1B/FFFFFF?text=Ala+Turqa'}
                        alt={item.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                      />
                    </td>
                    <td className="fw-bold" style={{ fontFamily: '"Poppins", sans-serif' }}>{item.name}</td>
                    <td>{item.category}</td>
                    <td style={{ color: '#C9A227' }}>{formatPrice(item.price, item.displayPrice)}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${item.available ? 'btn-success' : 'btn-danger'}`}
                        onClick={() => handleToggleAvailability(item)}
                      >
                        {item.available ? <FaCheck /> : <FaTimes />}
                      </button>
                    </td>
                    <td>{item.featured ? <span className="badge bg-warning text-dark">Yes</span> : <span className="badge bg-secondary">No</span>}</td>
                    <td>{item.popular ? <span className="badge bg-danger">Yes</span> : <span className="badge bg-secondary">No</span>}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-info me-2" onClick={() => openEditModal(item)}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">No menu items found matching filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddMenuItemModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onAdd={(newItem) => {
            setItems([newItem, ...items]);
            setShowAddModal(false);
          }}
        />
      )}

      {showEditModal && selectedItem && (
        <EditMenuItemModal
          categories={categories}
          item={selectedItem}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedItem) => {
            setItems(items.map(i => i.id === updatedItem.id ? updatedItem : i));
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

export default MenuManagement;
