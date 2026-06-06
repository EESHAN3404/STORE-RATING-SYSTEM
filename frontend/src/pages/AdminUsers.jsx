import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
    const [sort, setSort] = useState('name');
    const [order, setOrder] = useState('ASC');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [filters, sort, order]);

    const fetchUsers = async () => {
        try {
            const query = new URLSearchParams({ ...filters, sort, order }).toString();
            const res = await api.get(`/users?${query}`);
            setUsers(res.data.users);
        } catch (err) {
            console.error('Failed to fetch users', err);
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
    const handleNewUserChange = (e) => setNewUser({ ...newUser, [e.target.name]: e.target.value });

    const handleAddUser = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.post('/admin/users', newUser);
            setSuccess('User added successfully');
            setShowAddForm(false);
            setNewUser({ name: '', email: '', password: '', address: '', role: 'USER' });
            fetchUsers();
        } catch (err) {
            if(err.response?.data?.errors) {
                setError(err.response.data.errors.map(err => err.msg).join(', '));
            } else {
                setError(err.response?.data?.message || 'Failed to add user');
            }
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Manage Users</h2>
                <button className="primary" onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? 'Cancel' : '+ Add User'}
                </button>
            </div>

            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg" style={{color: 'green'}}>{success}</div>}

            {showAddForm && (
                <form onSubmit={handleAddUser} style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <div className="form-group"><label>Name</label><input type="text" name="name" required minLength="20" maxLength="60" value={newUser.name} onChange={handleNewUserChange} /></div>
                        <div className="form-group"><label>Email</label><input type="email" name="email" required value={newUser.email} onChange={handleNewUserChange} /></div>
                        
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label>Password</label>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                required 
                                minLength="8" 
                                maxLength="16" 
                                value={newUser.password} 
                                onChange={handleNewUserChange} 
                                style={{ paddingRight: '40px' }}
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>

                        <div className="form-group"><label>Address</label><input type="text" name="address" value={newUser.address} onChange={handleNewUserChange} /></div>
                        <div className="form-group">
                            <label>Role</label>
                            <select name="role" value={newUser.role} onChange={handleNewUserChange}>
                                <option value="USER">USER</option>
                                <option value="STORE_OWNER">STORE_OWNER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="primary">Save User</button>
                </form>
            )}

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input type="text" name="name" placeholder="Filter by Name" value={filters.name} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" name="email" placeholder="Filter by Email" value={filters.email} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" name="address" placeholder="Filter by Address" value={filters.address} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <select name="role" value={filters.role} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                    <option value="">All Roles</option>
                    <option value="USER">USER</option>
                    <option value="STORE_OWNER">STORE_OWNER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name {sort === 'name' && (order === 'ASC' ? '↑' : '↓')}</th>
                        <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>Email {sort === 'email' && (order === 'ASC' ? '↑' : '↓')}</th>
                        <th onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>Role {sort === 'role' && (order === 'ASC' ? '↑' : '↓')}</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td><span className={`badge ${u.role}`}>{u.role}</span></td>
                            <td>{u.address}</td>
                            <td><button onClick={() => navigate(`/admin/users/${u.id}`)} style={{cursor:'pointer', padding: '5px 10px'}}>View Details</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminUsers;
