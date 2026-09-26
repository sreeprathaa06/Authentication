import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <Shield size={64} style={{ margin: '0 auto 2rem', color: 'var(--border-strong)' }} />
          <h1 style={{ fontSize: '5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>404</h1>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page not found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
            The page you are looking for doesn't exist or has been moved securely.
          </p>
          <Link to="/" className="btn btn-primary">Return Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
