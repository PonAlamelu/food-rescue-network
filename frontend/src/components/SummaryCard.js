import React from 'react';
import './SummaryCard.css';

const SummaryCard = ({ title, value, iconClass }) => {
    return (
        <div className="summary-card">
            <div className="card-icon">
                <i className={iconClass}></i>
            </div>
            <div className="card-content">
                <div className="card-title">{title}</div>
                <div className="card-value">{value}</div>
            </div>
        </div>
    );
};

export default SummaryCard;
