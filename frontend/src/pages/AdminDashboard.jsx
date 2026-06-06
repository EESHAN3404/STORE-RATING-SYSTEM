import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to load stats', err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Stores</h3>
                    <p>{stats.totalStores}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Ratings</h3>
                    <p>{stats.totalRatings}</p>
                </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/admin/users" className="primary" style={{ padding: '10px', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Manage Users</Link>
                <Link to="/admin/stores" className="primary" style={{ padding: '10px', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Manage Stores</Link>
            </div>
        </div>
    );
}

export default AdminDashboard;
