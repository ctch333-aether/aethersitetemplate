/**
 * AETHER React - About Window Content
 * Company overview and contact information
 */

function AboutContent() {
  return (
    <div className="about-content">
      <h1>About AETHER</h1>

      <div className="highlight-box">
        <p>
          <strong>AETHER</strong> is a pioneering phygital experience company that bridges
          the gap between physical and digital entertainment. We create immersive, responsive
          environments that transform how people connect with stories, brands, and each other.
        </p>
      </div>

      <div className="content-separator"></div>

      <div className="major-section-header">
        <span>Our Mission</span>
      </div>

      <div className="brand-showcase">
        <div className="brand-showcase-title">Democratizing Wonder</div>
        <p>
          We believe that extraordinary experiences should not be reserved for the privileged few.
          AETHER is building the infrastructure to bring world-class immersive entertainment
          to communities everywhere.
        </p>
      </div>

      <div className="content-separator"></div>

      <div className="major-section-header">
        <span>Leadership Team</span>
      </div>

      <div className="leadership-card">
        <h3>Founder & CEO</h3>
        <p>
          With over 15 years of experience in immersive entertainment, theatrical production,
          and technology development, our founder has led teams at major theme parks,
          produced award-winning theatrical productions, and pioneered new approaches
          to audience engagement.
        </p>
      </div>

      <div className="leadership-card">
        <h3>Co-Founders & Advisory Board</h3>
        <p>
          Our leadership team includes experts in:
        </p>
        <ul className="feature-list">
          <li>Experiential Design & Architecture</li>
          <li>Artificial Intelligence & Machine Learning</li>
          <li>Theatrical Production & Narrative Design</li>
          <li>Business Development & Strategic Partnerships</li>
        </ul>
      </div>

      <div className="content-separator"></div>

      <div className="major-section-header">
        <span>Company Information</span>
      </div>

      <div className="content-grid two-col">
        <div className="key-summary">
          <div className="key-summary-title">Headquarters</div>
          <p>
            <strong>Alchemist Atelier</strong><br />
            Mesa, Arizona<br />
            45,900 sq ft Innovation Center
          </p>
        </div>
        <div className="key-summary">
          <div className="key-summary-title">Contact</div>
          <p>
            <strong>General Inquiries:</strong><br />
            info@aetherphygital.com<br /><br />
            <strong>Partnerships:</strong><br />
            partnerships@aetherphygital.com
          </p>
        </div>
      </div>

      <div className="takeaway-box">
        <strong>Join the Revolution:</strong> Whether you're a venue operator, brand marketer,
        event producer, or creative visionary, AETHER has the platform and expertise to
        bring your most ambitious experiences to life.
      </div>

      <div className="content-separator"></div>

      <div className="impact-box">
        <h4>AETHER - Where Reality Becomes Magic</h4>
        <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
          Version 3.0 | Phygital Experience Platform
        </p>
      </div>
    </div>
  );
}

export default AboutContent;
