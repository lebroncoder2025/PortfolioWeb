import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { LoginPage, AdminDashboard } from './AdminPanelComponents';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import PortfolioCategoryPage from './pages/PortfolioCategoryPage';
import PortfolioItemPage from './pages/PortfolioItemPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiesPolicyPage from './pages/CookiesPolicyPage';
import TermsPage from './pages/TermsPage';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';

// API URL - configurable via environment variable or defaults to relative path
// For GitHub Pages + PHP hosting: set REACT_APP_API_URL to your PHP API URL
// For local XAMPP: set to http://localhost/portfolio-php/api
const API_URL = process.env.REACT_APP_API_URL || 'https://portfolioweb-production-5696.up.railway.app';

function AppShell({ isLoggedIn, onLogout, onLogin, siteData, setSiteData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin_panel');

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogoutWithRedirect = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header siteData={siteData} />}
      <main className={isAdminRoute ? '' : 'app-content'} style={!isAdminRoute ? { paddingTop: '64px', '@media (max-width: 768px)': { paddingTop: '56px' } } : undefined}>
        <Routes>
          <Route path="/" element={<HomePage siteData={siteData} />} />
          <Route path="/about" element={<AboutPage siteData={siteData} />} />
          <Route path="/services" element={<ServicesPage siteData={siteData} />} />
          <Route path="/portfolio" element={<PortfolioPage siteData={siteData} />} />
          <Route path="/portfolio/:category" element={<PortfolioCategoryPage siteData={siteData} />} />
          <Route path="/portfolio/:category/:id" element={<PortfolioItemPage siteData={siteData} />} />
          <Route path="/contact" element={<ContactPage siteData={siteData} />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/cookies" element={<CookiesPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route
            path="/admin_panel"
            element={isLoggedIn ? (
              <AdminDashboard onLogout={handleLogoutWithRedirect} siteData={siteData} setSiteData={setSiteData} />
            ) : (
              <LoginPage onLogin={onLogin} />
            )}
          />
        </Routes>
      </main>
      {!isAdminRoute && <Footer siteData={siteData} />}
      <CookieConsent />
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [siteData, setSiteData] = useState({
    hero: {},
    about: {},
    services: [],
    categories: [],
    portfolio: [],
    contact: {},
    social: {}
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch site data
  const fetchSite = useCallback(async () => {
    try {
      // Try dynamic endpoint first, then fallback to static JSON generated at build time
      let res = await fetch(`${API_URL}/site`);
      if (!res.ok) {
        res = await fetch(`${API_URL}/site.json`);
      }
      if (res.ok) {
        const data = await res.json();
        setSiteData(data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, []);

  useEffect(() => {
    fetchSite();

    // Load TikTok embed script
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Listen for updates triggered by admin actions
    const onUpdate = () => fetchSite();
    window.addEventListener('site-updated', onUpdate);
    return () => window.removeEventListener('site-updated', onUpdate);
  }, [fetchSite]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  // Use basename for subdirectory deployment (e.g., /portfolio-php/)
  // const basename = process.env.REACT_APP_BASENAME || '';
  const basename = '';

  return (
    <Router basename={basename}>
      <AppShell
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLogin={handleLogin}
        siteData={siteData}
        setSiteData={setSiteData}
      />
    </Router>
  );
}

export default App;
