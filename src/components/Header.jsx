import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const colors = {
  beige: '#F5F5DC',
  cream: '#FFFDD0',
  linen: '#FAF0E6',
  gold: '#D4AF37',
  brown: '#8B7355',
  darkGray: '#3E3E3E',
};

export default function Header({ siteData = {} }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  // Build navigation from siteData.layout when available (keeps order + visibility)
  const defaultMap = {
    hero: { to: '/', label: 'Home' },
    about: { to: '/about', label: 'O mnie' },
    services: { to: '/services', label: 'Usługi' },
    portfolio: { to: '/portfolio', label: 'Portfolio' },
    contact: { to: '/contact', label: 'Kontakt' }
  };

  const layout = Array.isArray(siteData.layout) ? [...siteData.layout].sort((a,b)=> (a.order||0)-(b.order||0)) : null;
  let navLinks = [];
  if (layout) {
    navLinks = layout.filter(s => s.visible && s.id !== 'testimonials').map(s => defaultMap[s.id] || { to: `/${s.id}`, label: s.id });
  } else {
    navLinks = Object.values(defaultMap).filter(v => v);
  }

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-lg' : 'py-4'}`} style={{ backgroundColor: scrolled ? 'rgba(255,255,255,0.98)' : 'white', backdropFilter: scrolled ? 'blur(8px)' : 'none' }}>
      <nav className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: colors.gold }}>K</div>
          <span className="text-xl font-bold" style={{ color: colors.darkGray }}>Portfolio</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive ? 'text-white shadow-md' : 'hover:bg-gray-100 hover:shadow-md'}`}
              style={({ isActive }) => ({ backgroundColor: isActive ? colors.gold : 'transparent', color: isActive ? 'white' : colors.brown })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-md">
          <span className={`w-5 h-0.5 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ backgroundColor: colors.darkGray }} />
          <span className={`w-5 h-0.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} style={{ backgroundColor: colors.darkGray }} />
          <span className={`w-5 h-0.5 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ backgroundColor: colors.darkGray }} />
        </button>
      </nav>

      <div className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-4 space-y-2">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive ? 'text-white' : 'hover:bg-gray-100 hover:shadow-md'}`}
              style={({ isActive }) => ({ backgroundColor: isActive ? colors.gold : colors.cream, color: isActive ? 'white' : colors.brown })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
