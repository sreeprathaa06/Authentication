import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div>
          <div className="nav-brand" style={{ marginBottom: '1rem' }}>
            <Shield className="icon" size={20} />
            <span>AuthForge</span>
          </div>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>
            Secure authentication infrastructure<br />for modern applications.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '3rem' }}>
          <div>
            <h4 style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Product</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li>Features</li>
              <li>Security</li>
              <li>Documentation</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Company</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li>About</li>
              <li>Blog</li>
              <li>GitHub</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
