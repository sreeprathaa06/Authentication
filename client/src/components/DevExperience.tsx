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