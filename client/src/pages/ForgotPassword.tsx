import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthLayout } from '../components/AuthLayout';

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
      {status === 'success' && <div className="success-alert">{message}</div>}
      {status === 'error' && <div className="error-alert">{message}</div>}
      
      {status !== 'success' && (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn btn-primary lg full-width">
            {status === 'loading' ? 'Sending...' : 'Send Reset Link &rarr;'}
          </button>
        </form>
      )}
      <p className="auth-footer">
        Remember your password? <Link to="/login" className="auth-link">Sign in</Link>
      </p>
    </AuthLayout>
  );
}