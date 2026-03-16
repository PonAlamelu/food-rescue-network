import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

    const fetchUnreadNotificationsCount = useCallback(async () => {
        if (userInfo) {
            try {
                const res = await api.get('/notifications/unread-count');
                setUnreadNotificationCount(res.data.count);
            } catch (err) {
                console.error("Failed to fetch unread notification count", err);
            }
        } else {
            setUnreadNotificationCount(0);
        }
    }, [userInfo]);

    useEffect(() => {
        if (userInfo) {
            fetchUnreadNotificationsCount();
        }
    }, [userInfo, fetchUnreadNotificationsCount]);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    // Check if token is expired
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                    } else {
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        // Fetch full user details
                        try {
                            const res = await api.get('/users/profile');
                            setUserInfo(res.data);
                        } catch (err) {
                            // If profile fetch fails, token is likely invalid
                            logout();
                        }
                    }
                } catch (e) {
                    console.error("Invalid token", e);
                    logout();
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const login = useCallback((userData) => {
        const { token, ...info } = userData;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUserInfo(info);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUserInfo(null);
        setUnreadNotificationCount(0); // Reset count on logout
    }, []);

    const authValue = React.useMemo(() => ({
        isAuthenticated: !!userInfo,
        userInfo,
        login,
        logout,
        loading,
        unreadNotificationCount,
        fetchUnreadNotificationsCount
    }), [userInfo, loading, unreadNotificationCount, fetchUnreadNotificationsCount, login, logout]);

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
const useAuth = () => {
    return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth };