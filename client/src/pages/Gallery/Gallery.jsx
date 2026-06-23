import { useState, useEffect } from 'react';
import GalleryHero from '../../components/Gallery/GalleryHero';
import GalleryFilters from '../../components/Gallery/GalleryFilters';
import GalleryGrid from '../../components/Gallery/GalleryGrid';
import GallerySkeleton from '../../components/Gallery/GallerySkeleton';
import EmptyGallery from '../../components/Gallery/EmptyGallery';
import Lightbox from '../../components/Gallery/Lightbox';
import { getGalleryImages } from '../../services/galleryService';
import './Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = [
    'All',
    'Signature Dishes',
    'Turkish Breakfast',
    'Kebabs & Grill',
    'Desserts',
    'Drinks & Coffee',
    'Restaurant Interior',
    'Outdoor Seating',
    'Events & Celebrations',
    'Chef Specials'
  ];

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await getGalleryImages();
      setImages(data);
    } catch (error) {
      console.error("Failed to load images", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <div className="gallery-page">
      <GalleryHero />
      <div className="container py-5">
        <GalleryFilters 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
        
        {loading ? (
          <GallerySkeleton />
        ) : filteredImages.length === 0 ? (
          <EmptyGallery onRefresh={fetchImages} />
        ) : (
          <GalleryGrid images={filteredImages} onImageClick={openLightbox} />
        )}
      </div>

      {lightboxOpen && (
        <Lightbox 
          images={filteredImages}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
};

export default Gallery;
