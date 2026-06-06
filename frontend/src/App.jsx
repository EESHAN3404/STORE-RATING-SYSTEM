import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import UserDetails from './pages/UserDetails';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="users/:id" element={<UserDetails />} />
                  <Route path="stores" element={<AdminStores />} />
                </Routes>
              </ProtectedRoute>
            } />

            <Route path="/user/*" element={
              <ProtectedRoute allowedRoles={['USER']}>
                <Routes>
                  <Route path="dashboard" element={<UserDashboard />} />
                </Routes>
              </ProtectedRoute>
            } />

            <Route path="/store-owner/*" element={
              <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                <Routes>
                  <Route path="dashboard" element={<StoreOwnerDashboard />} />
                </Routes>
              </ProtectedRoute>
            } />

            <Route path="/change-password" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'USER', 'STORE_OWNER']}>
                <ChangePassword />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
