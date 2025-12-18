/**
 * AETHER React - Contact Window Content
 * Contact information and inquiry form
 */

import { useState } from 'react';

function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to an API
    alert('Thank you for your inquiry! We will be in touch soon.');
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="contact-content">
      <h1>Contact AETHER</h1>

      <div className="highlight-box">
        <p>
          Ready to explore how AETHER can transform your next project?
          We'd love to hear from you.
        </p>
      </div>

      <div className="content-separator"></div>

      <div className="content-grid two-col">
        <div>
          <div className="major-section-header">
            <span>Get in Touch</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label htmlFor="name" style={{ fontWeight: 'bold', fontSize: '12px' }}>Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  padding: '8px',
                  border: '2px solid',
                  borderColor: '#808080 #ffffff #ffffff #808080',
                  background: 'white',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label htmlFor="email" style={{ fontWeight: 'bold', fontSize: '12px' }}>Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  padding: '8px',
                  border: '2px solid',
                  borderColor: '#808080 #ffffff #ffffff #808080',
                  background: 'white',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label htmlFor="company" style={{ fontWeight: 'bold', fontSize: '12px' }}>Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                style={{
                  padding: '8px',
                  border: '2px solid',
                  borderColor: '#808080 #ffffff #ffffff #808080',
                  background: 'white',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label htmlFor="subject" style={{ fontWeight: 'bold', fontSize: '12px' }}>Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{
                  padding: '8px',
                  border: '2px solid',
                  borderColor: '#808080 #ffffff #ffffff #808080',
                  background: 'white',
                  fontFamily: 'inherit',
                }}
              >
                <option value="">Select a topic...</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="project">Project Proposal</option>
                <option value="licensing">Licensing/IP</option>
                <option value="press">Press/Media</option>
                <option value="careers">Careers</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label htmlFor="message" style={{ fontWeight: 'bold', fontSize: '12px' }}>Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                style={{
                  padding: '8px',
                  border: '2px solid',
                  borderColor: '#808080 #ffffff #ffffff #808080',
                  background: 'white',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#c0c0c0',
                border: '2px solid',
                borderColor: '#ffffff #000000 #000000 #ffffff',
                fontFamily: 'inherit',
                fontWeight: 'bold',
                cursor: 'pointer',
                alignSelf: 'flex-start',
              }}
            >
              Send Message
            </button>
          </form>
        </div>

        <div>
          <div className="major-section-header">
            <span>Contact Information</span>
          </div>

          <div className="key-summary" style={{ marginBottom: '20px' }}>
            <div className="key-summary-title">General Inquiries</div>
            <p>info@aetherphygital.com</p>
          </div>

          <div className="key-summary" style={{ marginBottom: '20px' }}>
            <div className="key-summary-title">Partnerships</div>
            <p>partnerships@aetherphygital.com</p>
          </div>

          <div className="key-summary" style={{ marginBottom: '20px' }}>
            <div className="key-summary-title">Press & Media</div>
            <p>press@aetherphygital.com</p>
          </div>

          <div className="sidebar-callout">
            <div className="sidebar-callout-title">Headquarters</div>
            <p>
              <strong>Alchemist Atelier</strong><br />
              Mesa, Arizona<br />
              United States
            </p>
          </div>
        </div>
      </div>

      <div className="content-separator"></div>

      <div className="takeaway-box">
        <strong>Response Time:</strong> We typically respond to all inquiries within
        24-48 business hours. For urgent matters, please indicate in your subject line.
      </div>
    </div>
  );
}

export default ContactContent;
