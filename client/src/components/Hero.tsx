import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <span className="eyebrow">SECURE AUTHENTICATION INFRASTRUCTURE</span>
        <h1 className="hero-title">Authentication,<br/>forged properly.</h1>
        <p className="hero-description">
          Secure authentication infrastructure for modern applications &mdash; registration, email verification, secure sessions, password recovery and role-based access.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary lg">Get Started &rarr;</Link>
          <a href="#security" className="btn btn-outline lg">View Security</a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="visual-grid">
          <div className="v-card highlight"><CheckCircle2 className="icon-sm" /> Identity</div>
          <div className="v-card"><CheckCircle2 className="icon-sm" /> Verified</div>
          <div className="v-card"><CheckCircle2 className="icon-sm" /> Secure Session</div>
          <div className="v-card"><CheckCircle2 className="icon-sm" /> Role Access</div>
          <div className="v-card"><CheckCircle2 className="icon-sm" /> Token Rotation</div>
        </div>
      </div>
    </section>
  );
}