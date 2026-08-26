import React, { useState } from 'react';
import { updateMenuItem } from '../../services/menuService';
import { uploadImage } from '../../services/storageService';
import { MENU_CATEGORIES } from '../../utils/constants';

const EditMenuItemModal = ({ item, onClose, onUpdate, categories = [] }) => {
  const dynamicCategories = categories.length > 0 ? categories : MENU_CATEGORIES;
  
  const [formData, setFormData] = useState({
    name: item.name || '',
    category: item.category || dynamicCategories[0],
    price: item.price || '',
    description: item.description || '',
    preparationTime: item.preparationTime || '',
    spicy: item.spicy || false,
    available: item.available !== undefined ? item.available : true
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
      if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
        throw new Error("Price must be a valid positive number.");
      }

      let imageUrl = item.image || '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'menu-images');
      }

      const updatedData = {
        ...formData,
        price: Number(formData.price),
        image: imageUrl
      };

      const result = await updateMenuItem(item.id, updatedData);
      onUpdate(result);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" style={{ backgroundColor: '#1B1B1B', color: '#FFFFFF', border: '1px solid #C9A227' }}>
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227' }}>Edit Menu Item</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Food Name *</label>
                  <input type="text" className="form-control bg-dark text-light border-secondary" name="name" value={formData.name} onChange={handleChange} required maxLength="100" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category *</label>
                  <select className="form-select bg-dark text-light border-secondary" name="category" value={formData.category} onChange={handleChange}>
                    {dynamicCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Price *</label>
                  <input type="number" step="0.01" min="0" className="form-control bg-dark text-light border-secondary" name="price" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Preparation Time (mins)</label>
                  <input type="text" className="form-control bg-dark text-light border-secondary" name="preparationTime" value={formData.preparationTime} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control bg-dark text-light border-secondary" rows="3" name="description" value={formData.description} onChange={handleChange} maxLength="500"></textarea>
                </div>
                <div className="col-12">
                  <label className="form-label">Food Image</label>
                  {item.image && <div className="mb-2"><img src={item.image} alt="current" style={{width: '100px', borderRadius: '5px'}}/></div>}
                  <input type="file" accept="image/*" className="form-control bg-dark text-light border-secondary" onChange={handleImageChange} />
                  <small className="text-muted">Leave empty to keep current image</small>
                </div>
                
                <div className="col-12 d-flex flex-wrap gap-4 mt-4">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="editSpicy" name="spicy" checked={formData.spicy} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="editSpicy">Spicy</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="editAvailable" name="available" checked={formData.available} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="editAvailable">Available</label>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top-0 mt-4">
                <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose} disabled={loading}>Cancel</button>
                <button type="submit" className="btn text-dark fw-bold rounded-pill px-4" style={{ backgroundColor: '#C9A227' }} disabled={loading}>
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMenuItemModal;
