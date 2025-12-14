import React from 'react';

const colors = {
  beige: '#F5F5DC',
  cream: '#FFFDD0',
  linen: '#FAF0E6',
  gold: '#D4AF37',
  brown: '#8B7355',
  darkGray: '#3E3E3E',
};


export default function AboutPage({ siteData = {} }) {
  const { about = {} } = siteData;
  const isVisible = (id) => {
    if (!siteData.layout) return true;
    const item = siteData.layout.find((s) => s.id === id);
    return item ? item.visible : true;
  };

  if (!isVisible('about')) return null;

  // Example quote
  const quote = about.quote || 'Tworzę, bo kocham opowiadać historie. Każdy projekt to nowa przygoda!';

  // Example "Why Me" points
  const whyMe = [
    {
      icon: '🎥',
      title: 'Pasja do wideo',
      desc: 'Od lat realizuję filmy, które inspirują i angażują odbiorców.'
    },
    {
      icon: '📸',
      title: 'Oko do detalu',
      desc: 'Dbam o każdy szczegół, by efekt końcowy był perfekcyjny.'
    },
    {
      icon: '💬',
      title: 'Komunikacja',
      desc: 'Zawsze słucham potrzeb klienta i proponuję najlepsze rozwiązania.'
    },
    {
      icon: '🌍',
      title: 'Nowoczesność',
      desc: 'Korzystam z najnowszych trendów i technologii.'
    },
  ];

  return (
    <main style={{ backgroundColor: colors.linen, minHeight: '100vh', paddingTop: 96 }}>
      {/* Hero Section with Photo and Quote */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col items-center">
            {about.image && (
              <img src={about.image} alt="About" className="rounded-2xl shadow-2xl w-72 h-72 object-cover mb-8 border-4" style={{ borderColor: colors.gold }} />
            )}
            <blockquote className="italic text-xl text-center px-4 py-6 rounded-xl shadow bg-white/80" style={{ color: colors.brown }}>
              “{quote}”
            </blockquote>
          </div>
          <div>
            <h2 className="text-5xl font-extrabold mb-6" style={{ color: colors.gold }}>
              {about.title || 'O mnie'}
            </h2>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: colors.brown }}>
              {about.bio || 'Opowiedz o sobie i swoim doświadczeniu...'}
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {(about.stats || []).map((stat, idx) => (
                <div key={idx} className="text-center p-6 rounded-2xl shadow bg-white/90" style={{ backgroundColor: colors.cream }}>
                  <p className="text-4xl font-extrabold mb-1" style={{ color: colors.gold }}>{stat.value}+</p>
                  <p className="text-base font-semibold" style={{ color: colors.brown }}>{stat.label}</p>
                </div>
              ))}
            </div>
            {/* Why Me Section */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.darkGray }}>Dlaczego ja?</h3>
              <div className="grid grid-cols-2 gap-4">
                {whyMe.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white/80 rounded-xl p-4 shadow group hover:shadow-lg transition-all">
                    <span className="text-3xl" style={{ color: colors.gold }}>{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-lg mb-1" style={{ color: colors.darkGray }}>{item.title}</h4>
                      <p className="text-sm" style={{ color: colors.brown }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
