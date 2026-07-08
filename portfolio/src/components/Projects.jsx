import { useState } from 'react';
import portfolioData from '../data/portfolioData';

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const categories = ['all', ...new Set(portfolioData.projects.map(p => p.category))];

  const filtered = filter === 'all'
    ? portfolioData.projects
    : portfolioData.projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">My Recent Work</span>
          <h2 className="section-title">Projects</h2>
          <div className="section-divider" />
        </div>

        <div className="projects-filter">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filtered.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <div className="project-placeholder">
                  <span className="project-icon">📁</span>
                </div>
                <div className="project-overlay">
                  <div className="project-links">
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link-btn" title="Live Demo">
                        🔗
                      </a>
                    )}
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link-btn" title="Source Code">
                      💻
                    </a>
                  </div>
                </div>
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
