import React, { useState, useEffect } from 'react';
import TikTokEmbed from './TikTokEmbed';

// eslint-disable-next-line no-unused-vars
const colors = {
  beige: '#F5F5DC',
  cream: '#FFFDD0',
  linen: '#FAF0E6',
  gold: '#D4AF37',
  brown: '#8B7355',
  darkGray: '#3E3E3E',
};

export default function MediaLightbox({ isOpen, media, title, onClose, initialIndex = 0, onNavigate }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentIndex, media.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  if (!isOpen || !media || media.length === 0) return null;

  const currentMedia = media[currentIndex];
  const url = currentMedia?.url || '';

  const inferKind = (url = '') => {
    const u = (url || '').toLowerCase();
    if (!u) return 'unknown';
    if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
    if (u.includes('tiktok.com')) return 'tiktok';
    if (u.endsWith('.mp4') || u.endsWith('.webm')) return 'video';
    return 'image';
  };

  const kind = inferKind(url);

  const renderMedia = () => {
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
          title={`yt-lightbox`}
          src={src}
          className="w-full h-auto"
          style={{ aspectRatio: '16 / 9', maxWidth: '100%', maxHeight: '90vh' }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (kind === 'tiktok') {
      // Użyj dedykowanego komponentu TikTok
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <TikTokEmbed url={url} width={340} minHeight={600} />
        </div>
      );
    }
    
    if (kind === 'video') {
      return (
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          className="w-full h-auto"
          style={{ maxWidth: '100%', maxHeight: '85vh', backgroundColor: '#000' }}
          autoPlay
        >
          <source src={url} type="video/mp4" />
          <source src={url} type="video/webm" />
          Twoja przeglądarka nie obsługuje odtwarzania video.
        </video>
      );
    }

    return (
      <img
        src={url}
        alt={currentMedia.caption || title}
        className="w-full h-auto object-contain"
        style={{ maxWidth: '100%', maxHeight: '85vh' }}
        loading="lazy"
        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
      />
    );
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl font-bold hover:opacity-70 transition-opacity z-[210]"
        aria-label="Close lightbox"
      >
        ✕
      </button>

      {/* Media container */}
      <div
        className="relative flex items-center justify-center max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {renderMedia()}

        {/* Navigation buttons - positioned at screen edges with better visibility */}
        {media.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="fixed left-8 top-1/2 transform -translate-y-1/2 z-[220] transition-all duration-300 rounded-full p-4 animate-pulse hover:animate-none"
              aria-label="Previous media"
              style={{ 
                width: '72px', 
                height: '72px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#D4AF37',
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.8), inset 0 0 10px rgba(255,255,255,0.3)',
                border: '3px solid #fff'
              }}
              onMouseEnter={(e) => e.target.style.boxShadow = '0 0 40px rgba(212, 175, 55, 1), inset 0 0 10px rgba(255,255,255,0.5)'}
              onMouseLeave={(e) => e.target.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.8), inset 0 0 10px rgba(255,255,255,0.3)'}
            >
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', lineHeight: '1' }}>←</span>
            </button>
            <button
              onClick={handleNext}
              className="fixed right-8 top-1/2 transform -translate-y-1/2 z-[220] transition-all duration-300 rounded-full p-4 animate-pulse hover:animate-none"
              aria-label="Next media"
              style={{ 
                width: '72px', 
                height: '72px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#D4AF37',
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.8), inset 0 0 10px rgba(255,255,255,0.3)',
                border: '3px solid #fff'
              }}
              onMouseEnter={(e) => e.target.style.boxShadow = '0 0 40px rgba(212, 175, 55, 1), inset 0 0 10px rgba(255,255,255,0.5)'}
              onMouseLeave={(e) => e.target.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.8), inset 0 0 10px rgba(255,255,255,0.3)'}
            >
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', lineHeight: '1' }}>→</span>
            </button>
          </>
        )}
      </div>

      {/* Counter */}
      {media.length > 1 && (
        <div
          className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-lg"
        >
          {currentIndex + 1} / {media.length}
        </div>
      )}

      {/* Caption */}
      {currentMedia.caption && (
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm text-center max-w-[80vw] bg-black/50 px-4 py-2 rounded-lg"
        >
          {currentMedia.caption}
        </div>
      )}

      {/* Keyboard hint */}
      <div className="absolute top-4 left-4 text-white/70 text-xs text-center max-w-[200px]">
        <div>ESC - zamknij</div>
        {media.length > 1 && <div>← → - nawigacja</div>}
      </div>
    </div>
  );
}
