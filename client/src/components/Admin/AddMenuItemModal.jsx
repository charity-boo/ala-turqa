import React, { useState } from 'react';
import { createMenuItem } from '../../services/menuService';
import { uploadImage } from '../../services/storageService';
import { MENU_CATEGORIES } from '../../utils/constants';

const AddMenuItemModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: MENU_CATEGORIES[0],
    price: '',
    description: '',
    preparationTime: '',
    featured: false,
    popular: false,
    vegetarian: false,
    spicy: false,
    available: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name || !formData.price) {
        throw new Error("Name and Price are required.");
      }
      if (isNaN(Number(formData.price))) {
        throw new Error("Price must be a number.");
      }

      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'menu-images');
      }

      const newItemData = {
        ...formData,
        price: Number(formData.price),
        image: imageUrl
      };

      const addedItem = await createMenuItem(newItemData);
      onAdd(addedItem);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" style={{ backgroundColor: '#1B1B1B', color: '#FFFFFF', border: '1px solid #C9A227' }}>
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>Add Menu Item</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Food Name *</label>
                  <input type="text" className="form-control bg-dark text-light border-secondary" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category *</label>
                  <select className="form-select bg-dark text-light border-secondary" name="category" value={formData.category} onChange={handleChange}>
                    {MENU_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Price *</label>
                  <input type="number" step="0.01" className="form-control bg-dark text-light border-secondary" name="price" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Preparation Time (mins)</label>
                  <input type="text" className="form-control bg-dark text-light border-secondary" name="preparationTime" value={formData.preparationTime} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control bg-dark text-light border-secondary" rows="3" name="description" value={formData.description} onChange={handleChange}></textarea>
                </div>
                <div className="col-12">
                  <label className="form-label">Food Image</label>
                  <input type="file" accept="image/*" className="form-control bg-dark text-light border-secondary" onChange={handleImageChange} />
                </div>
                
                <div className="col-12 d-flex flex-wrap gap-4 mt-4">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="addFeatured" name="featured" checked={formData.featured} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="addFeatured">Featured</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="addPopular" name="popular" checked={formData.popular} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="addPopular">Popular</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="addVegetarian" name="vegetarian" checked={formData.vegetarian} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="addVegetarian">Vegetarian</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="addSpicy" name="spicy" checked={formData.spicy} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="addSpicy">Spicy</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="addAvailable" name="available" checked={formData.available} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="addAvailable">Available</label>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top-0 mt-4">
                <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn text-dark fw-bold rounded-pill px-4" style={{ backgroundColor: '#C9A227' }} disabled={loading}>
                  {loading ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenuItemModal;
