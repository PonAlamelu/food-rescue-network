import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PendingApproval from '../pages/PendingApproval';

const PrivateRoute = ({ children, roles }) => {
    const { userInfo, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    // If not logged in, redirect to login
    if (!userInfo) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user is not an Admin and their account is not approved, show pending page
    const userRole = userInfo.role.toLowerCase();
    if (userRole !== 'admin' && !userInfo.isApproved) {
        return <PendingApproval />;
    }

    // If roles are specified and user's role is not included, redirect
    if (roles && !roles.some(role => role.toLowerCase() === userRole)) {
        // Determine the correct default path based on user's actual role
        let defaultPath;
        switch (userRole) {
            case 'donor':
                defaultPath = '/donor/dashboard';
                break;
            case 'ngo':
            case 'volunteer':
                defaultPath = '/ngo/dashboard';
                break;
            case 'admin':
                defaultPath = '/admin/dashboard';
                break;
            default:
                defaultPath = '/'; // Fallback for unexpected roles
        }
        return <Navigate to={defaultPath} replace />;
    }

    // If all checks pass, render the component
    return children;
};

export default PrivateRoute;
