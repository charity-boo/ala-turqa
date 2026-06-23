import HeroSection from '../../components/Contact/HeroSection';
import QuickActions from '../../components/Contact/QuickActions';
import MapSection from '../../components/Contact/MapSection';
import ContactInfo from '../../components/Contact/ContactInfo';
import ContactForm from '../../components/Contact/ContactForm';
import FeatureCards from '../../components/Contact/FeatureCards';
import CTASection from '../../components/Contact/CTASection';

const Contact = () => {
  return (
    <div className="contact-page bg-primary-dark">
      <HeroSection />
      <QuickActions />
      <MapSection />
      
      <section className="py-5 bg-dark-secondary">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-5">
              <ContactInfo />
            </div>
            <div className="col-lg-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <FeatureCards />
      <CTASection />
    </div>
  );
};

export default Contact;
