import React, { useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/axios';
// import { AuthContext } from '../context/AuthContext';

import { 
  Package, 

  Truck, 
  Search, 
  RotateCcw, 
  ClipboardCheck, 
  HandHelping,
  Navigation,
  Clock,
  AlertCircle,
  Utensils
} from 'lucide-react';
import { motion } from 'framer-motion';
import DonationMap from '../components/DonationMap';
import { AuthContext } from '../context/AuthContext';
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

const NGODashboard = () => {
    const [availableDonations, setAvailableDonations] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [myPickups, setMyPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [ngoStats, setNgoStats] = useState({ requestsMade: 0, approvedRequests: 0, completedPickups: 0 });
    const [submitting, setSubmitting] = useState(false);
    
    const [searchDescription, setSearchDescription] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterQuantity, setFilterQuantity] = useState('');
    const [filterPickupLocation, setFilterPickupLocation] = useState('');
    const [filterDistance, setFilterDistance] = useState('');
    const [currentLat, setCurrentLat] = useState(null);
    const [currentLng, setCurrentLng] = useState(null);

    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLat(position.coords.latitude);
                    setCurrentLng(position.coords.longitude);
                },
                (err) => console.error("Geolocation error:", err)
            );
        }
    }, []);

    const fetchData = useCallback(async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);

            const params = new URLSearchParams();
            if (searchDescription) params.append('description', searchDescription);
            if (filterStatus) params.append('status', filterStatus);
            if (filterQuantity) params.append('quantity', filterQuantity);
            if (filterPickupLocation) params.append('pickupLocation', filterPickupLocation);
            
            if (filterDistance && currentLat && currentLng) {
                params.append('lat', currentLat);
                params.append('lng', currentLng);
                params.append('distance', filterDistance);
            }

            const [donationsRes, requestsRes, pickupsRes, statsRes] = await Promise.all([
                api.get(`/donations?${params.toString()}`),
                api.get('/requests/myrequests'),
                api.get('/donations/mypickups'),
                api.get('/donations/stats/ngo')
            ]);

            setAvailableDonations(donationsRes.data);
            setMyRequests(requestsRes.data);
            setNgoStats(statsRes.data);
            setMyPickups(pickupsRes.data);

        } catch (err) {
            setError('Could not fetch dashboard data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchDescription, filterStatus, filterQuantity, filterPickupLocation, filterDistance, currentLat, currentLng]);

    useEffect(() => {
        if(userInfo) fetchData(true);
    }, [userInfo, fetchData]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (userInfo) fetchData(false);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchDescription, filterDistance, filterPickupLocation, filterStatus, userInfo, fetchData]);

    const handleRequest = async (donationId) => {
        try {
            await api.post('/requests', { donationId });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not make request.');
        }
    };

    const handleConfirmPickup = async (donationId) => {
        if (submitting) return;
        setSubmitting(true);
        try {
            await api.put(`/donations/${donationId}/pickup`);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not confirm pickup.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmDelivery = async (donationId) => {
        if (submitting) return;
        setSubmitting(true);
        try {
            await api.put(`/donations/${donationId}/deliver`);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not confirm delivery.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetFilters = () => {
        setSearchDescription('');
        setFilterStatus('');
        setFilterDistance('');
        setFilterPickupLocation('');
        setFilterQuantity('');
    };

    if (loading) return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">NGO Dashboard</h1>
                    <p className="text-gray-500 font-medium mt-1">Find surplus food and manage your rescues in real-time.</p>
                </div>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl flex items-center justify-between font-bold"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-6 w-6" />
                  <span>{error}</span>
                </div>
                <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">×</button>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard title="Requests Made" value={ngoStats.requestsMade} icon={HandHelping} color="bg-blue-600" delay={0.1} />
                <StatCard title="Approved" value={ngoStats.approvedRequests} icon={ClipboardCheck} color="bg-purple-600" delay={0.2} />
                <StatCard title="Successful Rescues" value={ngoStats.completedPickups} icon={Truck} color="bg-green-600" delay={0.3} />
            </div>

            {/* Map Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden h-[450px] relative shadow-2xl shadow-primary-900/5"
            >
              <DonationMap donations={availableDonations} onMarkerClick={handleRequest} />
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur px-6 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg"><Navigation className="h-5 w-5 text-primary-600 animate-pulse" /></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Live Map</p>
                  <p className="text-sm font-black text-gray-900 leading-none">Nearby Donations</p>
                </div>
              </div>
            </motion.div>

            {/* Available Donations Section */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/50">
                    <h3 className="text-xl font-black text-gray-900 flex items-center space-x-3">
                      <Utensils className="h-6 w-6 text-primary-600" />
                      <span>Available Donations</span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative group">
                        <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="pl-12 pr-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm focus:border-primary-600 outline-none w-full sm:w-64 font-medium transition-all"
                            value={searchDescription}
                            onChange={(e) => setSearchDescription(e.target.value)}
                        />
                      </div>
                      <select 
                        value={filterDistance} 
                        onChange={(e) => setFilterDistance(e.target.value)}
                        className="bg-white border-2 border-gray-100 rounded-2xl text-sm focus:border-primary-600 outline-none py-3 px-4 font-bold text-gray-700 cursor-pointer"
                      >
                          <option value="">Any Distance</option>
                          <option value="5">Within 5 km</option>
                          <option value="10">Within 10 km</option>
                          <option value="25">Within 25 km</option>
                      </select>
                      <button 
                        onClick={handleResetFilters}
                        className="p-3 bg-white border-2 border-gray-100 text-gray-400 hover:text-primary-600 hover:border-primary-100 rounded-2xl transition-all shadow-sm active:scale-95"
                        title="Reset Filters"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-5">Food Item</th>
                                <th className="px-8 py-5">Quantity</th>
                                <th className="px-8 py-5">Expires In</th>
                                <th className="px-8 py-5">Donor Partner</th>
                                <th className="px-8 py-5">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {availableDonations.length > 0 ? availableDonations.map(d => (
                                <tr key={d._id} className="hover:bg-gray-50/80 transition-all group">
                                    <td className="px-8 py-6 font-black text-gray-900 text-lg">{d.description}</td>
                                    <td className="px-8 py-6">
                                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-black text-xs uppercase border border-blue-100">{d.quantity}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`flex flex-col font-bold ${isExpired(d.expiryDate) ? 'text-red-500' : 'text-orange-600'}`}>
                                          <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{formatTimeUntil(d.expiryDate)}</span>
                                          </div>
                                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                            {new Date(d.expiryDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-gray-600 italic">By {d.donor.name}</td>
                                    <td className="px-8 py-6">
                                        {d.status === 'POSTED' && !isExpired(d.expiryDate) && (
                                            <button 
                                                onClick={() => handleRequest(d._id)} 
                                                className="bg-primary-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 active:scale-95"
                                            >
                                                Request
                                            </button>
                                        )}
                                        {d.status === 'REQUESTED' && (
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-4 py-2 rounded-xl border border-primary-100">Requested</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                  <td colSpan="5" className="px-8 py-20 text-center">
                                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                      <Search className="h-8 w-8 text-gray-200" />
                                    </div>
                                    <p className="text-xl font-black text-gray-900">No donations match your search</p>
                                    <p className="text-gray-500 font-medium mt-1">Try adjusting your filters to see more results.</p>
                                  </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Active Tasks Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-xl font-black text-gray-900 flex items-center space-x-3">
                    <Truck className="h-6 w-6 text-primary-600" />
                    <span>My Rescues In Progress</span>
                  </h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {myPickups.length > 0 ? myPickups.map(d => (
                    <div key={d._id} className="p-8 hover:bg-gray-50/50 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <h4 className="text-xl font-black text-gray-900 leading-tight">{d.description}</h4>
                          <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>Pickup: {d.pickupLocation}</span>
                          </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 ${
                          d.status === 'APPROVED' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                          d.status === 'PICKED_UP' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                          'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          {d.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        {d.status === 'APPROVED' && (
                          <button 
                            onClick={() => handleConfirmPickup(d._id)} 
                            disabled={submitting}
                            className="flex-grow bg-primary-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50"
                          >
                            {submitting ? 'Updating...' : 'Confirm Pickup'}
                          </button>
                        )}
                        {d.status === 'PICKED_UP' && (
                          <button 
                            onClick={() => handleConfirmDelivery(d._id)} 
                            disabled={submitting}
                            className="flex-grow bg-green-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-green-200 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
                          >
                            {submitting ? 'Updating...' : 'Confirm Delivery'}
                          </button>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="p-20 text-center">
                      <Truck className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-lg font-black text-gray-900">No scheduled rescues</p>
                      <p className="text-gray-500 text-sm mt-1">Accept a donation request to start a rescue mission.</p>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-xl font-black text-gray-900 flex items-center space-x-3">
                    <HistoryIcon className="h-6 w-6 text-primary-600" />
                    <span>Recent Activity</span>
                  </h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {myRequests.length > 0 ? myRequests.slice(0, 5).map(req => (
                    <div key={req._id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-all">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          req.status === 'approved' ? 'bg-green-100 text-green-600' : 
                          req.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                          'bg-gray-100 text-gray-400'
                        }`}>
                          <ClipboardCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{req.donation.description}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(req.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest ${
                        req.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-100' : 
                        req.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-100' : 
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  )) : (
                    <div className="p-20 text-center">
                      <HistoryIcon className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-lg font-black text-gray-900">No recent activity</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
        </div>
    );
};

const HistoryIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
);

const MapPin = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export default NGODashboard;
