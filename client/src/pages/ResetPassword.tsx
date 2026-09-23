import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthLayout } from '../components/AuthLayout';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    if (password !== confirmPassword) {
      setStatus('error');
      return setMessage('Passwords do not match');
    }
    
    setStatus('loading');
    setMessage('');
    try {
      const res = await api.post('/auth/reset-password', { token, newPassword: password });
      setStatus('success');
      setMessage(res.data.message || 'Password reset successfully.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to reset password');
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Reset Password">
        <div className="error-alert">Invalid or missing reset token.</div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Enter New Password">
      {status === 'success' && (
        <div className="success-alert">
          {message}
          <div style={{ marginTop: '1rem' }}>
            <Link to="/login" className="btn btn-outline full-width">Continue to Login &rarr;</Link>
          </div>
        </div>
      )}
      {status === 'error' && <div className="error-alert">{message}</div>}
      
      {status !== 'success' && (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>New Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-input" />
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn btn-primary lg full-width">
            {status === 'loading' ? 'Resetting...' : 'Reset Password &rarr;'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}