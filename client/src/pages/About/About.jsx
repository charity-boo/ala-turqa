import HeroSection from '../../components/About/HeroSection';
import StorySection from '../../components/About/StorySection';
import OffersSection from '../../components/About/OffersSection';
import ChefSection from '../../components/About/ChefSection';
import WhyChooseSection from '../../components/About/WhyChooseSection';
import StatsSection from '../../components/About/StatsSection';
import CTASection from '../../components/About/CTASection';

const About = () => {
  return (
    <div className="about-page bg-primary-dark">
      <HeroSection />
      <StorySection />
      <OffersSection />
      <ChefSection />
      <WhyChooseSection />
      <StatsSection />
      <CTASection />
    </div>
  );
};

export default About;
