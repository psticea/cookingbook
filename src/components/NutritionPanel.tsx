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
    { label: text.protein, value: nutrition.protein, percent: Math.round((proteinCalories / macroCalories) * 100), color: 'bg-brand-warm' },
    { label: text.carbohydrates, value: nutrition.carbohydrates, percent: Math.round((carbohydrateCalories / macroCalories) * 100), color: 'bg-brand-yellow' },
    { label: text.fat, value: nutrition.fat, percent: Math.round((fatCalories / macroCalories) * 100), color: 'bg-brand-accent' },
  ];
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

  const getRating = (kind: NutrientKind, percent: number) => {
    if (kind === 'benefit') {
      if (percent >= 30) return { label: text.excellent, color: 'text-brand-accent dark:text-brand-accent-bright', bar: 'bg-brand-accent' };
      if (percent >= 15) return { label: text.good, color: 'text-brand-accent dark:text-brand-accent-bright', bar: 'bg-brand-accent' };
      return { label: text.low, color: 'text-brand-warm', bar: 'bg-brand-warm' };
    }
    if (kind === 'limit') {
      if (percent <= 20) return { label: text.low, color: 'text-brand-accent dark:text-brand-accent-bright', bar: 'bg-brand-accent' };
      if (percent <= 40) return { label: text.moderate, color: 'text-ink-muted-light dark:text-ink-muted-dark', bar: 'bg-brand-yellow' };
      return { label: text.high, color: 'text-brand-warm', bar: 'bg-brand-warm' };
    }
    return { label: text.moderate, color: 'text-ink-muted-light dark:text-ink-muted-dark', bar: 'bg-brand-yellow' };
  };

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-3xl bg-ink-light text-white dark:bg-card-2-dark border border-ink-light dark:border-line-dark shadow-card">
        <div className="grid sm:grid-cols-[1fr_auto]">
          <div className="p-5 sm:p-6">
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/60">{text.perServing}</p>
            <p className="mt-2 text-sm font-semibold text-white/85">{nutrition.servingSize[language]}</p>
            <div className="mt-5 flex items-end gap-2">
              <span className="font-serif text-5xl font-semibold tabular-nums leading-none">{nutrition.calories}</span>
              <span className="pb-1 text-sm font-bold text-brand-yellow">{text.calories}</span>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-brand-yellow" style={{ width: `${Math.min(caloriePercent, 100)}%` }} />
            </div>
            <p className="mt-2 text-xs text-white/60">{caloriePercent}% {text.dailyEnergy}</p>
          </div>
          <div className="flex items-center gap-4 border-t border-white/10 bg-white/5 p-5 sm:w-52 sm:flex-col sm:justify-center sm:border-l sm:border-t-0">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-[7px] border-brand-accent-bright bg-white/5">
              <span className="font-serif text-2xl font-semibold tabular-nums">{nutritionScore}</span>
            </div>
            <div className="sm:text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-white/60">{text.score}</p>
              <p className="mt-1 font-serif text-xl font-semibold text-brand-yellow">{text.scoreLabel} · /10</p>
              <p className="mt-1 text-[10px] leading-snug text-white/50">{text.scoreExplanation}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-line-light bg-card-light p-4 dark:border-line-dark dark:bg-card-dark">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft-light dark:text-ink-soft-dark">{text.proteinScore}</p>
          <p className="mt-2 font-serif text-2xl font-semibold text-brand-accent dark:text-brand-accent-bright">{Math.min(10, proteinPercent / 3).toFixed(1)}<span className="text-sm text-ink-soft-light dark:text-ink-soft-dark"> / 10</span></p>
          <p className="mt-1 text-xs text-ink-muted-light dark:text-ink-muted-dark">{proteinPercent}% {text.dailyValue}</p>
        </div>
        <div className="rounded-2xl border border-line-light bg-card-light p-4 dark:border-line-dark dark:bg-card-dark">
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft-light dark:text-ink-soft-dark">{text.limitScore}</p>
          <p className="mt-2 font-serif text-2xl font-semibold text-brand-warm">{limitScore.toFixed(1)}<span className="text-sm text-ink-soft-light dark:text-ink-soft-dark"> / 10</span></p>
          <p className="mt-1 text-xs text-ink-muted-light dark:text-ink-muted-dark">{text.watch}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-line-light bg-card-light p-5 dark:border-line-dark dark:bg-card-dark sm:p-6">
        <h2 className="font-serif text-lg font-semibold text-ink-light dark:text-ink-dark">{text.macroBalance}</h2>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-line-2-light dark:bg-line-2-dark" role="img" aria-label={macroSegments.map((item) => `${item.label} ${item.percent}%`).join(', ')}>
          {macroSegments.map((item) => <span key={item.label} className={item.color} style={{ width: `${item.percent}%` }} />)}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {macroSegments.map((item) => (
            <div key={item.label}>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${item.color}`} />
                <span className="text-[11px] font-semibold text-ink-muted-light dark:text-ink-muted-dark">{item.label}</span>
              </div>
              <p className="mt-1 font-serif text-xl font-semibold text-ink-light dark:text-ink-dark tabular-nums">{item.value}<span className="ml-0.5 font-sans text-xs font-medium text-ink-soft-light dark:text-ink-soft-dark">g</span></p>
              <p className="text-[10px] text-ink-soft-light dark:text-ink-soft-dark">{item.percent}% kcal</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line-light bg-card-light p-5 dark:border-line-dark dark:bg-card-dark sm:p-6">
        <h2 className="font-serif text-lg font-semibold text-ink-light dark:text-ink-dark">{text.nutrients}</h2>
        <div className="mt-4 flex gap-2" aria-label={text.nutrients}>
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
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                filter === value
                  ? 'bg-ink-light text-white dark:bg-ink-dark dark:text-ink-light'
                  : 'bg-card-3-light text-ink-muted-light hover:text-ink-light dark:bg-card-3-dark dark:text-ink-muted-dark dark:hover:text-ink-dark'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-4 divide-y divide-line-2-light dark:divide-line-2-dark">
          {visibleNutrients.map((nutrient) => {
            const rating = getRating(nutrient.kind, nutrient.percent);
            return (
              <div key={nutrient.label} className="py-3">
                <div className="grid grid-cols-[1fr_auto_auto] items-baseline gap-3">
                  <span className="text-sm font-semibold text-ink-light dark:text-ink-dark">{nutrient.label}</span>
                  <span className="text-xs font-medium tabular-nums text-ink-muted-light dark:text-ink-muted-dark">{nutrient.value}</span>
                  <span className="w-12 text-right text-sm font-bold tabular-nums text-ink-light dark:text-ink-dark">{nutrient.percent}%</span>
                </div>
                <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-line-2-light dark:bg-line-2-dark">
                    <div className={`h-full rounded-full ${rating.bar}`} style={{ width: `${Math.min(nutrient.percent, 100)}%` }} />
                  </div>
                  <span className={`w-16 text-right text-[10px] font-bold uppercase tracking-wide ${rating.color}`}>{rating.label}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-end gap-5 text-[10px] font-bold uppercase tracking-wide text-ink-soft-light dark:text-ink-soft-dark">
          <span>{text.dailyValue}: %</span>
          <span>{text.guidance}</span>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <aside className="rounded-2xl border border-brand-accent/20 bg-brand-accent/10 p-4">
          <p className="text-sm font-bold text-brand-accent dark:text-brand-accent-bright">✓ {text.strengths}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted-light dark:text-ink-muted-dark">{text.strengthsText}</p>
        </aside>
        <aside className="rounded-2xl border border-brand-warm/20 bg-brand-warm/10 p-4">
          <p className="text-sm font-bold text-brand-warm">! {text.watch}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted-light dark:text-ink-muted-dark">{text.watchText}</p>
        </aside>
      </div>

      <div className="px-1 text-[11px] leading-relaxed text-ink-soft-light dark:text-ink-soft-dark">
        <p>{text.note}</p>
        <p className="mt-1">{text.reference}</p>
      </div>
    </div>
  );
};
