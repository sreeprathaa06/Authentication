import { Link, useLocation } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function DashNav() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="dash-nav">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Link to="/dashboard" className="nav-brand">
            <Shield className="icon" size={24} />
            <span>AuthForge</span>
          </Link>
          <div className="dash-links">
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Overview</Link>
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
            <Link to="/security" className={location.pathname === '/security' ? 'active' : ''}>Security</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin</Link>
            )}
          </div>
        </div>
        <div className="nav-actions">
          <button onClick={logout} className="btn btn-secondary">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
