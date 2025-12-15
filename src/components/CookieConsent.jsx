import React, { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user has already accepted cookies
    const accepted = localStorage.getItem('cookiesAccepted');
    if (!accepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
  };

  // Don't show on admin panel or legal pages
  const hiddenPaths = ['/admin_panel', '/privacy', '/cookies', '/terms'];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white shadow-lg p-4 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm md:text-base">
            <strong>Informacja o cookies:</strong> Ta strona używa cookies do analizy ruchu i zapamiętywania Twoich preferencji.
            Klikając "Akceptuję", wyrażasz zgodę na naszą{' '}
            <NavLink to="/privacy" className="text-blue-300 hover:underline">
              Politykę Prywatności
            </NavLink>
            {' '}i{' '}
            <NavLink to="/cookies" className="text-blue-300 hover:underline">
              Politykę Cookies
            </NavLink>.
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="flex-shrink-0 px-6 py-2 rounded-lg font-semibold transition-colors"
          style={{
            backgroundColor: '#D4AF37',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#c9a12e'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#D4AF37'}
        >
          Akceptuję
        </button>
      </div>
    </div>
  );
}
