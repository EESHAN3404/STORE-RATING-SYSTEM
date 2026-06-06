import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', formData);
            setSuccess('Registration successful! Please login.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            if(err.response?.data?.errors) {
                setError(err.response.data.errors.map(e => e.msg).join(', '));
            } else {
                setError(err.response?.data?.message || 'Registration failed');
            }
        }
    };

    return (
        <div className="card" style={{ maxWidth: '500px', margin: '40px auto' }}>
            <h2>Register</h2>
            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name (20-60 characters)</label>
                    <input type="text" name="name" required minLength="20" maxLength="60" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required onChange={handleChange} />
                </div>
                <div className="form-group" style={{ position: 'relative' }}>
                    <label>Password (8-16 chars, 1 uppercase, 1 special)</label>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        required 
                        minLength="8" 
                        maxLength="16" 
                        onChange={handleChange} 
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
                <div className="form-group">
                    <label>Address</label>
                    <input type="text" name="address" maxLength="400" onChange={handleChange} />
                </div>
                <button type="submit" className="primary">Register</button>
            </form>
        </div>
    );
}

export default Register;
