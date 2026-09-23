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