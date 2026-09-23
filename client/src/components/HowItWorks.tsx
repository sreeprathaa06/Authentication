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