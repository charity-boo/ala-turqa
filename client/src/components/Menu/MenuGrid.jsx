import React from 'react';
import MenuCard from './MenuCard';
import EmptyState from './EmptyState';

const MenuGrid = ({ items, onAddToCart, onReset }) => {
  if (!items || items.length === 0) {
    return <EmptyState onReset={onReset} />;
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 slide-up">
      {items.map(item => (
        <div key={item.id} className="col">
          <MenuCard item={item} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;
