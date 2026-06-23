

const GallerySkeleton = () => {
  // Generate 8 skeleton cards
  const skeletons = Array(8).fill(0);

  return (
    <div className="gallery-masonry">
      {skeletons.map((_, index) => (
        <div key={index} className="gallery-card-wrapper">
          <div className="skeleton-card" style={{ height: `${Math.random() * 150 + 200}px` }}></div>
        </div>
      ))}
    </div>
  );
};

export default GallerySkeleton;
