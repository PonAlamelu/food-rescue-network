import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import './Dashboard.css';

const Reports = () => {
    const [dailyReports, setDailyReports] = useState([]);
    const [statusReports, setStatusReports] = useState([]);
    const [userStats, setUserStats] = useState({ totalUsers: 0, totalApprovedUsers: 0, totalPendingUsers: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const [donationRes, userRes] = await Promise.all([
                    api.get('/donations/reports/daily'),
                    api.get('/users/stats/admin')
                ]);
                
                setDailyReports(donationRes.data.daily);
                setStatusReports(donationRes.data.status);
                setUserStats(userRes.data);
            } catch (err) {
                setError('Could not fetch reports. Make sure you have admin privileges.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <div className="loading-spinner">Loading reports...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Admin Reports</h2>
            </div>
            {error && <div className="form-error">{error}</div>}

            <div className="reports-section">
                <h3>User Statistics</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Users</td>
                                <td>{userStats.totalUsers}</td>
                            </tr>
                            <tr>
                                <td>Approved Users</td>
                                <td className="text-success">{userStats.totalApprovedUsers}</td>
                            </tr>
                            <tr>
                                <td>Pending Approvals</td>
                                <td className="text-warning">{userStats.totalPendingUsers}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="reports-section">
                <h3>Donations by Status</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statusReports.length > 0 ? statusReports.map(report => (
                                <tr key={report._id}>
                                    <td><StatusBadge status={report._id} /></td>
                                    <td>{report.count}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="2">No donation data available.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="reports-section">
                <h3>Daily Donation Count</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Number of Donations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dailyReports.length > 0 ? dailyReports.map(report => (
                                <tr key={report._id}>
                                    <td>{report._id}</td>
                                    <td>{report.count}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="2">No daily data available.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
