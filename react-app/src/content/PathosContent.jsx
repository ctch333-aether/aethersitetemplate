import React from 'react';

function PathosContent() {
  return (
    <>
      <h1>The Crisis We're Solving: A Problem of Equity and Access</h1>

      <div className="info-box">
        <p>
          <strong>Entertainment accessibility is an equity problem across both content and commerce.</strong>{' '}
          This is not hyperbole—it is the stark reality facing millions of families across North America
          and beyond.
        </p>
      </div>

      <div className="problem-card">
        <h4>The Problem</h4>
        <p>
          Theme park tickets now exceed $150 per person. Concert tickets routinely cost $200+.
          Premium entertainment has become a luxury that excludes the majority of families.
        </p>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="number">$600+</span>
            <span className="label">Average Family Theme Park Day</span>
          </div>
          <div className="metric-card">
            <span className="number">78%</span>
            <span className="label">Families Priced Out of Premium Entertainment</span>
          </div>
        </div>
      </div>

      <div className="solution-card">
        <h4>The AETHER Solution</h4>
        <p>
          We believe premium entertainment should be accessible to everyone. Our equity-based pricing
          model and phygital platform create experiences that don't require massive infrastructure
          or premium pricing.
        </p>
        <ul className="feature-list">
          <li>Location-flexible deployments that bring experiences to communities</li>
          <li>Equity-conscious pricing structures</li>
          <li>Technology that scales without proportional cost increases</li>
          <li>Community partnership models</li>
        </ul>
      </div>

      <h2>Emotional Impact Through Story</h2>

      <div className="quote-box">
        <p>
          "Every child deserves to experience wonder. Every family deserves magical moments together.
          We're building the technology to make that possible."
        </p>
      </div>

      <h2>Tales of Lucidia: Our Flagship IP</h2>

      <div className="highlight-box">
        <img
          src="/assets/webp/aether-ip-tales-of-lucidia.webp"
          alt="Tales of Lucidia"
          style={{ maxWidth: '100%', marginBottom: '15px' }}
        />
        <p>
          <strong>Tales of Lucidia</strong> is our original entertainment franchise designed from the
          ground up for phygital deployment. Set in a world where dreams and reality interweave,
          it features diverse characters, inclusive narratives, and multi-platform storytelling.
        </p>
      </div>

      <h3>Connected IP Universe</h3>

      <div className="brands-grid">
        <div className="brand-card">
          <img
            src="/assets/webp/aether-ip-maryjane-mainframe.webp"
            alt="MaryJane Mainframe"
          />
          <h4>MaryJane Mainframe</h4>
          <p>
            A cyberpunk adventure exploring digital consciousness and human connection.
          </p>
        </div>

        <div className="brand-card">
          <img
            src="/assets/webp/aether-ip-metamorphasis-apothecary.webp"
            alt="Metamorphasis Apothecary"
          />
          <h4>Metamorphasis Apothecary</h4>
          <p>
            Fantasy alchemy meets modern wellness in this transformative experience.
          </p>
        </div>
      </div>

      <div className="section-divider" />

      <h2>Human-Centered Design Philosophy</h2>

      <p>
        Every AETHER experience begins with empathy. We design for real people with real lives,
        creating moments of connection, wonder, and joy that transcend economic barriers.
      </p>

      <div className="takeaway-box">
        <p>
          <strong>The future of entertainment must be equitable.</strong> We're proving that premium
          experiences don't require premium prices—they require innovative thinking and technology
          deployed with purpose.
        </p>
      </div>
    </>
  );
}

export default PathosContent;
