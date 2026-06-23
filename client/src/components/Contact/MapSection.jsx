const MapSection = () => {
  return (
    <section className="bg-primary-dark">
      <div className="container-fluid px-0">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.362241680581!2d36.8722421!3d-1.2263435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f15f6f4c8c7f9%3A0x6b8f13e7b16d1f9!2sSafari%20Park%20Hotel%20%26%20Casino!5e0!3m2!1sen!2ske!4v1689793144802!5m2!1sen!2ske" 
          width="100%" 
          height="400" 
          style={{ border: 0, display: 'block', opacity: 0.8, filter: 'grayscale(30%)' }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Ala Turqa Google Maps Location"
        ></iframe>
      </div>
    </section>
  );
};

export default MapSection;
