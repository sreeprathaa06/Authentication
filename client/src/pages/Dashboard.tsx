import { useAuth } from '../context/AuthContext';

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