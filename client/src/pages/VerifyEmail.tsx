import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthLayout } from '../components/AuthLayout';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully.');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Email verification failed');
      }
    };

    verify();
  }, [token]);

  return (
    <AuthLayout title="Email Verification">
      {status === 'verifying' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
          <Loader2 className="icon animate-spin" size={32} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
          <p>Verifying your email address...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{message}</span>
        </div>
      )}
      {status === 'success' && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}
      
      {status !== 'verifying' && (
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Continue to Login</Link>
        </div>
      )}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </AuthLayout>
  );
}
