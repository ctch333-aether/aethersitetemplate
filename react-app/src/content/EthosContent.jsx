import React from 'react';

function EthosContent() {
  return (
    <>
      <h1>The AETHER Vision: Where Worlds Converge</h1>

      <p>
        The future of entertainment merges three elements: <strong>Equitable Commerce</strong>,{' '}
        <strong>Phygital Experiential Reality</strong>, and <strong>Fandomonium</strong>—interconnected
        pillars of one revolutionary ecosystem.
      </p>

      <div className="info-box">
        <p>
          <strong>AETHER</strong> stands at the intersection of physical and digital worlds, creating
          immersive experiences that transform how audiences engage with entertainment, brands, and each other.
        </p>
      </div>

      <h2>Industry Authority & Leadership</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="number">15+</span>
          <span className="label">Years Experience in Entertainment Technology</span>
        </div>
        <div className="metric-card">
          <span className="number">50+</span>
          <span className="label">Major Productions & Installations</span>
        </div>
        <div className="metric-card">
          <span className="number">3M+</span>
          <span className="label">Audience Members Reached</span>
        </div>
        <div className="metric-card">
          <span className="number">100%</span>
          <span className="label">Commitment to Accessible Entertainment</span>
        </div>
      </div>

      <h2>Leadership Team</h2>

      <div className="team-grid">
        <div className="team-member">
          <img
            src="/assets/webp/aether-team-founder-ctch.webp"
            alt="Christian Charles-Harris"
            className="team-photo"
          />
          <div className="team-name">Christian Charles-Harris</div>
          <div className="team-title">Founder & CEO</div>
          <div className="team-bio">
            Visionary leader with over 15 years in entertainment technology and immersive experience design.
            Pioneer of the phygital experience platform concept.
          </div>
        </div>

        <div className="team-member">
          <img
            src="/assets/webp/aether-team-cofounder-shaxinwei.webp"
            alt="Dr. Sha Xin Wei"
            className="team-photo"
          />
          <div className="team-name">Dr. Sha Xin Wei</div>
          <div className="team-title">Co-Founder & Chief Research Officer</div>
          <div className="team-bio">
            Mathematician, philosopher, and media artist. Former Director of Synthesis Center at ASU.
            Expert in responsive environments and computational media.
          </div>
        </div>

        <div className="team-member">
          <img
            src="/assets/webp/aether-team-cofounder-vangelis.webp"
            alt="Vangelis Lympouridis"
            className="team-photo"
          />
          <div className="team-name">Vangelis Lympouridis</div>
          <div className="team-title">Co-Founder & Chief Technology Officer</div>
          <div className="team-bio">
            Award-winning technologist and immersive experience designer. Expert in real-time systems
            and interactive installations.
          </div>
        </div>
      </div>

      <div className="section-divider" />

      <h2>Core Competencies</h2>

      <ul className="feature-list">
        <li>
          <strong>Immersive Experience Design</strong> - Creating transformative entertainment
          environments that blur the line between physical and digital reality
        </li>
        <li>
          <strong>Projection Mapping</strong> - Large-scale architectural mapping and theatrical
          visual effects
        </li>
        <li>
          <strong>Interactive Installations</strong> - Sensor-driven responsive environments
          that react to audience presence
        </li>
        <li>
          <strong>Phygital Platform Development</strong> - Proprietary PXE technology connecting
          physical experiences with digital engagement
        </li>
        <li>
          <strong>IP Development</strong> - Original entertainment franchises designed for
          multi-platform deployment
        </li>
      </ul>

      <div className="takeaway-box">
        <p>
          <strong>AETHER represents the convergence of entertainment, technology, and equity.</strong>{' '}
          We're not just building experiences—we're creating a new paradigm for how people engage
          with entertainment and each other.
        </p>
      </div>
    </>
  );
}

export default EthosContent;
