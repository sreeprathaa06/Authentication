import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export function AuthLayout({ children, title, subtitle }: { children: ReactNode, title: string, subtitle?: string }) {
  return (
    <div className="auth-layout">
      <div className="auth-visual">
        <div className="auth-branding">
          <Link to="/" className="navbar-brand" style={{ color: 'white', marginBottom: '2rem', display: 'flex' }}>
            <ShieldCheck className="brand-icon" />
            <span>AUTHFORGE</span>
          </Link>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, color: 'white' }}>
            Authentication,<br/>forged properly.
          </h2>
          <p style={{ marginTop: '1rem', color: '#a1a1aa', fontSize: '1.125rem', maxWidth: '400px' }}>
            Secure authentication infrastructure for modern applications.
          </p>
        </div>
      </div>
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}