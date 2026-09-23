import React from 'react';
import { ContentPage } from '../components/ContentPage';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';

interface Rule {
  title: string;
  body: string;
}

const RULES_RO: Rule[] = [
  { title: 'Citește rețeta complet înainte să începi să gătești', body: 'Așa nu o să ai surprize pe parcurs.' },
  { title: 'Pregătește toate ingredientele în avans pe masa de gătit', body: 'Asta te ajută să gătești mai relaxat când ai totul la îndemână.' },
  { title: 'Pe cât posibil nu exclude niciun condiment', body: 'E un cost mic care face o diferență mare la final.' },
  { title: 'Asigură-te că folosești un cuțit bine ascuțit', body: 'Asta înseamnă că orice cuțit trebuie ascuțit o dată la câteva săptămâni.' },
];

const RULES_EN: Rule[] = [
  { title: 'Read the recipe completely before you start cooking', body: "This way you won't have surprises along the way." },
  { title: 'Prepare all ingredients in advance on the cooking table', body: 'This helps you cook more relaxed when you have everything at hand.' },
  { title: "As much as possible, don't exclude any seasoning", body: "It's a small cost that makes a big difference in the end." },
  { title: 'Make sure you use a well-sharpened knife', body: 'This means any knife should be sharpened once every few weeks.' },
];

/** CookingBasicsPage — numbered house rules set as a calm, scannable reading list. */
const CookingBasicsPage: React.FC = () => {
  const { language } = useLanguage();
  const ro = language === 'ro';
  const rules = ro ? RULES_RO : RULES_EN;

  return (
    <ContentPage
      title={getTranslation('cookingBasicsTitle', language)}
      intro={ro
        ? 'Din experiența mea am scos câteva reguli care fac orice rețetă mai bună.'
        : 'From my experience, a handful of rules that make every recipe easier and tastier.'}
    >
      <ol role="list" className="mt-12 md:mt-16 border-t border-line">
        {rules.map((rule, i) => (
          <li
            key={rule.title}
            className="grid grid-cols-[2.75rem_minmax(0,1fr)] md:grid-cols-[5rem_minmax(0,1fr)] items-baseline py-7 md:py-9 border-b border-line"
          >
            <span aria-hidden="true" className="type-figure font-light text-3xl md:text-4xl leading-none text-mark">
              {i + 1}
            </span>
            <h2 className="type-title md:text-xl lg:text-2xl text-ink text-pretty">{rule.title}</h2>
            <p className="col-start-2 mt-2.5 max-w-[60ch] text-base leading-[1.6] text-ink-2 text-pretty">
              {rule.body}
            </p>
          </li>
        ))}
      </ol>

      <aside className="mt-12 md:mt-16 bg-paper rounded-ctl p-5 md:px-6 md:py-[22px]">
        <p className="text-base leading-[1.6] text-ink-2">{ro ? 'Va urma…' : 'To be continued…'}</p>
        <p className="mt-1 type-section text-ink">{ro ? 'Spor la gătit!' : 'Happy cooking!'}</p>
      </aside>
    </ContentPage>
  );
};

export default CookingBasicsPage;
