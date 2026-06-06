import { useState, useEffect } from 'react';
import api from '../services/api';

function UserDashboard() {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('name');
    const [order, setOrder] = useState('ASC');
    const [ratingInput, setRatingInput] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchStores();
    }, [search, sort, order]);

    const fetchStores = async () => {
        try {
            const res = await api.get(`/stores?search=${search}&sort=${sort}&order=${order}`);
            setStores(res.data.stores);
        } catch (err) {
            console.error('Failed to fetch stores', err);
        }
    };

    const handleSort = (field) => {
        if (sort === field) {
            setOrder(order === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSort(field);
            setOrder('ASC');
        }
    };

    const handleRatingSubmit = async (storeId) => {
        try {
            const rating = ratingInput[storeId];
            if (!rating || rating < 1 || rating > 5) {
                setMessage('Please enter a valid rating between 1 and 5.');
                return;
            }

            const store = stores.find(s => s.id === storeId);
            if (store.user_rating) {
                await api.put(`/ratings/${storeId}`, { rating });
                setMessage('Rating updated successfully.');
            } else {
                await api.post('/ratings', { store_id: storeId, rating });
                setMessage('Rating submitted successfully.');
            }
            fetchStores(); // Refresh data
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to submit rating.');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="card">
            <h2>User Dashboard - Stores</h2>
            {message && <div style={{ marginBottom: '10px', color: message.includes('success') ? 'green' : 'red' }}>{message}</div>}
            
            <div style={{ marginBottom: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Search stores by name or address..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: '8px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name {sort === 'name' && (order === 'ASC' ? '↑' : '↓')}</th>
                        <th>Address</th>
                        <th onClick={() => handleSort('average_rating')} style={{ cursor: 'pointer' }}>Overall Rating {sort === 'average_rating' && (order === 'ASC' ? '↑' : '↓')}</th>
                        <th>Your Rating</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map(s => (
                        <tr key={s.id}>
                            <td>{s.name}</td>
                            <td>{s.address}</td>
                            <td>{Number(s.average_rating).toFixed(1)} / 5</td>
                            <td>{s.user_rating ? `${s.user_rating} / 5` : 'Not rated'}</td>
                            <td style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map(star => {
                                        const currentRating = ratingInput[s.id] || 0;
                                        return (
                                            <svg 
                                                key={star} 
                                                onClick={() => setRatingInput({ ...ratingInput, [s.id]: star })}
                                                xmlns="http://www.w3.org/2000/svg" 
                                                width="24" 
                                                height="24" 
                                                viewBox="0 0 24 24" 
                                                fill={star <= currentRating ? "#fbbf24" : "none"} 
                                                stroke={star <= currentRating ? "#fbbf24" : "#cbd5e1"} 
                                                strokeWidth="2" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round"
                                            >
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                            </svg>
                                        );
                                    })}
                                </div>
                                <button className="primary" onClick={() => handleRatingSubmit(s.id)}>
                                    {s.user_rating ? 'Update' : 'Submit'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserDashboard;
