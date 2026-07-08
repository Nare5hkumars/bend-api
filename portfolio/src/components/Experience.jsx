import portfolioData from '../data/portfolioData';

export default function Experience() {
  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">My Career Journey</span>
          <h2 className="section-title">Experience & Education</h2>
          <div className="section-divider" />
        </div>
        <div className="timeline">
          {portfolioData.experience.map((item, index) => (
            <div key={item.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-dot">
                <span>{item.type === 'work' ? '💼' : '🎓'}</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-period">{item.period}</div>
                <h3 className="timeline-title">{item.title}</h3>
                <div className="timeline-org">
                  {item.organization} · {item.location}
                </div>
                <ul className="timeline-desc">
                  {item.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
