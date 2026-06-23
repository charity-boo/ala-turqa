const StorySection = () => {
  return (
    <section className="py-5 bg-primary-dark">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0 slide-up">
            <div className="position-relative">
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Turkish Food Preparation" 
                className="img-fluid rounded shadow-lg object-fit-cover w-100"
                style={{ height: '400px', border: '1px solid rgba(201, 162, 39, 0.2)' }}
              />
              <div 
                className="position-absolute bottom-0 end-0 bg-dark-secondary p-4 rounded shadow-lg text-center" 
                style={{ transform: 'translate(10%, 10%)', border: '1px solid rgba(201, 162, 39, 0.3)' }}
              >
                <h3 className="text-gold mb-0" style={{ fontFamily: 'Playfair Display, serif' }}>2018</h3>
                <p className="text-muted small mb-0">Established</p>
              </div>
            </div>
          </div>
          <div className="col-lg-5 offset-lg-1 slide-up">
            <h2 className="text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem' }}>Our Heritage</h2>
            <p className="text-light opacity-75 mb-4" style={{ lineHeight: '1.8' }}>
              Born from a passion for the vibrant, bustling streets of Istanbul, Ala Turqa was established to bring the authentic flavors of Turkish street food and fine dining straight to Nairobi. 
            </p>
            <p className="text-light opacity-75 mb-4" style={{ lineHeight: '1.8' }}>
              We believe that true hospitality—<em>Misafirperverlik</em>—is an art form. Every dish we serve is crafted with fresh, locally sourced ingredients combined with traditional spices imported directly from Turkey, ensuring an unforgettable culinary journey.
            </p>
            <p className="text-gold fw-bold" style={{ fontStyle: 'italic' }}>
              "Experience tradition on a plate."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
