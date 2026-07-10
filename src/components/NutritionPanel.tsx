import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { NutritionData } from '../types/recipe';

interface NutritionPanelProps {
  nutrition: NutritionData;
}

const copy = {
  ro: {
    perServing: 'Per porție',
    calories: 'calorii',
    macroBalance: 'Distribuția macronutrienților',
    protein: 'Proteine',
    carbohydrates: 'Carbohidrați',
    fat: 'Grăsimi',
    details: 'Detalii nutriționale',
    saturatedFat: 'din care saturate',
    fiber: 'Fibre',
    sugars: 'Zaharuri',
    sodium: 'Sodiu',
    dailyValue: 'din aportul zilnic de referință',
    highlight: 'Bogat în proteine',
    highlightText: 'O porție oferă 76% din aportul zilnic de referință pentru proteine.',
    note: 'Valori estimate din cantitățile ingredientelor. Produsele și modul de preparare pot modifica rezultatele.',
    reference: 'Procente bazate pe aportul de referință al unui adult mediu (2.000 kcal).',
  },
  en: {
    perServing: 'Per serving',
    calories: 'calories',
    macroBalance: 'Macronutrient balance',
    protein: 'Protein',
    carbohydrates: 'Carbohydrates',
    fat: 'Fat',
    details: 'Nutrition details',
    saturatedFat: 'saturated fat',
    fiber: 'Fiber',
    sugars: 'Sugars',
    sodium: 'Sodium',
    dailyValue: 'of daily reference intake',
    highlight: 'High in protein',
    highlightText: 'One serving provides 76% of the daily reference intake for protein.',
    note: 'Values are estimated from the listed ingredient quantities. Products and preparation can change the result.',
    reference: 'Percentages use reference intakes for an average adult (2,000 kcal).',
  },
};

export const NutritionPanel: React.FC<NutritionPanelProps> = ({ nutrition }) => {
  const { language } = useLanguage();
  const text = copy[language];
  const proteinCalories = nutrition.protein * 4;
  const carbohydrateCalories = nutrition.carbohydrates * 4;
  const fatCalories = nutrition.fat * 9;
  const macroCalories = proteinCalories + carbohydrateCalories + fatCalories;
  const macroSegments = [
    {
      label: text.protein,
      value: nutrition.protein,
      percent: Math.round((proteinCalories / macroCalories) * 100),
      color: 'bg-brand-warm',
    },
    {
      label: text.carbohydrates,
      value: nutrition.carbohydrates,
      percent: Math.round((carbohydrateCalories / macroCalories) * 100),
      color: 'bg-brand-yellow',
    },
    {
      label: text.fat,
      value: nutrition.fat,
      percent: Math.round((fatCalories / macroCalories) * 100),
      color: 'bg-brand-accent',
    },
  ];
  const detailRows = [
    { label: text.saturatedFat, value: `${nutrition.saturatedFat} g`, percent: 75 },
    { label: text.fiber, value: `${nutrition.fiber} g`, percent: 17 },
    { label: text.sugars, value: `${nutrition.sugars} g`, percent: 8 },
    { label: text.sodium, value: `${nutrition.sodium} mg`, percent: 38 },
  ];

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl bg-card-light dark:bg-card-dark border border-line-light dark:border-line-dark shadow-card">
        <div className="grid grid-cols-[1.05fr_1fr]">
          <div className="p-5 sm:p-6 border-r border-line-light dark:border-line-dark">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-ink-soft-light dark:text-ink-soft-dark">
              {text.perServing}
            </p>
            <p className="mt-2 font-serif font-semibold text-5xl text-ink-light dark:text-ink-dark tabular-nums leading-none">
              {nutrition.calories}
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-warm">{text.calories}</p>
          </div>
          <div className="p-5 sm:p-6 flex flex-col justify-center">
            <p className="text-xs font-semibold text-ink-light dark:text-ink-dark">
              {nutrition.servingSize[language]}
            </p>
            <div className="mt-3 h-1.5 rounded-full overflow-hidden bg-line-2-light dark:bg-line-2-dark">
              <div className="h-full bg-brand-warm rounded-full" style={{ width: '39%' }} />
            </div>
            <p className="mt-2 text-[11px] leading-snug text-ink-muted-light dark:text-ink-muted-dark">
              39% {text.dailyValue}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-card-light dark:bg-card-dark border border-line-light dark:border-line-dark p-5 sm:p-6">
        <h2 className="font-serif text-lg font-semibold text-ink-light dark:text-ink-dark">
          {text.macroBalance}
        </h2>
        <div
          className="mt-4 flex h-3 overflow-hidden rounded-full bg-line-2-light dark:bg-line-2-dark"
          role="img"
          aria-label={macroSegments.map((item) => `${item.label} ${item.percent}%`).join(', ')}
        >
          {macroSegments.map((item) => (
            <span key={item.label} className={item.color} style={{ width: `${item.percent}%` }} />
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {macroSegments.map((item) => (
            <div key={item.label}>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${item.color}`} />
                <span className="text-[11px] font-semibold text-ink-muted-light dark:text-ink-muted-dark">
                  {item.label}
                </span>
              </div>
              <p className="mt-1 font-serif text-xl font-semibold text-ink-light dark:text-ink-dark tabular-nums">
                {item.value}
                <span className="ml-0.5 font-sans text-xs font-medium text-ink-soft-light dark:text-ink-soft-dark">g</span>
              </p>
              <p className="text-[10px] text-ink-soft-light dark:text-ink-soft-dark">{item.percent}% kcal</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-card-light dark:bg-card-dark border border-line-light dark:border-line-dark p-5 sm:p-6">
        <h2 className="font-serif text-lg font-semibold text-ink-light dark:text-ink-dark">
          {text.details}
        </h2>
        <div className="mt-3 divide-y divide-line-2-light dark:divide-line-2-dark">
          {detailRows.map((item) => (
            <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 py-3">
              <span className="text-sm text-ink-muted-light dark:text-ink-muted-dark">{item.label}</span>
              <span className="text-sm font-bold text-ink-light dark:text-ink-dark tabular-nums">{item.value}</span>
              <div className="col-span-2 mt-2 h-1 rounded-full overflow-hidden bg-line-2-light dark:bg-line-2-dark">
                <div
                  className="h-full bg-brand-yellow rounded-full"
                  style={{ width: `${Math.min(item.percent, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="rounded-2xl bg-brand-warm/10 dark:bg-brand-warm/15 border border-brand-warm/20 p-4">
        <p className="text-sm font-bold text-ink-light dark:text-ink-dark">{text.highlight}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted-light dark:text-ink-muted-dark">
          {text.highlightText}
        </p>
      </aside>

      <div className="px-1 text-[11px] leading-relaxed text-ink-soft-light dark:text-ink-soft-dark">
        <p>{text.note}</p>
        <p className="mt-1">{text.reference}</p>
      </div>
    </div>
  );
};
