import React, { useEffect, useRef, useState } from 'react';

/**
 * TikTokEmbed - Osadzanie filmów TikTok z blockquote
 * Używa oficjalnego API TikTok embed.js
 */
export default function TikTokEmbed({ url, width = '100%', aspectRatio = '9/16' }) {
  const containerRef = useRef(null);
  const [embedInfo, setEmbedInfo] = useState({ id: null, cite: null });
  const [rendered, setRendered] = useState(null);
  const [error, setError] = useState(null);
  
  // Check if we're on localhost
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Wyciągnij video ID z różnych formatów URL
  useEffect(() => {
    if (!url) {
      setError('Brak URL');
      return;
    }

    try {
      const urlStr = url.toString().toLowerCase();
      
      const fullMatch = urlStr.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
      if (fullMatch && fullMatch[1]) {
        // full URL with numeric ID
        setEmbedInfo({ id: fullMatch[1], cite: url });
        setError(null);
        return;
      }

      // Pattern 2: Krótki URL z /t/
      // https://www.tiktok.com/t/ZTR1abc23/
      const shortMatch = urlStr.match(/tiktok\.com\/t\/([a-z0-9]+)/i);
      if (shortMatch && shortMatch[1]) {
        // short URL - use cite (full short URL)
        setEmbedInfo({ id: null, cite: url });
        setError(null);
        return;
      }

      // Pattern 3: VM URL
      // https://vm.tiktok.com/ZMR1abc23/
      const vmMatch = urlStr.match(/vm\.tiktok\.com\/([a-z0-9]+)/i);
      if (vmMatch && vmMatch[1]) {
        // vm short URL - use cite
        setEmbedInfo({ id: null, cite: url });
        setError(null);
        return;
      }

      setError('Nie można rozpoznać tego URL TikTok');
    } catch (e) {
      setError('Błąd parsowania URL');
    }
  }, [url]);

  // Załaduj embed.js i renderuj; obserwuj transformację blockquote -> iframe i użyj fallbacku jeśli się nie uda
  useEffect(() => {
    if ((!embedInfo || (!embedInfo.id && !embedInfo.cite)) || !containerRef.current) return;

    let observer = null;
    let fallbackTimeout = null;

    const checkRendered = () => {
      const el = containerRef.current;
      if (!el) return false;
      // TikTok embed may insert iframe or element with class 'tt-video'
      if (el.querySelector('iframe[src*="tiktok.com"]') || el.querySelector('.tt-video')) return true;
      return false;
    };

    const startObserver = () => {
      try {
        observer = new MutationObserver(() => {
          if (checkRendered()) {
            setRendered(true);
            console.log('[TikTokEmbed] embed rendered');
            if (observer) observer.disconnect();
            if (fallbackTimeout) clearTimeout(fallbackTimeout);
          }
        });
        observer.observe(containerRef.current, { childList: true, subtree: true });
      } catch (e) {
        // ignore
      }
    };

    const onScriptLoaded = () => {
      try {
        if (window.tiktok?.Embed?.lib?.render) window.tiktok.Embed.lib.render(containerRef.current);
      } catch (e) { /* ignore */ }
      // Start observing for DOM mutation
      startObserver();
      // Fallback if not rendered in 2s
      fallbackTimeout = setTimeout(() => {
        if (!checkRendered()) {
          setRendered(false);
          console.log('[TikTokEmbed] embed did not render - showing fallback');
        } else {
          setRendered(true);
        }
      }, 2000);
    };

    // Ensure we clear previous state
    setRendered(null);

    const existingScript = document.querySelector('script[src*="tiktok.com/embed"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      script.onload = onScriptLoaded;
      document.body.appendChild(script);
    } else {
      // Script already present - trigger render and start observer
      onScriptLoaded();
    }

    return () => {
      if (observer) observer.disconnect();
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, [embedInfo]);

  // Check if we're on localhost - if so, show redirect UI immediately
  if (isLocalhost) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 to-cyan-200 rounded-2xl p-6"
        style={{ width, minHeight: 400 }}
      >
        <div className="text-5xl mb-3">🎵</div>
        <p className="text-gray-700 text-center text-sm mb-4">
          Osadzenia TikTok nie działają na localhost. Kliknij aby otworzyć na TikTok.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
        >
          Otwórz na TikTok
        </a>
      </div>
    );
  }

  if (error) {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const errorMessage = isLocalhost 
      ? 'Osadzenia TikTok nie działają na localhost. Na produkcji (HTTPS) będą działać prawidłowo.'
      : error;
    
    return (
      <div
        className="flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 to-cyan-200 rounded-2xl p-6"
        style={{ width, minHeight: 400 }}
      >
        <div className="text-5xl mb-3">🎵</div>
        <p className="text-gray-700 text-center text-sm mb-4">{errorMessage}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
        >
          Otwórz na TikTok
        </a>
      </div>
    );
  }

  if (!embedInfo || (!embedInfo.id && !embedInfo.cite)) {
    return (
      <div
        className="flex items-center justify-center bg-gradient-to-br from-pink-100 to-cyan-100 rounded-2xl animate-pulse"
        style={{ width, minHeight: 400 }}
      >
        <div className="text-4xl">🎵</div>
      </div>
    );
  }

  // If we already determined the embed did NOT render, show a clear fallback UI (icon + open button)
  if (rendered === false) {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const errorMessage = isLocalhost 
      ? 'Osadzenia TikTok nie działają na localhost. Na produkcji (HTTPS) będą działać prawidłowo.'
      : 'Nie udało się załadować osadzenia TikTok.';
    
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl p-6" style={{ width, minHeight: 240 }}>
        <div className="text-6xl mb-3">🎵</div>
        <p className="text-sm text-gray-700 mb-4 text-center">{errorMessage}</p>
        <a href={embedInfo.cite || url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold">Otwórz na TikTok</a>
      </div>
    );
  }

  // Renderuj blockquote - TikTok embed.js automatycznie przekształci to w iframe
  return (
    <div
      ref={containerRef}
      className="tiktok-embed-container"
      style={{
        width: width === '100%' ? '100%' : width,
        maxWidth: 325,
        margin: '0 auto',
        position: 'relative'
      }}
    >
      <blockquote
        className="tiktok-embed"
        {...(embedInfo.id ? { 'data-video-id': embedInfo.id } : {})}
        {...(embedInfo.cite ? { cite: embedInfo.cite } : {})}
        style={{
          maxWidth: '100%',
          minWidth: 288
        }}
      >
        <section>
          <a target="_blank" rel="noopener noreferrer" href={embedInfo.cite || url}>Film TikTok</a>
        </section>
      </blockquote>
    </div>
  );
}

