import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import MapSelector from '../components/MapSelector';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, Utensils, PlusCircle, Calendar, MapPin, Info } from 'lucide-react';

const CreateDonation = () => {
    const [formData, setFormData] = useState({
        description: '',
        quantity: '',
        pickupLocation: '',
        expiryDate: '',
        latitude: '',
        longitude: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const { description, quantity, pickupLocation, expiryDate, latitude, longitude } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleLocationSelect = (lat, lng) => {
        setFormData({ ...formData, latitude: lat, longitude: lng });
    };

    const onSubmit = async e => {
        e.preventDefault();
        if (!latitude || !longitude) {
            setError('Please pinpoint the pickup location on the map.');
            return;
        }
        setIsSubmitting(true);
        try {
            await api.post('/donations', { 
                description, 
                quantity, 
                pickupLocation, 
                expiryDate: new Date(expiryDate).toISOString(), 
                latitude, 
                longitude 
            });
            navigate('/donor/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create donation');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link 
                        to="/donor/dashboard" 
                        className="inline-flex items-center text-sm font-black text-gray-400 hover:text-primary-600 uppercase tracking-widest transition-colors mb-6 group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Post New Donation</h1>
                    <p className="text-gray-500 font-medium mt-1">Help reduce food waste by sharing your surplus.</p>
                </motion.div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-4 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl flex items-center justify-between font-bold"
                    >
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="h-6 w-6" />
                            <span>{error}</span>
                        </div>
                        <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 font-black">×</button>
                    </motion.div>
                )}

                <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Details */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6"
                    >
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                                <Utensils className="h-4 w-4" />
                                <span>Food Description</span>
                            </label>
                            <textarea 
                                name="description" 
                                value={description} 
                                onChange={onChange} 
                                required 
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary-600 focus:bg-white outline-none transition-all font-medium min-h-[120px]"
                                placeholder="E.g. 50 Fresh vegetable biryani packets, unused surplus."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Quantity</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="quantity" 
                                    value={quantity} 
                                    onChange={onChange} 
                                    required 
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary-600 focus:bg-white outline-none transition-all font-bold"
                                    placeholder="E.g. 10 kg, 20 packets"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Expiry Time</span>
                                </label>
                                <input 
                                    type="datetime-local" 
                                    name="expiryDate" 
                                    value={expiryDate} 
                                    onChange={onChange} 
                                    required 
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary-600 focus:bg-white outline-none transition-all font-bold cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span>Pickup Address</span>
                            </label>
                            <input 
                                type="text" 
                                name="pickupLocation" 
                                value={pickupLocation} 
                                onChange={onChange} 
                                required 
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary-600 focus:bg-white outline-none transition-all font-medium"
                                placeholder="Full address or landmark"
                            />
                        </div>

                        <div className="p-4 bg-primary-50 rounded-2xl flex items-start space-x-3 border border-primary-100">
                            <Info className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-primary-900 font-bold leading-relaxed italic">
                                Please ensure the food is packed safely and stored at appropriate temperatures until pickup.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column - Map */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col"
                    >
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>Locate on Map</span>
                        </label>
                        <div className="flex-grow rounded-2xl overflow-hidden border-2 border-gray-50 h-[300px] lg:h-auto min-h-[300px] relative">
                            <MapSelector onLocationSelect={handleLocationSelect} />
                            {latitude && (
                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-primary-100 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Pin Confirmed</span>
                                    <span className="text-[10px] font-bold text-gray-400">{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
                                </div>
                            )}
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full mt-8 bg-primary-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 active:scale-95 flex items-center justify-center space-x-3 group disabled:opacity-50"
                        >
                            <span>{isSubmitting ? 'Posting...' : 'Post Donation'}</span>
                            <PlusCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        </button>
                    </motion.div>
                </form>
            </div>
        </div>
    );
};

export default CreateDonation;
