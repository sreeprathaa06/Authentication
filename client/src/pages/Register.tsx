import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthLayout } from '../components/AuthLayout';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent a verification link to your email address.">
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>Registration successful. Please verify your email to continue.</span>
        </div>
        <Link to="/login" className="btn btn-secondary" style={{ width: '100%', padding: '0.75rem' }}>
          Return to Sign In
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create Account" subtitle="Start building securely today.">
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="form-input" placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="john@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="password-input-wrapper">
            <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="••••••••" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Must be at least 8 characters</p>
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-input" placeholder="••••••••" />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
