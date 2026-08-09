import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  ShieldCheck, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  MessageSquare,
  Info
} from 'lucide-react';

const Support = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  const sections = [
    {
      id: 'help-center',
      title: 'Help Center',
      icon: <HelpCircle className="h-8 w-8 text-primary-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Welcome to the Food Rescue Network Help Center. This platform connects food donors with NGOs to reduce food waste and support people in need.
          </p>
          
          <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
            <h4 className="text-lg font-black text-primary-900 mb-4 flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>How the Platform Works</span>
            </h4>
            <ul className="space-y-4">
              {[
                { step: 'Donors', text: 'can post details of surplus food.' },
                { step: 'NGOs', text: 'can view available donations and request them.' },
                { step: 'Approval', text: 'Once approved, NGOs collect and distribute the food.' }
              ].map((item, i) => (
                <li key={i} className="flex items-start space-x-3 text-sm font-medium text-gray-700">
                  <div className="mt-1 bg-primary-200 rounded-full p-1"><ChevronRight className="h-3 w-3 text-primary-700" /></div>
                  <span><strong className="text-primary-900">{item.step}</strong> {item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-black text-gray-900 flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-primary-600" />
              <span>Frequently Asked Questions (FAQs)</span>
            </h4>
            <div className="grid gap-4">
              {[
                { q: 'How can I donate food?', a: 'Register as a donor, log in, and post your food details including quantity, location, and pickup time.' },
                { q: 'How can NGOs request food?', a: 'NGOs can view available donations and send a request to the donor.' },
                { q: 'Is the platform free to use?', a: 'Yes, the platform is completely free for all users.' },
                { q: 'Who ensures food safety?', a: 'Donors are responsible for providing safe, hygienic, and non-expired food.' }
              ].map((faq, i) => (
                <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <p className="font-black text-gray-900 mb-2">Q: {faq.q}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p className="font-bold text-gray-900">Food Rescue Network is committed to protecting user privacy and personal information.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>We collect basic user information such as name, email, phone number, and role for account creation.</li>
            <li>All user data is stored securely and used only for platform functionality.</li>
            <li>Passwords are encrypted to ensure security.</li>
            <li>We do not share personal information with third parties without user consent.</li>
            <li>Data may be used to improve services and user experience.</li>
          </ul>
          <p className="italic text-sm bg-gray-50 p-4 rounded-xl border border-gray-100 mt-6">
            By using this platform, users agree to the collection and use of their information as described in this policy.
          </p>
        </div>
      )
    },
    {
      id: 'terms-of-service',
      title: 'Terms of Service',
      icon: <FileText className="h-8 w-8 text-orange-600" />,
      content: (
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p className="font-bold text-gray-900">By using the Food Rescue Network platform, users agree to the following terms:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Users must provide accurate and valid information during registration.</li>
            <li>Donors must ensure that the food provided is safe, hygienic, and not expired.</li>
            <li>NGOs must handle food responsibly and distribute it properly.</li>
            <li>Any misuse of the platform, including false information or illegal activity, is strictly prohibited.</li>
            <li>The platform is not responsible for any issues related to food quality or delivery.</li>
            <li>Failure to follow these terms may result in account suspension or removal.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'contact-us',
      title: 'Contact Us',
      icon: <Mail className="h-8 w-8 text-blue-600" />,
      content: (
        <div className="space-y-8">
          <p className="text-gray-600">If you have any questions, feedback, or issues, feel free to contact us.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="p-3 bg-blue-50 rounded-xl mb-4"><Mail className="h-6 w-6 text-blue-600" /></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
              <a href="mailto:ponalamelusoff1@gmail.com" className="font-bold text-gray-900 hover:text-primary-600 transition-colors">ponalamelusoff1@gmail.com</a>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="p-3 bg-green-50 rounded-xl mb-4"><Phone className="h-6 w-6 text-green-600" /></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
              <a href="tel:+918072609218" className="font-bold text-gray-900 hover:text-primary-600 transition-colors">+91 80726 09218</a>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="p-3 bg-orange-50 rounded-xl mb-4"><MapPin className="h-6 w-6 text-orange-600" /></div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Address</p>
              <p className="font-bold text-gray-900">Food Rescue Network, Tirunelveli, India</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h4 className="text-lg font-black text-gray-900 mb-4">You can contact us for:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Technical support', 'Reporting issues', 'Suggestions and feedback'].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 bg-white px-4 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-700">
                  <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-primary-600 font-black italic">We are always happy to help and improve our platform!</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <section className="bg-primary-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-6"
          >
            Support & Policies
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-primary-200 max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to know about using our platform and how we protect our community.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-12">
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    {section.icon}
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{section.title}</h2>
                </div>
                {section.content}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