/**
 * Miniatura TikTok dla admin panelu i galerii
 */
export function TikTokThumbnail({ url, onClick }) {
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    // Spróbuj pobrać miniaturę przez oEmbed API TikTok
    const fetchThumbnail = async () => {
      try {
        const oEmbedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
        const response = await fetch(oEmbedUrl);
        if (response.ok) {
          const data = await response.json();
          if (data.thumbnail_url) {
            setThumbnail(data.thumbnail_url);
            setError(false);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.warn('TikTok oEmbed failed:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchThumbnail();
  }, [url]);

  if (loading) {
    return (
      <div
        className="w-full h-full bg-gradient-to-br from-pink-100 to-cyan-100 flex items-center justify-center cursor-pointer group relative animate-pulse"
        onClick={onClick}
        style={{ aspectRatio: '9/16' }}
      >
        <div className="text-4xl">🎵</div>
      </div>
    );
  }

  if (thumbnail && !error) {
    return (
      <div
        className="w-full h-full cursor-pointer group relative overflow-hidden rounded-lg"
        onClick={onClick}
        style={{ aspectRatio: '9/16' }}
      >
        <img
          src={thumbnail}
          alt="TikTok thumbnail"
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          onError={() => setError(true)}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-3xl">▶️</span>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
          TikTok
        </div>
      </div>
    );
  }

  // Fallback gdy nie udało się pobrać miniatury
  return (
    <div
      className="w-full h-full bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center cursor-pointer group relative"
      onClick={onClick}
      style={{ aspectRatio: '9/16' }}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
      <div className="relative z-10 text-center">
        <div className="text-5xl mb-2">🎵</div>
        <div className="text-white text-sm font-medium">TikTok</div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
          <span className="text-3xl">▶️</span>
        </div>
      </div>
    </div>
  );
}
