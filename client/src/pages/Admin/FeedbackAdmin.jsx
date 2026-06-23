import { useState, useEffect } from 'react';
import { getFeedback } from '../../services/feedbackService';
import FeedbackFilters from '../../components/Feedback/FeedbackFilters';
import FeedbackList from '../../components/Feedback/FeedbackList';

const FeedbackAdmin = () => {
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const data = await getFeedback(statusFilter, priorityFilter);
      setFeedbackItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, [statusFilter, priorityFilter]);

  return (
    <div className="container-fluid p-4">
      <h2 className="text-gold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Feedback & Complaints</h2>
      
      <FeedbackFilters 
        currentStatus={statusFilter}
        setCurrentStatus={setStatusFilter}
        currentPriority={priorityFilter}
        setCurrentPriority={setPriorityFilter}
      />

      {loading ? (
        <div className="text-light">Loading feedback...</div>
      ) : (
        <FeedbackList 
          feedbackItems={feedbackItems} 
          onFeedbackUpdated={fetchFeedbackData} 
        />
      )}
    </div>
  );
};

export default FeedbackAdmin;
