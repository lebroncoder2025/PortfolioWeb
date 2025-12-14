import React from 'react';
import { NavLink } from 'react-router-dom';

const colors = {
  beige: '#F5F5DC',
  cream: '#FFFDD0',
  linen: '#FAF0E6',
  gold: '#D4AF37',
  brown: '#8B7355',
  darkGray: '#3E3E3E',
};

export default function Footer({ siteData = {} }) {
  const year = new Date().getFullYear();
  const email = siteData?.contact?.email;
  const social = siteData?.social || {};

  const socialIcons = {
    facebook: { icon: '📘', label: 'Facebook' },
    instagram: { icon: '📷', label: 'Instagram' },
    twitter: { icon: '𝕏', label: 'Twitter' },
    tiktok: { icon: '🎵', label: 'TikTok' },
    youtube: { icon: '▶️', label: 'YouTube' },
    linkedin: { icon: '💼', label: 'LinkedIn' },
    pinterest: { icon: '📌', label: 'Pinterest' },
    canva: { icon: '🎨', label: 'Canva' },
  };

  return (
    <footer className="mt-auto" style={{ backgroundColor: colors.beige, borderTop: `4px solid ${colors.gold}` }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: colors.gold }}>
                K
              </div>
              <span className="text-xl font-bold" style={{ color: colors.darkGray }}>Portfolio</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: colors.brown }}>
              Profesjonalne portfolio i prezentacja realizacji. Strona zoptymalizowana pod urządzenia mobilne.
            </p>
          </div>

          <div>
            <p className="font-bold text-lg mb-4" style={{ color: colors.darkGray }}>Nawigacja</p>
            <div className="flex flex-col gap-2">
              <NavLink to="/" className="text-sm hover:underline transition" style={{ color: colors.brown }}>🏠 Home</NavLink>
              <NavLink to="/about" className="text-sm hover:underline transition" style={{ color: colors.brown }}>👤 O mnie</NavLink>
              <NavLink to="/services" className="text-sm hover:underline transition" style={{ color: colors.brown }}>💼 Usługi</NavLink>
              <NavLink to="/portfolio" className="text-sm hover:underline transition" style={{ color: colors.brown }}>📸 Portfolio</NavLink>
              <NavLink to="/contact" className="text-sm hover:underline transition" style={{ color: colors.brown }}>📧 Kontakt</NavLink>
            </div>
          </div>

          <div>
            <p className="font-bold text-lg mb-4" style={{ color: colors.darkGray }}>Kontakt</p>
            {email ? (
              <a className="text-sm hover:underline transition block mb-2" href={`mailto:${email}`} style={{ color: colors.brown }}>
                ✉️ {email}
              </a>
            ) : (
              <p className="text-sm mb-2" style={{ color: colors.brown }}>Dane kontaktowe wkrótce.</p>
            )}
            <NavLink
              to="/admin_panel"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold mt-4 transition duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
              style={{ backgroundColor: colors.cream, color: colors.brown, border: `2px solid ${colors.gold}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.gold;
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.boxShadow = `0 8px 16px rgba(212,175,55,0.3)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.cream;
                e.currentTarget.style.color = colors.brown;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ⚙️ Panel admin
            </NavLink>
          </div>

          <div>
            <p className="font-bold text-lg mb-4" style={{ color: colors.darkGray }}>Obserwuj nas</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(socialIcons).map(([key, { icon, label }]) => (
                social[key] && (
                  <a
                    key={key}
                    href={social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-lg transition duration-300 hover:shadow-lg hover:scale-110 active:scale-95"
                    title={label}
                    style={{ 
                      backgroundColor: colors.cream, 
                      color: colors.brown, 
                      border: `2px solid ${colors.gold}`,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = colors.gold;
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = colors.cream;
                      e.target.style.color = colors.brown;
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    {icon}
                  </a>
                )
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 text-sm flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between" style={{ borderTop: `2px solid ${colors.cream}`, color: colors.brown }}>
          <span>© {year} Professional Portfolio. Wszystkie prawa zastrzeżone.</span>
          <div className="flex gap-4 flex-wrap">
            <NavLink to="/privacy" className="hover:underline transition" style={{ color: colors.brown }}>Polityka prywatności</NavLink>
            <NavLink to="/cookies" className="hover:underline transition" style={{ color: colors.brown }}>Polityka cookies</NavLink>
            <NavLink to="/terms" className="hover:underline transition" style={{ color: colors.brown }}>Warunki użytkowania</NavLink>
          </div>
          <span style={{ color: colors.darkGray }}>Wykonanie: React + Express ❤️</span>
        </div>
      </div>
    </footer>
  );
}
