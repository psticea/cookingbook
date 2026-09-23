import React from 'react';
import { Language } from '../types';
import { RecipeCost, formatPrice } from '../utils/pricing';
import { getTranslation } from '../utils/translations';
import { MinusIcon, PlusIcon } from './icons';

interface RecipeStatsProps {
  prepTime: number;
  servings: number;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  cost: RecipeCost | null;
  language: Language;
  className?: string;
}

const PER_SERVING = { ro: 'lei / porție', en: 'lei / serving' } as const;
const SERVINGS_UNIT = { ro: ['porție', 'porții'], en: ['serving', 'servings'] } as const;

const CELL = 'min-w-0 flex flex-col items-center justify-center text-center py-2 px-1.5';
const FIGURE = 'type-figure text-xl md:text-2xl leading-none text-ink';
const UNIT = 'mt-1 text-xs md:text-sm leading-tight text-ink-3';

/** 36px outlined step button with a 44px hit area (DESIGN.md → The 44 Rule). */
const StepButton: React.FC<{ label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }> = ({
  label,
  disabled,
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="relative grid place-items-center shrink-0 w-9 h-9 rounded-ctl border border-line-strong text-ink before:absolute before:-inset-1 before:content-[''] transition-[border-color,color,transform,opacity] duration-200 ease-ease enabled:hover:border-mark enabled:hover:text-mark enabled:active:scale-[.95] disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

/**
 * RecipeStats — the fact box (DESIGN.md → Fact box): prep time, the servings
 * stepper and cost per serving in one framed rectangle of three centred cells,
 * each a figure with its unit beneath.
 */
export const RecipeStats: React.FC<RecipeStatsProps> = ({
  prepTime,
  servings,
  canDecrease,
  canIncrease,
  onDecrease,
  onIncrease,
  cost,
  language,
  className = '',
}) => {
  const hasPrice = !!cost && cost.pricePerServing !== null && cost.status !== 'unavailable';
  const price = hasPrice ? formatPrice(cost.pricePerServing as number, false) : null;
  const costLabel = cost?.status === 'complete' && price
    ? `${getTranslation('estimatedCost', language)}: ${price} ${getTranslation('perServing', language)}`
    : cost?.status === 'partial' && price
      ? `${getTranslation('partialEstimate', language)} · ${getTranslation('knownSubtotal', language)}: ${price} ${getTranslation('perServing', language)}`
      : getTranslation('costUnavailable', language);
  const minutesLabel = `${getTranslation('prepTime', language)}: ${prepTime} ${getTranslation('minutes', language)}`;

  return (
    <dl className={`m-0 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] border border-line-strong rounded-ctl ${className}`}>
      <div className={CELL} title={minutesLabel}>
        <dt className="sr-only">{getTranslation('prepTimeShort', language)}</dt>
        <dd className="m-0 flex flex-col items-center">
          <span aria-hidden="true" className={FIGURE}>{prepTime}</span>
          <span aria-hidden="true" className={UNIT}>min</span>
          <span className="sr-only">{minutesLabel}</span>
        </dd>
      </div>

      <div className={`${CELL} px-2.5 xs:px-4 border-x border-line`}>
        <dt className="sr-only">{getTranslation('servings', language)}</dt>
        <dd className="m-0 flex items-center gap-2.5 xs:gap-3.5">
          <StepButton label={getTranslation('decreaseServings', language)} disabled={!canDecrease} onClick={onDecrease}>
            <MinusIcon size={16} />
          </StepButton>
          <span aria-live="polite" aria-atomic="true" className="flex flex-col items-center min-w-[3.25rem]">
            <span className={FIGURE}>{servings}</span>
            <span className={UNIT}>{SERVINGS_UNIT[language][servings === 1 ? 0 : 1]}</span>
          </span>
          <StepButton label={getTranslation('increaseServings', language)} disabled={!canIncrease} onClick={onIncrease}>
            <PlusIcon size={16} />
          </StepButton>
        </dd>
      </div>

      <div className={CELL} title={costLabel}>
        <dt className="sr-only">{getTranslation('estimatedCost', language)}</dt>
        <dd className="m-0 flex flex-col items-center">
          <span aria-hidden="true" className={`${FIGURE} whitespace-nowrap`}>
            {cost?.status === 'partial' && price && <span className="text-ink-3 mr-px">≈</span>}
            {price ?? '—'}
          </span>
          <span aria-hidden="true" className={UNIT}>{PER_SERVING[language]}</span>
          <span className="sr-only">{costLabel}</span>
        </dd>
      </div>
    </dl>
  );
};
