import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getBadgeClass = () => {
    switch (status) {
      case 'POSTED':
        return 'badge-posted';
      case 'REQUESTED':
        return 'badge-requested';
      case 'APPROVED':
        return 'badge-approved';
      case 'PICKED_UP':
        return 'badge-picked-up';
      case 'DELIVERED':
        return 'badge-delivered';
      case 'EXPIRED':
        return 'badge-expired';
      default:
        return 'badge-default';
    }
  };

  return <span className={`status-badge ${getBadgeClass()}`}>{status}</span>;
};

export default StatusBadge;
