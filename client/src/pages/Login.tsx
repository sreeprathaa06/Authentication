import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/login', { email, password });
      await checkAuth();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In">
      {error && <div className="error-alert">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-input-wrapper">
            <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <div className="form-options">
          <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary lg full-width">
          {loading ? 'Signing in...' : 'Sign In &rarr;'}
        </button>
        <p className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Create account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}