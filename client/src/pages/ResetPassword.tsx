import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthLayout } from '../components/AuthLayout';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>Invalid or missing reset token.</span>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Enter New Password">
      {status === 'success' && (
        <div>
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
          <Link to="/login" className="btn btn-secondary" style={{ width: '100%', padding: '0.75rem' }}>Continue to Login</Link>
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
            <label className="form-label">New Password</label>
            <div className="password-input-wrapper">
              <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-input" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
