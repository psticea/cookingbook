import React, { useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { getTranslation } from '../utils/translations';

const AboutPage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const giscusRef = useRef<HTMLDivElement>(null);

  // Load Giscus script dynamically
  useEffect(() => {
    if (!giscusRef.current) return;

    // Remove existing Giscus iframe if present
    const existingGiscus = giscusRef.current.querySelector('iframe.giscus-frame');
    if (existingGiscus) {
      existingGiscus.remove();
    }

    // Create and configure Giscus script
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'YOUR_USERNAME/YOUR_REPO'); // TODO: Replace with actual repo
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // TODO: Replace with actual repo ID
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // TODO: Replace with actual category ID
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', language);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    giscusRef.current.appendChild(script);

    // Cleanup function
    return () => {
      if (giscusRef.current) {
        const scriptElement = giscusRef.current.querySelector('script[src="https://giscus.app/client.js"]');
        if (scriptElement) {
          scriptElement.remove();
        }
      }
    };
  }, [language, theme]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-4xl">
        {/* About Section */}
        <article className="prose dark:prose-invert max-w-none">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
            {getTranslation('aboutTitle', language)}
          </h1>
          
          <div className="space-y-4 sm:space-y-6 text-gray-700 dark:text-gray-300">
            <p className="text-base sm:text-lg leading-relaxed">
              {getTranslation('aboutDescription', language)}
            </p>

            {language === 'ro' ? (
              <>
                <section className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Despre Acest Site
                  </h2>
                  <p className="leading-relaxed">
                    Acest site a fost creat pentru a împărtăși rețete delicioase și ușor de urmat. 
                    Fiecare rețetă include instrucțiuni clare, ingrediente măsurate cu precizie și 
                    sfaturi personale pentru a vă ajuta să obțineți cele mai bune rezultate.
                  </p>
                </section>

                <section className="mt-6 sm:mt-8">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
                    Caracteristici
                  </h2>
                  <ul className="list-disc list-inside space-y-2 leading-relaxed text-sm sm:text-base">
                    <li>Rețete organizate în 8 categorii pentru navigare ușoară</li>
                    <li>Scalare automată a ingredientelor pentru diferite porții</li>
                    <li>Suport pentru limbile română și engleză</li>
                    <li>Temă întunecată și luminoasă pentru confortul ochilor</li>
                    <li>Ajustare mărime text pentru citire confortabilă</li>
                    <li>Filtrare după dificultate, tip de carne, metodă de gătit și ingrediente</li>
                    <li>Căutare rapidă după titlul rețetei</li>
                    <li>Design responsive pentru mobil și desktop</li>
                  </ul>
                </section>

                <section className="mt-6 sm:mt-8">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
                    Filosofia Noastră
                  </h2>
                  <p className="leading-relaxed text-sm sm:text-base">
                    Credem că gătitul ar trebui să fie o experiență plăcută și accesibilă pentru toată lumea. 
                    De aceea, rețetele noastre sunt testate, clare și includ sfaturi personale pentru a vă 
                    ajuta să reușiți de fiecare dată. Fie că sunteți începător sau bucătar experimentat, 
                    veți găsi aici rețete care vă vor inspira.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section className="mt-6 sm:mt-8">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
                    About This Site
                  </h2>
                  <p className="leading-relaxed text-sm sm:text-base">
                    This site was created to share delicious and easy-to-follow recipes. 
                    Each recipe includes clear instructions, precisely measured ingredients, and 
                    personal tips to help you achieve the best results.
                  </p>
                </section>

                <section className="mt-6 sm:mt-8">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
                    Features
                  </h2>
                  <ul className="list-disc list-inside space-y-2 leading-relaxed text-sm sm:text-base">
                    <li>Recipes organized into 8 categories for easy navigation</li>
                    <li>Automatic ingredient scaling for different serving sizes</li>
                    <li>Support for Romanian and English languages</li>
                    <li>Dark and light themes for eye comfort</li>
                    <li>Text size adjustment for comfortable reading</li>
                    <li>Filter by difficulty, meat type, cooking method, and ingredients</li>
                    <li>Quick search by recipe title</li>
                    <li>Responsive design for mobile and desktop</li>
                  </ul>
                </section>

                <section className="mt-6 sm:mt-8">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
                    Our Philosophy
                  </h2>
                  <p className="leading-relaxed text-sm sm:text-base">
                    We believe that cooking should be an enjoyable and accessible experience for everyone. 
                    That's why our recipes are tested, clear, and include personal tips to help you 
                    succeed every time. Whether you're a beginner or an experienced cook, 
                    you'll find recipes here that will inspire you.
                  </p>
                </section>
              </>
            )}
          </div>
        </article>

        {/* Giscus Comments Section */}
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            {language === 'ro' ? 'Comentarii' : 'Comments'}
          </h2>
          <div ref={giscusRef} className="giscus-container" />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
