import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav>
            <div className="logo">
                <h2>Store Rating System</h2>
            </div>
            <div className="nav-links">
                {user ? (
                    <>
                        <span>Welcome, {user.name} ({user.role})</span>
                        
                        {user.role === 'ADMIN' && (
                            <>
                                <Link to="/admin/dashboard">Dashboard</Link>
                                <Link to="/admin/users">Manage Users</Link>
                                <Link to="/admin/stores">Manage Stores</Link>
                            </>
                        )}
                        
                        {user.role === 'USER' && (
                            <Link to="/user/dashboard">Stores List</Link>
                        )}
                        
                        {user.role === 'STORE_OWNER' && (
                            <Link to="/store-owner/dashboard">My Store Dashboard</Link>
                        )}
                        
                        <Link to="/change-password">Change Password</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
