import portfolioData from '../data/portfolioData';

export default function Certifications() {
  return (
    <section id="certifications" className="section certifications-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">My Achievements</span>
          <h2 className="section-title">Certifications & Awards</h2>
          <div className="section-divider" />
        </div>
        <div className="certifications-grid">
          {portfolioData.certifications.map(cert => (
            <div key={cert.id} className="cert-card">
              <div className="cert-icon">{cert.icon}</div>
              <div className="cert-info">
                <h3>{cert.title}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <p className="cert-date">{cert.date}</p>
              </div>
              <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-link" title="View credential">
                →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
