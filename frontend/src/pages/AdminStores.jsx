import { useState, useEffect } from 'react';
import api from '../services/api';

function AdminStores() {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({ name: '', email: '', address: '' });
    const [sort, setSort] = useState('name');
    const [order, setOrder] = useState('ASC');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchStores();
    }, [filters, sort, order]);

    const fetchStores = async () => {
        try {
            const query = new URLSearchParams({ ...filters, sort, order }).toString();
            const res = await api.get(`/stores?${query}`);
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

    const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
    const handleNewStoreChange = (e) => setNewStore({ ...newStore, [e.target.name]: e.target.value });

    const handleAddStore = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/admin/stores', newStore);
            setSuccess('Store added successfully');
            setShowAddForm(false);
            setNewStore({ name: '', email: '', address: '', owner_id: '' });
            fetchStores();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add store');
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Manage Stores</h2>
                <button className="primary" onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? 'Cancel' : '+ Add Store'}
                </button>
            </div>

            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg" style={{color: 'green'}}>{success}</div>}

            {showAddForm && (
                <form onSubmit={handleAddStore} style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <div className="form-group"><label>Name</label><input type="text" name="name" required value={newStore.name} onChange={handleNewStoreChange} /></div>
                        <div className="form-group"><label>Email</label><input type="email" name="email" required value={newStore.email} onChange={handleNewStoreChange} /></div>
                        <div className="form-group"><label>Address</label><input type="text" name="address" required value={newStore.address} onChange={handleNewStoreChange} /></div>
                        <div className="form-group"><label>Owner ID (User ID)</label><input type="number" name="owner_id" required value={newStore.owner_id} onChange={handleNewStoreChange} /></div>
                    </div>
                    <button type="submit" className="primary">Save Store</button>
                </form>
            )}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input type="text" name="name" placeholder="Filter by Name" value={filters.name} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" name="email" placeholder="Filter by Email" value={filters.email} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" name="address" placeholder="Filter by Address" value={filters.address} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name {sort === 'name' && (order === 'ASC' ? '↑' : '↓')}</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th onClick={() => handleSort('average_rating')} style={{ cursor: 'pointer' }}>Avg Rating {sort === 'average_rating' && (order === 'ASC' ? '↑' : '↓')}</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map(s => (
                        <tr key={s.id}>
                            <td>{s.name}</td>
                            <td>{s.email}</td>
                            <td>{s.address}</td>
                            <td>{Number(s.average_rating).toFixed(1)} / 5</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminStores;
