import React from 'react';
import './DonationProgress.css';

const DonationProgress = ({ status }) => {
  const statuses = ['POSTED', 'REQUESTED', 'APPROVED', 'PICKED_UP', 'DELIVERED'];
  const currentStatusIndex = statuses.indexOf(status);

  // If the donation is expired, show a different state
  if (status === 'EXPIRED') {
    return (
      <div className="progress-container-expired">
        <div className="progress-bar-expired"></div>
        <span>EXPIRED</span>
      </div>
    );
  }

  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}></div>
      <div className="progress-steps">
        {statuses.map((step, index) => (
          <div
            key={step}
            className={`progress-step ${index <= currentStatusIndex ? 'completed' : ''}`}
          >
            <div className="step-circle"></div>
            <div className="step-label">{step.replace('_', ' ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationProgress;
