import Hero from '../../components/Home/Hero';
import Features from '../../components/Home/Features';
import SignatureDishes from '../../components/Home/SignatureDishes';
import WhyUs from '../../components/Home/WhyUs';
import Experience from '../../components/Home/Experience';
import Stats from '../../components/Home/Stats';
import CTA from '../../components/Home/CTA';

const Home = () => {
  return (
    <div className="home-page bg-primary-dark">
      <Hero />
      <Features />
      <SignatureDishes />
      <WhyUs />
      <Experience />
      <Stats />
      <CTA />
    </div>
  );
};

export default Home;
