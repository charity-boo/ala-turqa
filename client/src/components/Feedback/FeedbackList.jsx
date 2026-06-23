import { FaEnvelope, FaPhoneAlt, FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { updateFeedbackStatus, updateFeedbackPriority, deleteFeedback } from '../../services/feedbackService';

const FeedbackList = ({ feedbackItems, onFeedbackUpdated }) => {

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateFeedbackStatus(id, newStatus);
      onFeedbackUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePriorityChange = async (id, newPriority) => {
    try {
      await updateFeedbackPriority(id, newPriority);
      onFeedbackUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await deleteFeedback(id);
        onFeedbackUpdated();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (!feedbackItems || feedbackItems.length === 0) {
    return (
      <div className="card-luxury p-5 text-center">
        <FaCheckCircle className="text-gold mb-3" style={{ fontSize: '3rem', opacity: 0.5 }} />
        <h4 className="text-light" style={{ fontFamily: 'Playfair Display, serif' }}>No entries found</h4>
        <p className="text-muted">You're all caught up!</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning text-dark';
      case 'reviewed': return 'bg-info text-dark';
      case 'resolved': return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Complaint': return 'text-danger';
      case 'Suggestion': return 'text-info';
      default: return 'text-gold';
    }
  };

  return (
    <div className="feedback-list">
      {feedbackItems.map(item => (
        <div key={item.id} className="card-luxury p-4 mb-3">
          <div className="d-flex justify-content-between align-items-start mb-3 border-bottom border-secondary pb-3">
            <div>
              <h5 className="text-light mb-1 d-flex align-items-center gap-2">
                {item.name} 
                <span className={`badge ${getStatusColor(item.status)}`}>{item.status}</span>
              </h5>
              <div className="text-muted small d-flex gap-3">
                {item.phone && <span><FaPhoneAlt className="me-1" /> {item.phone}</span>}
                <span>
                  {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : 'Just now'}
                </span>
              </div>
            </div>
            <div className="text-end">
              <strong className={getTypeColor(item.type)}>{item.type}</strong>
            </div>
          </div>
          
          <div className="mb-4 text-light opacity-75">
            {item.message}
          </div>
          
          <div className="d-flex justify-content-between align-items-center bg-dark p-2 rounded">
            <div className="d-flex gap-3 align-items-center">
              <select 
                className="form-select form-select-sm bg-dark text-light border-secondary w-auto"
                value={item.status}
                onChange={(e) => handleStatusChange(item.id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </select>
              
              <select 
                className="form-select form-select-sm bg-dark text-light border-secondary w-auto"
                value={item.priority}
                onChange={(e) => handlePriorityChange(item.id, e.target.value)}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDelete(item.id)}
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;
