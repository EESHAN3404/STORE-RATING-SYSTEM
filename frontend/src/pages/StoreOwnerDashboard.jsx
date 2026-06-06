import { useState, useEffect } from 'react';
import api from '../services/api';

function StoreOwnerDashboard() {
    const [data, setData] = useState({ store: {}, averageRating: 0, ratings: [] });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/store-owner/dashboard');
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load dashboard data');
            }
        };
        fetchDashboard();
    }, []);

    if (error) return <div className="card error-msg">{error}</div>;
    if (!data.store.id) return <div>Loading...</div>;

    return (
        <div>
            <h2>Store Owner Dashboard</h2>
            <div className="card">
                <h3>{data.store.name}</h3>
                <p style={{ fontSize: '20px' }}>Average Rating: <strong>{data.averageRating} / 5</strong></p>
            </div>

            <div className="card">
                <h3>User Ratings</h3>
                <table>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>Rating Given</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.ratings.length === 0 ? (
                            <tr><td colSpan="4">No ratings yet.</td></tr>
                        ) : (
                            data.ratings.map(r => (
                                <tr key={r.id}>
                                    <td>{r.userName}</td>
                                    <td>{r.userEmail}</td>
                                    <td>{r.rating} / 5</td>
                                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StoreOwnerDashboard;
