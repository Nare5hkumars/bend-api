import portfolioData from '../data/portfolioData';

export default function Skills() {
  const categories = [...new Set(portfolioData.skills.map(s => s.category))];

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">My Technical Proficiency</span>
          <h2 className="section-title">Skills & Tools</h2>
          <div className="section-divider" />
        </div>
        <div className="skills-content">
          {categories.map(category => (
            <div key={category} className="skill-category">
              <h3 className="skill-category-title">{category}</h3>
              <div className="skills-grid">
                {portfolioData.skills
                  .filter(s => s.category === category)
                  .map(skill => (
                    <div key={skill.name} className="skill-card">
                      <div className="skill-header">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      <div className="skill-bar-track">
                        <div
                          className="skill-bar-fill"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
