import { useState } from 'react';
import portfolioData from '../data/portfolioData';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  function update(field) {
    return e => setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: 'error', text: 'Please fill in required fields.' });
      return;
    }
    setSending(true);
    setStatus({ type: '', text: '' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', text: 'Message sent successfully! I\'ll get back to you soon.' });
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', text: data.message || 'Failed to send message.' });
      }
    } catch {
      setStatus({ type: 'error', text: 'Network error. Please try again later.' });
    } finally {
      setSending(false);
    }
  }

  const { personal, social } = portfolioData;

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Get In Touch</span>
          <h2 className="section-title">Contact Me</h2>
          <div className="section-divider" />
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <h3>Let's work together</h3>
            <p>I'm always open to new opportunities, collaborations, and interesting projects. Feel free to reach out!</p>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${personal.email}`}>{personal.email}</a>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <div>
                  <strong>Phone</strong>
                  <span>{personal.phone}</span>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>Location</strong>
                  <span>{personal.location}</span>
                </div>
              </div>
            </div>
            <div className="contact-social">
              <h4>Find me on</h4>
              <div className="social-links">
                {social.github && <a href={social.github} target="_blank" rel="noopener noreferrer" className="social-link-btn" title="GitHub">GH</a>}
                {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link-btn" title="LinkedIn">LI</a>}
                {social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="social-link-btn" title="Twitter">TW</a>}
                {social.devto && <a href={social.devto} target="_blank" rel="noopener noreferrer" className="social-link-btn" title="Dev.to">DV</a>}
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            {status.text && (
              <div className={`form-alert ${status.type}`}>{status.text}</div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={form.name} onChange={update('name')} placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={form.email} onChange={update('email')} placeholder="john@example.com" required />
              </div>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input type="text" value={form.subject} onChange={update('subject')} placeholder="What's this about?" />
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea rows="6" value={form.message} onChange={update('message')} placeholder="Your message..." required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? 'Sending...' : 'Send Message ✈️'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
