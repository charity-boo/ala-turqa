import React from 'react';

const MenuSkeleton = () => {
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="col">
          <div className="card h-100 border-0" style={{ backgroundColor: '#1B1B1B', borderRadius: '16px', overflow: 'hidden' }}>
            <div className="placeholder-glow" style={{ height: '220px' }}>
              <div className="placeholder w-100 h-100 bg-secondary" style={{ opacity: 0.2 }}></div>
            </div>
            <div className="card-body p-4 placeholder-glow">
              <span className="placeholder col-4 bg-secondary mb-3 rounded" style={{ opacity: 0.2 }}></span>
              <h5 className="placeholder col-8 bg-secondary mb-3 rounded" style={{ height: '24px', opacity: 0.2 }}></h5>
              <p className="placeholder col-12 bg-secondary mb-2 rounded" style={{ opacity: 0.2 }}></p>
              <p className="placeholder col-9 bg-secondary mb-4 rounded" style={{ opacity: 0.2 }}></p>
              <div className="d-flex justify-content-between align-items-center mt-auto border-top pt-3 border-secondary">
                <span className="placeholder col-4 bg-secondary rounded" style={{ height: '28px', opacity: 0.2 }}></span>
                <span className="placeholder col-4 bg-secondary rounded-pill" style={{ height: '38px', opacity: 0.2 }}></span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuSkeleton;
