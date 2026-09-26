import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthLayout } from '../components/AuthLayout';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setStatus('success');
      setMessage(res.data.message || 'Check your email for a password reset link.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to receive a password reset link.">
      {status === 'success' && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}
      {status === 'error' && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{message}</span>
        </div>
      )}
      
      {status !== 'success' && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="developer@example.com" />
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem' }}>
        Remember your password? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
      </p>
    </AuthLayout>
  );
}
