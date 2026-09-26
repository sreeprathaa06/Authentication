import { useAuth } from '../context/AuthContext';
import { DashNav } from '../components/DashNav';
import { Navigate } from 'react-router-dom';
import { Users, Shield, Server } from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="dashboard-layout">
      <DashNav />
      <main className="dash-main">
        <div className="container">
          <div className="dash-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h1>Admin Portal</h1>
              <span className="badge badge-warning" style={{ backgroundColor: 'rgba(217, 249, 157, 0.1)', color: 'var(--accent)' }}>Restricted Area</span>
            </div>
            <p>System configuration and user management.</p>
          </div>
          
          <div className="dash-grid">
            <div className="dash-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Users size={18} className="text-accent" />
                <div className="dash-card-label" style={{ marginBottom: 0 }}>Total Users</div>
              </div>
              <div className="dash-card-value">1</div>
            </div>
            <div className="dash-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Shield size={18} className="text-accent" />
                <div className="dash-card-label" style={{ marginBottom: 0 }}>Security Alerts</div>
              </div>
              <div className="dash-card-value">0</div>
            </div>
            <div className="dash-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Server size={18} className="text-accent" />
                <div className="dash-card-label" style={{ marginBottom: 0 }}>System Status</div>
              </div>
              <div className="dash-card-value"><span style={{ color: 'var(--success)' }}>Operational</span></div>
            </div>
          </div>
          
          <div className="section-panel">
            <div className="panel-header">
              <h3 style={{ fontSize: '1.25rem' }}>Platform Access Logs</h3>
            </div>
            <div className="panel-body">
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <th style={{ padding: '0.75rem 0', fontWeight: 500 }}>User ID</th>
                    <th style={{ padding: '0.75rem 0', fontWeight: 500 }}>Email</th>
                    <th style={{ padding: '0.75rem 0', fontWeight: 500 }}>Event</th>
                    <th style={{ padding: '0.75rem 0', fontWeight: 500 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem 0', fontFamily: 'monospace', fontSize: '0.875rem' }}>{user.id.substring(0, 8)}...</td>
                    <td style={{ padding: '1rem 0', fontSize: '0.875rem' }}>{user.email}</td>
                    <td style={{ padding: '1rem 0', fontSize: '0.875rem' }}>Admin Access</td>
                    <td style={{ padding: '1rem 0' }}><span className="badge badge-success">Authorized</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
