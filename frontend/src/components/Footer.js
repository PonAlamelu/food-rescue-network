import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Heart, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-primary-600 p-2 rounded-2xl shadow-lg shadow-primary-900/50">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">FoodRescue</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              We're on a mission to end food waste and hunger by connecting surplus food to those who need it most.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-xl hover:bg-primary-600 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-xl hover:bg-primary-600 transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-xl hover:bg-primary-600 transition-colors"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-primary-500">Quick Links</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Join as Donor</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Join as NGO</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-primary-500">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-primary-500">Get in Touch</h4>
            <div className="space-y-4 text-sm font-bold text-gray-400">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-800 rounded-lg text-primary-500"><Phone className="h-4 w-4" /></div>
                <span>+91 80726 09218</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-800 rounded-lg text-primary-500"><Mail className="h-4 w-4" /></div>
                <span>ponalamelusoff1@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-800 rounded-lg text-primary-500"><MapPin className="h-4 w-4" /></div>
                <span>Tirunelveli, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Food Rescue Network. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-1 text-xs font-bold text-gray-500">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>for the community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
