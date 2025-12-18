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
    },
    {
      id: 'pathos',
      label: 'PATHOS',
      subtitle: 'Emotion, Connection & Project Impact',
      color: '#f093fb',
    },
    {
      id: 'logos',
      label: 'LOGOS',
      subtitle: 'Logic, Systems & Technical Expertise',
      color: '#4a90e2',
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
            {/* Button Icon */}
            <svg className="button-icon" viewBox="0 0 200 150" width="340" height="255">
              <defs>
                <linearGradient id={`grad-${button.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={button.color} />
                  <stop offset="100%" stopColor={button.color} stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Background Shape */}
              <rect
                x="10"
                y="10"
                width="180"
                height="130"
                rx="10"
                fill={`url(#grad-${button.id})`}
                opacity="0.3"
              />

              {/* Icon based on type */}
              {button.id === 'ethos' && (
                <>
                  {/* Shield Icon */}
                  <path
                    d="M100,25 L150,45 L150,90 C150,115 100,135 100,135 C100,135 50,115 50,90 L50,45 Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  />
                  <path
                    d="M75,75 L95,95 L125,60"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {button.id === 'pathos' && (
                <>
                  {/* Heart Icon */}
                  <path
                    d="M100,45 C80,20 40,30 40,65 C40,100 100,130 100,130 C100,130 160,100 160,65 C160,30 120,20 100,45 Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  />
                </>
              )}

              {button.id === 'logos' && (
                <>
                  {/* Brain/Circuit Icon */}
                  <circle cx="100" cy="75" r="45" fill="none" stroke="white" strokeWidth="3" />
                  <path
                    d="M70,75 Q85,55 100,75 Q115,95 130,75"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <circle cx="100" cy="75" r="10" fill="white" opacity="0.8" />
                  {/* Connection nodes */}
                  <circle cx="70" cy="55" r="4" fill="white" />
                  <circle cx="130" cy="55" r="4" fill="white" />
                  <circle cx="70" cy="95" r="4" fill="white" />
                  <circle cx="130" cy="95" r="4" fill="white" />
                </>
              )}
            </svg>

            <div className="button-label">{button.label}</div>
            <div className="button-subtitle">{button.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Desktop;
