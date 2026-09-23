import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthLayout } from '../components/AuthLayout';

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
      {status === 'verifying' && <div className="status-alert">Verifying email...</div>}
      {status === 'error' && <div className="error-alert">{message}</div>}
      {status === 'success' && (
        <div className="success-alert">
          {message}
        </div>
      )}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to="/login" className="btn btn-outline lg">Continue to Login &rarr;</Link>
      </div>
    </AuthLayout>
  );
}