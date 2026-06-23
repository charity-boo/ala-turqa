import GalleryCard from './GalleryCard';

const GalleryGrid = ({ images, onImageClick }) => {
  return (
    <div className="gallery-masonry">
      {images.map((image, index) => (
        <div key={image.id} className="gallery-card-wrapper">
          <GalleryCard 
            image={image} 
            onClick={() => onImageClick(index)} 
          />
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
