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