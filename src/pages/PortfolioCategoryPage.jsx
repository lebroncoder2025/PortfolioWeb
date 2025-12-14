import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const colors = {
  beige: '#F5F5DC',
  cream: '#FFFDD0',
  linen: '#FAF0E6',
  gold: '#D4AF37',
  brown: '#8B7355',
  darkGray: '#3E3E3E',
};

export default function PortfolioCategoryPage({ siteData = {} }) {
  const { category } = useParams();
  const decoded = decodeURIComponent(category || '');
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const navigate = useNavigate();

  // Treat "All" as the main portfolio page
  useEffect(() => {
    if (decoded.toLowerCase() === 'all') {
      navigate('/portfolio', { replace: true });
    }
  }, [decoded, navigate]);

  const items = useMemo(() => (siteData.portfolio || []).filter((p) => ((p.category || '') + '').toLowerCase() === (decoded + '').toLowerCase()), [siteData, decoded]);
  const categoryInfo = (siteData.categories || []).find(c => c.name === decoded);

  const inferKind = (url = '') => {
    const u = (url || '').toLowerCase();
    if (!u) return 'unknown';
    if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
    if (u.includes('tiktok.com')) return 'tiktok';
    if (u.endsWith('.mp4') || u.endsWith('.webm')) return 'video';
    return 'image';
  };

  const renderThumb = (url, title) => {
    const kind = inferKind(url);
    if (kind === 'video') {
      return <video src={url} muted playsInline className="w-full h-full object-cover" />;
    }
    if (kind === 'youtube') {
      return (
        <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-red-600 to-red-800">
          ▶️ {/* Play button */}
        </div>
      );
    }
    if (kind === 'tiktok') {
      return (
        <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-black to-gray-800">
          ♪ {/* Music note */}
        </div>
      );
    }
    return (
      <img
        src={url}
        alt={title}
        className="object-cover h-full w-full"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = '/placeholder.jpg';
        }}
      />
    );
  };

  const isVisible = (id) => {
    if (!siteData.layout) return true;
    const item = siteData.layout.find((s) => s.id === id);
    return item ? item.visible : true;
  };

  if (!isVisible('portfolio')) return null;

  if (decoded.toLowerCase() === 'all') return null;

  const openItemPage = (item) => {
    const id = item.id || item._id || item.title;
    const safeCategory = (item.category || decoded || 'Uncategorized').toString();
    navigate(`/portfolio/${encodeURIComponent(safeCategory)}/${encodeURIComponent(id)}`);
  };

  return (
    <main style={{ backgroundColor: colors.cream, minHeight: '100vh', paddingTop: 96 }}>
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link to="/portfolio" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors hover:bg-white/50" style={{ color: colors.brown }}>
              <span>←</span> Wróć do wszystkich kategorii
            </Link>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: colors.darkGray }}>Kategoria: {decoded}</h2>
              {categoryInfo?.description && <p className="text-lg mt-2" style={{ color: colors.brown }}>{categoryInfo.description}</p>}
              <p className="text-sm" style={{ color: colors.brown }}>{items.length} projektów</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('grid')}
                className="px-3 py-2 rounded font-medium transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95"
                style={{
                  border: `1px solid ${colors.gold}`,
                  backgroundColor: view === 'grid' ? colors.gold : 'transparent',
                  color: view === 'grid' ? 'white' : colors.brown
                }}
              >
                Kafelki
              </button>
              <button
                onClick={() => setView('list')}
                className="px-3 py-2 rounded font-medium transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95"
                style={{
                  border: `1px solid ${colors.gold}`,
                  backgroundColor: view === 'list' ? colors.gold : 'transparent',
                  color: view === 'list' ? 'white' : colors.brown
                }}
              >
                Lista
              </button>
            </div>
          </div>

          {items.length === 0 && (
            <div className="py-20 text-center" style={{ color: colors.brown }}>
              Brak projektów w tej kategorii. <Link to="/portfolio" style={{ color: colors.gold }}>Wróć do portfolio</Link>
            </div>
          )}

          {view === 'grid' ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((item, idx) => (
                <div key={item.id || idx} className="bg-white rounded-lg shadow p-4 cursor-pointer" onClick={() => openItemPage(item)}>
                  <div className="h-44 w-full mb-4 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    {(() => {
                      const thumbUrl = item.featuredMedia?.url
                        || item.image
                        || (item.images && item.images[0] ? (item.images[0].url || item.images[0]) : '');

                      if (!thumbUrl) return <div style={{ color: colors.brown }}>Brak mediów</div>;
                      return renderThumb(thumbUrl, item.title);
                    })()}
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: colors.darkGray }}>{item.title}</h3>
                  <p style={{ color: colors.brown }}>{item.subtitle || item.description || ''}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, idx) => (
                <div key={item.id || idx} className="bg-white rounded-lg shadow p-6 flex gap-6 items-center">
                  <div className="w-40 h-28 bg-gray-100 rounded overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => openItemPage(item)}>
                    {(() => {
                      const thumbUrl = item.featuredMedia?.url
                        || item.image
                        || (item.images && item.images[0] ? (item.images[0].url || item.images[0]) : '');

                      if (!thumbUrl) return <div style={{ color: colors.brown }}>Brak mediów</div>;
                      return renderThumb(thumbUrl, item.title);
                    })()}
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: colors.darkGray }}>{item.title}</h3>
                    <p style={{ color: colors.brown }}>{item.description}</p>
                    <div className="mt-4">
                      <button className="px-3 py-2 rounded transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95" style={{ border: `1px solid ${colors.gold}`, color: colors.gold }} onClick={() => openItemPage(item)}>Otwórz galerię</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* item page replaces modal; navigation handled in list above */}
    </main>
  );
}
