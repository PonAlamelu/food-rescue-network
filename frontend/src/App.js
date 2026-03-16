import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import AdminDashboard from './pages/AdminDashboard'; 
import Reports from './pages/Reports';
import CreateDonation from './pages/CreateDonation';
import EditDonation from './pages/EditDonation'; 
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import api from './api/axios';



function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="App min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/donor/dashboard" element={<PrivateRoute roles={['donor']}><DonorDashboard /></PrivateRoute>} />
              <Route path="/ngo/dashboard" element={<PrivateRoute roles={['ngo', 'volunteer']}><NGODashboard /></PrivateRoute>} />
              <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/reports" element={<PrivateRoute roles={['admin']}><Reports /></PrivateRoute>} />
              <Route path="/create-donation" element={<PrivateRoute roles={['donor']}><CreateDonation /></PrivateRoute>} />
              <Route path="/edit-donation/:id" element={<PrivateRoute roles={['donor']}><EditDonation /></PrivateRoute>} />
              <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

              {/* Catch-all for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;