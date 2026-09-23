import { Link } from 'react-router-dom';
import { Menu, ShieldCheck } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <ShieldCheck className="brand-icon" />
          <span>AUTHFORGE</span>
        </Link>
        <div className="navbar-links">
          <a href="#how-it-works">How It Works</a>
          <a href="#security">Security</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="navbar-actions">
          <Link to="/register" className="btn btn-primary">Get Started &rarr;</Link>
          <button className="menu-btn"><Menu /></button>
        </div>
      </div>
    </nav>
  );
}