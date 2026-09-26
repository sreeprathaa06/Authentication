import { Link } from 'react-router-dom';
import { Shield, Key, RefreshCcw, MailCheck, Lock, Users } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function Landing() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-pill">AUTHFORGE 2.0 IS LIVE</div>
            <h1>Authentication, <br /><span className="text-accent">forged properly.</span></h1>
            <p>
              Secure authentication infrastructure for modern applications. 
              Implement registration, JWT rotation, role-based access, and password recovery in minutes.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                Get Started
              </Link>
              <a href="#security" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                Explore Security
              </a>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="trust-strip">
          <div className="container">
            <div className="trust-item"><Lock size={16} /> JWT Authentication</div>
            <div className="trust-item"><Shield size={16} /> HTTP-only Cookies</div>
            <div className="trust-item"><RefreshCcw size={16} /> Refresh Token Rotation</div>
            <div className="trust-item"><MailCheck size={16} /> Email Verification</div>
            <div className="trust-item"><Key size={16} /> Password Reset</div>
            <div className="trust-item"><Users size={16} /> Role-Based Access</div>
          </div>
        </section>

        {/* Developer Experience Section */}
        <section className="section">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <div>
                <h2 style={{ marginBottom: '1.5rem' }}>Built for developers.</h2>
                <p style={{ marginBottom: '1rem' }}>
                  AuthForge provides a clean, predictable API that integrates seamlessly into any frontend framework.
                </p>
                <p>
                  Our architecture ensures that tokens are securely stored in HTTP-only cookies, protecting your application from XSS attacks out of the box.
                </p>
              </div>
              <div className="terminal">
                <div className="terminal-header">
                  <div className="term-dot red"></div>
                  <div className="term-dot yellow"></div>
                  <div className="term-dot green"></div>
                </div>
                <div className="terminal-body">
                  <span className="token-method">POST</span> <span className="token-url">/api/auth/login</span><br/><br/>
                  {"{"}<br/>
                  &nbsp;&nbsp;<span className="token-key">"email"</span>: <span className="token-string">"developer@example.com"</span>,<br/>
                  &nbsp;&nbsp;<span className="token-key">"password"</span>: <span className="token-string">"••••••••"</span><br/>
                  {"}"}<br/><br/>
                  <span style={{ color: '#5c6370' }}>// Response</span><br/>
                  <span className="token-url">200 OK</span><br/>
                  Set-Cookie: access_token=...; HttpOnly; Secure<br/>
                  Set-Cookie: refresh_token=...; HttpOnly; Secure
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2>Seamless integration flow</h2>
              <p style={{ maxWidth: '600px', margin: '1rem auto 0' }}>From registration to authenticated access in four steps.</p>
            </div>
            <div className="steps-wrapper">
              <div className="step">
                <div className="step-num">01 // Register</div>
                <h3>Create Account</h3>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Securely hash and store user credentials.</p>
              </div>
              <div className="step">
                <div className="step-num">02 // Verify</div>
                <h3>Email Verification</h3>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Confirm ownership via secure token links.</p>
              </div>
              <div className="step">
                <div className="step-num">03 // Authenticate</div>
                <h3>Login & Session</h3>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Issue rotating JWTs in secure HTTP-only cookies.</p>
              </div>
              <div className="step">
                <div className="step-num">04 // Access</div>
                <h3>Protected Routes</h3>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Access APIs with role-based authorization.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="section">
          <div className="container">
            <h2 style={{ textAlign: 'center' }}>Everything you need.</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon"><Lock size={20} /></div>
                <h3>Secure Authentication</h3>
                <p style={{ fontSize: '0.875rem' }}>Industry-standard bcrypt password hashing and secure credential handling.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><Shield size={20} /></div>
                <h3>JWT Access Tokens</h3>
                <p style={{ fontSize: '0.875rem' }}>Stateless authentication using signed JSON Web Tokens.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><RefreshCcw size={20} /></div>
                <h3>Refresh Token Rotation</h3>
                <p style={{ fontSize: '0.875rem' }}>Automatic session renewal with built-in token reuse detection.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><MailCheck size={20} /></div>
                <h3>Email Verification</h3>
                <p style={{ fontSize: '0.875rem' }}>Built-in flows to verify user email addresses securely.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><Key size={20} /></div>
                <h3>Password Recovery</h3>
                <p style={{ fontSize: '0.875rem' }}>Secure forgot/reset password flows with expiring tokens.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><Users size={20} /></div>
                <h3>Role-Based Auth</h3>
                <p style={{ fontSize: '0.875rem' }}>Granular access control based on user roles and permissions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="section" style={{ backgroundColor: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <Shield size={48} style={{ color: 'var(--accent)', margin: '0 auto 1.5rem' }} />
            <h2 style={{ marginBottom: '1.5rem' }}>Security isn't an afterthought.</h2>
            <p style={{ maxWidth: '800px', margin: '0 auto 3rem', fontSize: '1.125rem' }}>
              AuthForge is designed to protect against XSS, CSRF, and session hijacking by default. 
              Tokens are never exposed to JavaScript, and sessions are tightly monitored.
            </p>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
              Start Building Securely
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
