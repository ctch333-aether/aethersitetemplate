import React from 'react';

function AboutContent() {
  return (
    <>
      <h1>About AETHER</h1>

      <p>
        AETHER is a Brand & Creative Technology Atelier at the forefront of the phygital revolution.
        We transform how brands connect with audiences and how people experience entertainment through
        the seamless integration of physical environments and digital intelligence.
      </p>

      <div className="info-box">
        <p>
          <strong>AETHER</strong> — Named for the classical element thought to fill the universe,
          we create the invisible force that connects physical and digital worlds.
        </p>
      </div>

      <h2>Our Mission</h2>

      <div className="quote-box">
        <p>
          To democratize premium entertainment experiences through innovative technology,
          making wonder accessible to all.
        </p>
      </div>

      <h2>What We Do</h2>

      <ul className="feature-list">
        <li>
          <strong>Immersive Experience Design</strong> - Transformative environments that engage all senses
        </li>
        <li>
          <strong>Projection Mapping</strong> - Architectural and theatrical visual spectacles
        </li>
        <li>
          <strong>Interactive Installations</strong> - Responsive environments that react to presence
        </li>
        <li>
          <strong>IP Development</strong> - Original entertainment franchises for phygital deployment
        </li>
        <li>
          <strong>Platform Technology</strong> - The AETHER PXE system powering next-gen experiences
        </li>
      </ul>

      <h2>Our Values</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="number">♿</span>
          <span className="label">Accessibility First</span>
        </div>
        <div className="metric-card">
          <span className="number">🌍</span>
          <span className="label">Equity in Entertainment</span>
        </div>
        <div className="metric-card">
          <span className="number">✨</span>
          <span className="label">Wonder for All</span>
        </div>
        <div className="metric-card">
          <span className="number">🤝</span>
          <span className="label">Community Partnership</span>
        </div>
      </div>

      <div className="section-divider" />

      <h2>Contact</h2>

      <div className="highlight-box">
        <p><strong>AETHER Phygital Experience Platform</strong></p>
        <p>Transforming Entertainment. Connecting Worlds.</p>
        <p style={{ marginTop: '15px' }}>
          <strong>Inquiries:</strong> hello@aetherphygital.com
        </p>
      </div>

      <div className="takeaway-box">
        <p>
          <strong>Join us in building the future of entertainment.</strong> Whether you're a venue,
          brand, or creator, we'd love to explore how AETHER can transform your vision into reality.
        </p>
      </div>
    </>
  );
}

export default AboutContent;
