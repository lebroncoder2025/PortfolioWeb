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
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-8 md:gap-12 sm:grid-cols-2 md:grid-cols-4 mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-base md:text-xl" style={{ backgroundColor: colors.gold }}>
                K
              </div>
              <span className="text-lg md:text-xl font-bold" style={{ color: colors.darkGray }}>Portfolio</span>
            </div>
            <p className="text-xs md:text-sm leading-relaxed" style={{ color: colors.brown }}>
              Profesjonalne portfolio i prezentacja realizacji. Strona zoptymalizowana pod urządzenia mobilne.
            </p>
          </div>

          <div>
            <p className="font-bold text-base md:text-lg mb-3 md:mb-4" style={{ color: colors.darkGray }}>Nawigacja</p>
            <div className="flex flex-col gap-1 md:gap-2">
              <NavLink to="/" className="text-xs md:text-sm hover:underline transition" style={{ color: colors.brown }}>🏠 Home</NavLink>
              <NavLink to="/about" className="text-xs md:text-sm hover:underline transition" style={{ color: colors.brown }}>👤 O mnie</NavLink>
              <NavLink to="/services" className="text-xs md:text-sm hover:underline transition" style={{ color: colors.brown }}>💼 Usługi</NavLink>
              <NavLink to="/portfolio" className="text-xs md:text-sm hover:underline transition" style={{ color: colors.brown }}>📸 Portfolio</NavLink>
              <NavLink to="/contact" className="text-xs md:text-sm hover:underline transition" style={{ color: colors.brown }}>📧 Kontakt</NavLink>
            </div>
          </div>

          <div>
            <p className="font-bold text-base md:text-lg mb-3 md:mb-4" style={{ color: colors.darkGray }}>Kontakt</p>
            {email ? (
              <a className="text-xs md:text-sm hover:underline transition block mb-2" href={`mailto:${email}`} style={{ color: colors.brown }}>
                ✉️ {email}
              </a>
            ) : (
              <p className="text-xs md:text-sm mb-2" style={{ color: colors.brown }}>Dane kontaktowe wkrótce.</p>
            )}
            <NavLink
              to="/admin_panel"
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold mt-3 md:mt-4 transition duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
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
            <p className="font-bold text-base md:text-lg mb-3 md:mb-4" style={{ color: colors.darkGray }}>Obserwuj nas</p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {Object.entries(socialIcons).map(([key, { icon, label }]) => (
                social[key] && (
                  <a
                    key={key}
                    href={social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-base md:text-lg transition duration-300 hover:shadow-lg hover:scale-110 active:scale-95"
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
