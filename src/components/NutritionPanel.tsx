import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { NutritionData } from '../types/recipe';

interface NutritionPanelProps {
  nutrition: NutritionData;
}

type NutrientKind = 'benefit' | 'limit' | 'neutral';
type Filter = 'all' | 'benefit' | 'limit';

const copy = {
  ro: {
    perServing: 'Valorile unei singure porții',
    calories: 'kcal',
    dailyEnergy: 'din energia zilnică',
    score: 'Scor nutrițional',
    scoreLabel: 'Bun',
    scoreExplanation: 'Combină nutrienții utili cu cei care ar trebui limitați.',
    proteinScore: 'Aport proteic',
    limitScore: 'Echilibru nutrienți de limitat',
    macroBalance: 'Energie din macronutrienți',
    protein: 'Proteine',
    carbohydrates: 'Carbohidrați',
    fat: 'Grăsimi',
    saturatedFat: 'Grăsimi saturate',
    fiber: 'Fibre',
    sugars: 'Zaharuri',
    sodium: 'Sodiu',
    potassium: 'Potasiu',
    calcium: 'Calciu',
    iron: 'Fier',
    nutrients: 'Nutrienți și valori zilnice',
    all: 'Toate',
    benefits: 'De consumat',
    limits: 'De limitat',
    excellent: 'Excelent',
    good: 'Bun',
    low: 'Scăzut',
    moderate: 'Moderat',
    high: 'Ridicat',
    dailyValue: 'VZ',
    guidance: 'Evaluare',
    strengths: 'Puncte forte',
    strengthsText: 'Multă proteină, potasiu și calciu într-o singură porție.',
    watch: 'De urmărit',
    watchText: 'Grăsimile saturate sunt ridicate; porția are 75% din valoarea zilnică.',
    note: 'Valori estimate per porție din cantitățile ingredientelor. Produsele și prepararea pot modifica rezultatele.',
    reference: 'Procentele folosesc valorile de referință pentru un adult (2.000 kcal). Scorul este orientativ, nu recomandare medicală.',
  },
  en: {
    perServing: 'Values for one serving',
    calories: 'kcal',
    dailyEnergy: 'of daily energy',
    score: 'Nutrition score',
    scoreLabel: 'Good',
    scoreExplanation: 'Balances helpful nutrients against nutrients to limit.',
    proteinScore: 'Protein target',
    limitScore: 'Limit nutrient balance',
    macroBalance: 'Energy from macronutrients',
    protein: 'Protein',
    carbohydrates: 'Carbohydrates',
    fat: 'Fat',
    saturatedFat: 'Saturated fat',
    fiber: 'Fiber',
    sugars: 'Sugars',
    sodium: 'Sodium',
    potassium: 'Potassium',
    calcium: 'Calcium',
    iron: 'Iron',
    nutrients: 'Nutrients and daily values',
    all: 'All',
    benefits: 'Get more',
    limits: 'Limit',
    excellent: 'Excellent',
    good: 'Good',
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    dailyValue: 'DV',
    guidance: 'Rating',
    strengths: 'What is good',
    strengthsText: 'Plenty of protein, potassium and calcium in one serving.',
    watch: 'What to watch',
    watchText: 'Saturated fat is high at 75% of the daily value per serving.',
    note: 'Values are estimated per serving from ingredient quantities. Products and preparation can change the result.',
    reference: 'Percentages use reference values for an adult (2,000 kcal). The score is a guide, not medical advice.',
  },
};

// Macro shares are told apart by tone and legend, never by hue (The Photograph Owns the Colour Rule).
const MACRO_TONES = ['bg-ink', 'bg-ink-3', 'bg-line-strong'];

/** A thin, square-ended share bar on a Hairline track. */
const Meter: React.FC<{ percent: number; className?: string }> = ({ percent, className = '' }) => (
  <div aria-hidden="true" className={`h-1 bg-line overflow-hidden ${className}`}>
    <div className="h-full bg-ink-2" style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }} />
  </div>
);

