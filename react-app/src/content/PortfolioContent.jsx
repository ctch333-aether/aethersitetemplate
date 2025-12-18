import React from 'react';

const portfolioData = {
  enchant: {
    title: 'Enchant - Holiday Light Experience',
    items: [
      { id: 'aether-portfolio-enchant-lights-01', title: 'Enchant Lights 01' },
      { id: 'aether-portfolio-enchant-lights-02', title: 'Enchant Lights 02' },
      { id: 'aether-portfolio-enchant-daytime', title: 'Enchant Daytime' },
      { id: 'aether-portfolio-enchant-retail', title: 'Enchant Retail' },
      { id: 'BRANDwork-EnchantSite-Collage2', title: 'Enchant Collage 2' },
      { id: 'BRANDwork-EnchantSite-Collage4', title: 'Enchant Collage 4' },
      { id: 'BRANDwork-EnchantSite-Collage6', title: 'Enchant Collage 6' },
      { id: 'BRANDwork-EnchantSite-Collage7', title: 'Enchant Collage 7' },
      { id: 'BRANDwork-EnchantSite-Collage8', title: 'Enchant Collage 8' },
    ],
  },
  projectionMapping: {
    title: 'Projection Mapping',
    items: [
      { id: 'BRANDwork-ProjectionMapping-CircuitNeuron', title: 'Circuit Neuron' },
      { id: 'BRANDwork-ProjectionMapping-CosmicEye', title: 'Cosmic Eye' },
      { id: 'BRANDwork-ProjectionMapping-GridMatrix', title: 'Grid Matrix' },
      { id: 'BRANDwork-ProjectionMapping-OceanForge', title: 'Ocean Forge' },
      { id: 'BRANDwork-ProjectionMapping-SciFi', title: 'SciFi' },
      { id: 'BRANDwork-ProjectionMapping-Vintage', title: 'Vintage' },
    ],
  },
  theatrical: {
    title: 'Theatrical Productions',
    items: [
      { id: 'aether-portfolio-batb-setdesign', title: 'Beauty & The Beast Set Design' },
      { id: 'aether-portfolio-killmove-01', title: 'Kill Move Paradise 01' },
      { id: 'aether-portfolio-killmove-02', title: 'Kill Move Paradise 02' },
      { id: 'BRANDwork-StageProduction-GhostProjection', title: 'Ghost Projection' },
      { id: 'BRANDwork-StageProduction-PrisonScene', title: 'Prison Scene' },
    ],
  },
  venues: {
    title: 'Venues & Installations',
    items: [
      { id: 'aether-portfolio-candlelight-venue', title: 'Candlelight Venue' },
      { id: 'BRANDwork-WarriorPrincessOz-ArenaLayout', title: 'Warrior Princess Arena' },
      { id: 'BRANDwork-WarriorPrincessOz-EmeraldCrystals', title: 'Emerald Crystals' },
      { id: 'BRANDwork-WarriorPrincessOz-StageSet', title: 'Warrior Princess Stage' },
    ],
  },
};

function PortfolioCategory({ title, items }) {
  return (
    <div className="portfolio-category">
      <h3>{title}</h3>
      <div className="portfolio-scroll-container">
        <div className="portfolio-scroll">
          {items.map((item) => (
            <div key={item.id} className="portfolio-item">
              <img
                src={`/assets/webp/${item.id}.webp`}
                alt={item.title}
                loading="lazy"
                onLoad={(e) => e.target.classList.add('loaded')}
              />
              <div className="portfolio-item-title">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortfolioContent() {
  const totalProjects = Object.values(portfolioData).reduce(
    (acc, category) => acc + category.items.length,
    0
  );

  return (
    <>
      <h1>AETHER Portfolio Gallery</h1>

      <div className="info-box">
        <p>
          Explore our collection of <strong>{totalProjects} projects</strong> spanning immersive
          experiences, projection mapping, theatrical productions, and venue installations.
          Scroll horizontally to browse each category.
        </p>
      </div>

      <div className="portfolio-gallery">
        {Object.entries(portfolioData).map(([key, category]) => (
          <PortfolioCategory
            key={key}
            title={category.title}
            items={category.items}
          />
        ))}
      </div>

      <div className="section-divider" />

      <div className="takeaway-box">
        <p>
          <strong>Each project represents our commitment to transformative entertainment.</strong>{' '}
          From intimate theatrical moments to large-scale festival installations, we bring the
          same dedication to craft and innovation.
        </p>
      </div>
    </>
  );
}

export default PortfolioContent;
