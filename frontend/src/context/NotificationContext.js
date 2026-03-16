import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from '../api/axios';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { userInfo } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/notifications', config);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [userInfo]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/notifications/unread-count', config);
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      // Request notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Fetch initial notifications and unread count
      fetchNotifications();
      fetchUnreadCount();

      // Initialize socket connection
      // We use the base URL (without /api) for the socket connection
      const socketUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace('/api', '');
      const newSocket = io(socketUrl);

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        newSocket.emit('join', userInfo._id);
      });

      newSocket.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        // Show browser notification if permitted
        if (Notification.permission === 'granted') {
          new Notification('Food Rescue Network', {
            body: notification.message,
          });
        }
      });

      return () => newSocket.disconnect();
    }
  }, [userInfo, fetchNotifications, fetchUnreadCount]);

  const markAsRead = async (notificationId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`/notifications/${notificationId}/read`, {}, config);
      
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    // Implement on backend if needed, or just loop through local notifications
    notifications.forEach(async (n) => {
      if (!n.isRead) await markAsRead(n._id);
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};