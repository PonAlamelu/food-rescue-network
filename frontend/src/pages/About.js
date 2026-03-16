import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Truck, ClipboardList, TrendingUp, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const steps = [
    {
      title: "Step 1: Identifying Surplus",
      description: "Donors like restaurants, hotels, and grocery stores identify surplus food that is still perfectly safe for consumption but would otherwise go to waste.",
      icon: <ClipboardList className="h-10 w-10 text-primary-600" />,
    },
    {
      title: "Step 2: Listing the Donation",
      description: "Donors quickly list the surplus food on our platform, providing details like food type, quantity, expiration time, and pickup location.",
      icon: <CheckCircle className="h-10 w-10 text-primary-600" />,
    },
    {
      title: "Step 3: NGO Matching",
      description: "Local NGOs and volunteers receive real-time notifications based on their location and the availability of food that matches their capacity.",
      icon: <Users className="h-10 w-10 text-primary-600" />,
    },
    {
      title: "Step 4: Efficient Pickup",
      description: "NGOs or volunteers accept the donation and coordinate a swift pickup, ensuring the food remains fresh and safe during transit.",
      icon: <Truck className="h-10 w-10 text-primary-600" />,
    },
    {
      title: "Step 5: Impact Distribution",
      description: "The food is immediately distributed to local communities, shelters, and families in need, turning potential waste into nourishment.",
      icon: <Heart className="h-10 w-10 text-primary-600" />,
    },
    {
      title: "Step 6: Tracking Progress",
      description: "Our platform tracks every kilogram of food rescued, providing transparency and detailed impact reports for both donors and NGOs.",
      icon: <TrendingUp className="h-10 w-10 text-primary-600" />,
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            How Our Food Rescue Works
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed"
          >
            We bridge the gap between food surplus and food insecurity through a seamless, technology-driven platform.
          </motion.p>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">The Rescue Process</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Our systematic approach ensures that surplus food is handled safely and reaches the right hands quickly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="bg-white p-4 rounded-2xl w-fit shadow-sm mb-6">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Visuals Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Who We Serve</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Your donations directly support vulnerable groups in our local communities.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Students",
                description: "Supporting students from low-income backgrounds to ensure they have the nutrition needed to excel in their studies.",
                img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Elderly Communities",
                description: "Providing healthy, fresh meals to aged people in shelters and community centers who may face mobility or financial challenges.",
                img: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Families in Need",
                description: "Helping families struggling with food insecurity, ensuring no child goes to bed hungry.",
                img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                className="relative h-[450px] rounded-3xl overflow-hidden group shadow-2xl"
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 text-white">
                  <h3 className="text-2xl font-black mb-2">{item.title}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-8 italic">Ready to make an impact?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="w-full sm:w-auto bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-200">
              Join the Network
            </Link>
            <Link to="/login" className="w-full sm:w-auto bg-white text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all border border-gray-200">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
