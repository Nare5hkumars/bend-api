import portfolioData from '../data/portfolioData';

export default function About() {
  const { personal } = portfolioData;

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Get To Know Me</span>
          <h2 className="section-title">About Me</h2>
          <div className="section-divider" />
        </div>
        <div className="about-content">
          <div className="about-image">
            <div className="about-avatar-frame">
              <div className="about-avatar">
                <span>{personal.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Projects Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">30+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
            </div>
          </div>
          <div className="about-text">
            <h3>{personal.title}</h3>
            {personal.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="about-objective">
              <h4>Career Objective</h4>
              <p>{personal.careerObjective}</p>
            </div>
            <div className="about-details">
              <div className="detail-item">
                <strong>📍 Location:</strong> {personal.location}
              </div>
              <div className="detail-item">
                <strong>📧 Email:</strong> {personal.email}
              </div>
              <div className="detail-item">
                <strong>📱 Phone:</strong> {personal.phone}
              </div>
            </div>
            <a href="#contact" className="btn btn-primary" onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Let's Talk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
