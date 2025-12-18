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
    },
    {
      id: 2,
      title: 'Kill Move Paradise',
      category: 'Theatrical Production',
      description: 'Award-winning theatrical production with innovative projection design and spatial audio.',
      stats: { shows: '100+', critics: '5 Stars', awards: 'Regional Excellence' },
    },
    {
      id: 3,
      title: 'Beauty & The Beast',
      category: 'Scenic Design',
      description: 'Professional theater production with enchanted castle projection mapping and practical effects.',
      stats: { attendance: '50K+', runs: 'Sold Out', reviews: 'Standing Ovations' },
    },
    {
      id: 4,
      title: 'Corporate Activations',
      category: 'Brand Experience',
      description: 'Fortune 500 brand activations featuring interactive installations and data visualization.',
      stats: { clients: '25+', engagement: '300%', roi: 'Documented' },
    },
    {
      id: 5,
      title: 'Warrior Princess of Oz',
      category: 'Arena Production',
      description: 'Large-scale arena show concept combining theatrical narrative with immersive technology.',
      stats: { capacity: '15K', tech: 'Cutting Edge', concept: 'Development' },
    },
    {
      id: 6,
      title: 'Tales of Lucidia',
      category: 'Transmedia IP',
      description: 'Original intellectual property spanning interactive theater, gaming, and collectibles.',
      stats: { formats: '5+', characters: '50+', worlds: '3 Realms' },
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

      {projects.map((project, index) => (
        <div key={project.id}>
          <div className="leadership-card">
            <h3>{project.title}</h3>
            <span className="title">{project.category}</span>
            <p>{project.description}</p>
            <div className="stats-row">
              {Object.entries(project.stats).map(([key, value]) => (
                <div className="stat-item" key={key}>
                  <span className="stat-number">{value}</span>
                  <span className="stat-label" style={{ textTransform: 'capitalize' }}>
                    {key}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {index < projects.length - 1 && <div className="content-separator"></div>}
        </div>
      ))}

      <div className="takeaway-box">
        <strong>Ready to Create Something Extraordinary?</strong> Contact us to discuss
        how AETHER can transform your vision into an unforgettable experience.
      </div>
    </div>
  );
}

export default PortfolioContent;
