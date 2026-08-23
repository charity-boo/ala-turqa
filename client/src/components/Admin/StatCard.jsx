const StatCard = ({ label, value, subtitle }) => {
  return (
    <div className="card border-0 h-100" style={{ backgroundColor: '#1B1B1B' }}>
      <div className="card-body">
        <div className="small text-muted">{label}</div>
        <div className="h4 mb-0 text-gold">{value}</div>
        {subtitle ? <div className="small text-light mt-2">{subtitle}</div> : null}
      </div>
    </div>
  );
};

export default StatCard;
