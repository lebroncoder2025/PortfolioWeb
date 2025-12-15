import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TikTokThumbnail } from './components/TikTokEmbed';
const API_URL = process.env.REACT_APP_API_URL || '/api';
// Colors
const colors = {
  beige: '#F5F5DC',
  cream: '#FFFDD0',
  linen: '#FAF0E6',
  gold: '#D4AF37',
  brown: '#8B7355',
  darkGray: '#3E3E3E',
};

// Utility function to determine media type
const getMediaType = (url) => {
  if (!url || typeof url !== 'string') return 'unknown';
  const lower = url.toLowerCase();
  if (lower.includes('tiktok.com') || lower.includes('vm.tiktok')) return 'tiktok';
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('/video/')) return 'video';
  if (lower.match(/\.(mp4|webm|mov|avi|m4v)(\?|#|$)/)) return 'video';
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|#|$)/)) return 'image';
  if (lower.includes('/uploads/') || lower.includes('picsum') || lower.includes('unsplash') || lower.includes('/image/')) return 'image';
  return 'unknown';
};
// Helper utilities
const moveUp = (arr, setArr, idx) => {
  if (idx === 0) return;
  const copy = [...arr];
  [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
  copy.forEach((item, i) => (item.order = i + 1));
  setArr(copy);
};
const moveDown = (arr, setArr, idx) => {
  if (idx === arr.length - 1) return;
  const copy = [...arr];
  [copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]];
  copy.forEach((item, i) => (item.order = i + 1));
  setArr(copy);
};
const saveItemToApi = async (endpointBase, item) => {
  try {
    const id = item.id;
    let res;
    if (id && id.toString().length > 3) {
      res = await fetch(`${API_URL}/site/${endpointBase}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(item)
      });
    } else {
      res = await fetch(`${API_URL}/site/${endpointBase}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(item)
      });
    }
    if (res && res.ok) {
      try { window.dispatchEvent(new Event('site-updated')); } catch (e) { /* ignore */ }
    }
    return res;
  } catch (err) {
    console.error('Save failed', err);
    throw err;
  }
}
;
const saveAllItems = async (endpointBase, items) => {
  for (const item of items) {
    await saveItemToApi(endpointBase, item);
  }
  try { window.dispatchEvent(new Event('site-updated')); } catch (e) { /* ignore */ }
};
// ==================== LOGIN PAGE ====================
export const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // ==================== SECURITY: Input Validation ====================
    if (!credentials.email || !credentials.password) {
      setError('Email i hasło są wymagane');
      setLoading(false);
      return;
    }
    // Usuwamy wymóg @ w loginie, pozwalamy na email lub nazwę użytkownika
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        onLogin();
      } else {
        setError(data.error || '❌ Błędne dane logowania!');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('❌ Błąd połączenia z serwerem!');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.linen }}>
      <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl" style={{ backgroundColor: colors.cream }}>
            🔐
          </div>
          <h1 className="text-3xl font-bold" style={{ color: colors.darkGray }}>
            Panel Administracyjny
          </h1>
          <p className="text-gray-500 mt-2">Zaloguj się, aby zarządzać treścią</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.brown }}>Email</label>
            
              <input
                type="text"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition"
                style={{ borderColor: colors.cream }}
                required
                autoComplete="username"
                placeholder="Email lub nazwa użytkownika"
              />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.brown }}>Hasło</label>
            <input
              type="password"
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition"
              style={{ borderColor: colors.cream }}
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !credentials.email || !credentials.password}
            className="w-full py-3 rounded-xl text-white font-bold text-lg transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: colors.gold }}
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>
        <div className="mt-6 p-4 rounded-lg text-center text-sm" style={{ backgroundColor: colors.cream }}>
          <p style={{ color: colors.brown }}>
            <strong>Demo:</strong> admin_klaudia / admin123
          </p>
        </div>
      </div>
    </div>
  );
};
// ==================== ADMIN DASHBOARD ====================
export const AdminDashboard = ({ onLogout, siteData, setSiteData }) => {
  const [activeTab, setActiveTab] = useState('hero');
  const [currentUser, setCurrentUser] = useState(null);

  // Decode JWT to get user role
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (e) {
        console.error('Failed to decode token', e);
      }
    }
  }, []);
  const tabs = [
    { id: 'hero', label: 'Hero', icon: '🎬' },
    { id: 'about', label: 'O mnie', icon: '👤' },
    { id: 'services', label: 'Usługi', icon: '💼' },
    { id: 'portfolio', label: 'Portfolio', icon: '📸' },
    { id: 'categories', label: 'Kategorie', icon: '📂' },
    { id: 'contact', label: 'Kontakt', icon: '📧' },
    { id: 'footer', label: 'Footer', icon: '🌐' },
    { id: 'layout', label: 'Układ', icon: '🧩' },
    ...(currentUser?.role === 'admin' ? [
      { id: 'users', label: 'Konta', icon: '👥' },
      { id: 'logs', label: 'Logi', icon: '📋' }
    ] : [])
  ];

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: colors.linen }}>
      {/* Top Bar */}
      <div className="bg-white shadow-lg" style={{ borderBottom: `4px solid ${colors.gold}` }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: colors.gold }}>
            <span>⚙️ Panel Admin</span>
          </h1>
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.cream }}>
                <span>{currentUser.role === 'admin' ? '👑' : '👤'}</span>
                <div>
                  <p style={{ color: colors.darkGray }}>{currentUser.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg text-white font-semibold text-sm transition hover:opacity-80"
              style={{ backgroundColor: colors.brown }}
            >
              🚪 Wyloguj
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm" style={{ borderBottom: `2px solid ${colors.cream}` }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap text-sm transition-all ${
                  activeTab === tab.id ? 'text-white shadow-md' : 'hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? colors.gold : 'transparent',
                  color: activeTab === tab.id ? 'white' : colors.brown
                }}
              >
                <span>{tab.icon}</span> <span className="ml-1">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'hero' && <HeroEditor siteData={siteData} setSiteData={setSiteData} />}
        {activeTab === 'about' && <AboutEditor siteData={siteData} setSiteData={setSiteData} />}
        {activeTab === 'services' && <ServicesEditor siteData={siteData} setSiteData={setSiteData} />}
        {activeTab === 'portfolio' && <PortfolioEditor siteData={siteData} setSiteData={setSiteData} />}
        {activeTab === 'categories' && <CategoriesEditor siteData={siteData} setSiteData={setSiteData} />}
        {activeTab === 'contact' && <ContactEditor siteData={siteData} setSiteData={setSiteData} />}
        {activeTab === 'footer' && <FooterEditor siteData={siteData} setSiteData={setSiteData} />}
        {activeTab === 'layout' && <LayoutEditor siteData={siteData} setSiteData={setSiteData} />}
        {activeTab === 'users' && currentUser?.role === 'admin' && <UsersEditor currentUser={currentUser} />}
        {activeTab === 'logs' && currentUser?.role === 'admin' && <LogsEditor currentUser={currentUser} />}
      </div>
    </div>
  );
};
// ==================== CARD WRAPPER ====================
const InlineMessage = ({ type = 'success', children }) => (
  <div className={`w-full mt-4 p-3 rounded-lg ${type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} text-center font-semibold text-sm`}>
    {children}
  </div>
);

const EditorCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 sm:rounded-lg" style={{ borderColor: colors.gold }}>
    <div className="px-8 py-5 border-b-2 sm:px-4 sm:py-3" style={{ borderColor: colors.cream, backgroundColor: colors.beige }}>
      <h2 className="text-2xl font-bold flex items-center gap-3 sm:text-xl sm:gap-2" style={{ color: colors.darkGray }}>
        <span className="text-3xl sm:text-2xl">{icon}</span> <span className="break-words">{title}</span>
      </h2>
    </div>
    <div className="p-8 space-y-6 sm:p-4 sm:space-y-4">
      {children}
    </div>
  </div>
);
// ==================== HERO EDITOR ====================
const HeroEditor = ({ siteData, setSiteData }) => {
  const [formData, setFormData] = useState(siteData.hero || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef();
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFormData({ ...formData, tempImagePreview: e.target.result });
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title || '');
    formDataObj.append('subtitle', formData.subtitle || '');
    const file = fileInputRef.current?.files[0];
    if (file) formDataObj.append('image', file);
    try {
      const res = await fetch(`${API_URL}/site/hero`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formDataObj
      });
      if (res.ok) {
        const data = await res.json();
        // Update formData with server response - use /image/{id} URL if provided
        const updatedFormData = { ...formData };
        if (data.image) {
          updatedFormData.image = data.image;
        }
        delete updatedFormData.tempImagePreview;
        fileInputRef.current.value = '';
        setSiteData({ ...siteData, hero: updatedFormData });
        setFormData(updatedFormData);
        setMessage({ type: 'success', text: '✅ Zapisano!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: '❌ Błąd zapisu!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Błąd zapisu!' });
    } finally {
      setSaving(false);
    }
  };
  return (
    <EditorCard title="Sekcja Hero" icon="🎬">
      <div>
        <label className="block font-semibold mb-3 text-lg sm:text-base" style={{ color: colors.darkGray }}>Nagłówek główny</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 transition text-base sm:text-sm sm:px-3 sm:py-2"
          style={{ borderColor: colors.cream, '--tw-ring-color': colors.gold }}
          placeholder="Np. Kreatywny Twórca Treści"
        />
      </div>
      <div>
        <label className="block font-semibold mb-3 text-lg sm:text-base" style={{ color: colors.darkGray }}>Podtytuł</label>
        <input
          type="text"
          value={formData.subtitle || ''}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="w-full px-5 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 transition text-base sm:text-sm sm:px-3 sm:py-2"
          style={{ borderColor: colors.cream, '--tw-ring-color': colors.gold }}
          placeholder="Np. Vlogi • Reklamy • Social Media"
        />
      </div>
      <div>
        <label className="block font-semibold mb-3 text-lg sm:text-base" style={{ color: colors.darkGray }}>Zdjęcie profilowe</label>
        {(formData.tempImagePreview || formData.image) && (
          <div className="mb-4">
            <img src={formData.tempImagePreview || formData.image} alt="preview" className="w-32 h-32 rounded-full object-cover border-4 shadow-md sm:w-24 sm:h-24 sm:border-2" style={{ borderColor: colors.gold }} />
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/mp4,video/webm"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:border-0 file:font-semibold file:cursor-pointer file:transition hover:file:opacity-80 sm:file:mr-2 sm:file:py-2 sm:file:px-3 sm:text-xs"
          style={{ '--file-bg': colors.gold, '--file-color': 'white' }}
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 rounded-xl text-white font-bold text-lg transition hover:opacity-90 disabled:opacity-50 sm:py-3 sm:text-base"
        style={{ backgroundColor: colors.gold }}
      >
        {saving ? '💾 Zapisywanie...' : '💾 Zapisz zmiany'}
      </button>
      {message && <InlineMessage type={message.type}>{message.text}</InlineMessage>}
    </EditorCard>
  );
};
// ==================== ABOUT EDITOR ====================
const AboutEditor = ({ siteData, setSiteData }) => {
  const [formData, setFormData] = useState(siteData.about || { stats: [] });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef();
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFormData({ ...formData, tempImagePreview: e.target.result });
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async () => {
    setSaving(true);
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title || '');
    formDataObj.append('bio', formData.bio || '');
    formDataObj.append('stats', JSON.stringify(formData.stats || []));
    const file = fileInputRef.current?.files[0];
    if (file) formDataObj.append('image', file);
      try {
      const res = await fetch(`${API_URL}/site/about`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formDataObj
      });
      if (res.ok) {
        const data = await res.json();
        const updatedFormData = { ...formData };
        if (data.image) {
          updatedFormData.image = data.image;
        }
        delete updatedFormData.tempImagePreview;
        fileInputRef.current.value = '';
        setSiteData({ ...siteData, about: updatedFormData });
        setFormData(updatedFormData);
        setMessage({ type: 'success', text: '✅ Zapisano!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Błąd zapisu!' });
    } finally {
      setSaving(false);
    }
  };
  const updateStat = (idx, field, value) => {
    const newStats = [...(formData.stats || [])];
    newStats[idx] = { ...newStats[idx], [field]: field === 'value' ? parseInt(value) || 0 : value };
    setFormData({ ...formData, stats: newStats });
  };
  const addStat = () => {
    setFormData({ ...formData, stats: [...(formData.stats || []), { label: 'Nowa', value: 0 }] });
  };
  const removeStat = (idx) => {
    setFormData({ ...formData, stats: formData.stats.filter((_, i) => i !== idx) });
  };
  return (
    <EditorCard title="Sekcja O mnie" icon="👤">
      <div>
        <label className="block font-semibold mb-3 text-lg sm:text-base" style={{ color: colors.darkGray }}>Tytuł sekcji</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-5 py-4 rounded-xl border-2 text-base sm:text-sm sm:px-3 sm:py-2"
          style={{ borderColor: colors.cream }}
          placeholder="O mnie"
        />
      </div>
      <div>
        <label className="block font-semibold mb-3 text-lg sm:text-base" style={{ color: colors.darkGray }}>Bio / Opis</label>
        <textarea
          value={formData.bio || ''}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full px-5 py-4 rounded-xl border-2 h-40 resize-none text-base sm:text-sm sm:px-3 sm:py-2 sm:h-32"
          style={{ borderColor: colors.cream }}
          placeholder="Opowiedz o sobie..."
        />
      </div>
      <div>
        <label className="block font-semibold mb-3 text-lg sm:text-base" style={{ color: colors.darkGray }}>Zdjęcie</label>
        {(formData.tempImagePreview || formData.image) && (
          <div className="mb-4">
            <img src={formData.tempImagePreview || formData.image} alt="preview" className="w-40 h-40 rounded-xl object-cover shadow-md sm:w-32 sm:h-32 sm:shadow-sm" />
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*,video/mp4,video/webm" onChange={handleFileSelect} className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-5 file:rounded-lg file:font-semibold file:cursor-pointer sm:file:mr-2 sm:file:py-2 sm:file:px-3 sm:text-xs" />
      </div>
      <div>
        <label className="block font-semibold mb-3 text-lg sm:text-base" style={{ color: colors.darkGray }}>Statystyki</label>
        <div className="space-y-3 sm:space-y-2">
          {(formData.stats || []).map((stat, idx) => (
            <div key={idx} className="flex gap-3 items-center sm:gap-2">
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(idx, 'label', e.target.value)}
                placeholder="Etykieta"
                className="flex-1 px-4 py-3 rounded-lg border-2 text-base sm:text-sm sm:px-2 sm:py-2"
                style={{ borderColor: colors.cream }}
              />
              <input
                type="number"
                value={stat.value}
                onChange={(e) => updateStat(idx, 'value', e.target.value)}
                placeholder="Wartość"
                className="w-28 px-4 py-3 rounded-lg border-2 text-base sm:text-sm sm:px-2 sm:py-2 sm:w-20"
                style={{ borderColor: colors.cream }}
              />
              <button onClick={() => removeStat(idx)} className="px-4 py-3 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 font-semibold transition-all duration-300 hover:shadow-md sm:px-2 sm:py-2 sm:text-sm">✕</button>
            </div>
          ))}
        </div>
        <button onClick={addStat} className="mt-4 px-5 py-3 rounded-lg text-base font-semibold transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95 sm:text-sm sm:px-3 sm:py-2" style={{ backgroundColor: colors.cream, color: colors.brown }}>
          + Dodaj statystykę
        </button>
      </div>
      <button onClick={handleSave} disabled={saving} className="w-full py-4 rounded-xl text-white font-bold text-lg sm:py-3 sm:text-base" style={{ backgroundColor: colors.gold }}>
        {saving ? '💾 Zapisywanie...' : '💾 Zapisz zmiany'}
      </button>
      {message && <InlineMessage type={message.type}>{message.text}</InlineMessage>}
    </EditorCard>
  );
};
// ==================== SERVICES EDITOR ====================
const ServicesEditor = ({ siteData, setSiteData }) => {
  const [services, setServices] = useState(siteData.services || []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const addService = () => {
    setServices([...services, {
      id: Date.now().toString(),
      title: 'Nowa usługa',
      description: 'Opis usługi',
      icon: '📌',
      order: services.length + 1
    }]);
  };
  const updateService = (idx, field, value) => {
    const newServices = [...services];
    newServices[idx] = { ...newServices[idx], [field]: value };
    setServices(newServices);
  };
  const deleteService = (idx) => {
    setServices(services.filter((_, i) => i !== idx));
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAllItems('services', services);
      setSiteData({ ...siteData, services });
      setMessage({ type: 'success', text: '✅ Zapisano!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Błąd zapisu!' });
    } finally {
      setSaving(false);
    }
  };
  return (
    <EditorCard title="Usługi" icon="💼">
      <div className="space-y-5">
        {services.map((service, idx) => (
          <div key={service.id} className="p-5 rounded-xl border-2" style={{ borderColor: colors.cream }}>
            <div className="flex gap-3 mt-6">
              <button onClick={() => moveUp(services, setServices, idx)} disabled={idx === 0} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 font-semibold transition-all duration-300 hover:shadow-md">▲</button>
              <button onClick={() => moveDown(services, setServices, idx)} disabled={idx === services.length - 1} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 font-semibold transition-all duration-300 hover:shadow-md">▼</button>
              <span className="flex-1 text-sm font-semibold" style={{ color: colors.brown }}>#{idx + 1}</span>
              <button onClick={() => deleteService(idx)} className="px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 font-semibold transition-all duration-300 hover:shadow-md">🗑️</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={service.icon}
                onChange={(e) => updateService(idx, 'icon', e.target.value)}
                placeholder="Ikona (emoji)"
                className="px-4 py-3 rounded-lg border-2 text-base"
                style={{ borderColor: colors.cream }}
              />
              <input
                type="text"
                value={service.title}
                onChange={(e) => updateService(idx, 'title', e.target.value)}
                placeholder="Tytuł"
                className="px-4 py-3 rounded-lg border-2 text-base"
                style={{ borderColor: colors.cream }}
              />
            </div>
            {message && <InlineMessage type={message.type}>{message.text}</InlineMessage>}
            <textarea
              value={service.description}
              onChange={(e) => updateService(idx, 'description', e.target.value)}
              placeholder="Opis usługi"
              className="w-full px-4 py-3 rounded-lg border-2 h-24 resize-none text-base"
              style={{ borderColor: colors.cream }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={addService} className="flex-1 py-4 rounded-xl font-bold text-base transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95" style={{ backgroundColor: colors.cream, color: colors.brown }}>
          ➕ Dodaj usługę
        </button>
        <button onClick={handleSave} disabled={saving} className="flex-1 py-4 rounded-xl text-white font-bold text-base transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: colors.gold }}>
          {saving ? '💾 Zapisywanie...' : '💾 Zapisz wszystko'}
        </button>
      </div>
    </EditorCard>
  );
};
// ==================== PORTFOLIO EDITOR ====================
const PortfolioEditor = ({ siteData, setSiteData }) => {
  const [portfolio, setPortfolio] = useState(siteData.portfolio || []);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [expandedItem, setExpandedItem] = useState(null); // For accordion style editing
    const [message, setMessage] = useState(null);
  const uploadFileToServer = async (file, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
      });
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            // Response now has {id, url: '/image/{id}', filename}
            // Transform to keep backward compatibility with existing code expecting {url}
            resolve({ url: response.url });
          }
          else reject(new Error('Upload failed'));
        }
      };
      xhr.open('POST', `${API_URL}/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
      xhr.send(form);
    });
  };
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      title: 'Nowy projekt',
      category: 'Ads',
      images: [],
      video: null,
      featuredMedia: null, // { url, caption }
      order: portfolio.length + 1
    };
    setPortfolio([...portfolio, newItem]);
    setExpandedItem(newItem.id); // Auto-expand new item
  };
  const updateItem = (idx, field, value) => {
    const newPortfolio = [...portfolio];
    newPortfolio[idx] = { ...newPortfolio[idx], [field]: value };
    setPortfolio(newPortfolio);
  };
  const deleteItem = (idx) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten projekt?')) {
      setPortfolio(portfolio.filter((_, i) => i !== idx));
    }
  };
  const handleImageUpload = async (idx, file) => {
    try {
      setUploadProgress(p => ({ ...p, [`img-${idx}-${Date.now()}`]: 0 }));
      const res = await uploadFileToServer(file, pct => setUploadProgress(p => ({ ...p, [`img-${idx}`]: pct })));
      const newPortfolio = [...portfolio];
      const item = { ...newPortfolio[idx] };
      item.images = Array.isArray(item.images) ? [...item.images, { url: res.url, caption: '' }] : [{ url: res.url, caption: '' }];
      newPortfolio[idx] = item;
      setPortfolio(newPortfolio);
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Upload failed' });
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setTimeout(() => setUploadProgress(p => { const n = {...p}; Object.keys(n).filter(k=>k.startsWith(`img-${idx}`)).forEach(k=>delete n[k]); return n; }), 1000);
    }
  };
  const setFeaturedFromUrl = (idx, url, caption = '') => {
    const newPortfolio = [...portfolio];
    const item = { ...newPortfolio[idx] };
    item.featuredMedia = url ? { url, caption: caption || '' } : null;
    newPortfolio[idx] = item;
    setPortfolio(newPortfolio);
  };
  const removeImageFromItem = (idx, imgIdx) => {
    const newPortfolio = [...portfolio];
    const item = { ...newPortfolio[idx] };
    item.images = (item.images || []).filter((_, i) => i !== imgIdx);
    newPortfolio[idx] = item;
    setPortfolio(newPortfolio);
  };
  const moveImage = (idx, imgIdx, dir) => {
    const newPortfolio = [...portfolio];
    const item = { ...newPortfolio[idx] };
    const imgs = [...(item.images || [])];
    const to = imgIdx + dir;
    if (to < 0 || to >= imgs.length) return;
    [imgs[imgIdx], imgs[to]] = [imgs[to], imgs[imgIdx]];
    item.images = imgs;
    newPortfolio[idx] = item;
    setPortfolio(newPortfolio);
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAllItems('portfolio', portfolio);
      setSiteData({ ...siteData, portfolio });
      setMessage({ type: 'success', text: '✅ Zapisano zmiany w portfolio!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Błąd zapisu!' });
    } finally {
      setSaving(false);
    }
  };
  return (
    <EditorCard title="Portfolio" icon="📸">
      <div className="space-y-4">
        {portfolio.map((item, idx) => (
          <div key={item.id} className="bg-white rounded-xl border-2 shadow-md overflow-hidden transition-all" style={{ borderColor: colors.cream }}>
            {/* Header of the item (always visible) */}
            <div 
              className="p-5 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors border-b-2" 
              style={{ borderColor: colors.cream }}
              onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
            >
              <div className="flex flex-col gap-1">
                <button onClick={(e) => { e.stopPropagation(); moveUp(portfolio, setPortfolio, idx); }} disabled={idx === 0} className="p-1 px-2 rounded hover:bg-gray-200 text-xs disabled:opacity-30 font-semibold">▲</button>
                <button onClick={(e) => { e.stopPropagation(); moveDown(portfolio, setPortfolio, idx); }} disabled={idx === portfolio.length - 1} className="p-1 px-2 rounded hover:bg-gray-200 text-xs disabled:opacity-30 font-semibold">▼</button>
              </div>
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border-2 flex items-center justify-center relative" style={{ borderColor: colors.cream }}>
                {(() => {
                  // Zbierz wszystkie media z różnych źródeł
                  const allMedia = [];
                  
                  // 1. Featured media
                  if (item.featuredMedia?.url) {
                    allMedia.push(item.featuredMedia.url);
                  }
                  
                  // 2. Images array
                  if (Array.isArray(item.images)) {
                    item.images.forEach(img => {
                      const url = typeof img === 'string' ? img : img?.url;
                      if (url) allMedia.push(url);
                    });
                  } else if (typeof item.images === 'string' && item.images) {
                    allMedia.push(item.images);
                  }
                  
                  // 3. Single image fallback
                  if (item.image) allMedia.push(item.image);
                  
                  // 4. Video field
                  if (item.video) allMedia.push(item.video);
                  
                  if (allMedia.length === 0) {
                    return <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Brak</div>;
                  }
                  
                  // Znajdź pierwsze zdjęcie do miniatury
                  let thumbUrl = null;
                  let mediaType = 'unknown';
                  
                  for (const url of allMedia) {
                    const type = getMediaType(url);
                    if (type === 'tiktok') {
                      // TikTok ma najwyższy priorytet - użyj komponentu TikTokThumbnail
                      mediaType = 'tiktok';
                      break;
                    } else if (type === 'youtube') {
                      // Pobierz miniaturę YouTube
                      let ytId = '';
                      if (url.includes('embed/')) ytId = url.split('embed/')[1]?.split(/[?&]/)[0];
                      else if (url.includes('youtu.be/')) ytId = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
                      else if (url.includes('watch?v=')) ytId = url.split('watch?v=')[1]?.split('&')[0];
                      if (ytId) {
                        thumbUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                        mediaType = 'youtube';
                        break;
                      }
                    } else if (type === 'image' && !thumbUrl) {
                      // Zdjęcie tylko jeśli nie mamy jeszcze nic lepszego
                      thumbUrl = url;
                      mediaType = 'image';
                    } else if (!thumbUrl && type === 'video') {
                      // Video jeśli nie mamy zdjęcia
                      mediaType = 'video';
                    }
                  }

                  // Jeśli nie znaleziono miniatury, użyj fallback
                  if (!thumbUrl) {
                    if (mediaType === 'tiktok') {
                      // Znajdź pierwszy URL TikTok do wyświetlenia miniatury
                      const tikTokUrl = allMedia.find(u => typeof u === 'string' && /tiktok\.com|vm\.tiktok|tiktok\.com\/t\//i.test(u));
                      // use TikTokThumbnail component for consistent appearance
                      return (
                        <div className="w-full h-full" title={tikTokUrl}>
                          <TikTokThumbnail url={tikTokUrl} onClick={() => window.open(tikTokUrl, '_blank')} />
                        </div>
                      );
                    }
                    const icon = mediaType === 'video' ? '▶️' : '📁';
                    const colors = mediaType === 'video'
                      ? 'from-blue-400 to-purple-500'
                      : 'from-gray-300 to-gray-400';
                    return (
                      <div className={`w-full h-full bg-gradient-to-br ${colors} flex items-center justify-center text-3xl`} title={allMedia[0]}>
                        {icon}
                      </div>
                    );
                  }
                  
                  return (
                    <img
                      src={thumbUrl}
                      alt="miniatura"
                      className="w-full h-full object-cover"
                      title={thumbUrl}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const parent = e.target.parentNode;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-2xl">📷</div>';
                        }
                      }}
                    />
                  );
                })()}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg" style={{ color: colors.darkGray }}>{item.title || 'Bez tytułu'}</h3>
                <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-700">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl text-gray-400 transform transition-transform duration-200" style={{ transform: expandedItem === item.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  ⌄
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteItem(idx); }} 
                  className="p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-semibold"
                  title="Usuń projekt"
                >
                  🗑️
                </button>
              </div>
            </div>
            {/* Expanded Content */}
            {expandedItem === item.id && (
              <div className="p-7 border-t-2 bg-gray-50/50" style={{ borderColor: colors.cream }}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-base font-semibold mb-3" style={{ color: colors.darkGray }}>Tytuł projektu</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(idx, 'title', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-2 bg-white focus:ring-2 focus:ring-yellow-400/50 outline-none transition-all"
                      style={{ borderColor: colors.cream }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: colors.brown }}>Kategoria</label>
                    <select
                      value={item.category}
                      onChange={(e) => updateItem(idx, 'category', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-2 bg-white focus:ring-2 focus:ring-yellow-400/50 outline-none transition-all"
                      style={{ borderColor: colors.cream }}
                    >
                      {(() => {
                        const hardcoded = ['Ads', 'Vlogs', 'Photos', 'Social Media'];
                        const dynamic = (siteData.categories || []).map((c) => c?.name).filter(Boolean);
                        const all = Array.from(new Set([...hardcoded, ...dynamic]));
                        return all.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ));
                      })()}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2" style={{ color: colors.brown }}>Opis projektu</label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => updateItem(idx, 'description', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-2 bg-white h-24 resize-y focus:ring-2 focus:ring-yellow-400/50 outline-none transition-all"
                      style={{ borderColor: colors.cream }}
                      placeholder="Krótki opis projektu..."
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-3" style={{ color: colors.brown }}>Galeria zdjęć</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {(item.images || []).map((img, i) => (
                      <div key={i} className="group relative bg-white rounded-lg shadow-sm border p-2" style={{ borderColor: colors.cream }}>
                        <div className="relative aspect-square mb-2 rounded overflow-hidden bg-gray-100">
                          {(() => {
                            const url = img?.url || img;
                            const mediaType = getMediaType(url);
                            
                            if (mediaType === 'tiktok') {
                              return <TikTokThumbnail url={url} />;
                            } else if (mediaType === 'youtube') {
                              // Pobierz miniaturę YouTube
                              let ytId = '';
                              if (url.includes('embed/')) ytId = url.split('embed/')[1]?.split(/[?&]/)[0];
                              else if (url.includes('youtu.be/')) ytId = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
                              else if (url.includes('watch?v=')) ytId = url.split('watch?v=')[1]?.split('&')[0];
                              
                              if (ytId) {
                                return (
                                  <img
                                    src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                                    alt="YouTube thumbnail"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      const parent = e.target.parentNode;
                                      if (parent) {
                                        parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white text-2xl">▶️</div>';
                                      }
                                    }}
                                  />
                                );
                              }
                            } else if (mediaType === 'video') {
                              return (
                                <video src={url} className="w-full h-full object-cover" />
                              );
                            }
                            
                            // Default: regular image
                            return (
                              <img 
                                src={url} 
                                alt="" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const parent = e.target.parentNode;
                                  if (parent) {
                                    parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-2xl">📷</div>';
                                  }
                                }}
                              />
                            );
                          })()}
                          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 p-1 rounded backdrop-blur-sm">
                            <button onClick={() => moveImage(idx, i, -1)} className="p-1 bg-white rounded text-xs hover:bg-gray-100">◀</button>
                            <button onClick={() => moveImage(idx, i, 1)} className="p-1 bg-white rounded text-xs hover:bg-gray-100">▶</button>
                            <button
                              onClick={() => {
                                const url = typeof (item.images || [])[i] === 'string' ? (item.images || [])[i] : (item.images || [])[i]?.url;
                                const cap = typeof (item.images || [])[i] === 'string' ? '' : ((item.images || [])[i]?.caption || '');
                                setFeaturedFromUrl(idx, url || '', cap);
                              }}
                              className="p-1 bg-yellow-100 text-yellow-800 rounded text-xs hover:bg-yellow-200"
                              title="Ustaw jako główne media"
                            >
                              ★
                            </button>
                            <button onClick={() => removeImageFromItem(idx, i)} className="p-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200">✕</button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={img.caption || ''}
                          onChange={(e) => {
                            const copy = [...(item.images || [])];
                            const existing = copy[i];
                            const url = typeof existing === 'string' ? existing : (existing?.url || '');
                            copy[i] = { url, caption: e.target.value };
                            const newPortfolio = [...portfolio];
                            newPortfolio[idx] = { ...newPortfolio[idx], images: copy };
                            setPortfolio(newPortfolio);
                          }}
                          placeholder="Podpis..."
                          className="w-full text-xs px-2 py-1.5 rounded border bg-gray-50 focus:bg-white focus:ring-1 focus:ring-yellow-400 outline-none"
                        />
                      </div>
                    ))}
                    {/* Upload Button */}
                    <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: colors.gold }}>
                      <span className="text-2xl mb-1">📎</span>
                      <span className="text-xs font-medium text-center px-2" style={{ color: colors.brown }}>Dodaj media</span>
                      <input type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={(e) => e.target.files[0] && handleImageUpload(idx, e.target.files[0])} />
                    </label>
                  </div>
                  {/* URL Input for media */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Lub wklej URL zdjęcia / wideo i naciśnij Enter"
                      className="flex-1 px-4 py-2 rounded-lg border-2 text-sm bg-white"
                      style={{ borderColor: colors.cream }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const url = e.target.value.trim();
                          if (url) {
                            const newPortfolio = [...portfolio];
                            const item = { ...newPortfolio[idx] };
                            item.images = Array.isArray(item.images) ? [...item.images, { url, caption: '' }] : [{ url, caption: '' }];
                            newPortfolio[idx] = item;
                            setPortfolio(newPortfolio);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                  {Object.keys(uploadProgress).some(k=>k.startsWith(`img-${idx}`)) && (
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress[`img-${idx}`] || 0}%`, backgroundColor: colors.gold }} />
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t" style={{ borderColor: colors.cream }}>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <label className="block text-sm font-bold" style={{ color: colors.brown }}>Główne media (opcjonalnie)</label>
                    {item.featuredMedia?.url && (
                      <button
                        type="button"
                        onClick={() => setFeaturedFromUrl(idx, '')}
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                        style={{ backgroundColor: colors.cream, color: colors.brown, border: `1px solid ${colors.gold}` }}
                      >
                        Wyczyść główne
                      </button>
                    )}
                  </div>
                  <p className="text-xs mb-3" style={{ color: colors.brown }}>
                    Możesz ustawić główne zdjęcie lub wideo. Najszybciej: kliknij ★ na elemencie w galerii.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={item.featuredMedia?.url || ''}
                      onChange={(e) => setFeaturedFromUrl(idx, e.target.value, item.featuredMedia?.caption || '')}
                      placeholder="URL głównego zdjęcia / wideo (YouTube/TikTok/mp4/webm)"
                      className="w-full px-4 py-2 rounded-lg border-2 bg-white"
                      style={{ borderColor: colors.cream }}
                    />
                    <input
                      type="text"
                      value={item.featuredMedia?.caption || ''}
                      onChange={(e) => setFeaturedFromUrl(idx, item.featuredMedia?.url || '', e.target.value)}
                      placeholder="Podpis głównych mediów (opcjonalnie)"
                      className="w-full px-4 py-2 rounded-lg border-2 bg-white"
                      style={{ borderColor: colors.cream }}
                    />
                  </div>
                  <div className="mt-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer" style={{ backgroundColor: colors.cream, color: colors.brown, border: `1px solid ${colors.gold}` }}>
                      ⬆️ Uploaduj jako główne
                      <input
                        type="file"
                        accept="image/*,video/mp4,video/webm"
                        className="hidden"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          try {
                            const res = await uploadFileToServer(f);
                            setFeaturedFromUrl(idx, res.url, item.featuredMedia?.caption || '');
                          } catch {
                                setMessage({ type: 'error', text: '❌ Upload failed' });
                                setTimeout(() => setMessage(null), 4000);
                          } finally {
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-4 border-t" style={{ borderColor: colors.cream }}>
        <button 
          onClick={addItem} 
          className="flex-1 py-4 rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2" 
          style={{ backgroundColor: '#fff', border: `2px solid ${colors.gold}`, color: colors.gold }}
        >
          <span>✨</span> Dodaj nowy projekt
        </button>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="flex-1 py-4 rounded-xl text-white font-bold text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" 
          style={{ backgroundColor: colors.gold }}
        >
          {saving ? '⏳ Zapisywanie...' : '💾 Zapisz wszystkie zmiany'}
        </button>
      </div>
      {message && <InlineMessage type={message.type}>{message.text}</InlineMessage>}
    </EditorCard>
  );
};
// ==================== CONTACT EDITOR ====================
const ContactEditor = ({ siteData, setSiteData }) => {
  const [contact, setContact] = useState(siteData.contact || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/site/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(contact)
      });
      if (res.ok) {
        setSiteData({ ...siteData, contact });
        setMessage({ type: 'success', text: '✅ Zapisano!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Błąd zapisu!' });
    } finally {
      setSaving(false);
    }
  };
  return (
    <EditorCard title="Dane Kontaktowe" icon="📧">
      <div>
        <label className="block font-semibold mb-3 text-lg" style={{ color: colors.darkGray }}>Email</label>
        <input
          type="email"
          value={contact.email || ''}
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
          className="w-full px-5 py-4 rounded-xl border-2 text-base"
          style={{ borderColor: colors.cream }}
          placeholder="kontakt@example.com"
        />
      </div>
      <div>
        <label className="block font-semibold mb-3 text-lg" style={{ color: colors.darkGray }}>Telefon</label>
        <input
          type="tel"
          value={contact.phone || ''}
          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          className="w-full px-5 py-4 rounded-xl border-2 text-base"
          style={{ borderColor: colors.cream }}
          placeholder="+48 123 456 789"
        />
      </div>
      <div>
        <label className="block font-semibold mb-3 text-lg" style={{ color: colors.darkGray }}>Lokalizacja</label>
        <input
          type="text"
          value={contact.location || ''}
          onChange={(e) => setContact({ ...contact, location: e.target.value })}
          className="w-full px-5 py-4 rounded-xl border-2 text-base"
          style={{ borderColor: colors.cream }}
          placeholder="Warszawa, Polska"
        />
      </div>
      <button onClick={handleSave} disabled={saving} className="w-full py-4 rounded-xl text-white font-bold text-lg" style={{ backgroundColor: colors.gold }}>
        {saving ? '💾 Zapisywanie...' : '💾 Zapisz zmiany'}
      </button>
      {message && <InlineMessage type={message.type}>{message.text}</InlineMessage>}
    </EditorCard>
  );
};
// ==================== LAYOUT EDITOR ====================
const LayoutEditor = ({ siteData, setSiteData }) => {
  const defaultSections = useMemo(() => ['hero', 'about', 'services', 'portfolio', 'contact'], []);
  const [sections, setSections] = useState(siteData.layout || defaultSections.map((s, i) => ({ id: s, visible: true, order: i + 1 })));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    if (!siteData.layout) {
      setSections(defaultSections.map((s, i) => ({ id: s, visible: true, order: i + 1 })));
    }
  }, [defaultSections, siteData.layout]);
  const sectionNames = {
    hero: '🎬 Hero',
    about: '👤 O mnie',
    services: '💼 Usługi',
    portfolio: '📸 Portfolio',
    contact: '📧 Kontakt'
  };
  const toggleVisible = (idx) => {
    const copy = [...sections];
    copy[idx].visible = !copy[idx].visible;
    setSections(copy);
  };
  const saveLayout = async () => {
    setSaving(true);
    try {
      await fetch(`${API_URL}/site/layout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(sections)
      });
      setSiteData({ ...siteData, layout: sections });
      try { window.dispatchEvent(new Event('site-updated')); } catch(e) {}
      setMessage({ type: 'success', text: '✅ Układ zapisany!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.warn('Layout save failed:', err);
    } finally {
      setSaving(false);
    }
  };
  return (
    <EditorCard title="Układ Strony" icon="🧩">
      <p className="text-base mb-4 font-medium" style={{ color: colors.darkGray }}>
        Zmień kolejność sekcji i kontroluj ich widoczność na stronie głównej.
      </p>
      <div className="space-y-3">
        {sections.map((sec, idx) => (
          <div key={sec.id} className="flex items-center gap-4 p-4 rounded-xl border-2" style={{ borderColor: sec.visible ? colors.cream : colors.cream, backgroundColor: sec.visible ? 'white' : '#f9fafb' }}>
            <div className="flex flex-col gap-2">
              <button onClick={() => moveUp(sections, setSections, idx)} disabled={idx === 0} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-sm font-semibold">▲</button>
              <button onClick={() => moveDown(sections, setSections, idx)} disabled={idx === sections.length - 1} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-sm font-semibold">▼</button>
            </div>
            <span className="flex-1 font-semibold text-base" style={{ color: sec.visible ? colors.darkGray : '#9ca3af' }}>
              {sectionNames[sec.id] || sec.id}
            </span>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sec.visible}
                onChange={() => toggleVisible(idx)}
                className="w-6 h-6 rounded cursor-pointer"
              />
              <span className="text-base font-semibold" style={{ color: colors.darkGray }}>{sec.visible ? '✅ Widoczna' : '❌ Ukryta'}</span>
            </label>
          </div>
        ))}
      </div>
      <button onClick={saveLayout} disabled={saving} className="w-full py-4 rounded-xl text-white font-bold mt-6 text-lg" style={{ backgroundColor: colors.gold }}>
        {saving ? '💾 Zapisywanie...' : '💾 Zapisz układ'}
      </button>
      {message && <InlineMessage type={message.type}>{message.text}</InlineMessage>}
    </EditorCard>
  );
};
// ==================== CATEGORIES EDITOR ====================
const CategoriesEditor = ({ siteData, setSiteData }) => {
  const [categories, setCategories] = useState(siteData.categories || [
    { name: 'Ads', description: 'Reklamy i kampanie marketingowe' },
    { name: 'Vlogs', description: 'Vlogi i treści lifestyle' },
    { name: 'Photos', description: 'Sesje zdjęciowe i fotografie' },
    { name: 'Social Media', description: 'Treści na media społecznościowe' }
  ]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const addCategory = () => {
    setCategories([...categories, { name: 'Nowa kategoria', description: '' }]);
  };
  const updateCategory = (idx, field, value) => {
    const newCategories = [...categories];
    newCategories[idx] = { ...newCategories[idx], [field]: value };
    setCategories(newCategories);
  };
  const deleteCategory = (idx) => {
    setCategories(categories.filter((_, i) => i !== idx));
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/site/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(categories)
      });
      if (res.ok) {
        setSiteData({ ...siteData, categories });
        try { window.dispatchEvent(new Event('site-updated')); } catch(e) {}
        setMessage({ type: 'success', text: '✅ Zapisano!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Błąd zapisu!' });
    } finally {
      setSaving(false);
    }
  };
  return (
    <EditorCard title="Zarządzanie Kategoriami" icon="📂">
      <p className="text-base mb-6 font-medium" style={{ color: colors.darkGray }}>
        Dodaj, edytuj lub usuń kategorie portfolio. Zmiany będą widoczne w menu nawigacji.
      </p>
      <div className="space-y-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="p-5 rounded-xl border-2" style={{ borderColor: colors.cream }}>
            <div className="flex gap-3 mb-4">
              <span className="flex-1 text-sm font-semibold" style={{ color: colors.brown }}>#{idx + 1}</span>
              <button onClick={() => deleteCategory(idx)} className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 font-semibold">🗑️</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={cat.name}
                onChange={(e) => updateCategory(idx, 'name', e.target.value)}
                placeholder="Nazwa kategorii"
                className="px-4 py-3 rounded-lg border-2 text-base"
                style={{ borderColor: colors.cream }}
              />
              <input
                type="text"
                value={cat.description}
                onChange={(e) => updateCategory(idx, 'description', e.target.value)}
                placeholder="Opis kategorii"
                className="px-4 py-3 rounded-lg border-2 text-base"
                style={{ borderColor: colors.cream }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={addCategory} className="flex-1 py-4 rounded-xl font-bold text-base" style={{ backgroundColor: colors.cream, color: colors.brown }}>
          ➕ Dodaj kategorię
        </button>
        <button onClick={handleSave} disabled={saving} className="flex-1 py-4 rounded-xl text-white font-bold text-base" style={{ backgroundColor: colors.gold }}>
          {saving ? '💾 Zapisywanie...' : '💾 Zapisz kategorie'}
        </button>
      </div>
      {message && <InlineMessage type={message.type}>{message.text}</InlineMessage>}
    </EditorCard>
  );
};
// ==================== USERS EDITOR (Admin only) ====================
const UsersEditor = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'moderator', name: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [createMsg, setCreateMsg] = useState(null);
  const [listMsg, setListMsg] = useState(null);
  const [creating, setCreating] = useState(false);
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        setListMsg({ type: 'error', text: `❌ Błąd ładowania użytkowników: ${error.error}` });
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
      setListMsg({ type: 'error', text: '❌ Błąd połączenia z serwerem' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateMsg(null);
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        await fetchUsers();
        setNewUser({ email: '', password: '', role: 'moderator', name: '' });
        setCreateMsg({ type: 'success', text: '✅ Konto utworzone!' });
        setTimeout(() => setCreateMsg(null), 3000);
      } else {
        const error = await res.json();
        setCreateMsg({ type: 'error', text: `❌ Błąd: ${error.error}` });
      }
    } catch (err) {
      setCreateMsg({ type: 'error', text: '❌ Błąd połączenia' });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        await fetchUsers();
        setEditingUser(null);
        setListMsg({ type: 'success', text: '✅ Konto zaktualizowane!' });
        setTimeout(() => setListMsg(null), 3000);
      } else {
        const error = await res.json();
        setListMsg({ type: 'error', text: `❌ Błąd: ${error.error}` });
      }
    } catch (err) {
      setListMsg({ type: 'error', text: '❌ Błąd połączenia' });
    }
  };
  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Czy na pewno chcesz usunąć konto ${userEmail}?`)) return;
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        await fetchUsers();
        setListMsg({ type: 'success', text: '✅ Konto usunięte' });
        setTimeout(() => setListMsg(null), 3000);
      } else {
        const error = await res.json();
        setListMsg({ type: 'error', text: `❌ Błąd: ${error.error}` });
      }
    } catch (err) {
      setListMsg({ type: 'error', text: '❌ Błąd połączenia' });
    }
  };
  React.useEffect(() => {
    fetchUsers();
  }, []);
  if (loading) return <EditorCard title="Zarządzanie Kontami" icon="👥"><div className="p-8 text-center">Ładowanie...</div></EditorCard>;
  return (
    <EditorCard title="Zarządzanie Kontami Użytkowników" icon="👥">
      <div className="space-y-6">
        {/* Create New User Form */}
        <div className="bg-gray-50 rounded-xl p-6" style={{ borderLeft: `4px solid ${colors.gold}` }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.darkGray }}>➕ Utwórz nowe konto</h3>
          <form onSubmit={handleCreateUser} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Email lub nazwa użytkownika (opcjonalne)"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="px-4 py-2 rounded-lg border-2"
              style={{ borderColor: colors.cream }}
            />
            <input
              type="text"
              placeholder="Imię/Nazwa (opcjonalne)"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="px-4 py-2 rounded-lg border-2"
              style={{ borderColor: colors.cream }}
            />
            <input
              type="password"
              placeholder="Hasło"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="px-4 py-2 rounded-lg border-2"
              style={{ borderColor: colors.cream }}
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="px-4 py-2 rounded-lg border-2"
              style={{ borderColor: colors.cream }}
            >
              <option value="moderator">Moderator</option>
              <option value="admin">Administrator</option>
            </select>
            <button type="submit" disabled={creating} className="md:col-span-2 py-3 rounded-lg text-white font-bold disabled:opacity-50" style={{ backgroundColor: colors.gold }}>
              {creating ? 'Tworzenie...' : 'Utwórz konto'}
            </button>
            {createMsg && <div className="md:col-span-2"><InlineMessage type={createMsg.type}>{createMsg.text}</InlineMessage></div>}
          </form>
        </div>
        {/* Users List */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold mb-4" style={{ color: colors.darkGray }}>Wszyscy użytkownicy ({users.length})</h3>
          {listMsg && <InlineMessage type={listMsg.type}>{listMsg.text}</InlineMessage>}
          {users.map(user => (
            <div key={user.id} className="bg-white rounded-lg border-2 p-4 flex items-center justify-between" style={{ borderColor: colors.cream }}>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{user.role === 'admin' ? '👑' : '👤'}</span>
                  <div>
                    <p className="font-bold" style={{ color: colors.darkGray }}>
                      {user.name || user.email}
                      {user.email === currentUser?.email && <span className="ml-2 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: colors.gold, color: 'white' }}>To Ty</span>}
                    </p>
                    <p className="text-sm" style={{ color: colors.brown }}>{user.email}</p>
                    <p className="text-xs" style={{ color: colors.brown }}>
                      Rola: <strong>{user.role === 'admin' ? 'Administrator' : 'Moderator'}</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingUser(user)}
                  className="px-4 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: colors.cream, color: colors.brown }}
                >
                  ✏️ Edytuj
                </button>
                {user.email !== currentUser?.email && (
                  <button
                    onClick={() => handleDeleteUser(user.id, user.email)}
                    className="px-4 py-2 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    🗑️ Usuń
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Edit User Modal-style */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]" onClick={() => setEditingUser(null)}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: colors.darkGray }}>Edytuj konto</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.brown }}>Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2"
                    style={{ borderColor: colors.cream }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.brown }}>Imię/Nazwa</label>
                  <input
                    type="text"
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2"
                    style={{ borderColor: colors.cream }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.brown }}>Rola</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2"
                    style={{ borderColor: colors.cream }}
                  >
                    <option value="moderator">Moderator</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.brown }}>
                    Nowe hasło (zostaw puste, aby nie zmieniać)
                  </label>
                  <input
                    type="password"
                    placeholder="Nowe hasło..."
                    onChange={(e) => setEditingUser({ ...editingUser, newPassword: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2"
                    style={{ borderColor: colors.cream }}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setEditingUser(null)}
                    className="flex-1 py-3 rounded-lg font-bold"
                    style={{ backgroundColor: colors.cream, color: colors.brown }}
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={() => {
                      const updates = { email: editingUser.email, name: editingUser.name, role: editingUser.role };
                      if (editingUser.newPassword) updates.password = editingUser.newPassword;
                      handleUpdateUser(editingUser.id, updates);
                    }}
                    className="flex-1 py-3 rounded-lg text-white font-bold"
                    style={{ backgroundColor: colors.gold }}
                  >
                    Zapisz zmiany
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </EditorCard>
  );
};
// ==================== FOOTER EDITOR ====================
const FooterEditor = ({ siteData, setSiteData }) => {
  const [social, setSocial] = useState(siteData.social || {});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const socialPlatforms = [
    { key: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/...' },
    { key: 'instagram', label: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/...' },
    { key: 'twitter', label: 'Twitter/X', icon: '𝕏', placeholder: 'https://twitter.com/...' },
    { key: 'tiktok', label: 'TikTok', icon: '🎵', placeholder: 'https://tiktok.com/@...' },
    { key: 'youtube', label: 'YouTube', icon: '▶️', placeholder: 'https://youtube.com/@...' },
    { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/...' },
    { key: 'pinterest', label: 'Pinterest', icon: '📌', placeholder: 'https://pinterest.com/...' },
    { key: 'canva', label: 'Canva', icon: '🎨', placeholder: 'https://canva.com/...' },
  ];
  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      const res = await fetch(`${API_URL}/site/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(social)
      });
      if (res.ok) {
        setSiteData({ ...siteData, social });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || '❌ Błąd zapisu!');
      }
    } catch (err) {
      setError('❌ Błąd zapisu!');
    } finally {
      setSaving(false);
    }
  };
  return (
    <EditorCard title="Sieci Społeczne" icon="🌐">
      <p className="text-base mb-6 font-medium" style={{ color: colors.darkGray }}>
        Dodaj URL do swoich profili na sieciach społecznych. Jeśli pole pozostanie puste, ikona nie będzie wyświetlana.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {socialPlatforms.map(platform => (
          <div key={platform.key}>
            <label className="block font-semibold mb-3 text-lg" style={{ color: colors.darkGray }}>
              {platform.icon} {platform.label}
            </label>
            <input
              type="url"
              value={social[platform.key] || ''}
              onChange={(e) => setSocial({ ...social, [platform.key]: e.target.value })}
              className="w-full px-5 py-4 rounded-xl border-2 text-base"
              style={{ borderColor: colors.cream }}
              placeholder={platform.placeholder}
            />
            <p className="text-xs mt-2" style={{ color: colors.brown }}>
              {social[platform.key] ? '✅ Widoczna' : '❌ Ukryta'}
            </p>
          </div>
        ))}
      </div>
      {success && (
        <div className="w-full mt-6 p-3 rounded-lg bg-green-50 text-green-700 text-center font-semibold text-sm">
          ✅ Sieci społeczne zapisane!
        </div>
      )}
      {error && (
        <div className="w-full mt-6 p-3 rounded-lg bg-red-50 text-red-700 text-center font-semibold text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 rounded-xl text-white font-bold text-lg mt-8 transition duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: colors.gold }}
        onMouseEnter={(e) => !saving && (e.target.style.boxShadow = `0 12px 24px rgba(212,175,55,0.4)`)}
        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
      >
        {saving ? '💾 Zapisywanie...' : '💾 Zapisz sieci społeczne'}
      </button>
    </EditorCard>
  );
};
// ==================== LOGS EDITOR (Admin only) ====================
const LogsEditor = ({ currentUser }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  
  const fetchLogs = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/logs?page=${pageNum}&limit=50`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotalPages(data.pagination.pages);
        setPage(pageNum);
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        setError(`❌ Błąd ładowania logów: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Failed to fetch logs', err);
      setError('❌ Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLogs();
  }, []);

  const formatAction = (action) => {
    const actionLabels = {
      login: '🔐 Logowanie do systemu',
      create_user: '👤 Utworzenie nowego użytkownika',
      update_user: '✏️ Edycja danych użytkownika',
      delete_user: '🗑️ Usunięcie użytkownika',
      create_portfolio: '📸 Dodanie nowego projektu',
      update_portfolio: '📝 Aktualizacja projektu',
      update_hero: '🎬 Zmiana sekcji Hero',
      update_about: '👤 Aktualizacja strony "O mnie"',
      update_services: '💼 Modyfikacja usług',
      update_contact: '📧 Zmiana danych kontaktowych',
      update_categories: '📂 Aktualizacja kategorii',
      update_footer: '🌐 Edycja stopki',
      update_layout: '🧩 Zmiana układu strony'
    };
    return actionLabels[action] || action;
  };

  const formatDetails = (action, details, logType) => {
    if (!details || typeof details !== 'object') return null;

    switch (action) {
      case 'login':
        return `👤 Zalogował się: ${details.username || 'nieznany użytkownik'} | Rola: ${details.role || 'brak'}`;
      
      case 'create_user':
        return `👥 Nowy użytkownik: ${details.createdUserName} (${details.createdUserEmail}) | Rola: ${details.createdUserRole}`;
      
      case 'update_user':
        const changed = details.changedFields || [];
        return `✏️ Zmieniono ${details.updatedUserName}: ${changed.length > 0 ? changed.join(', ') : 'brak zmian'}`;
      
      case 'delete_user':
        return `🗑️ Usunięto użytkownika: ${details.deletedUserName} (${details.deletedUserEmail}) | Rola: ${details.deletedUserRole}`;
      
      case 'create_portfolio':
        return `📸 Nowy projekt: "${details.title}" w kategorii "${details.category}" | ${details.imagesCount} zdjęć${details.hasVideo ? ' + wideo' : ''}`;
      
      case 'update_portfolio':
        let portfolioDesc = `📝 Projekt: "${details.title}"`;
        if (details.changes && Object.keys(details.changes).length > 0) {
          const changeLines = [];
          
          if (details.changes.title) {
            changeLines.push(`   • Tytuł: "${details.changes.title.from}" → "${details.changes.title.to}"`);
          }
          if (details.changes.category) {
            changeLines.push(`   • Kategoria: "${details.changes.category.from}" → "${details.changes.category.to}"`);
          }
          if (details.changes.video) {
            changeLines.push(`   • Wideo główne: "${(details.changes.video.from || 'brak').substring(0, 40)}" → "${(details.changes.video.to || 'brak').substring(0, 40)}"`);
          }
          if (details.changes.order) {
            changeLines.push(`   • Kolejność: ${details.changes.order.from} → ${details.changes.order.to}`);
          }
          
          // Dodane zdjęcia
          if (details.changes.addedImages && details.changes.addedImages.length > 0) {
            details.changes.addedImages.forEach(img => {
              if (img && img.filename) {
                changeLines.push(`   ✅ Dodane zdjęcie: ${img.filename}${img.caption ? ` (opis: ${img.caption})` : ''}`);
              }
            });
          }
          
          // Usunięte zdjęcia
          if (details.changes.removedImages && details.changes.removedImages.length > 0) {
            details.changes.removedImages.forEach(img => {
              if (img && img.filename) {
                changeLines.push(`   ❌ Usunięte zdjęcie: ${img.filename}`);
              }
            });
          }
          
          // Media główne
          if (details.changes.featuredMedia) {
            const from = details.changes.featuredMedia.from;
            const to = details.changes.featuredMedia.to;
            const fromDesc = from === 'brak' ? 'brak' : (from && from.filename ? from.filename : 'brak');
            const toDesc = to === 'brak' ? 'brak' : (to && to.filename ? to.filename : 'brak');
            changeLines.push(`   ⭐ Media główne: "${fromDesc}" → "${toDesc}"`);
          }
          
          // Nowy plik
          if (details.changes.newFile) {
            changeLines.push(`   ➕ Nowy plik: ${details.changes.newFile.filename}`);
          }
          
          if (changeLines.length > 0) {
            portfolioDesc += `\n${changeLines.join('\n')}`;
          }
        }
        return portfolioDesc;
      
      case 'update_hero':
        const heroFields = details.changedFields || [];
        return `🎨 Sekcja Hero: zmieniono ${heroFields.join(', ') || 'brak zmian'}`;
      
      default:
        return `${action}: ${JSON.stringify(details)}`;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading && logs.length === 0) {
    return (
      <EditorCard title="Logi Systemowe" icon="📋">
        <div className="p-8 text-center">Ładowanie logów...</div>
      </EditorCard>
    );
  }

  return (
    <EditorCard title="Logi Systemowe" icon="📋">
      <div className="space-y-4">
        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700 text-center font-semibold">
            {error}
          </div>
        )}
        
        <div className="text-sm text-gray-600 mb-4">
          <p>Pokaż wszystkie działania użytkowników w systemie. Strona {page} z {totalPages}.</p>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map(log => (
            <div key={log.id} className="p-4 rounded-lg border-2 bg-gray-50" style={{ borderColor: colors.cream }}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-base" style={{ color: colors.darkGray }}>
                    {formatAction(log.action)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">{log.userName || log.userEmail}</span>
                    {log.userRole === 'admin' && <span className="ml-2 px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-800">Admin</span>}
                    {log.userRole === 'moderator' && <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">Moderator</span>}
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {formatDate(log.createdAt)}
                  <div className="text-xs text-gray-400 mt-1">{log.ipAddress}</div>
                </div>
              </div>
              
              {log.details && Object.keys(log.details).length > 0 && (
                <div className="mt-3 p-3 rounded bg-white text-sm max-h-48 overflow-y-auto">
                  <div className="text-xs font-medium text-gray-500 mb-2">Szczegóły:</div>
                  <div className="text-gray-700 font-mono text-xs" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                    {formatDetails(log.action, log.details, log.logType)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {logs.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            Brak logów do wyświetlenia
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => fetchLogs(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 rounded-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: colors.cream }}
            >
              ← Poprzednia
            </button>
            
            <span className="px-4 py-2 text-sm font-medium" style={{ color: colors.darkGray }}>
              Strona {page} z {totalPages}
            </span>
            
            <button
              onClick={() => fetchLogs(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-lg border-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: colors.cream }}
            >
              Następna →
            </button>
          </div>
        )}
      </div>
    </EditorCard>
  );
};