import React from 'react';

const brandsData = [
  {
    id: 'tales-of-lucidia',
    image: 'aether-ip-tales-of-lucidia',
    title: 'Tales of Lucidia',
    description: 'Our flagship fantasy IP set in a world where dreams and reality interweave. Features diverse characters, inclusive narratives, and multi-platform storytelling designed for phygital deployment.',
    franchise: 'Tales of Lucidia Universe',
  },
  {
    id: 'maryjane-mainframe',
    image: 'aether-ip-maryjane-mainframe',
    title: 'MaryJane Mainframe',
    description: 'A cyberpunk adventure exploring digital consciousness, human connection, and the boundaries between virtual and physical existence.',
    franchise: 'Tales of Lucidia Universe',
  },
  {
    id: 'metamorphasis-apothecary',
    image: 'aether-ip-metamorphasis-apothecary',
    title: 'Metamorphasis Apothecary',
    description: 'Fantasy alchemy meets modern wellness in this transformative experience about personal growth and magical healing.',
    franchise: 'Tales of Lucidia Universe',
  },
  {
    id: 'warrior-princess',
    image: 'BRANDAsset-WarriorPrincess-CharacterConcept',
    title: 'Warrior Princess of Oz',
    description: 'A reimagining of classic fantasy with strong female protagonists, epic battles, and messages of empowerment and courage.',
    franchise: 'Tales of Lucidia Universe',
  },
  {
    id: 'broussard-bayou',
    image: 'BRANDAsset-PhygitalIP-BroussardBayouBBQ',
    title: 'Broussard Bayou BBQ',
    description: 'Phygital dining experience combining Louisiana culinary traditions with immersive entertainment and community gathering.',
    franchise: 'Phygital IP',
  },
  {
    id: 'port51-confectionarium',
    image: 'BRANDAsset-PhygitalIP-Port51Confectionarium',
    title: 'Port 51 Confectionarium',
    description: 'A whimsical candy and confection experience blending nostalgia with futuristic wonder in an interactive retail environment.',
    franchise: 'Phygital IP',
  },
];

function BrandsContent() {
  const lucidiaIPs = brandsData.filter(b => b.franchise === 'Tales of Lucidia Universe');
  const phygitalIPs = brandsData.filter(b => b.franchise === 'Phygital IP');

  return (
    <>
      <h1>Brands & Intellectual Property</h1>

      <p>
        AETHER develops original intellectual property designed from the ground up for phygital
        deployment. Our IPs span multiple genres and formats, all connected through our unified
        platform and shared commitment to accessible, transformative entertainment.
      </p>

      <h2>Tales of Lucidia Universe</h2>

      <div className="info-box">
        <p>
          Our flagship entertainment universe featuring interconnected stories, characters, and
          experiences that span physical installations, digital content, and interactive merchandise.
        </p>
      </div>

      <div className="brands-grid">
        {lucidiaIPs.map((brand) => (
          <div key={brand.id} className="brand-card">
            <img
              src={`/assets/webp/${brand.image}.webp`}
              alt={brand.title}
              loading="lazy"
            />
            <h4>{brand.title}</h4>
            <p>{brand.description}</p>
          </div>
        ))}
      </div>

      <div className="section-divider" />

      <h2>Phygital Experience IPs</h2>

      <div className="info-box">
        <p>
          Location-based entertainment concepts that blend physical venues with digital engagement,
          creating unique destination experiences.
        </p>
      </div>

      <div className="brands-grid">
        {phygitalIPs.map((brand) => (
          <div key={brand.id} className="brand-card">
            <img
              src={`/assets/webp/${brand.image}.webp`}
              alt={brand.title}
              loading="lazy"
            />
            <h4>{brand.title}</h4>
            <p>{brand.description}</p>
          </div>
        ))}
      </div>

      <div className="section-divider" />

      <h2>Partnership Opportunities</h2>

      <ul className="feature-list">
        <li>
          <strong>Licensing</strong> - License our IP for your venue or activation
        </li>
        <li>
          <strong>Co-Development</strong> - Partner with us to create custom experiences
        </li>
        <li>
          <strong>Franchise</strong> - Operate an AETHER experience in your market
        </li>
        <li>
          <strong>Merchandise</strong> - Extend our brands through physical products
        </li>
      </ul>

      <div className="takeaway-box">
        <p>
          <strong>Our IP is designed for multi-platform engagement.</strong> From immersive
          installations to mobile games, merchandise to streaming content, each brand can
          deploy across the full spectrum of entertainment touchpoints.
        </p>
      </div>
    </>
  );
}

export default BrandsContent;
