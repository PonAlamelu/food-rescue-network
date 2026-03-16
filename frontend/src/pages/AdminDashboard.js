import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import SummaryCard from '../components/SummaryCard'; // Import SummaryCard
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Dashboard.css';
import '../components/SummaryCard.css'; // Import SummaryCard styles

const AdminDashboard = () => {
    const [unapprovedUsers, setUnapprovedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [adminStats, setAdminStats] = useState({ totalUsers: 0, totalDonations: 0, successfulDeliveries: 0 });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const fetchData = async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            else setUpdating(true);

            const [unapprovedRes, usersRes, donationsRes, donationStatsRes, userStatsRes] = await Promise.all([
                api.get('/users?approved=false'),
                api.get('/users'),
                api.get('/donations/all'),
                api.get('/donations/stats/admin'),
                api.get('/users/stats/admin')
            ]);
            
            setUnapprovedUsers(unapprovedRes.data);
            setAllUsers(usersRes.data);
            setDonations(donationsRes.data);
            setAdminStats({
                totalUsers: userStatsRes.data.totalUsers,
                totalDonations: donationStatsRes.data.totalDonations,
                successfulDeliveries: donationStatsRes.data.successfulDeliveries,
            });

        } catch (err) {
            setError('Could not fetch all required data. Make sure you are an administrator.');
            console.error(err);
        } finally {
            setLoading(false);
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchData(true);
    }, []);
    
    const handleApproveUser = async (userId) => {
        if (window.confirm('Are you sure you want to approve this user?')) {
            try {
                await api.put(`/users/${userId}/approve`);
                fetchData(); // Refresh all data
            } catch (err) {
                setError(err.response?.data?.message || 'Could not approve user.');
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await api.delete(`/users/${userId}`);
                fetchData(); // Refresh all data
            } catch (err) {
                setError(err.response?.data?.message || 'Could not delete user.');
            }
        }
    };

    const handleDeleteDonation = async (donationId) => {
        if (window.confirm('Are you sure you want to delete this donation? This action cannot be undone.')) {
            try {
                await api.delete(`/donations/${donationId}`);
                fetchData(); // Refresh data
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete donation.');
            }
        }
    };

    const handleEditDonation = (donationId) => {
        navigate(`/edit-donation/${donationId}`); // Assuming an edit page exists
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="dashboard-container">
            {updating && <div className="updating-indicator">Updating data...</div>}
            <div className="dashboard-header">
                <h2>Admin Dashboard</h2>
                <button onClick={() => navigate('/admin/reports')} className="btn btn-primary">View Reports</button>
            </div>
            {error && <div className="form-error" onClick={() => setError('')}>{error}</div>}

            <div className="summary-card-container">
                <SummaryCard title="Total Users" value={adminStats.totalUsers} iconClass="fas fa-users" />
                <SummaryCard title="Total Donations" value={adminStats.totalDonations} iconClass="fas fa-utensils" />
                <SummaryCard title="Successful Deliveries" value={adminStats.successfulDeliveries} iconClass="fas fa-handshake" />
            </div>

            <h3>Pending Approvals</h3>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unapprovedUsers.length > 0 ? unapprovedUsers.map(u => (
                            <tr key={u._id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                                <td>
                                    <button onClick={() => handleApproveUser(u._id)} className="btn btn-success">Approve</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4">No users are pending approval.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <h3>All Users</h3>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.length > 0 ? allUsers.map(u => (
                            <tr key={u._id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                                <td>{u.isApproved ? <span className="text-success">Approved</span> : <span className="text-warning">Pending</span>}</td>
                                <td>
                                    {!u.isApproved && (
                                        <button onClick={() => handleApproveUser(u._id)} className="btn btn-success btn-sm">Approve</button>
                                    )}
                                    {u.role.toLowerCase() !== 'admin' && (
                                        <button onClick={() => handleDeleteUser(u._id)} className="btn btn-danger btn-sm ml-2">Delete</button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5">No users found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <h3>All Donations</h3>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Donor</th>
                            <th>Pickup Time</th>
                            <th>Delivery Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.length > 0 ? donations.map(d => (
                            <tr key={d._id}>
                                <td>{d.description}</td>
                                <td>{d.quantity}</td>
                                <td><StatusBadge status={d.status} /></td>
                                <td>{d.donor ? d.donor.name : 'N/A'}</td>
                                <td>{d.pickupTimestamp ? new Date(d.pickupTimestamp).toLocaleString() : 'N/A'}</td>
                                <td>{d.deliveryTimestamp ? new Date(d.deliveryTimestamp).toLocaleString() : 'N/A'}</td>
                                <td>
                                    {(d.status !== 'DELIVERED') && ( // Admins can edit anything not yet delivered
                                        <button 
                                            onClick={() => handleEditDonation(d._id)} 
                                            className="btn btn-info btn-sm"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDeleteDonation(d._id)} 
                                        className="btn btn-danger btn-sm ml-2"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : (
                        <tr><td colSpan="7">No donations found.</td></tr> 
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;