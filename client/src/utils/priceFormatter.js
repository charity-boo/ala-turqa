export const formatPrice = (price, displayPrice) => {
  try {
    if (displayPrice) {
      if (typeof displayPrice === 'string' && displayPrice.includes('/')) {
        const parts = displayPrice.split('/');
        const formattedParts = parts.map(p => {
          const n = Number(p.trim());
          return isNaN(n) ? p.trim() : n.toLocaleString();
        });
        return `KES ${formattedParts.join('/')}`;
      }
      return `KES ${displayPrice}`;
    }
    
    if (price == null) return "KES 0";
    
    const priceStr = String(price);
    if (priceStr.includes('/')) {
      const parts = priceStr.split('/');
      const formattedParts = parts.map(p => {
        const n = Number(p.trim());
        return isNaN(n) ? p.trim() : n.toLocaleString();
      });
      return `KES ${formattedParts.join('/')}`;
    }
    
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return `KES ${priceStr}`;
    
    return `KES ${numericPrice.toLocaleString()}`;
  } catch {
    return "KES 0";
  }
};

export const parseBasePrice = (price) => {
  if (price == null) return 0;
  if (typeof price === 'number') {
    return isNaN(price) ? 0 : price;
  }
  const priceStr = String(price);
  if (priceStr.includes('/')) {
    const parsed = Number(priceStr.split('/')[0].trim());
    return isNaN(parsed) ? 0 : parsed;
  }
  const num = Number(priceStr);
  return isNaN(num) ? 0 : num;
};
