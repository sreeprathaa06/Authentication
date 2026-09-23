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