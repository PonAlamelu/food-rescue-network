import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/users/login', { email, password });
            login(res.data);
            const userRole = res.data.role.toLowerCase();
            
            switch (userRole) {
                case 'donor': navigate('/donor/dashboard'); break;
                case 'ngo': navigate('/ngo/dashboard'); break;
                case 'volunteer': navigate('/ngo/dashboard'); break;
                case 'admin': navigate('/admin/dashboard'); break;
                default: navigate('/'); break;
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex bg-white overflow-hidden">
            {/* Left Side - Form */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16"
            >
                <div className="max-w-md w-full">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-gray-900 mb-3">Welcome Back</h2>
                        <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
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

                    <form onSubmit={onSubmit} className="space-y-6" autoComplete="off">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                    autoComplete="off"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-600 focus:bg-white outline-none transition-all font-medium text-gray-900"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-wider">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                    autoComplete="new-password"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-600 focus:bg-white outline-none transition-all font-medium text-gray-900"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 active:scale-95 flex items-center justify-center space-x-2 group"
                        >
                            <span>Sign In</span>
                            <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600 font-medium">
                        Don't have an account? <Link to="/register" className="text-primary-600 font-black hover:underline">Create one</Link>
                    </p>
                </div>
            </motion.div>

            {/* Right Side - Image/Visual */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block lg:w-1/2 relative bg-primary-900"
            >
                <img 
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200" 
                    alt="Food Donation" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-transparent p-16 flex flex-col justify-end">
                    <div className="max-w-md">
                        <h3 className="text-4xl font-black text-white mb-4 leading-tight">Every donation makes a real difference.</h3>
                        <p className="text-primary-100 text-lg">Join our network of donors and help us eliminate food waste while supporting those in need.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;