import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function AuthLayout({ children, title, subtitle }: { children: ReactNode, title: string, subtitle?: string }) {
  return (
    <div className="auth-page">
      <div className="auth-left">
        <div>
          <Link to="/" className="nav-brand">
            <Shield className="icon" size={28} />
            <span style={{ fontSize: '1.5rem' }}>AuthForge</span>
          </Link>
        </div>
        <div className="auth-left-content">
          <h1>Authentication, forged properly.</h1>
          <p style={{ fontSize: '1.125rem' }}>
            Secure infrastructure with JWT rotation, role-based access, and stateless session management built right in.
          </p>
        </div>
        <div>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>&copy; {new Date().getFullYear()} AuthForge</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-container">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{title}</h2>
            {subtitle && <p className="text-muted">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
