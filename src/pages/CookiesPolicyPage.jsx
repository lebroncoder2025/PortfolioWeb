import React from 'react';

export default function CookiesPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#2c3e50' }}>
        Polityka Cookies
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-600 mb-8">
          <strong>Ostatnia aktualizacja:</strong> 12 grudnia 2025 r.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            1. Co to są pliki cookies?
          </h2>
          <p className="mb-4">
            Pliki cookies (tzw. "ciasteczka") to niewielkie pliki tekstowe wysyłane przez serwer www i przechowywane
            przez przeglądarkę internetową urządzenia użytkownika. Pliki te zawierają informacje niezbędne do prawidłowego
            funkcjonowania strony internetowej.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            2. Jakie pliki cookies wykorzystujemy?
          </h2>

          <h3 className="text-xl font-semibold mb-3">2.1 Pliki cookies niezbędne</h3>
          <p className="mb-4">
            Są one niezbędne do prawidłowego funkcjonowania strony internetowej. Umożliwiają nawigację po stronie,
            korzystanie z formularzy kontaktowych oraz logowanie do panelu administratora.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p><strong>Przechowywanie:</strong> Do końca sesji przeglądarki lub do momentu usunięcia</p>
            <p><strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes</p>
          </div>

          <h3 className="text-xl font-semibold mb-3">2.2 Pliki cookies analityczne</h3>
          <p className="mb-4">
            Służą do analizy ruchu na stronie i zachowania użytkowników. Pomagają w ulepszaniu funkcjonalności
            i treści strony internetowej.
          </p>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p><strong>Przechowywanie:</strong> Do 2 lat</p>
            <p><strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes</p>
          </div>

          <h3 className="text-xl font-semibold mb-3">2.3 Pliki cookies marketingowe</h3>
          <p className="mb-4">
            Wykorzystywane do wyświetlania spersonalizowanych reklam i treści marketingowych.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <p><strong>Przechowywanie:</strong> Do 1 roku</p>
            <p><strong>Podstawa prawna:</strong> Art. 6 ust. 1 lit. a RODO - zgoda użytkownika</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            3. Zarządzanie plikami cookies
          </h2>

          <h3 className="text-xl font-semibold mb-3">3.1 Ustawienia przeglądarki</h3>
          <p className="mb-4">
            Użytkownik może samodzielnie zarządzać plikami cookies poprzez ustawienia przeglądarki internetowej:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Google Chrome:</strong> Ustawienia → Prywatność i bezpieczeństwo → Cookies</li>
            <li><strong>Mozilla Firefox:</strong> Preferencje → Prywatność i bezpieczeństwo → Cookies</li>
            <li><strong>Microsoft Edge:</strong> Ustawienia → Cookies i uprawnienia witryny</li>
            <li><strong>Safari:</strong> Preferencje → Prywatność → Zarządzaj danymi witryn</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">3.2 Zgoda na cookies</h3>
          <p className="mb-4">
            Przy pierwszej wizycie na stronie wyświetlane jest okienko z prośbą o zgodę na wykorzystanie
            plików cookies. Użytkownik może wyrazić zgodę na wszystkie pliki lub wybrać tylko niektóre kategorie.
          </p>

          <h3 className="text-xl font-semibold mb-3">3.3 Wycofanie zgody</h3>
          <p className="mb-4">
            Zgoda na wykorzystanie plików cookies może być w każdej chwili wycofana poprzez:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Zmianę ustawień w banerze cookies na stronie</li>
            <li>Zmianę ustawień przeglądarki</li>
            <li>Usunięcie plików cookies z przeglądarki</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            4. Konsekwencje wyłączenia plików cookies
          </h2>
          <p className="mb-4">
            Wyłączenie plików cookies może wpłynąć na funkcjonalność strony:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Brak możliwości logowania do panelu administratora</li>
            <li>Ograniczone możliwości korzystania z formularzy kontaktowych</li>
            <li>Brak personalizacji treści</li>
            <li>Problemy z wyświetlaniem niektórych elementów strony</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            5. Pliki cookies stron trzecich
          </h2>
          <p className="mb-4">
            Na stronie mogą być wykorzystywane pliki cookies pochodzące od zaufanych partnerów:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Google Analytics:</strong> analiza ruchu na stronie</li>
            <li><strong>Social media:</strong> integracja z platformami społecznościowymi</li>
            <li><strong>Hosting provider:</strong> zapewnienie bezpieczeństwa i wydajności</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            6. Bezpieczeństwo danych
          </h2>
          <p className="mb-4">
            Wszystkie pliki cookies są bezpieczne i nie zawierają danych osobowych.
            Są one wykorzystywane wyłącznie do celów określonych w niniejszej polityce.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            7. Kontakt
          </h2>
          <p className="mb-4">
            W przypadku pytań dotyczących plików cookies, prosimy o kontakt:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Email:</strong> [email]</p>
            <p><strong>Telefon:</strong> [telefon]</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            8. Aktualizacje polityki
          </h2>
          <p className="mb-4">
            Niniejsza Polityka Cookies może być aktualizowana. O wszelkich zmianach
            użytkownicy będą informowani poprzez stronę internetową.
          </p>
        </section>
      </div>
    </div>
  );
}