import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const colors = {
  beige: '#F5F5DC',
  cream: '#FFFDD0',
  linen: '#FAF0E6',
  gold: '#D4AF37',
  brown: '#8B7355',
  darkGray: '#3E3E3E',
};

export default function ContactPage({ siteData = {} }) {
  const { contact = {}, social = {} } = siteData;
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
  const isVisible = (id) => {
    if (!siteData.layout) return true;
    const item = siteData.layout.find((s) => s.id === id);
    return item ? item.visible : true;
  };

  if (!isVisible('contact')) return null;

  return (
    <main style={{ backgroundColor: colors.linen, minHeight: '100vh', paddingTop: 96 }}>
      <section className="py-16 px-8 text-center" style={{ background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.linen} 100%)` }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4" style={{ color: colors.darkGray }}>
            Skontaktuj się ze mną
          </h1>
          <p className="text-xl" style={{ color: colors.brown }}>
            Masz pytania? Chcesz współpracować? Napisz lub zadzwoń!
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-10 items-center">
          {/* Contact Info Cards */}
          <div className="space-y-6 w-full">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.darkGray }}>
              Dane kontaktowe
            </h2>
            {/* Email Card */}
            {contact.email && (
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6 hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.gold}20` }}>
                  <Mail size={28} style={{ color: colors.gold }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1" style={{ color: colors.darkGray }}>Email</h3>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="text-lg font-medium transition-all duration-300 hover:underline"
                    style={{ color: colors.gold }}
                  >
                    {contact.email}
                  </a>
                  <p className="text-sm mt-1" style={{ color: colors.brown }}>
                    Odpowiadam w ciągu 24h
                  </p>
                </div>
              </div>
            )}
            {/* Phone Card */}
            {contact.phone && (
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6 hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.gold}20` }}>
                  <Phone size={28} style={{ color: colors.gold }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1" style={{ color: colors.darkGray }}>Telefon</h3>
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="text-lg font-medium transition-all duration-300 hover:underline"
                    style={{ color: colors.gold }}
                  >
                    {contact.phone}
                  </a>
                  <p className="text-sm mt-1" style={{ color: colors.brown }}>
                    Pon-Pt: 9:00 - 18:00
                  </p>
                </div>
              </div>
            )}
            {/* Location Card */}
            {contact.location && (
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6 hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.gold}20` }}>
                  <MapPin size={28} style={{ color: colors.gold }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1" style={{ color: colors.darkGray }}>Lokalizacja</h3>
                  <span className="text-lg font-medium" style={{ color: colors.gold }}>{contact.location}</span>
                </div>
              </div>
            )}
            {/* Response Time Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6 hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.gold}20` }}>
                <Clock size={28} style={{ color: colors.gold }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1" style={{ color: colors.darkGray }}>Czas odpowiedzi</h3>
                <p className="text-lg font-medium" style={{ color: colors.gold }}>
                  Do 24 godzin
                </p>
                <p className="text-sm mt-1" style={{ color: colors.brown }}>
                  Staram się odpowiadać jak najszybciej
                </p>
              </div>
            </div>
            {/* Social Links */}
            {Object.entries(social).some(([_, url]) => url) && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4" style={{ color: colors.darkGray }}>
                  Social Media
                </h3>
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
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
