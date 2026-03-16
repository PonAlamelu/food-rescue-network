import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

import { 
  Package, 
  CheckCircle, 
  Truck, 
  Clock, 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin, 
  Calendar,
  AlertCircle,
  Users,
  Utensils,
  Apple
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTimeUntil, isExpired } from '../utils/timeUtils';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all"
  >
    <div className="space-y-1">
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</p>
      <p className="text-4xl font-black text-gray-900">{value}</p>
    </div>
    <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
      <Icon className="h-8 w-8 text-white" />
    </div>
  </motion.div>
);

const DonorDashboard = () => {
    const [donations, setDonations] = useState([]);
    const [requestsByDonation, setRequestsByDonation] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ totalDonations: 0, approvedDonations: 0, deliveredDonations: 0 });
    const navigate = useNavigate();

    const fetchDonationsAndRequests = async () => {
        try {
            setLoading(true);
            const [donationsRes, statsRes] = await Promise.all([
                api.get('/donations/mydonations'),
                api.get('/donations/stats/donor')
            ]);
            
            setDonations(donationsRes.data);
            setStats(statsRes.data);

            const requestsMap = {};
            for (const donation of donationsRes.data) {
                if (donation.status === 'REQUESTED') {
                    const reqRes = await api.get(`/donations/${donation._id}`);
                    if (reqRes.data.requests.length > 0) {
                        requestsMap[donation._id] = reqRes.data.requests;
                    }
                }
            }
            setRequestsByDonation(requestsMap);

        } catch (err) {
            setError('Could not fetch dashboard data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonationsAndRequests();
    }, []);

    const handleUpdateRequest = async (requestId, status) => {
        try {
            await api.put(`/requests/${requestId}`, { status });
            fetchDonationsAndRequests();
        } catch (err) {
            setError(`Failed to ${status} request.`);
        }
    };

    const handleDeleteDonation = async (donationId) => {
        if (window.confirm('Are you sure you want to delete this donation?')) {
            try {
                await api.delete(`/donations/${donationId}`);
                fetchDonationsAndRequests();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete donation.');
            }
        }
    };

    const getStatusStyles = (status) => {
      switch (status) {
        case 'POSTED': return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'REQUESTED': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
        case 'APPROVED': return 'bg-purple-50 text-purple-600 border-purple-100';
        case 'PICKED_UP': return 'bg-orange-50 text-orange-600 border-orange-100';
        case 'DELIVERED': return 'bg-green-50 text-green-600 border-green-100';
        case 'EXPIRED': return 'bg-red-50 text-red-600 border-red-100';
        default: return 'bg-gray-50 text-gray-600 border-gray-100';
      }
    };

    if (loading) return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6"
            >
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Donor Dashboard</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your food donations and track your community impact.</p>
                </div>
                <Link 
                  to="/create-donation" 
                  className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 active:scale-95 space-x-2"
                >
                  <Plus className="h-6 w-6" />
                  <span>Post Donation</span>
                </Link>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-4 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl flex items-center space-x-3 font-bold"
              >
                <AlertCircle className="h-6 w-6" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <StatCard title="Total Rescued" value={stats.totalDonations} icon={Utensils} color="bg-blue-600" delay={0.1} />
                <StatCard title="Approved" value={stats.approvedDonations} icon={CheckCircle} color="bg-purple-600" delay={0.2} />
                <StatCard title="Success Deliveries" value={stats.deliveredDonations} icon={Truck} color="bg-green-600" delay={0.3} />
            </div>
            
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-primary-600" />
                    <span>My Donation History</span>
                  </h3>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{donations.length} Items</span>
                </div>
                
                <div className="divide-y divide-gray-50">
                    {donations.length > 0 ? donations.map((d, index) => (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            key={d._id} 
                            className="p-8 hover:bg-gray-50/80 transition-all group"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="flex-grow space-y-4">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <h4 className="text-2xl font-black text-gray-900 leading-none">{d.description}</h4>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 ${getStatusStyles(d.status)}`}>
                                          {d.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                                          <div className="p-2 bg-blue-50 rounded-lg"><Package className="h-4 w-4 text-blue-600" /></div>
                                          <div>
                                              <p className="text-[10px] font-black text-gray-400 uppercase">Quantity</p>
                                              <p className="font-bold text-gray-900">{d.quantity}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                                          <div className="p-2 bg-primary-50 rounded-lg"><MapPin className="h-4 w-4 text-primary-600" /></div>
                                          <div className="min-w-0">
                                              <p className="text-[10px] font-black text-gray-400 uppercase">Location</p>
                                              <p className="font-bold text-gray-900 truncate">{d.pickupLocation}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                                          <div className="p-2 bg-orange-50 rounded-lg"><Calendar className="h-4 w-4 text-orange-600" /></div>
                                          <div className="flex flex-col">
                                              <p className="text-[10px] font-black text-gray-400 uppercase">Expiry</p>
                                              <p className={`font-bold ${isExpired(d.expiryDate) ? 'text-red-500' : 'text-gray-900'}`}>
                                                {formatTimeUntil(d.expiryDate)}
                                              </p>
                                              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mt-1">
                                                {new Date(d.expiryDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                              </span>
                                          </div>
                                        </div>
                                    </div>

                                    {/* Timeline Info */}
                                    {(d.pickupTimestamp || d.deliveryTimestamp) && (
                                        <div className="flex flex-wrap gap-4 mt-2">
                                          {d.pickupTimestamp && (
                                            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl flex items-center space-x-2 border border-blue-100 text-xs font-bold">
                                              <Truck className="h-3.5 w-3.5" />
                                              <span>Picked: {new Date(d.pickupTimestamp).toLocaleDateString()}</span>
                                            </div>
                                          )}
                                          {d.deliveryTimestamp && (
                                            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl flex items-center space-x-2 border border-green-100 text-xs font-bold">
                                              <CheckCircle className="h-3.5 w-3.5" />
                                              <span>Delivered: {new Date(d.deliveryTimestamp).toLocaleDateString()}</span>
                                            </div>
                                          )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-3 shrink-0">
                                    { (d.status === 'POSTED') && (
                                        <button 
                                            onClick={() => navigate(`/edit-donation/${d._id}`)} 
                                            className="p-4 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all border border-transparent hover:border-primary-100"
                                            title="Edit Donation"
                                        >
                                            <Edit2 className="h-6 w-6" />
                                        </button>
                                    )}
                                    { (d.status === 'POSTED' || d.status === 'EXPIRED') && (
                                        <button 
                                            onClick={() => handleDeleteDonation(d._id)} 
                                            className="p-4 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                                            title="Delete Donation"
                                        >
                                            <Trash2 className="h-6 w-6" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Request Section */}
                            {d.status === 'REQUESTED' && requestsByDonation[d._id] && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-8 bg-primary-50 rounded-[24px] border border-primary-100 p-8 shadow-inner"
                                >
                                    <h5 className="font-black text-primary-900 mb-6 flex items-center space-x-3 text-sm uppercase tracking-widest">
                                      <Users className="h-5 w-5" />
                                      <span>Incoming NGO Requests</span>
                                      <span className="bg-primary-600 text-white text-[10px] px-3 py-1 rounded-full">{requestsByDonation[d._id].length}</span>
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {requestsByDonation[d._id].map(req => (
                                             <div key={req._id} className="bg-white p-6 rounded-2xl shadow-sm border border-primary-100 flex flex-col justify-between group/req hover:shadow-md transition-all">
                                                <div className="mb-6">
                                                  <p className="text-xl font-black text-gray-900">{req.requester.name}</p>
                                                  <div className="flex flex-col mt-2 text-sm text-gray-500 font-medium">
                                                    <span>{req.requester.email}</span>
                                                    <span>{req.requester.phone}</span>
                                                  </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <button 
                                                        onClick={() => handleUpdateRequest(req._id, 'approved')} 
                                                        className="flex-grow bg-primary-600 text-white py-3 rounded-xl font-black text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 active:scale-95 disabled:opacity-50"
                                                        disabled={isExpired(d.expiryDate)}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdateRequest(req._id, 'rejected')} 
                                                        className="flex-grow bg-white text-red-600 border-2 border-red-50 py-3 rounded-xl font-black text-sm hover:bg-red-50 hover:border-red-100 transition-all active:scale-95 disabled:opacity-50"
                                                        disabled={isExpired(d.expiryDate)}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )) : (
                        <div className="p-20 text-center">
                          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Apple className="h-12 w-12 text-gray-200" />
                          </div>
                          <p className="text-2xl font-black text-gray-900">No donations found</p>
                          <p className="text-gray-500 font-medium mt-2 mb-8">Ready to make an impact? Start by posting your first donation!</p>
                          <Link 
                            to="/create-donation" 
                            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-200"
                          >
                            <Plus className="h-5 w-5" />
                            <span>Post First Donation</span>
                          </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;