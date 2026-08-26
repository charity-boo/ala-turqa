import { useEffect, useState } from 'react';

const AnimatedCounter = ({ target, duration, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(target);
    if (start === end) return;

    let totalMilSecDur = parseInt(duration);
    let incrementTime = (totalMilSecDur / end) * 2;
    
    // Smooth out large numbers
    if (end > 1000) {
      incrementTime = 10;
    }

    const timer = setInterval(() => {
      start += end > 1000 ? Math.ceil(end / 100) : (end > 10 ? 1 : 0.1);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        // Keep 1 decimal point if target is a float like 4.8
        setCount(end % 1 !== 0 ? start.toFixed(1) : Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
};

const StatsSection = () => {
  return (
    <section className="py-5" style={{ backgroundColor: '#111111' }}>
      <div className="container py-5 border-top border-bottom border-secondary" style={{ borderColor: 'rgba(201, 162, 39, 0.2) !important' }}>
        <div className="row g-4 text-center slide-up justify-content-center">
          <div className="col-12 col-md-4">
            <h2 className="display-4 fw-bold text-gold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              <AnimatedCounter target="10000" duration="2000" suffix="+" />
            </h2>
            <p className="text-muted text-uppercase tracking-widest small">Happy Customers</p>
          </div>
          <div className="col-12 col-md-4">
            <h2 className="display-4 fw-bold text-gold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              <AnimatedCounter target="50" duration="2000" suffix="+" />
            </h2>
            <p className="text-muted text-uppercase tracking-widest small">Menu Items</p>
          </div>
          <div className="col-12 col-md-4">
            <h2 className="display-4 fw-bold text-gold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              <AnimatedCounter target="1" duration="1000" />
            </h2>
            <p className="text-muted text-uppercase tracking-widest small">Location</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
