import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#2c3e50' }}>
        Polityka Prywatności
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-600 mb-8">
          <strong>Ostatnia aktualizacja:</strong> 12 grudnia 2025 r.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            1. Informacje ogólne
          </h2>
          <p className="mb-4">
            Ta strona internetowa jest portfolio zawierającym projekty i pracę. Zawartość jest zarządzana przez administratora.
          </p>
          <p className="mb-4">
            <strong>Opis:</strong> Strona nie zbiera danych osobowych od odwiedzających. Nie ma formularzy rejestracyjnych ani zbierania informacji kontaktowych bez wyraźnej zgody.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            2. Cookies
          </h2>
          <p className="mb-4">Strona korzysta z cookies do:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Zapamiętania preferencji użytkownika (np. tryb ciemny/jasny)</li>
            <li>Analizy ruchu (Google Analytics) - do poprawy doświadczenia</li>
            <li>Bezpieczeństwa panelu administracji (cookies sesji)</li>
          </ul>
          <p className="mb-4">
            Możesz zablokować cookies w ustawieniach przeglądarki. Więcej informacji w <a href="/cookies" className="text-blue-600 hover:underline">Polityce Cookies</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            3. Bezpieczeństwo
          </h2>
          <p className="mb-4">
            Strona jest zabezpieczona certyfikatem SSL/TLS, co oznacza, że cała komunikacja między Twoją przeglądarką a naszym serwerem jest szyfrowana. Panel administracji jest chroniony hasłem i dostępny tylko dla autoryzowanych użytkowników.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            4. Zawartość zewnętrzna
          </h2>
          <p className="mb-4">Strona może zawierać osadzane materiały z:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>YouTube - <a href="https://www.youtube.com/intl/pl/howyoutubeworks/user-features/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Polityka prywatności YouTube</a></li>
            <li>TikTok - <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Polityka prywatności TikTok</a></li>
          </ul>
          <p className="mb-4">
            Te serwisy mogą zbierać dane zgodnie ze swoimi politykami prywatności. Nie mamy nad nimi kontroli.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            5. Dane techniczne
          </h2>
          <p className="mb-4">
            Podczas korzystania ze strony automatycznie zbierane są dane techniczne takie jak:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Adres IP</li>
            <li>Typ i wersja przeglądarki</li>
            <li>System operacyjny</li>
            <li>Czas spędzony na stronie</li>
          </ul>
          <p className="mb-4">
            Dane są używane wyłącznie do analityki i polepszania doświadczenia użytkownika.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            6. Kontakt
          </h2>
          <p className="mb-4">
            Jeśli masz pytania dotyczące tej polityki prywatności, skontaktuj się poprzez:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Formularz kontaktowy na stronie</li>
            <li>Media społecznościowe (linki w stopce)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: '#34495e' }}>
            7. Zgodność z prawem
          </h2>
          <p className="mb-4">
            Ta polityka jest zgodna z Rozporządzeniem Ogólnym o Ochronie Danych (RODO) i polskim ustawą o ochronie danych osobowych.
          </p>
        </section>
      </div>
    </div>
  );
}