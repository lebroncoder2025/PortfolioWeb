import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MediaLightbox from '../components/MediaLightbox';
import { TikTokThumbnail } from '../components/TikTokEmbed';

const colors = {
  beige: '#F5F5DC',
  cream: '#FFFDD0',
  linen: '#FAF0E6',
  gold: '#D4AF37',
  brown: '#8B7355',
  darkGray: '#3E3E3E',
};

export default function PortfolioItemPage({ siteData = {} }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  const { category, id } = useParams();
  const decodedCategory = decodeURIComponent(category || '');
  const decodedId = decodeURIComponent(id || '');

  const item = (siteData.portfolio || []).find(p => (p.id + '') === (decodedId + ''))
    || (siteData.portfolio || []).find(p => (p.title + '') === (decodedId + ''));

  if (!item) {
    return (
      <main style={{ backgroundColor: colors.cream, minHeight: '100vh', paddingTop: 96 }}>
        <section className="py-12 md:py-20 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center text-sm md:text-base" style={{ color: colors.brown }}>
            Projekt nie znaleziony. <Link to={`/portfolio/${encodeURIComponent(decodedCategory)}`} style={{ color: colors.gold }}>Wróć</Link>
          </div>
        </section>
      </main>
    );
  }

  const media = (item.images || []).map(m => (typeof m === 'string' ? { url: m, caption: '' } : m));
  if (media.length === 0 && item.image) {
    media.push({ url: item.image, caption: '' });
  }

  const featured = item.featuredMedia && (item.featuredMedia.url || item.featuredMedia.caption)
    ? { url: item.featuredMedia.url || '', caption: item.featuredMedia.caption || '' }
    : null;

  const inferKind = (url = '') => {
    const u = (url || '').toLowerCase();
    if (!u) return 'unknown';
    if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
    if (u.includes('tiktok.com')) return 'tiktok';
    if (u.includes('/api/video/') || u.endsWith('.mp4') || u.endsWith('.webm') || u.match(/\.(mp4|webm|mov|avi|m4v)(\?|#|$)/i)) return 'video';
    return 'image';
  };

  const renderMedia = (m, idx, aspectClass) => {
    const url = m?.url || '';
    const kind = inferKind(url);

    if (kind === 'youtube') {
      let src = url;
      if (url.includes('embed/')) {
        src = url;
      } else if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
        src = id ? `https://www.youtube.com/embed/${id}` : url;
      } else {
        src = url.replace('watch?v=', 'embed/').split('&')[0];
      }
      return (
        <iframe
          title={`yt-${idx}`}
          src={src}
          className={`w-full h-full ${aspectClass || ''}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (kind === 'tiktok') {
      // Użyj TikTokThumbnail z linkiem do TikTok - jak w galerii
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <TikTokThumbnail url={url} />
        </a>
      );
    }

    if (kind === 'video') {
      return (
        <video 
          controls 
          playsInline
          preload="metadata"
          className="w-full h-auto"
          style={{ 
            maxHeight: '80vh', 
            backgroundColor: '#000',
            display: 'block',
            margin: '0 auto'
          }}
          onError={(e) => {
            console.error('Video load error:', url, e);
          }}
          src={url}
        >
          Twoja przeglądarka nie obsługuje odtwarzania video.
        </video>
      );
    }

    return (
      <img
        src={url}
        alt={m.caption || item.title}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    );
  };

  return (
    <main style={{ backgroundColor: colors.cream, minHeight: '100vh', paddingTop: 96 }}>
      <section className="py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8">
            <Link 
              to="/portfolio" 
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-colors hover:bg-white/50"
              style={{ color: colors.brown }}
            >
              <span>←</span> Wróć do portfolio
            </Link>
            
            <div className="mt-4 md:mt-6">
              <span className="inline-block px-3 py-1 rounded-full text-xs md:text-sm font-medium mb-2 md:mb-3" style={{ backgroundColor: colors.gold, color: 'white' }}>
                {item.category}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: colors.darkGray }}>{item.title}</h1>
              {item.description && (
                <p className="text-sm sm:text-base md:text-lg mt-3 md:mt-4 max-w-3xl leading-relaxed" style={{ color: colors.brown }}>
                  {item.description}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Featured media (image or video) */}
            {featured?.url && (
              <>
                {inferKind(featured.url) === 'tiktok' ? (
                  // TikTok - bez białego tła
                  <div className="md:col-span-2 lg:col-span-3 flex justify-center py-6">
                    <div style={{ 
                      maxWidth: '400px', 
                      width: '100%',
                      aspectRatio: '9/16',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      transition: 'box-shadow 0.3s'
                    }}>
                      {renderMedia(featured, 'featured', '')}
                    </div>
                  </div>
                ) : (
                  // Inne media - z białym tłem
                  <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl overflow-visible shadow-lg hover:shadow-xl transition-shadow"
                       style={{ cursor: inferKind(featured.url) === 'image' ? 'pointer' : 'default' }}
                       onClick={(e) => {
                         if (inferKind(featured.url) === 'image') {
                           e.stopPropagation();
                           const index = media.findIndex(m => m.url === featured.url);
                           setLightboxStartIndex(index >= 0 ? index : 0);
                           setIsLightboxOpen(true);
                         }
                       }}>
                    <div className="aspect-video w-full relative group">
                      {renderMedia(featured, 'featured', '')}
                      {inferKind(featured.url) === 'image' && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                          <div className="text-4xl text-white opacity-0 group-hover:opacity-100 transition-opacity">🔍</div>
                        </div>
                      )}
                    </div>
                    {featured.caption && (
                      <div className="p-4 border-t bg-gray-50">
                        <p className="font-medium" style={{ color: colors.darkGray }}>{featured.caption}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Legacy main video fallback if no featured */}
            {!featured?.url && item.video && (
              <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-video w-full relative">
                  {renderMedia({ url: item.video, caption: item.videoCaption || '' }, 'legacy-video', '')}
                </div>
                {item.videoCaption && (
                  <div className="p-4 border-t bg-gray-50">
                    <p className="font-medium" style={{ color: colors.darkGray }}>{item.videoCaption}</p>
                  </div>
                )}
              </div>
            )}

            {/* Image Gallery */}
            {media.map((m, idx) => {
              const mediaKind = inferKind(m.url);
              const isClickable = mediaKind === 'image' || mediaKind === 'video' || mediaKind === 'tiktok';
              
              return (
              <div key={idx} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                   style={{ cursor: isClickable ? 'pointer' : 'default' }}
                   onClick={(e) => {
                     if (mediaKind === 'image' || mediaKind === 'video') {
                       e.stopPropagation();
                       setLightboxStartIndex(idx);
                       setIsLightboxOpen(true);
                     } else if (mediaKind === 'tiktok') {
                       window.open(m.url, '_blank');
                     }
                   }}>
                <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
                  {m.url ? (
                    <>
                      {mediaKind === 'tiktok' ? (
                        // Dla TikTok w galerii użyj miniatury z linkiem do nowej karty
                        <TikTokThumbnail url={m.url} />
                      ) : (
                        <div className="w-full h-full">{renderMedia(m, idx, '')}</div>
                      )}
                      {/* Lupa dla zdjęć i video */}
                      {(mediaKind === 'image' || mediaKind === 'video') && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                          <div className="text-4xl text-white opacity-0 group-hover:opacity-100 transition-opacity">{mediaKind === 'video' ? '▶️' : '🔍'}</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Brak mediów</div>
                  )}
                </div>
                {m.caption && (
                  <div className="p-4 border-t border-gray-100">
                    <p className="text-sm font-medium leading-snug" style={{ color: colors.brown }}>{m.caption}</p>
                  </div>
                )}
              </div>
            );})}
          </div>

          {/* MediaLightbox component */}
          <MediaLightbox
            isOpen={isLightboxOpen}
            media={media}
            title={item.title}
            initialIndex={lightboxStartIndex}
            onClose={() => setIsLightboxOpen(false)}
          />

          {/* TikTok Modal - temporarily disabled
          {isTikTokModalOpen && (
            <div
              className="fixed inset-0 z-[200] flex items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
              onClick={() => setIsTikTokModalOpen(false)}
            >
              <button
                onClick={() => setIsTikTokModalOpen(false)}
                className="absolute top-4 right-4 text-white text-3xl font-bold hover:opacity-70 transition-opacity z-[210]"
                aria-label="Zamknij"
              >
                ✕
              </button>

              <div
                className="relative flex items-center justify-center max-w-[90vw] max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <TikTokEmbed url={tiktokUrl} width="100%" aspectRatio="9/16" />
              </div>
            </div>
          )} */}
        </div>
      </section>
    </main>
  );
}