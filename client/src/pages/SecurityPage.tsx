import { useAuth } from '../context/AuthContext';
import { DashNav } from '../components/DashNav';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SecurityPage() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-layout">
      <DashNav />
      <main className="dash-main">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="dash-header">
            <h1>Security</h1>
            <p>Manage your account security and authentication methods.</p>
          </div>
          
          <div className="section-panel" style={{ marginBottom: '2rem' }}>
            <div className="panel-header">
              <h3 style={{ fontSize: '1.25rem' }}>Email Verification</h3>
            </div>
            <div className="panel-body">
              {user?.emailVerified ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <CheckCircle2 size={24} className="text-success" />
                  <div>
                    <p style={{ fontWeight: 500 }}>Your email is verified.</p>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>{user.email}</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <ShieldAlert size={24} className="text-warning" style={{ color: '#eab308' }} />
                    <div>
                      <p style={{ fontWeight: 500 }}>Your email is not verified.</p>
                      <p className="text-muted" style={{ fontSize: '0.875rem' }}>Verify your email to secure your account.</p>
                    </div>
                  </div>
                  <button className="btn btn-secondary">Resend Email</button>
                </div>
              )}
            </div>
          </div>
          
          <div className="section-panel" style={{ marginBottom: '2rem' }}>
            <div className="panel-header">
              <h3 style={{ fontSize: '1.25rem' }}>Password</h3>
            </div>
            <div className="panel-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 500 }}>Change your password</p>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Ensure you use a strong, unique password.</p>
              </div>
              <Link to="/forgot-password" className="btn btn-secondary">Reset Password</Link>
            </div>
          </div>
          
          <div className="section-panel" style={{ borderColor: 'var(--error-bg)' }}>
            <div className="panel-header" style={{ borderBottomColor: 'var(--error-bg)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--error)' }}>Danger Zone</h3>
            </div>
            <div className="panel-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontWeight: 500 }}>Sign out everywhere</p>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>Log out of all active sessions across all devices.</p>
                </div>
                <button onClick={logout} className="btn btn-danger">Sign Out All Devices</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
