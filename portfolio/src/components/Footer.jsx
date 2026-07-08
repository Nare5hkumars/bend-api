import portfolioData from '../data/portfolioData';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">&lt;JD /&gt;</span>
            <p>Building digital experiences that make a difference.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            {portfolioData.navLinks.map(link => (
              <a key={link.href} href={link.href} onClick={(e) => {
                e.preventDefault();
                document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
              }}>{link.label}</a>
            ))}
          </div>
          <div className="footer-social">
            <h4>Connect</h4>
            <div className="footer-social-links">
              {portfolioData.social.github && <a href={portfolioData.social.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
              {portfolioData.social.linkedin && <a href={portfolioData.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
              {portfolioData.social.twitter && <a href={portfolioData.social.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {year} {portfolioData.personal.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
