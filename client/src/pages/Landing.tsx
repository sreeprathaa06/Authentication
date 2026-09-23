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