import React, { useRef } from 'react';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** Accessible name when the visible label is an abbreviation (e.g. "RO"). */
  ariaLabel?: string;
  lang?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  labelledBy?: string;
  ariaLabel?: string;
}

/**
 * Two-cell segmented control used for preferences (DESIGN.md → Segmented control).
 * A radiogroup with roving tabindex and arrow-key support.
 */
export function SegmentedControl<T extends string>({ options, value, onChange, labelledBy, ariaLabel }: SegmentedControlProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-label={ariaLabel}
      className="grid grid-cols-2 w-[min(210px,100%)] p-0.5 border border-line-strong rounded-ctl"
    >
      {options.map((option, i) => {
        const checked = option.value === value;
        return (
          <button
            key={option.value}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={option.ariaLabel}
            lang={option.lang}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`min-h-[42px] px-2.5 rounded-print text-ui transition-colors duration-200 ease-ease ${
              checked ? 'bg-ink text-paper font-semibold' : 'text-ink-2 font-medium hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
