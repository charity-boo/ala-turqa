const FeedbackFilters = ({ currentStatus, setCurrentStatus, currentPriority, setCurrentPriority }) => {
  return (
    <div className="card-luxury p-3 mb-4 d-flex flex-wrap gap-3 align-items-center">
      <div className="d-flex align-items-center gap-2">
        <label className="text-light small fw-bold text-nowrap">Status:</label>
        <select 
          className="form-select bg-dark text-light border-secondary"
          value={currentStatus}
          onChange={(e) => setCurrentStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="d-flex align-items-center gap-2">
        <label className="text-light small fw-bold text-nowrap">Priority:</label>
        <select 
          className="form-select bg-dark text-light border-secondary"
          value={currentPriority}
          onChange={(e) => setCurrentPriority(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
};

export default FeedbackFilters;
