import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#2c3e50' }}>
        Warunki Użytkowania
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-600 mb-8">
          <strong>Ostatnia aktualizacja:</strong> 12 grudnia 2025 r.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            1. O tej stronie
          </h2>
          <p className="mb-4">
            To jest portfolio prezentujące projekty i pracę. Zawartość jest zarządzana przez administratora strony.
          </p>
          <p className="mb-4">
            Strona jest dostępna publicznie i darmowa do przeglądania.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            2. Prawo autorskie
          </h2>
          <p className="mb-4">
            Wszystkie projekty, zdjęcia, wideo i teksty na tej stronie są własnością twórcy lub używane za zgodą.
          </p>
          <p className="mb-4">
            <strong>Zakaz:</strong> Nie możesz kopiować, pobierać lub rozpowszechniać zawartości bez zgody.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            3. Korzystanie ze strony
          </h2>
          <p className="mb-4">Korzystając ze strony, akceptujesz te warunki.</p>
          <p className="mb-4">Możesz:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Przeglądać zawartość</li>
            <li>Udostępniać linki do strony</li>
            <li>Kontaktować się przez formularz</li>
          </ul>
          <p className="mb-4">Nie możesz:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Pobierać lub kopiować treści</li>
            <li>Używać zawartości do celów komercyjnych bez zgody</li>
            <li>Atakować lub obciążać serwer</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            4. Linki zewnętrzne
          </h2>
          <p className="mb-4">
            Strona może zawierać linki do YouTube, TikTok i mediów społecznościowych.
            Te witryny mają swoje własne warunki użytkowania.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            5. Zmiany warunków
          </h2>
          <p className="mb-4">
            Administrator może zmienić te warunki w dowolnym momencie. Zmiany będą opublikowane na tej stronie.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            6. Kontakt
          </h2>
          <p className="mb-4">
            Jeśli masz pytania dotyczące tych warunków, skontaktuj się przez formularz kontaktowy.
          </p>
        </section>
      </div>
    </div>
  );
}