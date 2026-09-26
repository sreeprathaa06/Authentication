import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">
          <Shield className="icon" size={24} />
          <span>AuthForge</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Product</Link>
          <a href="#security">Security</a>
          <a href="#features">Features</a>
          <a href="#">Documentation</a>
        </div>
        <div className="nav-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
