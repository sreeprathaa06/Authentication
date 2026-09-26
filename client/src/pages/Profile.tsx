import { useAuth } from '../context/AuthContext';
import { DashNav } from '../components/DashNav';

export function Profile() {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <DashNav />
      <main className="dash-main">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="dash-header">
            <h1>Profile Settings</h1>
            <p>Manage your account information and preferences.</p>
          </div>
          
          <div className="section-panel">
            <div className="panel-header">
              <h3 style={{ fontSize: '1.25rem' }}>Personal Information</h3>
            </div>
            <div className="panel-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" value={user?.name || ''} readOnly disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={user?.email || ''} readOnly disabled />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">User ID</label>
                <input type="text" className="form-input" value={user?.id || ''} readOnly disabled style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
