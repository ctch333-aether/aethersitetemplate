/**
 * AETHER React - Desktop Component
 * Main desktop area with brand logo and navigation buttons
 */

function Desktop({ onButtonClick }) {
  const buttons = [
    {
      id: 'ethos',
      label: 'ETHOS',
      subtitle: 'Credibility, Authority & The Vision',
      color: '#667eea',
      image: '/images/Skills2_2_-_1.webp',
    },
    {
      id: 'pathos',
      label: 'PATHOS',
      subtitle: 'Emotion, Connection & Project Impact',
      color: '#f093fb',
      image: '/images/BRANDwork-EnchantSite-Collage7.webp',
    },
    {
      id: 'logos',
      label: 'LOGOS',
      subtitle: 'Logic, Systems & Technical Expertise',
      color: '#4a90e2',
      image: '/images/BRANDwork-ProjectionMapping-CircuitNeuron.webp',
    },
  ];

  return (
    <div className="desktop">
      {/* Floating Brand Logo */}
      <div className="brand-logo-container">
        <svg viewBox="0 0 400 120" width="600" height="180">
          {/* AETHER Logo */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="50%" stopColor="#764ba2" />
              <stop offset="100%" stopColor="#f093fb" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Decorative Elements */}
          <circle cx="40" cy="60" r="35" fill="none" stroke="url(#logoGradient)" strokeWidth="2" opacity="0.6"/>
          <polygon points="40,30 65,75 15,75" fill="none" stroke="url(#logoGradient)" strokeWidth="2" opacity="0.8"/>
          <polygon points="40,75 55,45 25,45" fill="none" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.6"/>

          {/* AETHER Text */}
          <text
            x="200"
            y="75"
            textAnchor="middle"
            fill="url(#logoGradient)"
            fontSize="60"
            fontFamily="'MS Sans Serif', Arial, sans-serif"
            fontWeight="bold"
            filter="url(#glow)"
          >
            AETHER
          </text>

          {/* Tagline */}
          <text
            x="200"
            y="105"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontFamily="'MS Sans Serif', sans-serif"
            opacity="0.9"
          >
            Phygital Experience Platform
          </text>

          {/* Right decorative element */}
          <circle cx="360" cy="60" r="35" fill="none" stroke="url(#logoGradient)" strokeWidth="2" opacity="0.6"/>
          <polygon points="360,30 385,75 335,75" fill="none" stroke="url(#logoGradient)" strokeWidth="2" opacity="0.8"/>
        </svg>
      </div>

      {/* Three Main Buttons */}
      <div className="main-button-container">
        {buttons.map((button) => (
          <div
            key={button.id}
            className="main-desktop-button"
            onClick={() => onButtonClick(button.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onButtonClick(button.id);
              }
            }}
          >
            {/* Button Icon - Using WebP images */}
            <div
              className="button-icon"
              style={{
                width: '100%',
                maxWidth: '340px',
                height: '200px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: `3px solid ${button.color}`,
                boxShadow: `0 8px 24px ${button.color}40`,
              }}
            >
              <img
                src={button.image}
                alt={button.label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                loading="lazy"
              />
            </div>

            <div className="button-label">{button.label}</div>
            <div className="button-subtitle">{button.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Desktop;
