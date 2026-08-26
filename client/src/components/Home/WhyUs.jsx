import { FaCheckCircle } from 'react-icons/fa';

const WhyUs = () => {
  const points = [
    "Authentic Turkish taste & traditional recipes",
    "Fresh ingredients sourced daily",
    "Warm, luxurious dining experience"
  ];

  return (
    <section className="py-5 bg-dark-secondary">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0 slide-up">
            <h2 className="display-5 text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Why People Love Us</h2>
            <p className="lead text-light mb-5 opacity-75">
              At Ala Turqa, we don't just serve food—we serve memories. Every dish is a celebration of Turkish culture, crafted with passion and dedication.
            </p>
            <ul className="list-unstyled">
              {points.map((point, idx) => (
                <li key={idx} className="mb-4 d-flex align-items-center text-white fs-5">
                  <FaCheckCircle className="text-gold me-3 fs-4 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-5 offset-lg-1 slide-up">
            <div className="position-relative p-2" style={{ border: '2px solid #C9A227' }}>
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Chefs Cooking" 
                className="img-fluid w-100 object-fit-cover"
                style={{ height: '450px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
