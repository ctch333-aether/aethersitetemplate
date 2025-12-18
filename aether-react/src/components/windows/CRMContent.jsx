/**
 * AETHER React - CRM Window Content
 * Investor/Partner Database Management
 * Complete content from AetherKEMETFINALINTERNAL.html
 */

import { useState, useMemo } from 'react';

// Investor Database from AetherKEMETFINALINTERNAL.html
const INVESTOR_DATABASE = [
  {"entityName":"Khosla Ventures","entityType":"VC","tier":"Tier S","subCategory":"Early-Stage VC","executiveName":"Vinod Khosla","title":"Founder","directEmail":"vinod@khoslaventures.com","emailStatus":"HIGH-CONFIDENCE","generalContact":"kv@khoslaventures.com","phone":"650-376-8500","linkedIn":"linkedin.com/in/vinodkhosla","investmentAppetite":"HIGH","stageFocus":"Seed/Series A","sectorFocus":"AI,Climate,Deep Tech","geoFocus":"US/Global","aum":"$3.1B+","website":"khoslaventures.com","outreachMethod":"Portfolio warm intro","missionScore":"8/10","notes":"56 investments in 2024;highly active"},
  {"entityName":"NEA","entityType":"VC","tier":"Tier S","subCategory":"Multi-Stage VC","executiveName":"Tony Florence","title":"Co-CEO","directEmail":"tony.florence@nea.com","emailStatus":"INFERRED","generalContact":"bd@nea.com","phone":"650-854-9499","linkedIn":"","investmentAppetite":"HIGH","stageFocus":"Seed to Growth","sectorFocus":"Technology","geoFocus":"US/Global","aum":"$25B+","website":"nea.com","outreachMethod":"Portfolio warm intro","missionScore":"8/10","notes":"Named Co-CEO April 2024"},
  {"entityName":"Andreessen Horowitz","entityType":"VC","tier":"Tier S","subCategory":"Multi-Stage VC","executiveName":"Andrew Chen","title":"General Partner(a16z GAMES)","directEmail":"andrew@a16z.com","emailStatus":"HIGH-CONFIDENCE","generalContact":"info@a16z.com","phone":"650-232-2900","linkedIn":"linkedin.com/in/andrewchen","investmentAppetite":"HIGH","stageFocus":"Seed to Growth","sectorFocus":"Games,Consumer,Metaverse","geoFocus":"Global","aum":"$42B+","website":"a16z.com","outreachMethod":"Portfolio warm intro","missionScore":"9/10","notes":"Leads a16z GAMES;entertainment focus"},
  {"entityName":"Andreessen Horowitz","entityType":"VC","tier":"Tier S","subCategory":"Multi-Stage VC","executiveName":"Marc Andreessen","title":"Co-Founder & General Partner","directEmail":"marc@a16z.com","emailStatus":"INFERRED","generalContact":"info@a16z.com","phone":"650-232-2900","linkedIn":"","investmentAppetite":"HIGH","stageFocus":"All Stages","sectorFocus":"All Tech","geoFocus":"Global","aum":"$42B+","website":"a16z.com","outreachMethod":"Very selective","missionScore":"7/10","notes":"Netscape founder"},
  {"entityName":"Spark Capital","entityType":"VC","tier":"Top-Tier","subCategory":"Multi-Stage VC","executiveName":"Nabeel Hyatt","title":"General Partner","directEmail":"nabeel@sparkcapital.com","emailStatus":"INFERRED","generalContact":"contactus@sparkcapital.com","phone":"617-830-2000","linkedIn":"","investmentAppetite":"HIGH","stageFocus":"Seed to Growth","sectorFocus":"Gaming,Robotics","geoFocus":"US","aum":"$12B+","website":"sparkcapital.com","outreachMethod":"Portfolio warm intro","missionScore":"9/10","notes":"Gaming expertise;Discord lead"},
  {"entityName":"Spark Capital","entityType":"VC","tier":"Top-Tier","subCategory":"Multi-Stage VC","executiveName":"Bijan Sabet","title":"Co-Founder & Partner Emeritus","directEmail":"bijan@sparkcapital.com","emailStatus":"INFERRED","generalContact":"contactus@sparkcapital.com","phone":"617-830-2000","linkedIn":"","investmentAppetite":"HIGH","stageFocus":"Seed to Growth","sectorFocus":"Consumer,Entertainment","geoFocus":"US","aum":"$12B+","website":"sparkcapital.com","outreachMethod":"Portfolio warm intro","missionScore":"9/10","notes":"Twitter/Tumblr investor"},
  {"entityName":"Cleo Capital","entityType":"VC","tier":"Mid-Tier","subCategory":"Pre-Seed VC","executiveName":"Sarah Kunst","title":"Founder & Managing Director","directEmail":"sarah@cleocap.com","emailStatus":"VERIFIED","generalContact":"sarah@cleocap.com","phone":"","linkedIn":"","investmentAppetite":"HIGH","stageFocus":"Pre-seed","sectorFocus":"Consumer,Health,Fintech","geoFocus":"US","aum":"","website":"cleocap.com","outreachMethod":"Direct email or pitch form","missionScore":"9/10","notes":"VERIFIED EMAIL;pitch form available"},
  {"entityName":"Precursor Ventures","entityType":"VC","tier":"Mid-Tier","subCategory":"Pre-Seed VC","executiveName":"Charles Hudson","title":"Managing Partner & Founder","directEmail":"charles@precursorvc.com","emailStatus":"VERIFIED","generalContact":"hello@precursorvc.com","phone":"","linkedIn":"","investmentAppetite":"HIGH","stageFocus":"Pre-seed/Seed","sectorFocus":"B2B/B2C Software,Hardware","geoFocus":"US","aum":"$250M+","website":"precursorvc.com","outreachMethod":"Direct email or website","missionScore":"9/10","notes":"NVCA Board Chair;450+ companies"},
  {"entityName":"Backstage Capital","entityType":"VC","tier":"Mid-Tier","subCategory":"Diversity-Focused VC","executiveName":"Arlan Hamilton","title":"Founder & Managing Partner","directEmail":"arlan@backstagecapital.com","emailStatus":"INFERRED","generalContact":"hello@backstagecapital.com","phone":"","linkedIn":"linkedin.com/in/arlanwashere","investmentAppetite":"HIGH","stageFocus":"Pre-seed/Seed","sectorFocus":"Underrepresented Founders","geoFocus":"US","aum":"$100M+","website":"backstagecapital.com","outreachMethod":"Application via website","missionScore":"10/10","notes":"Perfect mission alignment"},
  {"entityName":"Revolution","entityType":"VC","tier":"Mid-Tier","subCategory":"Rise of Rest VC","executiveName":"Steve Case","title":"Chairman & CEO","directEmail":"steve@revolution.com","emailStatus":"INFERRED","generalContact":"Website form","phone":"","linkedIn":"","investmentAppetite":"HIGH","stageFocus":"Seed to Growth","sectorFocus":"Outside Silicon Valley","geoFocus":"US non-coastal","aum":"$2B total","website":"revolution.com","outreachMethod":"Apply via website","missionScore":"8/10","notes":"Rise of Rest thesis"},
  {"entityName":"M13","entityType":"VC","tier":"Mid-Tier","subCategory":"Consumer VC","executiveName":"Carter Reum","title":"Co-Founder & Partner","directEmail":"carter@m13.co","emailStatus":"INFERRED","generalContact":"team@m13.co","phone":"424-279-4361","linkedIn":"","investmentAppetite":"HIGH","stageFocus":"Seed/Series A","sectorFocus":"Consumer,Commerce","geoFocus":"US","aum":"","website":"m13.co","outreachMethod":"Direct contact","missionScore":"8/10","notes":"LA-based consumer focus"},
  {"entityName":"Floodgate","entityType":"VC","tier":"Mid-Tier","subCategory":"Seed VC","executiveName":"Mike Maples Jr.","title":"Co-Founder & Partner","directEmail":"mike@floodgate.com","emailStatus":"INFERRED","generalContact":"businessplans@maples.net","phone":"650-204-7990","linkedIn":"","investmentAppetite":"HIGH","stageFocus":"Pre-seed/Seed","sectorFocus":"Software","geoFocus":"SF Bay/Austin","aum":"$146M Fund VII","website":"floodgate.com","outreachMethod":"Direct businessplans email","missionScore":"8/10","notes":"8x Forbes Midas List"},
  {"entityName":"Floodgate","entityType":"VC","tier":"Mid-Tier","subCategory":"Seed VC","executiveName":"Ann Miura-Ko","title":"Co-Founder & Partner","directEmail":"ann@floodgate.com","emailStatus":"INFERRED","generalContact":"businessplans@maples.net","phone":"650-204-7990","linkedIn":"","investmentAppetite":"HIGH","stageFocus":"Pre-seed/Seed","sectorFocus":"Software","geoFocus":"SF Bay/Austin","aum":"$146M Fund VII","website":"floodgate.com","outreachMethod":"Direct businessplans email","missionScore":"8/10","notes":"Stanford lecturer;All Raise"},
];

function CRMContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAppetite, setSelectedAppetite] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [expandedCard, setExpandedCard] = useState(null);

  // Filter logic
  const filteredInvestors = useMemo(() => {
    return INVESTOR_DATABASE.filter(investor => {
      const matchesSearch = searchTerm === '' ||
        investor.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.executiveName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.sectorFocus.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTier = selectedTier === 'all' || investor.tier === selectedTier;
      const matchesType = selectedType === 'all' || investor.entityType === selectedType;
      const matchesAppetite = selectedAppetite === 'all' || investor.investmentAppetite === selectedAppetite;

      return matchesSearch && matchesTier && matchesType && matchesAppetite;
    });
  }, [searchTerm, selectedTier, selectedType, selectedAppetite]);

  const toggleFavorite = (index) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(index)) {
      newFavorites.delete(index);
    } else {
      newFavorites.add(index);
    }
    setFavorites(newFavorites);
  };

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
  };

  const getTierColor = (tier) => {
    switch(tier) {
      case 'Tier S': return '#ffd700';
      case 'Top-Tier': return '#c0c0c0';
      case 'Mid-Tier': return '#cd7f32';
      default: return '#808080';
    }
  };

  const getEmailStatusColor = (status) => {
    switch(status) {
      case 'VERIFIED': return '#28a745';
      case 'HIGH-CONFIDENCE': return '#17a2b8';
      case 'INFERRED': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div className="crm-content">
      <h1>AETHER CRM - Investor &amp; Partner Database</h1>

      <div className="takeaway-box">
        <h3>Strategic Pipeline Management</h3>
        <p>Comprehensive database of investors, partners, and strategic contacts for AETHER&apos;s fundraising and partnership initiatives. Filter by tier, type, and investment appetite to identify optimal outreach targets.</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="crm-controls">
        <div className="crm-search">
          <input
            type="text"
            placeholder="Search by name, firm, or sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>

        <div className="crm-filters" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="form-select"
          >
            <option value="all">All Tiers</option>
            <option value="Tier S">Tier S</option>
            <option value="Top-Tier">Top-Tier</option>
            <option value="Mid-Tier">Mid-Tier</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="form-select"
          >
            <option value="all">All Types</option>
            <option value="VC">VC</option>
            <option value="PE">PE</option>
            <option value="Strategic">Strategic</option>
          </select>

          <select
            value={selectedAppetite}
            onChange={(e) => setSelectedAppetite(e.target.value)}
            className="form-select"
          >
            <option value="all">All Appetite</option>
            <option value="HIGH">High Appetite</option>
            <option value="MODERATE">Moderate</option>
          </select>
        </div>

        <div className="crm-stats" style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <span className="stat-badge">Total: {filteredInvestors.length}</span>
          <span className="stat-badge">Favorites: {favorites.size}</span>
        </div>
      </div>

      {/* Investor Grid */}
      <div className="investor-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '15px' }}>
        {filteredInvestors.map((investor, index) => (
          <div
            key={index}
            className="investor-card"
            style={{
              background: '#fff',
              border: '2px solid',
              borderColor: '#808080 #fff #fff #808080',
              padding: '15px',
            }}
          >
            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <span
                  style={{
                    background: getTierColor(investor.tier),
                    color: '#000',
                    padding: '2px 8px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    marginRight: '5px'
                  }}
                >
                  {investor.tier}
                </span>
                <span style={{ fontSize: '10px', color: '#666' }}>{investor.entityType}</span>
              </div>
              <button
                onClick={() => toggleFavorite(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                {favorites.has(index) ? '★' : '☆'}
              </button>
            </div>

            {/* Entity Name */}
            <h3 style={{ margin: '0 0 5px 0', color: '#000080', fontSize: '14px' }}>
              {investor.entityName}
            </h3>

            {/* Executive Info */}
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '12px' }}>
              {investor.executiveName}
            </p>
            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '11px', fontStyle: 'italic' }}>
              {investor.title}
            </p>

            {/* Email with Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
              <span
                style={{
                  background: getEmailStatusColor(investor.emailStatus),
                  color: '#fff',
                  padding: '1px 5px',
                  fontSize: '9px',
                  borderRadius: '2px'
                }}
              >
                {investor.emailStatus}
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'Courier New, monospace' }}>
                {investor.directEmail}
              </span>
              <button
                onClick={() => copyEmail(investor.directEmail)}
                style={{
                  background: '#c0c0c0',
                  border: '1px solid #808080',
                  cursor: 'pointer',
                  fontSize: '10px',
                  padding: '2px 5px'
                }}
              >
                Copy
              </button>
            </div>

            {/* Key Info */}
            <div style={{ fontSize: '11px', marginBottom: '8px' }}>
              <p style={{ margin: '2px 0' }}><strong>Stage:</strong> {investor.stageFocus}</p>
              <p style={{ margin: '2px 0' }}><strong>Sector:</strong> {investor.sectorFocus}</p>
              <p style={{ margin: '2px 0' }}><strong>AUM:</strong> {investor.aum || 'N/A'}</p>
              <p style={{ margin: '2px 0' }}><strong>Mission Score:</strong> {investor.missionScore}</p>
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => setExpandedCard(expandedCard === index ? null : index)}
              style={{
                background: '#c0c0c0',
                border: '2px solid',
                borderColor: '#fff #808080 #808080 #fff',
                cursor: 'pointer',
                fontSize: '10px',
                padding: '4px 8px',
                width: '100%'
              }}
            >
              {expandedCard === index ? '▲ Less Info' : '▼ More Info'}
            </button>

            {/* Expanded Details */}
            {expandedCard === index && (
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ccc', fontSize: '11px' }}>
                <p style={{ margin: '2px 0' }}><strong>Phone:</strong> {investor.phone || 'N/A'}</p>
                <p style={{ margin: '2px 0' }}><strong>General Contact:</strong> {investor.generalContact}</p>
                <p style={{ margin: '2px 0' }}><strong>LinkedIn:</strong> {investor.linkedIn || 'N/A'}</p>
                <p style={{ margin: '2px 0' }}><strong>Website:</strong> {investor.website}</p>
                <p style={{ margin: '2px 0' }}><strong>Geo Focus:</strong> {investor.geoFocus}</p>
                <p style={{ margin: '2px 0' }}><strong>Outreach:</strong> {investor.outreachMethod}</p>
                <p style={{ margin: '5px 0', padding: '5px', background: '#f5f5f5' }}><strong>Notes:</strong> {investor.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredInvestors.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', background: '#fff', border: '2px solid #808080' }}>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>No contacts match your filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedTier('all');
              setSelectedType('all');
              setSelectedAppetite('all');
            }}
            className="form-button"
          >
            Clear All Filters
          </button>
        </div>
      )}

      <div className="section-divider"></div>

      <div className="highlight-box">
        <h3>CRM Usage Notes:</h3>
        <ul>
          <li><strong>Tier S:</strong> Highest priority targets with strong mission alignment and active investment appetite</li>
          <li><strong>Top-Tier:</strong> Major institutional investors with significant AUM and entertainment focus</li>
          <li><strong>Mid-Tier:</strong> Strategic investors including diversity-focused and sector-specific funds</li>
          <li><strong>Email Status:</strong> VERIFIED (confirmed), HIGH-CONFIDENCE (pattern-matched), INFERRED (standard format)</li>
        </ul>
      </div>
    </div>
  );
}

export default CRMContent;
