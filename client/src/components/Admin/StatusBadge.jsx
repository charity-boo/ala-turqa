import React from 'react';

const StatusBadge = ({ status }) => {
  let badgeClass = 'badge ';
  
  switch (status?.toLowerCase()) {
    case 'pending':
      badgeClass += 'bg-warning text-dark';
      break;
    case 'confirmed':
      badgeClass += 'bg-info text-dark';
      break;
    case 'preparing':
      badgeClass += 'bg-primary';
      break;
    case 'ready':
      badgeClass += 'bg-success';
      break;
    case 'completed':
      badgeClass += 'bg-secondary';
      break;
    case 'cancelled':
      badgeClass += 'bg-danger';
      break;
    default:
      badgeClass += 'bg-light text-dark';
  }

  return (
    <span className={badgeClass} style={{ textTransform: 'capitalize', padding: '8px 12px', borderRadius: '12px' }}>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
