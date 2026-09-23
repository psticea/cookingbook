import React, { useEffect, useRef } from 'react';
import { ContentPage } from '../components/ContentPage';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { getTranslation } from '../utils/translations';

const AUTHOR = { name: 'Paul Sticea', email: 'psticea@gmail.com' };

/** AboutPage — a short letter in the reading column, then the Giscus comments. */
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

  const ro = language === 'ro';

  return (
    <ContentPage
      title={getTranslation('aboutTitle', language)}
      intro={ro
        ? 'Bun venit pe colecția mea de rețete — fără reclame, doar mâncare bună.'
        : 'Welcome to my recipe collection — no ads, just food.'}
    >
      <article className="mt-12 md:mt-16 max-w-[65ch] text-base leading-[1.6] text-ink">
        <p className="type-title text-ink">{ro ? 'Salut!' : 'Hello!'}</p>
        <div className="mt-5 space-y-[1.1em]">
          {ro ? (
            <>
              <p>
                Bine ai venit pe site-ul meu cu rețete. Aici o să găsești rețetele mele preferate în română și
                engleză.
              </p>
              <p>Nu sunt reclame, pop-up-uri sau trackere, doar rețete grozave.</p>
              <p>
                Multe rețetele sunt preluate de pe alte website-uri, dar cu ingrediente și instrucțiuni ajustate în
                funcție de preferințele mele. Pentru fiecare rețetă preluată vei găsi și link-ul în notele rețetei.
              </p>
              <p>Spor la gătit!</p>
            </>
          ) : (
            <>
              <p>
                Welcome to my recipe website. Here you'll find my favorite recipes in both English and Romanian.
              </p>
              <p>No ads, no pop-ups, no trackers, just great recipes.</p>
              <p>
                Many recipes are adapted from other websites, but with ingredients and instructions adjusted
                according to my preferences. For each adapted recipe, you'll find the link in the recipe notes.
              </p>
              <p>Happy cooking!</p>
            </>
          )}
        </div>

        <footer className="mt-8">
          <p className="text-md font-[560] [font-stretch:108%] tracking-[-0.005em] text-ink">{AUTHOR.name}</p>
          <a
            href={`mailto:${AUTHOR.email}`}
            className="inline-flex items-center min-h-target -mt-1.5 text-ui text-ink-2 underline decoration-line-strong decoration-1 underline-offset-4 hover:text-ink hover:decoration-current transition-colors [overflow-wrap:anywhere]"
          >
            {AUTHOR.email}
          </a>
        </footer>
      </article>

      <section aria-labelledby="comments-title" className="mt-16 md:mt-[72px] pt-10 md:pt-12 border-t border-line">
        <h2 id="comments-title" className="type-headline text-ink">
          {ro ? 'Comentarii' : 'Comments'}
        </h2>
        <div ref={giscusRef} className="giscus-host mt-6 md:mt-8 [&_iframe]:w-full [&_iframe]:border-0" />
      </section>
    </ContentPage>
  );
};

export default AboutPage;