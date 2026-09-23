import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.25rem', color: 'gray', marginBottom: '2rem' }}>Page not found</p>
      <Link to="/" className="btn btn-primary">Return Home</Link>
    </div>
  );
}