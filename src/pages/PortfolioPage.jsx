import React from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const colors = {
  beige: '#F5F5DC',
  cream: '#FFFDD0',
  linen: '#FAF0E6',
  gold: '#D4AF37',
  brown: '#8B7355',
  darkGray: '#3E3E3E',
};

export default function PortfolioPage({ siteData = {} }) {
  const navigate = useNavigate();
  const { portfolio = [] } = siteData;

  const inferKind = (url = '') => {
    const u = (url || '').toLowerCase();
    if (!u) return 'unknown';
    if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
    if (u.includes('tiktok.com') || u.includes('vm.tiktok')) return 'tiktok';
    if (u.match(/\.(mp4|webm|mov|avi|m4v)(\?|#|$)/)) return 'video';
    return 'image';
  };

  // Funkcja do uzyskania miniatury
  const getThumbnail = (item) => {
    const allMedia = [];
    
    if (item.featuredMedia?.url) allMedia.push(item.featuredMedia.url);
    if (Array.isArray(item.images)) {
      item.images.forEach(img => {
        const url = typeof img === 'string' ? img : img?.url;
        if (url) allMedia.push(url);
      });
    }
    if (item.image) allMedia.push(item.image);
    if (item.video) allMedia.push(item.video);
    
    // Znajdź najlepszą miniaturę
    for (const url of allMedia) {
      const kind = inferKind(url);
      if (kind === 'image') return { url, kind: 'image' };
      if (kind === 'youtube') {
        let ytId = '';
        if (url.includes('embed/')) ytId = url.split('embed/')[1]?.split(/[?&]/)[0];
        else if (url.includes('youtu.be/')) ytId = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
        else if (url.includes('watch?v=')) ytId = url.split('watch?v=')[1]?.split('&')[0];
        if (ytId) return { url: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`, kind: 'youtube' };
      }
    }
    
    // Jeśli tylko video/tiktok - zwróć pierwszy
    if (allMedia.length > 0) {
      return { url: allMedia[0], kind: inferKind(allMedia[0]) };
    }
    
    return null;
  };

  const renderThumb = (thumbData, title) => {
    if (!thumbData) {
      return <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">Brak mediów</div>;
    }
    
    const { url, kind } = thumbData;
    
    if (kind === 'video') {
      return (
        <div className="w-full h-full relative bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <video src={url} muted playsInline className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl">▶️</span>
          </div>
        </div>
      );
    }
    
    if (kind === 'tiktok') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center">
          <span className="text-5xl">🎵</span>
        </div>
      );
    }
    
    return (
      <img
        src={url}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full bg-gray-300 flex items-center justify-center text-3xl">📷</div>';
        }}
      />
    );
  };
  const categories = React.useMemo(() => {
    const fromConfig = Array.isArray(siteData.categories) ? siteData.categories.map((c) => c?.name).filter(Boolean) : [];
    const fromItems = (portfolio || []).map((p) => p?.category).filter(Boolean);
    const unique = Array.from(new Set([...fromConfig, ...fromItems].map((s) => (s || '').trim()).filter(Boolean)));
    unique.sort((a, b) => a.localeCompare(b, 'pl'));
    return unique;
  }, [siteData.categories, portfolio]);

  const isVisible = (id) => {
    if (!siteData.layout) return true;
    const item = siteData.layout.find((s) => s.id === id);
    return item ? item.visible : true;
  };

  if (!isVisible('portfolio')) return null;

  return (
    <main style={{ backgroundColor: colors.linen, minHeight: '100vh', paddingTop: 96 }}>
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: colors.darkGray }}>
            Portfolio
          </h2>

          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {[{ name: 'All' }, ...categories.map((name) => ({ name }))].map(cat => (
              <button
                key={cat.name}
                onClick={() => navigate(cat.name === 'All' ? '/portfolio' : `/portfolio/${encodeURIComponent(cat.name)}`)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 border-2 hover:shadow-lg hover:scale-105 active:scale-95`}
                style={{ backgroundColor: 'transparent', borderColor: colors.gold, color: colors.gold }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {portfolio.map((item, idx) => {
              const thumbData = getThumbnail(item);
              const hasVideo = !!item.video || (thumbData && (thumbData.kind === 'video' || thumbData.kind === 'youtube' || thumbData.kind === 'tiktok'));
              
              return (
              <div
                key={item.id || idx}
                onClick={() => {
                  const safeCategory = (item.category || 'Uncategorized').toString();
                  const safeId = (item.id || item._id || item.title || idx).toString();
                  navigate(`/portfolio/${encodeURIComponent(safeCategory)}/${encodeURIComponent(safeId)}`);
                }}
                className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition group cursor-pointer"
              >
                <div className="relative overflow-hidden h-64 bg-gray-100">
                  {renderThumb(thumbData, item.title)}

                  {hasVideo && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Play size={48} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="p-6" style={{ backgroundColor: colors.cream }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.gold }}>{item.category}</p>
                  <h3 className="text-xl font-bold" style={{ color: colors.darkGray }}>{item.title}</h3>
                </div>
              </div>
            );})}
          </div>
          {/* item pages now used instead of modal */}
        </div>
      </section>
    </main>
  );
}