/**
 * NutritionPanel — per-serving nutrition in the neutral Light Table system:
 * tabular figures, hairline tables and grey meters. China Marker is never used for data.
 */
export const NutritionPanel: React.FC<NutritionPanelProps> = ({ nutrition }) => {
  const { language } = useLanguage();
  const text = copy[language];
  const [filter, setFilter] = useState<Filter>('all');

  const referenceIntakes = {
    calories: 2000,
    protein: 50,
    carbohydrates: 260,
    fat: 70,
    saturatedFat: 20,
    fiber: 25,
    sugars: 90,
    sodium: 2400,
    potassium: 2000,
    calcium: 800,
    iron: 14,
  };
  const percentOf = (value: number, reference: number) => Math.round((value / reference) * 100);
  const caloriePercent = percentOf(nutrition.calories, referenceIntakes.calories);
  const proteinPercent = percentOf(nutrition.protein, referenceIntakes.protein);
  const proteinCalories = nutrition.protein * 4;
  const carbohydrateCalories = nutrition.carbohydrates * 4;
  const fatCalories = nutrition.fat * 9;
  const macroCalories = proteinCalories + carbohydrateCalories + fatCalories;
  const macroSegments = [
    { label: text.protein, value: nutrition.protein, percent: Math.round((proteinCalories / macroCalories) * 100) },
    { label: text.carbohydrates, value: nutrition.carbohydrates, percent: Math.round((carbohydrateCalories / macroCalories) * 100) },
    { label: text.fat, value: nutrition.fat, percent: Math.round((fatCalories / macroCalories) * 100) },
  ].map((segment, index) => ({ ...segment, tone: MACRO_TONES[index] }));
  const nutrients: Array<{
    label: string;
    value: string;
    percent: number;
    kind: NutrientKind;
  }> = [
    { label: text.protein, value: `${nutrition.protein} g`, percent: proteinPercent, kind: 'benefit' },
    { label: text.carbohydrates, value: `${nutrition.carbohydrates} g`, percent: percentOf(nutrition.carbohydrates, referenceIntakes.carbohydrates), kind: 'neutral' },
    { label: text.fat, value: `${nutrition.fat} g`, percent: percentOf(nutrition.fat, referenceIntakes.fat), kind: 'limit' },
    { label: text.saturatedFat, value: `${nutrition.saturatedFat} g`, percent: percentOf(nutrition.saturatedFat, referenceIntakes.saturatedFat), kind: 'limit' },
    { label: text.fiber, value: `${nutrition.fiber} g`, percent: percentOf(nutrition.fiber, referenceIntakes.fiber), kind: 'benefit' },
    { label: text.sugars, value: `${nutrition.sugars} g`, percent: percentOf(nutrition.sugars, referenceIntakes.sugars), kind: 'limit' },
    { label: text.sodium, value: `${nutrition.sodium} mg`, percent: percentOf(nutrition.sodium, referenceIntakes.sodium), kind: 'limit' },
    { label: text.potassium, value: `${nutrition.potassium} mg`, percent: percentOf(nutrition.potassium, referenceIntakes.potassium), kind: 'benefit' },
    { label: text.calcium, value: `${nutrition.calcium} mg`, percent: percentOf(nutrition.calcium, referenceIntakes.calcium), kind: 'benefit' },
    { label: text.iron, value: `${nutrition.iron} mg`, percent: percentOf(nutrition.iron, referenceIntakes.iron), kind: 'benefit' },
  ];
  const beneficial = nutrients.filter((nutrient) => nutrient.kind === 'benefit');
  const limiting = nutrients.filter((nutrient) => nutrient.kind === 'limit');
  const benefitScore = beneficial.reduce((sum, nutrient) => sum + Math.min(10, nutrient.percent / 3), 0) / beneficial.length;
  const limitScore = limiting.reduce((sum, nutrient) => sum + Math.max(0, Math.min(10, (100 - nutrient.percent) / 8)), 0) / limiting.length;
  const nutritionScore = (benefitScore * 0.4 + limitScore * 0.6).toFixed(1);
  const visibleNutrients = filter === 'all' ? nutrients : nutrients.filter((nutrient) => nutrient.kind === filter);

  // Notable amounts (a rich source, or too much of a nutrient to limit) are set in Ink 600.
  const getRating = (kind: NutrientKind, percent: number) => {
    if (kind === 'benefit') {
      if (percent >= 30) return { label: text.excellent, notable: true };
      if (percent >= 15) return { label: text.good, notable: false };
      return { label: text.low, notable: false };
    }
    if (kind === 'limit') {
      if (percent <= 20) return { label: text.low, notable: false };
      if (percent <= 40) return { label: text.moderate, notable: false };
      return { label: text.high, notable: true };
    }
    return { label: text.moderate, notable: false };
  };

  return (
    <div className="grid gap-10 sm:gap-12">
      {/* Energy and overall score */}
      <section className="grid gap-y-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
        <div className="min-w-0 sm:pr-8">
          <p className="m-0 text-sm text-ink-2">{text.perServing}</p>
          <p className="m-0 mt-0.5 text-ui font-medium text-ink">{nutrition.servingSize[language]}</p>
          <p className="m-0 mt-5 flex items-baseline gap-2">
            <span className="type-figure font-light text-4xl leading-none text-ink">{nutrition.calories}</span>
            <span className="text-md text-ink-3">{text.calories}</span>
          </p>
          <Meter percent={caloriePercent} className="mt-5 max-w-sm" />
          <p className="m-0 mt-2 text-sm text-ink-2 tabular-nums">{caloriePercent}% {text.dailyEnergy}</p>
        </div>
        <div className="min-w-0 pt-6 border-t border-line sm:pt-0 sm:pl-8 sm:border-t-0 sm:border-l">
          <p className="m-0 text-sm text-ink-2">{text.score}</p>
          <p className="m-0 mt-2 flex items-baseline gap-1.5">
            <span className="type-figure font-light text-4xl leading-none text-ink">{nutritionScore}</span>
            <span className="text-md text-ink-3 tabular-nums">/10</span>
          </p>
          <p className="m-0 mt-2 text-ui font-semibold text-ink">{text.scoreLabel}</p>
          <p className="m-0 mt-1 text-sm text-ink-2 text-pretty">{text.scoreExplanation}</p>
        </div>
      </section>

      {/* Sub-scores */}
      <dl className="m-0 grid grid-cols-2 border-y border-line">
        <div className="min-w-0 py-4 pr-3">
          <dt className="text-sm text-ink-2 text-pretty">{text.proteinScore}</dt>
          <dd className="m-0 mt-2">
            <span className="type-figure text-2xl leading-none text-ink">{Math.min(10, proteinPercent / 3).toFixed(1)}</span>
            <span className="text-sm text-ink-3 tabular-nums"> /10</span>
            <p className="m-0 mt-1 text-sm text-ink-2 tabular-nums">{proteinPercent}% {text.dailyValue}</p>
          </dd>
        </div>
        <div className="min-w-0 py-4 pl-4 sm:pl-6 border-l border-line">
          <dt className="text-sm text-ink-2 text-pretty">{text.limitScore}</dt>
          <dd className="m-0 mt-2">
            <span className="type-figure text-2xl leading-none text-ink">{limitScore.toFixed(1)}</span>
            <span className="text-sm text-ink-3 tabular-nums"> /10</span>
            <p className="m-0 mt-1 text-sm text-ink-2">{text.watch}</p>
          </dd>
        </div>
      </dl>

      {/* Macronutrient energy split */}
      <section aria-labelledby="macro-balance">
        <h2 id="macro-balance" className="type-section text-ink">{text.macroBalance}</h2>
        <div
          className="mt-4 flex gap-[2px] h-2"
          role="img"
          aria-label={macroSegments.map((item) => `${item.label} ${item.percent}%`).join(', ')}
        >
          {macroSegments.map((item) => <span key={item.label} className={item.tone} style={{ width: `${item.percent}%` }} />)}
        </div>
        <ul className="m-0 mt-4 p-0 list-none grid sm:grid-cols-3 sm:gap-x-6">
          {macroSegments.map((item) => (
            <li
              key={item.label}
              className="min-w-0 grid grid-cols-[minmax(0,1fr)_auto_3.75rem] items-baseline gap-x-3 py-2.5 border-t border-line sm:block sm:py-0 sm:pt-3"
            >
              <span className="flex items-center gap-2 min-w-0 text-sm text-ink-2">
                <span aria-hidden="true" className={`shrink-0 w-2.5 h-2.5 rounded-[1px] ${item.tone}`} />
                <span className="min-w-0 break-words">{item.label}</span>
              </span>
              <span className="block sm:mt-1.5 text-ink">
                <span className="type-figure text-xl sm:text-2xl leading-none">{item.value}</span>
                <span className="ml-0.5 text-sm text-ink-3">g</span>
              </span>
              <span className="block sm:mt-1 text-right sm:text-left text-sm text-ink-3 tabular-nums">{item.percent}% kcal</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Nutrients and daily values */}
      <section aria-labelledby="nutrient-values">
        <h2 id="nutrient-values" className="type-section text-ink">{text.nutrients}</h2>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={text.nutrients}>
          {([
            ['all', text.all],
            ['benefit', text.benefits],
            ['limit', text.limits],
          ] as Array<[Filter, string]>).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={`inline-flex items-center min-h-target px-3.5 rounded-ctl border text-ui transition-colors duration-200 ease-ease ${
                filter === value
                  ? 'bg-ink border-ink text-paper font-[560]'
                  : 'border-line-strong text-ink font-[480] hover:border-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div aria-hidden="true" className="mt-5 flex justify-end gap-x-5 pb-1.5 text-xs text-ink-2">
          <span>{text.dailyValue}: %</span>
          <span>{text.guidance}</span>
        </div>
        <ul className="m-0 p-0 list-none border-b border-line">
          {visibleNutrients.map((nutrient) => {
            const rating = getRating(nutrient.kind, nutrient.percent);
            return (
              <li key={nutrient.label} className="py-3 border-t border-line">
                <div className="grid grid-cols-[minmax(0,1fr)_auto_3.25rem] items-baseline gap-x-3">
                  <span className="min-w-0 break-words text-ui text-ink">{nutrient.label}</span>
                  <span className="text-sm text-ink-2 tabular-nums whitespace-nowrap">{nutrient.value}</span>
                  <span className="text-right text-ui font-semibold text-ink tabular-nums">{nutrient.percent}%</span>
                </div>
                <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4">
                  <Meter percent={nutrient.percent} />
                  <span className={`min-w-[4.5rem] text-right text-sm ${rating.notable ? 'text-ink font-semibold' : 'text-ink-2'}`}>
                    {rating.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Guidance */}
      <div className="grid gap-3 sm:grid-cols-2">
        <aside className="bg-paper rounded-ctl p-4 sm:p-5">
          <p className="m-0 type-section text-ink">{text.strengths}</p>
          <p className="m-0 mt-1.5 text-ui leading-[1.5] text-ink-2 text-pretty">{text.strengthsText}</p>
        </aside>
        <aside className="bg-paper rounded-ctl p-4 sm:p-5">
          <p className="m-0 type-section text-ink">{text.watch}</p>
          <p className="m-0 mt-1.5 text-ui leading-[1.5] text-ink-2 text-pretty">{text.watchText}</p>
        </aside>
      </div>

      <div className="-mt-4 max-w-[65ch] text-sm text-ink-2 text-pretty">
        <p className="m-0">{text.note}</p>
        <p className="m-0 mt-1.5">{text.reference}</p>
      </div>
    </div>
  );
};
