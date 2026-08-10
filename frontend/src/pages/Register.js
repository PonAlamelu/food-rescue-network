import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { User, Mail, Phone, UserPlus, AlertCircle, ShieldCheck } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password2: '',
        role: 'Donor',
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const { name, email, phone, password, password2, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }

        if (password !== password2) {
            setError('Passwords do not match');
            return;
        }
        try {
            const res = await api.post('/users', { name, email, phone, password, role });
            login(res.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex bg-white overflow-hidden">
            {/* Left Side - Image/Visual */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden lg:block lg:w-1/2 relative bg-primary-900"
            >
                <img 
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200" 
                    alt="Community Service" 
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/90 to-transparent p-16 flex flex-col justify-center">
                    <div className="max-w-md">
                        <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                            <ShieldCheck className="text-white h-10 w-10" />
                        </div>
                        <h3 className="text-5xl font-black text-white mb-6 leading-tight">Join the Movement.</h3>
                        <p className="text-primary-100 text-xl leading-relaxed">Whether you're a donor, an NGO, or a volunteer, your contribution helps build a world without food waste.</p>
                        
                        <div className="mt-12 space-y-6">
                            {[
                                "Direct impact on your local community",
                                "Real-time donation tracking",
                                "Verified network of partners"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center space-x-3 text-white font-bold">
                                    <div className="h-2 w-2 bg-primary-400 rounded-full" />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 overflow-y-auto"
            >
                <div className="max-w-md w-full py-8">
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-gray-900 mb-3">Create Account</h2>
                        <p className="text-gray-500 font-medium">Fill in the details to get started.</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center space-x-2 text-sm font-bold"
                        >
                            <AlertCircle className="h-5 w-5" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                <input type="text" name="name" value={name} onChange={onChange} required className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-600 focus:bg-white outline-none transition-all font-medium" placeholder="John Doe" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                <input type="email" name="email" value={email} onChange={onChange} required className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-600 focus:bg-white outline-none transition-all font-medium" placeholder="john@example.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                <input type="tel" name="phone" value={phone} onChange={onChange} required pattern="[0-9]{10}" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-600 focus:bg-white outline-none transition-all font-medium" placeholder="10-digit number" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Password</label>
                                <input type="password" name="password" value={password} onChange={onChange} required className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-600 focus:bg-white outline-none transition-all font-medium" placeholder="••••••••" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Confirm</label>
                                <input type="password" name="password2" value={password2} onChange={onChange} required className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-600 focus:bg-white outline-none transition-all font-medium" placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Register As</label>
                            <select name="role" value={role} onChange={onChange} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-600 focus:bg-white outline-none transition-all font-bold text-gray-700 cursor-pointer">
                                <option value="Donor">Donor</option>
                                <option value="NGO">NGO</option>
                                <option value="Volunteer">Volunteer</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full mt-4 bg-primary-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 active:scale-95 flex items-center justify-center space-x-2 group">
                            <span>Create Account</span>
                            <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600 font-medium">
                        Already have an account? <Link to="/login" className="text-primary-600 font-black hover:underline">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;