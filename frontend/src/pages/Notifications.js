import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Check, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();

    const getRelativeTime = (date) => {
      const now = new Date();
      const diff = now - new Date(date);
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(diff / 3600000);
      if (hours < 24) return `${hours}h ago`;
      return new Date(date).toLocaleDateString();
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <Bell className="h-6 w-6 text-primary-600" />
                    <span>Notifications</span>
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">Stay updated on your donation activity.</p>
                </div>
                {notifications.some(n => !n.isRead) && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Mark all as read</span>
                  </button>
                )}
            </div>

            <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                    {notifications.length > 0 ? (
                        notifications.map((n, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                key={n._id}
                                className={`group p-6 rounded-2xl border transition-all relative overflow-hidden ${
                                  !n.isRead 
                                    ? 'bg-white border-primary-100 shadow-md shadow-primary-50 ring-1 ring-primary-50' 
                                    : 'bg-gray-50/50 border-gray-100 opacity-80'
                                }`}
                            >
                                {!n.isRead && (
                                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-600" />
                                )}
                                
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-grow">
                                        <p className={`text-lg ${!n.isRead ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                                          {n.message}
                                        </p>
                                        <div className="flex items-center space-x-3 mt-3 text-xs text-gray-400">
                                            <div className="flex items-center space-x-1">
                                              <Clock className="h-3 w-3" />
                                              <span>{getRelativeTime(n.createdAt)}</span>
                                            </div>
                                            <span>•</span>
                                            <span>{new Date(n.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    
                                    {!n.isRead && (
                                        <button 
                                          onClick={() => markAsRead(n._id)}
                                          className="p-2 bg-primary-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary-100 active:scale-95"
                                          title="Mark as read"
                                        >
                                          <Check className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
                              <Bell className="h-10 w-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
                            <p className="text-gray-500 mt-1">You have no new notifications at the moment.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Notifications;
