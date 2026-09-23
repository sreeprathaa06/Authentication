import os

def write_file(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

components = {
    'Navbar.tsx': '''
import { Link } from 'react-router-dom';
import { Menu, ShieldCheck } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <ShieldCheck className="brand-icon" />
          <span>AUTHFORGE</span>
        </Link>
        <div className="navbar-links">
          <a href="#how-it-works">How It Works</a>
          <a href="#security">Security</a>
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="navbar-actions">
          <Link to="/register" className="btn btn-primary">Get Started &rarr;</Link>
          <button className="menu-btn"><Menu /></button>
        </div>
      </div>
    </nav>
  );
}
''',
    'Hero.tsx': '''
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
''',
    'TrustStrip.tsx': '''
export function TrustStrip() {
  return (
    <div className="trust-strip">
      <div className="trust-item">AUTHENTICATION</div>
      <div className="trust-item">EMAIL VERIFICATION</div>
      <div className="trust-item">SESSION SECURITY</div>
      <div className="trust-item">ROLE ACCESS</div>
      <div className="trust-item">PASSWORD RECOVERY</div>
    </div>
  );
}
''',
    'HowItWorks.tsx': '''
export function HowItWorks() {
  const steps = [
    { num: '01', title: 'Register', desc: 'Secure user creation' },
    { num: '02', title: 'Verify', desc: 'Email ownership check' },
    { num: '03', title: 'Authenticate', desc: 'Robust login' },
    { num: '04', title: 'Refresh', desc: 'Silent session renewal' },
    { num: '05', title: 'Authorize', desc: 'Role-based access' },
    { num: '06', title: 'Sign out', desc: 'Clean termination' }
  ];
  return (
    <section id="how-it-works" className="section-padding">
      <div className="section-header">
        <h2>One authentication flow. Every essential step.</h2>
      </div>
      <div className="steps-grid">
        {steps.map(s => (
          <div key={s.num} className="step-card">
            <div className="step-num">{s.num}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
''',
    'Features.tsx': '''
export function Features() {
  return (
    <section id="features" className="section-padding">
      <div className="features-grid">
        <div className="feature-block">
          <span className="eyebrow">SECURITY FIRST</span>
          <h3>Credentials stay protected.</h3>
          <ul className="feature-list">
            <li>Password hashing (bcrypt)</li>
            <li>Secure token storage</li>
            <li>Session revocation</li>
          </ul>
        </div>
        <div className="feature-block">
          <span className="eyebrow">SESSION CONTROL</span>
          <h3>Sessions that behave predictably.</h3>
          <ul className="feature-list">
            <li>Access tokens (JWT)</li>
            <li>Refresh token rotation</li>
            <li>HTTP-Only cookies</li>
            <li>Secure Logout</li>
          </ul>
        </div>
        <div className="feature-block">
          <span className="eyebrow">IDENTITY VERIFICATION</span>
          <h3>Know who is signing in.</h3>
          <ul className="feature-list">
            <li>Email verification</li>
            <li>Password recovery</li>
            <li>Role-Based Authorization</li>
            <li>Input Validation</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
''',
    'SecuritySection.tsx': '''
export function SecuritySection() {
  return (
    <section id="security" className="section-padding dark-section">
      <div className="security-content">
        <h2>Security isn't an add-on.</h2>
        <p>Built with HTTP-only cookies, robust rate limiting, and secure token rotation to prevent theft and session hijacking.</p>
        <div className="flow-visual">
          USER &rarr; AUTHENTICATE &rarr; ACCESS TOKEN &rarr; PROTECTED API &rarr; REFRESH &rarr; NEW SESSION
        </div>
      </div>
    </section>
  );
}
''',
    'DevExperience.tsx': '''
export function DevExperience() {
  return (
    <section className="section-padding dev-section">
      <div className="section-header">
        <h2>Built to make authentication predictable.</h2>
      </div>
      <div className="code-grid">
        <div className="code-block">POST /api/auth/login</div>
        <div className="code-block">GET /api/auth/me</div>
        <div className="code-block">POST /api/auth/refresh</div>
        <div className="code-block">POST /api/auth/logout</div>
      </div>
    </section>
  );
}
''',
    'FAQ.tsx': '''
export function FAQ() {
  return (
    <section id="faq" className="section-padding">
      <div className="section-header">
        <h2>Frequently Asked Questions</h2>
      </div>
      <div className="faq-list">
        <div className="faq-item">
          <h4>Are tokens exposed to the frontend?</h4>
          <p>No, all tokens are stored in secure HTTP-only cookies, invisible to JavaScript.</p>
        </div>
        <div className="faq-item">
          <h4>How does session rotation work?</h4>
          <p>Refresh tokens are rotated automatically. If a token is reused, all sessions for that user are revoked.</p>
        </div>
      </div>
    </section>
  );
}
''',
    'Footer.tsx': '''
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <h3>AuthForge</h3>
        <p>Authentication, forged properly.</p>
      </div>
      <div className="footer-links">
        <a href="#security">Security</a>
        <a href="#features">Features</a>
        <a href="#">Documentation</a>
        <a href="#">GitHub</a>
      </div>
    </footer>
  );
}
'''
}

landing_page = '''
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { TrustStrip } from '../components/TrustStrip';
import { HowItWorks } from '../components/HowItWorks';
import { Features } from '../components/Features';
import { SecuritySection } from '../components/SecuritySection';
import { DevExperience } from '../components/DevExperience';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <Features />
        <SecuritySection />
        <DevExperience />
        <FAQ />
        
        <section className="section-padding final-cta">
          <h2>Ready to forge a secure login experience?</h2>
          <Link to="/register" className="btn btn-primary lg cta-btn">Get Started &rarr;</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
'''

app_tsx = '''
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import './App.css'; // Optional additional styles

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<div style={{padding: '4rem', textAlign: 'center'}}><h2>Register Page (Coming Soon)</h2></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
'''

css_content = '''
:root {
  --bg-primary: #fcfcfc;
  --bg-secondary: #f3f4f6;
  --bg-dark: #121212;
  --text-primary: #0a0a0a;
  --text-secondary: #52525b;
  --text-light: #f4f4f5;
  --accent: #d9f95d;
  --accent-hover: #c4e44c;
  --border-color: #e4e4e7;
  --border-dark: #27272a;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-editorial: 4px 4px 0px 0px rgba(10, 10, 10, 1);
  
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 20px;
  
  --font-primary: 'Inter', system-ui, sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-primary);
  background: var(--bg-primary);
  color: var(--text-primary);
}

a { text-decoration: none; color: inherit; }
ul { list-style: none; padding: 0; margin: 0; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}
.btn.lg { padding: 0.75rem 1.5rem; font-size: 1.125rem; }
.btn-primary { background: var(--accent); color: #000; box-shadow: var(--shadow-editorial); border: 2px solid #000; }
.btn-primary:hover { background: var(--accent-hover); transform: translate(-2px, -2px); box-shadow: 6px 6px 0px 0px rgba(10, 10, 10, 1); }
.btn-outline { background: transparent; border: 2px solid var(--text-primary); color: var(--text-primary); }
.btn-outline:hover { background: var(--bg-secondary); }

.navbar { padding: 1rem 2rem; border-bottom: 1px solid var(--border-color); background: var(--bg-primary); position: sticky; top: 0; z-index: 100; }
.navbar-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.navbar-brand { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; font-size: 1.25rem; letter-spacing: -0.02em; }
.navbar-links { display: flex; gap: 2rem; font-weight: 500; }
.navbar-links a:hover { color: var(--accent); }
.navbar-actions { display: flex; align-items: center; gap: 1rem; }
.menu-btn { display: none; background: none; border: none; cursor: pointer; }

@media (max-width: 768px) {
  .navbar-links, .btn-primary { display: none; }
  .menu-btn { display: block; }
}

.section-padding { padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; }
.section-header { margin-bottom: 3rem; }
.section-header h2 { font-size: 2.5rem; letter-spacing: -0.03em; margin: 0; }
.eyebrow { font-size: 0.875rem; font-weight: 700; color: var(--text-secondary); letter-spacing: 0.05em; margin-bottom: 1rem; display: block; }

.hero-section { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; padding: 6rem 2rem; max-width: 1200px; margin: 0 auto; align-items: center; }
.hero-title { font-size: 4rem; font-weight: 800; line-height: 1.1; letter-spacing: -0.04em; margin-bottom: 1.5rem; }
.hero-description { font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2.5rem; max-width: 480px; }
.hero-actions { display: flex; gap: 1rem; }

.visual-grid { display: flex; flex-direction: column; gap: 1rem; padding: 2rem; background: var(--bg-secondary); border-radius: var(--radius-xl); border: 1px solid var(--border-color); }
.v-card { padding: 1rem 1.5rem; background: #fff; border-radius: var(--radius-md); border: 2px solid var(--border-color); font-weight: 600; display: flex; align-items: center; gap: 0.75rem; box-shadow: var(--shadow-sm); }
.v-card.highlight { background: var(--accent); border-color: #000; box-shadow: var(--shadow-editorial); }

@media (max-width: 768px) {
  .hero-section { grid-template-columns: 1fr; padding: 4rem 1.5rem; }
  .hero-title { font-size: 3rem; }
}

.trust-strip { display: flex; flex-wrap: wrap; justify-content: center; gap: 3rem; padding: 2rem; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); font-weight: 700; font-size: 0.875rem; color: var(--text-secondary); letter-spacing: 0.05em; background: #fafafa; }

.steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
.step-card { padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); background: #fff; transition: transform 0.2s; }
.step-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.step-num { font-size: 3rem; font-weight: 800; color: var(--border-color); margin-bottom: 1rem; line-height: 1; }
.step-card h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }

.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem; }
.feature-block h3 { font-size: 1.5rem; margin-bottom: 1.5rem; }
.feature-list li { padding: 1rem; border-bottom: 1px solid var(--border-color); font-weight: 500; }
.feature-list li:last-child { border-bottom: none; }

.dark-section { background: var(--bg-dark); color: var(--text-light); border-radius: var(--radius-xl); margin: 2rem auto; text-align: center; }
.dark-section h2 { font-size: 3rem; margin-bottom: 1rem; }
.dark-section p { color: #a1a1aa; max-width: 600px; margin: 0 auto 3rem; font-size: 1.125rem; }
.flow-visual { padding: 2rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border-dark); border-radius: var(--radius-md); font-family: monospace; font-size: 1.125rem; font-weight: 600; letter-spacing: 0.1em; color: var(--accent); word-break: break-all; }

.code-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
.code-block { padding: 1.5rem; background: var(--bg-secondary); border-radius: var(--radius-md); font-family: monospace; font-weight: 600; color: var(--text-secondary); border: 1px solid var(--border-color); }

.faq-list { display: grid; gap: 2rem; max-width: 800px; }
.faq-item h4 { font-size: 1.25rem; margin-bottom: 0.5rem; }
.faq-item p { color: var(--text-secondary); }

.final-cta { text-align: center; padding: 6rem 2rem; }
.final-cta h2 { font-size: 3rem; margin-bottom: 2rem; }

.footer { background: var(--bg-primary); border-top: 1px solid var(--border-color); padding: 4rem 2rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 2rem; }
.footer-brand h3 { margin: 0 0 0.5rem; font-size: 1.25rem; }
.footer-brand p { color: var(--text-secondary); margin: 0; }
.footer-links { display: flex; gap: 2rem; font-weight: 500; }
'''

# Write components
for name, content in components.items():
    write_file(f'src/components/{name}', content.strip())

# Write pages
write_file('src/pages/Landing.tsx', landing_page.strip())

# Write App
write_file('src/App.tsx', app_tsx.strip())

# Write CSS
write_file('src/index.css', css_content.strip())
write_file('src/App.css', '')
