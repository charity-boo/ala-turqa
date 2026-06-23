import FeedbackForm from '../../components/Feedback/FeedbackForm';

const Feedback = () => {
  return (
    <div className="feedback-page bg-primary-dark py-5" style={{ minHeight: '100vh', marginTop: '76px' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-4 text-gold" style={{ fontFamily: 'Playfair Display, serif' }}>Contact Us</h1>
          <div className="divider mx-auto mb-3" style={{ width: '60px', height: '3px', backgroundColor: '#C9A227' }}></div>
          <p className="lead text-light opacity-75">We value your feedback. Let us know how we can improve your experience.</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <FeedbackForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
