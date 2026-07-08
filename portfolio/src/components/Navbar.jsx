import { useState, useEffect } from 'react';
import portfolioData from '../data/portfolioData';

export default function Navbar({ dark, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('#hero');

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);

      const sections = portfolioData.navLinks.map(l => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActive('#' + sections[i]);
          break;
        }
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleNavClick(href) {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#hero" className="nav-logo" onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}>
            {'<JD />'}
          </a>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {portfolioData.navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link ${active === link.href ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              >
                {link.label}
              </a>
            ))}
            <div className="nav-mobile-theme">
              <button className="theme-btn" onClick={toggleTheme}>
                {dark ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>
          <div className="nav-right">
            <button className="theme-btn desktop-only" onClick={toggleTheme}>
              {dark ? '☀️' : '🌙'}
            </button>
            <button className="hamburger" onClick={() => setMenuOpen(p => !p)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
