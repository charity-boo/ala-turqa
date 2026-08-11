import React, { useState } from 'react';

const SizeSelectorModal = ({ item, isOpen, onClose, onConfirm }) => {
  const [selectedSize, setSelectedSize] = useState('Small');

  if (!isOpen) return null;

  const smallPrice = item.smallPrice;
  const mediumPrice = item.mediumPrice;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1050 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0" style={{ backgroundColor: '#1B1B1B', color: '#FFFFFF' }}>
          <div className="modal-header border-0" style={{ borderBottom: '1px solid #333' }}>
            <h5 className="modal-title" style={{ fontFamily: '"Playfair Display", serif', color: '#C9A227', fontWeight: 'bold' }}>
              Choose Size for {item.name}
            </h5>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body" style={{ fontFamily: '"Poppins", sans-serif' }}>
            <div className="d-flex flex-column gap-3">
              <label 
                className={`p-3 rounded border ${selectedSize === 'Small' ? 'border-warning' : 'border-secondary'}`}
                style={{ cursor: 'pointer', backgroundColor: selectedSize === 'Small' ? '#332a00' : '#222' }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <input 
                      type="radio" 
                      name="pizzaSize" 
                      checked={selectedSize === 'Small'} 
                      onChange={() => setSelectedSize('Small')} 
                      className="form-check-input mt-0"
                    />
                    <span className="fw-bold">Small</span>
                  </div>
                  <span style={{ color: '#C9A227' }}>KES {smallPrice ? smallPrice.toLocaleString() : '0'}</span>
                </div>
              </label>

              <label 
                className={`p-3 rounded border ${selectedSize === 'Medium' ? 'border-warning' : 'border-secondary'}`}
                style={{ cursor: 'pointer', backgroundColor: selectedSize === 'Medium' ? '#332a00' : '#222' }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <input 
                      type="radio" 
                      name="pizzaSize" 
                      checked={selectedSize === 'Medium'} 
                      onChange={() => setSelectedSize('Medium')} 
                      className="form-check-input mt-0"
                    />
                    <span className="fw-bold">Medium</span>
                  </div>
                  <span style={{ color: '#C9A227' }}>KES {mediumPrice ? mediumPrice.toLocaleString() : '0'}</span>
                </div>
              </label>
            </div>
          </div>
          
          <div className="modal-footer border-0" style={{ borderTop: '1px solid #333' }}>
            <button type="button" className="btn btn-outline-secondary text-light" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="button" 
              className="btn fw-bold" 
              style={{ backgroundColor: '#C9A227', color: '#111111' }}
              onClick={() => onConfirm(selectedSize, selectedSize === 'Small' ? smallPrice : mediumPrice)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeSelectorModal;
