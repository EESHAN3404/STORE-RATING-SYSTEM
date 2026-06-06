import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/users/${id}`);
                setUser(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user details');
            }
        };
        fetchUser();
    }, [id]);

    if (error) return <div className="card error-msg">{error}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <div className="card">
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', padding: '5px 10px', cursor: 'pointer' }}>&larr; Back to Users</button>
            <h2>User Details</h2>
            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Role:</strong> <span style={{ fontWeight: 'bold', color: '#4f46e5' }}>{user.role}</span></p>
                <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>

            {user.role === 'STORE_OWNER' && user.stores && (
                <div>
                    <h3>Owned Stores</h3>
                    {user.stores.length === 0 ? (
                        <p>This owner currently has no stores assigned.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Store Name</th>
                                    <th>Address</th>
                                    <th>Average Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.stores.map((s, idx) => (
                                    <tr key={idx}>
                                        <td>{s.name}</td>
                                        <td>{s.address}</td>
                                        <td>{Number(s.average_rating).toFixed(1)} / 5</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserDetails;
