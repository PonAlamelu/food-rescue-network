import React from 'react';
import './Form.css'; // Reusing some form styling for the container

const PendingApproval = () => {
    return (
        <div className="form-container">
            <div className="form-card">
                <h2>Account Pending Approval</h2>
                <p>
                    Thank you for registering with the Food Rescue Network.
                </p>
                <p>
                    Your account is currently waiting for approval from an administrator. 
                    You will be notified once your account has been approved.
                </p>
                <p>
                    Until then, you will have limited access to the platform.
                </p>
            </div>
        </div>
    );
};

export default PendingApproval;
