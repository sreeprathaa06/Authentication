import { useAuth } from '../context/AuthContext';
import { DashNav } from '../components/DashNav';
import { Activity, Key, Shield, User } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <DashNav />
      <main className="dash-main">
        <div className="container">
          <div className="dash-header">
            <h1>Welcome back, {user?.name || 'Developer'}</h1>
            <p>Here's an overview of your authentication status and account details.</p>
          </div>
          
          <div className="dash-grid">
            <div className="dash-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <User size={18} className="text-accent" />
                <div className="dash-card-label" style={{ marginBottom: 0 }}>Account Status</div>
              </div>
              <div className="dash-card-value">Active</div>
            </div>
            <div className="dash-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Shield size={18} className="text-accent" />
                <div className="dash-card-label" style={{ marginBottom: 0 }}>Role</div>
              </div>
              <div className="dash-card-value" style={{ textTransform: 'capitalize' }}>
                {user?.role}
              </div>
            </div>
            <div className="dash-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Activity size={18} className="text-accent" />
                <div className="dash-card-label" style={{ marginBottom: 0 }}>Verification</div>
              </div>
              <div className="dash-card-value">
                {user?.emailVerified ? 
                  <span className="badge badge-success">Verified</span> : 
                  <span className="badge badge-warning">Unverified</span>
                }
              </div>
            </div>
            <div className="dash-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Key size={18} className="text-accent" />
                <div className="dash-card-label" style={{ marginBottom: 0 }}>Current Session</div>
              </div>
              <div className="dash-card-value">
                <span className="badge badge-success">Secure</span>
              </div>
            </div>
          </div>
          
          <div className="section-panel">
            <div className="panel-header">
              <h3 style={{ fontSize: '1.25rem' }}>Recent Security Activity</h3>
            </div>
            <div className="panel-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <Key size={20} className="text-muted" />
                </div>
                <div>
                  <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Successful Login</p>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>System recognized your credentials and issued a secure session.</p>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Just now
                </div>
              </div>
              {user?.emailVerified && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
                  <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <Shield size={20} className="text-success" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Email Verified</p>
                    <p className="text-muted" style={{ fontSize: '0.875rem' }}>Your email address was successfully verified.</p>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Completed
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
