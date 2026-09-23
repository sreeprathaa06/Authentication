import os

def write_file(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

api_ts = '''
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      try {
        await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
'''

auth_context_tsx = '''
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
'''

protected_route_tsx = '''
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
'''

auth_layout_tsx = '''
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export function AuthLayout({ children, title, subtitle }: { children: ReactNode, title: string, subtitle?: string }) {
  return (
    <div className="auth-layout">
      <div className="auth-visual">
        <div className="auth-branding">
          <Link to="/" className="navbar-brand" style={{ color: 'white', marginBottom: '2rem', display: 'flex' }}>
            <ShieldCheck className="brand-icon" />
            <span>AUTHFORGE</span>
          </Link>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, color: 'white' }}>
            Authentication,<br/>forged properly.
          </h2>
          <p style={{ marginTop: '1rem', color: '#a1a1aa', fontSize: '1.125rem', maxWidth: '400px' }}>
            Secure authentication infrastructure for modern applications.
          </p>
        </div>
      </div>
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
'''

login_tsx = '''
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
'''

register_tsx = '''
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthLayout } from '../components/AuthLayout';

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
      <AuthLayout title="Check your email">
        <div className="success-alert">
          Registration successful. A verification link has been sent to your email address.
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create Account">
      {error && <div className="error-alert">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
        </div>
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
          <small className="form-help">Must be at least 8 characters</small>
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-input" />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary lg full-width">
          {loading ? 'Creating Account...' : 'Create Account &rarr;'}
        </button>
        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
'''

verify_email_tsx = '''
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
'''

forgot_password_tsx = '''
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
'''

reset_password_tsx = '''
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
'''

dashboard_tsx = '''
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';

export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-layout">
      <header className="dash-header">
        <div className="dash-brand">AuthForge</div>
        <button onClick={logout} className="btn btn-outline">Logout</button>
      </header>
      <main className="dash-main section-padding">
        <div className="section-header">
          <h2>Welcome back, {user?.name || 'User'}</h2>
          <p className="eyebrow" style={{ marginTop: '0.5rem' }}>DASHBOARD OVERVIEW</p>
        </div>
        
        <div className="dash-grid">
          <div className="dash-card">
            <div className="dash-label">Email</div>
            <div className="dash-value">{user?.email}</div>
          </div>
          <div className="dash-card">
            <div className="dash-label">Email Status</div>
            <div className="dash-value">{user?.emailVerified ? '✅ Verified' : '❌ Unverified'}</div>
          </div>
          <div className="dash-card">
            <div className="dash-label">Role</div>
            <div className="dash-value" style={{ textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
          <div className="dash-card">
            <div className="dash-label">Session</div>
            <div className="dash-value" style={{ color: 'var(--accent)' }}>Active</div>
          </div>
        </div>
        
        <div style={{ marginTop: '4rem' }}>
          <h3>Recent Security Activity</h3>
          <div className="activity-list">
            <div className="activity-item">Static UI: Real backend event logs not implemented.</div>
          </div>
        </div>
      </main>
    </div>
  );
}
'''

not_found_tsx = '''
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
'''

app_tsx = '''
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { VerifyEmail } from './pages/VerifyEmail';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';

import './App.css'; 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Dashboard />} />
            <Route path="/security" element={<Dashboard />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
'''

css_append = '''

/* Auth Layout */
.auth-layout { display: flex; min-height: 100vh; }
.auth-visual { flex: 1; background: var(--bg-dark); padding: 4rem; display: flex; flex-direction: column; justify-content: center; }
.auth-form-container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; background: var(--bg-primary); }
.auth-form-wrapper { width: 100%; max-width: 400px; }
.auth-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.03em; }
.auth-subtitle { color: var(--text-secondary); margin-bottom: 2rem; }

.auth-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-weight: 600; font-size: 0.875rem; }
.form-input { padding: 0.75rem 1rem; border: 2px solid var(--border-color); border-radius: var(--radius-md); font-family: inherit; font-size: 1rem; transition: border-color 0.2s; outline: none; }
.form-input:focus { border-color: #000; }
.form-help { color: var(--text-secondary); font-size: 0.75rem; }

.password-input-wrapper { position: relative; display: flex; align-items: center; }
.password-input-wrapper input { width: 100%; padding-right: 4rem; }
.toggle-password { position: absolute; right: 1rem; background: none; border: none; font-weight: 600; font-size: 0.75rem; cursor: pointer; color: var(--text-secondary); }
.toggle-password:hover { color: #000; }

.full-width { width: 100%; }
.auth-footer { text-align: center; margin-top: 1.5rem; color: var(--text-secondary); font-size: 0.875rem; }
.auth-link { color: #000; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
.form-options { display: flex; justify-content: flex-end; font-size: 0.875rem; }

.error-alert { padding: 1rem; background: #fee2e2; color: #991b1b; border-radius: var(--radius-md); margin-bottom: 1.5rem; font-weight: 500; font-size: 0.875rem; border: 1px solid #fca5a5; }
.success-alert { padding: 1rem; background: #ecfccb; color: #3f6212; border-radius: var(--radius-md); margin-bottom: 1.5rem; font-weight: 500; font-size: 0.875rem; border: 1px solid #d9f99d; }
.status-alert { padding: 1rem; background: #f3f4f6; color: #1f2937; border-radius: var(--radius-md); margin-bottom: 1.5rem; font-weight: 500; font-size: 0.875rem; border: 1px solid #e5e7eb; }

/* Dashboard */
.dashboard-layout { min-height: 100vh; background: var(--bg-secondary); }
.dash-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: var(--bg-primary); border-bottom: 1px solid var(--border-color); }
.dash-brand { font-weight: 800; font-size: 1.25rem; }
.dash-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
.dash-card { background: #fff; padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); }
.dash-label { font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
.dash-value { font-size: 1.25rem; font-weight: 600; }
.activity-list { background: #fff; border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; }
.activity-item { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); font-size: 0.875rem; color: var(--text-secondary); }
.activity-item:last-child { border-bottom: none; }

@media (max-width: 768px) {
  .auth-layout { flex-direction: column; }
  .auth-visual { padding: 2rem; }
  .auth-form-container { padding: 2rem 1rem; }
}
'''

def append_file(filepath, content):
    with open(filepath, 'a', encoding='utf-8') as f:
        f.write(content)

write_file('src/services/api.ts', api_ts.strip())
write_file('src/context/AuthContext.tsx', auth_context_tsx.strip())
write_file('src/components/ProtectedRoute.tsx', protected_route_tsx.strip())
write_file('src/components/AuthLayout.tsx', auth_layout_tsx.strip())
write_file('src/pages/Login.tsx', login_tsx.strip())
write_file('src/pages/Register.tsx', register_tsx.strip())
write_file('src/pages/VerifyEmail.tsx', verify_email_tsx.strip())
write_file('src/pages/ForgotPassword.tsx', forgot_password_tsx.strip())
write_file('src/pages/ResetPassword.tsx', reset_password_tsx.strip())
write_file('src/pages/Dashboard.tsx', dashboard_tsx.strip())
write_file('src/pages/NotFound.tsx', not_found_tsx.strip())
write_file('src/App.tsx', app_tsx.strip())

append_file('src/index.css', css_append)
