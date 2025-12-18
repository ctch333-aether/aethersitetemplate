/**
 * AETHER React - Portfolio Window Content
 * Showcase of projects and work
 */

function PortfolioContent() {
  const projects = [
    {
      id: 1,
      title: 'Enchant Christmas',
      category: 'Immersive Installation',
      description: 'World\'s largest Christmas light maze and village, featuring our projection mapping and interactive elements.',
      stats: { visitors: '6M+', locations: '5 Cities', years: '8 Seasons' },
      image: '/images/BRANDwork-EnchantSite-Collage7.webp',
    },
    {
      id: 2,
      title: 'Kill Move Paradise',
      category: 'Theatrical Production',
      description: 'Award-winning theatrical production with innovative projection design and spatial audio.',
      stats: { shows: '100+', critics: '5 Stars', awards: 'Regional Excellence' },
      image: '/images/Collage1KMP1_1_-_1.webp',
    },
    {
      id: 3,
      title: 'Beauty & The Beast',
      category: 'Scenic Design',
      description: 'Professional theater production with enchanted castle projection mapping and practical effects.',
      stats: { attendance: '50K+', runs: 'Sold Out', reviews: 'Standing Ovations' },
      image: '/images/B_BSetDesign__2_.webp',
    },
    {
      id: 4,
      title: 'Projection Mapping',
      category: 'Visual Technology',
      description: 'Custom projection mapping solutions for corporate events, concerts, and immersive installations.',
      stats: { projects: '50+', venues: 'Worldwide', scale: 'Any Size' },
      image: '/images/BRANDwork-ProjectionMapping-OceanForge.webp',
    },
    {
      id: 5,
      title: 'Warrior Princess of Oz',
      category: 'Arena Production',
      description: 'Large-scale arena show concept combining theatrical narrative with immersive technology.',
      stats: { capacity: '15K', tech: 'Cutting Edge', concept: 'Development' },
      image: '/images/BRANDAsset-WarriorPrincess-CharacterConcept.webp',
    },
    {
      id: 6,
      title: 'Tales of Lucidia',
      category: 'Transmedia IP',
      description: 'Original intellectual property spanning interactive theater, gaming, and collectibles.',
      stats: { formats: '5+', characters: '50+', worlds: '3 Realms' },
      image: '/images/Cloudtext__2_.webp',
    },
  ];

  return (
    <div className="portfolio-content">
      <h1>Portfolio - Selected Works</h1>

      <div className="highlight-box">
        <p>
          A curated selection of AETHER's most impactful projects across entertainment,
          theatrical production, corporate activations, and original IP development.
        </p>
      </div>

      <div className="content-separator"></div>

      {/* Portfolio Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
      }}>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              background: 'white',
              border: '2px solid var(--aether-purple)',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {/* Project Image */}
            <div style={{
              width: '100%',
              height: '180px',
              overflow: 'hidden',
              borderBottom: '2px solid var(--aether-purple)',
            }}>
              <img
                src={project.image}
                alt={project.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                loading="lazy"
              />
            </div>

            {/* Project Info */}
            <div style={{ padding: '15px' }}>
              <h3 style={{
                color: 'var(--aether-purple-dark)',
                marginBottom: '5px',
                fontSize: '14px',
              }}>
                {project.title}
              </h3>
              <span style={{
                color: 'var(--aether-purple)',
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'block',
                marginBottom: '10px',
              }}>
                {project.category}
              </span>
              <p style={{
                fontSize: '12px',
                color: '#333',
                lineHeight: '1.5',
                marginBottom: '12px',
              }}>
                {project.description}
              </p>

              {/* Stats */}
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
              }}>
                {Object.entries(project.stats).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: 'var(--aether-purple)',
                    }}>
                      {value}
                    </span>
                    <span style={{
                      fontSize: '9px',
                      color: '#666',
                      textTransform: 'capitalize',
                    }}>
                      {key}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="takeaway-box">
        <strong>Ready to Create Something Extraordinary?</strong> Contact us to discuss
        how AETHER can transform your vision into an unforgettable experience.
      </div>
    </div>
  );
}

export default PortfolioContent;
