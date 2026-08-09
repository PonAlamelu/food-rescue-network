import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, ArrowRight, User, Building2, AlertCircle } from 'lucide-react';

const Leaderboard = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState({ donors: [], ngos: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleStart = () => {
        if (!userInfo) {
            navigate('/register');
            return;
        }
        
        const role = userInfo.role.toLowerCase();
        if (role === 'donor') {
            navigate('/create-donation');
        } else if (role === 'ngo' || role === 'volunteer') {
            navigate('/ngo/dashboard');
        } else {
            navigate('/');
        }
    };

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data } = await api.get('/users/leaderboard');
                setLeaderboard(data);
            } catch (err) {
                setError('Failed to load leaderboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const getBadge = (points) => {
        if (points >= 1000) return { label: 'Gold', color: 'text-yellow-500 bg-yellow-50 border-yellow-100', icon: Trophy };
        if (points >= 500) return { label: 'Silver', color: 'text-gray-400 bg-gray-50 border-gray-100', icon: Medal };
        if (points >= 100) return { label: 'Bronze', color: 'text-orange-500 bg-orange-50 border-orange-100', icon: Star };
        return null;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-5xl font-black text-gray-900 tracking-tight">Community Leaderboard</h1>
                <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                    Celebrating our top contributors in the fight against food waste.
                </p>
            </motion.div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl flex items-center justify-between font-bold max-w-2xl mx-auto"
                >
                    <div className="flex items-center space-x-3">
                        <AlertCircle className="h-6 w-6" />
                        <span>{error}</span>
                    </div>
                    <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 font-black text-xl">×</button>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Donors Leaderboard */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden"
                >
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-blue-100 rounded-2xl">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Top Donors</h3>
                        </div>
                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                            Philanthropists
                        </span>
                    </div>
                    <div className="p-4 space-y-3">
                        {leaderboard.donors.map((donor, index) => {
                            const badge = getBadge(donor.points);
                            return (
                                <div key={donor._id} className="flex items-center justify-between p-6 rounded-[24px] hover:bg-gray-50 transition-all group">
                                    <div className="flex items-center space-x-6">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl ${
                                            index === 0 ? 'bg-yellow-100 text-yellow-600 shadow-lg shadow-yellow-200' :
                                            index === 1 ? 'bg-gray-100 text-gray-500 shadow-lg shadow-gray-200' :
                                            index === 2 ? 'bg-orange-100 text-orange-600 shadow-lg shadow-orange-200' :
                                            'bg-gray-50 text-gray-400'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 group-hover:text-primary-600 transition-colors">{donor.name}</p>
                                            <div className="flex items-center mt-1">
                                                <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{donor.points} Points</span>
                                            </div>
                                        </div>
                                    </div>
                                    {badge && (
                                        <div className={`flex items-center px-4 py-1.5 rounded-full border-2 ${badge.color} text-[10px] font-black uppercase tracking-widest`}>
                                            <badge.icon className="h-3 w-3 mr-2" />
                                            {badge.label}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* NGOs Leaderboard */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden"
                >
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-100 rounded-2xl">
                                <Building2 className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Top NGOs</h3>
                        </div>
                        <span className="text-xs font-black text-green-600 uppercase tracking-widest bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                            Rescuers
                        </span>
                    </div>
                    <div className="p-4 space-y-3">
                        {leaderboard.ngos.map((ngo, index) => {
                            const badge = getBadge(ngo.points);
                            return (
                                <div key={ngo._id} className="flex items-center justify-between p-6 rounded-[24px] hover:bg-gray-50 transition-all group">
                                    <div className="flex items-center space-x-6">
                                        <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl ${
                                            index === 0 ? 'bg-yellow-100 text-yellow-600 shadow-lg shadow-yellow-200' :
                                            index === 1 ? 'bg-gray-100 text-gray-500 shadow-lg shadow-gray-200' :
                                            index === 2 ? 'bg-orange-100 text-orange-600 shadow-lg shadow-orange-200' :
                                            'bg-gray-50 text-gray-400'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 group-hover:text-primary-600 transition-colors">{ngo.name}</p>
                                            <div className="flex items-center mt-1">
                                                <Trophy className="h-3 w-3 text-primary-500 mr-1" />
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{ngo.points} Points</span>
                                            </div>
                                        </div>
                                    </div>
                                    {badge && (
                                        <div className={`flex items-center px-4 py-1.5 rounded-full border-2 ${badge.color} text-[10px] font-black uppercase tracking-widest`}>
                                            <badge.icon className="h-3 w-3 mr-2" />
                                            {badge.label}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-primary-600 rounded-[48px] p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-primary-200 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Trophy className="w-64 h-64 rotate-12" />
                </div>
                <div className="relative z-10 space-y-2">
                    <h2 className="text-4xl font-black">Want to reach the top?</h2>
                    <p className="text-primary-100 font-bold">Every donation and rescue mission earns you points and badges.</p>
                </div>
                <div className="relative z-10 mt-8 md:mt-0">
                    <button 
                        onClick={handleStart}
                        className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-black text-lg hover:bg-primary-50 transition-all flex items-center space-x-3 shadow-xl shadow-primary-900/20 active:scale-95"
                    >
                        <span>Get Started Now</span>
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Leaderboard;
