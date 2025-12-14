import React from 'react';

const colors = {
  beige: '#F5F5DC',
  cream: '#FFFDD0',
  linen: '#FAF0E6',
  gold: '#D4AF37',
  brown: '#8B7355',
  darkGray: '#3E3E3E',
};


export default function ServicesPage({ siteData = {} }) {
  const { services = [] } = siteData;
  const isVisible = (id) => {
    if (!siteData.layout) return true;
    const item = siteData.layout.find((s) => s.id === id);
    return item ? item.visible : true;
  };

  if (!isVisible('services')) return null;

  // Example "Why Us" content
  const whyUs = [
    {
      icon: '✨',
      title: 'Kreatywność',
      desc: 'Tworzymy oryginalne i nieszablonowe projekty, które wyróżniają się na rynku.'
    },
    {
      icon: '🤝',
      title: 'Indywidualne podejście',
      desc: 'Każdy klient jest dla nas wyjątkowy – słuchamy, doradzamy, realizujemy marzenia.'
    },
    {
      icon: '🚀',
      title: 'Efektywność',
      desc: 'Dostarczamy gotowe materiały szybko i bez kompromisów jakościowych.'
    },
    {
      icon: '🏆',
      title: 'Doświadczenie',
      desc: 'Setki zrealizowanych projektów i zadowolonych klientów.'
    },
  ];

  // Example service categories for animation
  const categories = [
    'Reklamy',
    'Vlogi',
    'Social Media',
    'Fotografia',
    'Kampanie',
    'YouTube',
    'TikTok',
    'Instagram',
  ];

  return (
    <main style={{ backgroundColor: colors.cream, minHeight: '100vh', paddingTop: 96 }}>
      {/* Animated Hero Section */}
      <section className="py-20 px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl font-extrabold mb-6" style={{ color: colors.gold, letterSpacing: 1 }}>
            Usługi, które inspirują
          </h2>
          <p className="text-xl mb-10" style={{ color: colors.brown }}>
            Oferujemy kompleksowe wsparcie w zakresie produkcji wideo, fotografii i promocji w social media. Zobacz, co możemy dla Ciebie zrobić!
          </p>
        </div>
        {/* Animated categories */}
        <div className="absolute left-0 right-0 top-0 flex gap-8 justify-center opacity-20 pointer-events-none select-none animate-pulse" style={{ fontSize: 64, zIndex: 0 }}>
          {categories.map((cat, i) => (
            <span key={cat + i} style={{ color: i % 2 === 0 ? colors.gold : colors.brown }}>{cat}</span>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-10 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            {(services || []).map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all border-t-4 group relative overflow-hidden"
                style={{ borderTop: `4px solid ${colors.gold}` }}
              >
                <div className="absolute -top-8 -right-8 opacity-10 text-8xl pointer-events-none select-none group-hover:opacity-20 transition-all">
                  {service.icon || '💡'}
                </div>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform" style={{ color: colors.gold }}>
                  {service.icon || '💡'}
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: colors.darkGray }}>{service.title}</h3>
                <p className="mb-4" style={{ color: colors.brown }}>{service.description}</p>
                {/* Example tags/animations */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.slice(0, 3 + (idx % 3)).map((cat, i) => (
                    <span key={cat + i} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: colors.linen, color: colors.brown }}>{cat}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 px-8 bg-white border-t-2" style={{ borderColor: colors.gold }}>
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: colors.gold }}>
            Dlaczego warto nam zaufać?
          </h3>
          <div className="grid md:grid-cols-2 gap-10">
            {whyUs.map((item, i) => (
              <div key={i} className="flex items-start gap-6 bg-[rgba(250,240,230,0.7)] rounded-2xl p-8 shadow group hover:shadow-lg transition-all">
                <div className="text-4xl" style={{ color: colors.gold }}>{item.icon}</div>
                <div>
                  <h4 className="text-xl font-bold mb-2" style={{ color: colors.darkGray }}>{item.title}</h4>
                  <p style={{ color: colors.brown }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Projects/Testimonials */}
      <section className="py-16 px-8" style={{ background: `linear-gradient(135deg, ${colors.linen} 0%, ${colors.cream} 100%)` }}>
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12" style={{ color: colors.darkGray }}>
            Przykłady realizacji
          </h3>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4">
              <span className="text-3xl" style={{ color: colors.gold }}>🎬</span>
              <h4 className="font-bold text-lg" style={{ color: colors.darkGray }}>Spot reklamowy dla marki XYZ</h4>
              <p style={{ color: colors.brown }}>Kompleksowa produkcja wideo, od scenariusza po montaż i promocję w social media. Efekt: wzrost sprzedaży o 30%.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4">
              <span className="text-3xl" style={{ color: colors.gold }}>📸</span>
              <h4 className="font-bold text-lg" style={{ color: colors.darkGray }}>Sesja zdjęciowa influencerki</h4>
              <p style={{ color: colors.brown }}>Kreatywna sesja zdjęciowa na Instagram, która zdobyła tysiące polubień i nowych obserwujących.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
