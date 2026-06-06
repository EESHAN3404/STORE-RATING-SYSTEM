import { useState } from 'react';
import api from '../services/api';

function ChangePassword() {
    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '' });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await api.put('/users/change-password', formData);
            setSuccess('Password updated successfully!');
            setFormData({ oldPassword: '', newPassword: '' });
        } catch (err) {
            if(err.response?.data?.errors) {
                setError(err.response.data.errors.map(err => err.msg).join(', '));
            } else {
                setError(err.response?.data?.message || 'Failed to change password');
            }
        }
    };

    return (
        <div className="card" style={{ maxWidth: '500px', margin: '40px auto' }}>
            <h2>Change Password</h2>
            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ position: 'relative' }}>
                    <label>Current Password</label>
                    <input 
                        type={showOldPassword ? "text" : "password"} 
                        name="oldPassword" 
                        required 
                        value={formData.oldPassword}
                        onChange={handleChange} 
                        style={{ paddingRight: '40px' }}
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowOldPassword(!showOldPassword)} 
                        style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                    >
                        {showOldPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                    </button>
                </div>
                <div className="form-group" style={{ position: 'relative' }}>
                    <label>New Password (8-16 chars, 1 uppercase, 1 special)</label>
                    <input 
                        type={showNewPassword ? "text" : "password"} 
                        name="newPassword" 
                        required 
                        minLength="8" 
                        maxLength="16" 
                        value={formData.newPassword}
                        onChange={handleChange} 
                        style={{ paddingRight: '40px' }}
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowNewPassword(!showNewPassword)} 
                        style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                    >
                        {showNewPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                    </button>
                </div>
                <button type="submit" className="primary">Update Password</button>
            </form>
        </div>
    );
}

export default ChangePassword;
