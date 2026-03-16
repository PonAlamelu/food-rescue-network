import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Users, ArrowRight, Zap, Globe, Award, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import './Home.css';
const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-30"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/30 to-white/70" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-primary-100 mb-8"
            >
              <Zap className="h-4 w-4 text-primary-600 fill-primary-600" />
              <span className="text-sm font-bold text-primary-900 uppercase tracking-wider">New: Real-time Notifications</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6"
            >
              Feed the Hungry, <br/>
              <span className="text-primary-600 text-shadow-sm">Reduce Food Waste</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 leading-relaxed font-medium"
            >
              Join the Food Rescue Network. We connect surplus food from donors to local NGOs and volunteers, making it easier to help those in need.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center"
            >
              <Link to="/register" className="w-full sm:w-auto bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-2xl shadow-primary-200 hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2">
                <span>Start Donating Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Gallery Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl text-left">
              <h2 className="text-4xl font-black text-gray-900 mb-4">Making a Difference Together</h2>
              <p className="text-lg text-gray-600">Every donation helps support students, elderly people, and families in our local communities.</p>
            </div>
            <Link to="/about" className="text-primary-600 font-bold flex items-center hover:underline">
              Learn about our process <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600", label: "Supporting Students" },
              { img: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=600", label: "Helping the Elderly" },
              { img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600", label: "Feeding Families" },
              { img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600", label: "Community Support" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="relative h-72 rounded-3xl overflow-hidden group shadow-lg"
              >
                <img src={item.img} alt={item.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <p className="text-white font-bold text-lg">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Our platform simplifies the process of giving and receiving, ensuring food reaches those who need it most.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "For Donors",
                desc: "Post surplus food details in seconds. Track your impact through our modern dashboard.",
                icon: Heart,
                color: "bg-red-50 text-red-600"
              },
              {
                title: "For NGOs",
                desc: "Browse available donations nearby. Request and arrange pickups with ease.",
                icon: Users,
                color: "bg-blue-50 text-blue-600"
              },
              {
                title: "Secure & Verified",
                desc: "We verify participants to ensure the safety and quality of every donation.",
                icon: ShieldCheck,
                color: "bg-primary-50 text-primary-600"
              }
            ].map((feature, i) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={i} 
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Food Rescued", val: "10k+ kg", icon: Utensils },
              { label: "Active NGOs", val: "50+", icon: Users },
              { label: "Regular Donors", val: "200+", icon: Heart },
              { label: "Community Awards", val: "12", icon: Award }
            ].map((stat, i) => (
              <div key={i} className="p-6">
                <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary-400" />
                <p className="text-4xl font-black mb-1">{stat.val}</p>
                <p className="text-primary-300 font-medium uppercase tracking-widest text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-6">Ready to make a difference?</h2>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed">Join hundreds of others who are already helping to rescue food and support their communities.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="w-full sm:w-auto bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-200">
              Join Now
            </Link>
            <Link to="/about" className="w-full sm:w-auto text-primary-600 font-bold px-10 py-4">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
