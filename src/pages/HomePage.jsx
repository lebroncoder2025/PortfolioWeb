import React from 'react';
import { useNavigate } from 'react-router-dom';

const colors = {
  beige: '#F5F5DC',
  cream: '#FFFDD0',
  linen: '#FAF0E6',
  gold: '#D4AF37',
  brown: '#8B7355',
  darkGray: '#3E3E3E',
};

export default function HomePage({ siteData = {} }) {
  const navigate = useNavigate();
  const { hero = {}, about = {}, contact = {}, services = [] } = siteData;
  const isVisible = (id) => {
    if (!siteData.layout) return true;
    const item = siteData.layout.find((s) => s.id === id);
    return item ? item.visible : true;
  };

  const portfolio = siteData.portfolio || [];
  const recentPortfolio = portfolio.slice(0, 3);

  return (
    <main style={{ backgroundColor: colors.linen }}>
      {/* Hero Section */}
      {isVisible('hero') && (
        <section className="w-full py-12 px-4 md:py-20 md:px-6 lg:py-32" style={{ backgroundColor: colors.cream }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
              <div className="text-center md:text-left">
                {hero.image && (
                  <img src={hero.image} alt="Profile" className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto md:mx-0 rounded-full object-cover mb-6 sm:mb-8 border-4 shadow-lg" style={{ borderColor: colors.gold }} />
                )}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6" style={{ color: colors.darkGray }}>
                  {hero.title || 'Profesjonalne Portfolio'}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed" style={{ color: colors.brown }}>
                  {hero.subtitle || 'Twoje portfolio z zaawansowanym panelem admin'}
                </p>
                <div className="flex gap-2 sm:gap-3 justify-center md:justify-start flex-wrap">
                  <button onClick={() => navigate('/about')} className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95" style={{ borderColor: colors.gold, color: colors.gold }}>
                    O mnie
                  </button>
                  <button onClick={() => navigate('/services')} className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95" style={{ borderColor: colors.gold, color: colors.gold }}>
                    Usługi
                  </button>
                  <button onClick={() => navigate('/portfolio')} className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95" style={{ borderColor: colors.gold, color: colors.gold }}>
                    Portfolio
                  </button>
                  <button onClick={() => navigate('/contact')} className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95" style={{ borderColor: colors.gold, color: colors.gold }}>
                    Kontakt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Preview */}
      {isVisible('about') && about.content && (
        <section className="w-full py-12 md:py-16 lg:py-24 px-4 md:px-6" style={{ backgroundColor: colors.linen }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-center" style={{ color: colors.darkGray }}>
              O mnie
            </h2>
            <div className="bg-white rounded-lg p-6 sm:p-8 md:p-12 shadow-md border-b-4" style={{ borderColor: colors.gold }}>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-6" style={{ color: colors.brown }}>
                {about.content}
              </p>
              <button onClick={() => navigate('/about')} className="px-6 py-2 rounded-lg font-semibold mt-4 text-sm sm:text-base" style={{ backgroundColor: colors.gold, color: 'white' }}>
                Czytaj więcej →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Services Preview */}
      {isVisible('services') && services.length > 0 && (
        <section className="w-full py-12 md:py-16 lg:py-24 px-4 md:px-6" style={{ backgroundColor: colors.linen }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 text-center" style={{ color: colors.darkGray }}>
              Moje usługi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {services.slice(0, 3).map((service, idx) => (
                <div key={idx} className="bg-white rounded-lg p-6 sm:p-8 shadow-md hover:shadow-lg transition-all border-t-4" style={{ borderColor: colors.gold }}>
                  <p className="text-4xl sm:text-5xl mb-3 sm:mb-4">{service.icon}</p>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: colors.darkGray }}>
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base" style={{ color: colors.brown }}>
                    {service.description?.substring(0, 60)}...
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button onClick={() => navigate('/services')} className="px-8 py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95" style={{ borderColor: colors.gold, color: colors.gold }}>
                Wszystkie usługi →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Recent Portfolio Preview */}
      {isVisible('portfolio') && portfolio.length > 0 && (
        <section className="w-full py-16 md:py-24 px-6" style={{ backgroundColor: colors.cream }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center" style={{ color: colors.darkGray }}>
              Ostatnie prace
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPortfolio.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer border-t-4" 
                     style={{ borderColor: colors.gold }}
                     onClick={() => navigate(`/portfolio/${item.category}/${item.id}`)}>
                  {item.featured?.url ? (
                    <img src={item.featured.url} alt={item.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center" style={{ backgroundColor: colors.linen }}>
                      <span style={{ color: colors.gold }}>📸 Portfolio</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.darkGray }}>
                      {item.title}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: colors.brown }}>
                      {item.category || 'Kategoria'}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: colors.brown }}>
                      {item.description?.substring(0, 80)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button onClick={() => navigate('/portfolio')} className="px-8 py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95" style={{ borderColor: colors.gold, color: colors.gold }}>
                Zobacz całe portfolio →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      {isVisible('contact') && (
        <section className="w-full py-16 md:py-24 px-6" style={{ backgroundColor: colors.linen }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.darkGray }}>
              Zainteresowany współpracą?
            </h2>
            <p className="text-lg mb-8" style={{ color: colors.brown }}>
              {contact.intro || 'Skontaktuj się ze mną, aby omówić Twój projekt'}
            </p>
            <button 
              onClick={() => navigate('/contact')} 
              className="px-10 py-3 rounded-lg font-semibold text-lg transition duration-300 hover:shadow-lg hover:scale-105 active:scale-95" 
              style={{ backgroundColor: colors.gold, color: 'white' }}
              onMouseEnter={(e) => e.target.style.boxShadow = `0 12px 24px rgba(212,175,55,0.4)`}
              onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
            >
              Skontaktuj się 📧
            </button>
          </div>
        </section>
      )}
    </main>
  );
}



