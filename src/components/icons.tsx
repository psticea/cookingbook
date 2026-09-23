import React from 'react';

/**
 * Line icons for "The Light Table" (DESIGN.md → Buttons): 24px grid, 1.6 stroke,
 * round caps, currentColor. Decorative by default; label the parent control.
 */
type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({ size = 22, children, className, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={`shrink-0 ${className ?? ''}`}
    {...rest}
  >
    {children}
  </svg>
);

export const SearchIcon: React.FC<IconProps> = (p) => (
  <Icon {...p}><circle cx="10.5" cy="10.5" r="6.25" /><path d="m15.2 15.2 5 5" /></Icon>
);
export const CloseIcon: React.FC<IconProps> = (p) => (
  <Icon {...p}><path d="M7 7l10 10M17 7 7 17" /></Icon>
);
export const MenuIcon: React.FC<IconProps> = (p) => (
  <Icon {...p}><path d="M4 9h16M4 15h10" /></Icon>
);
export const ArrowRightIcon: React.FC<IconProps> = (p) => (
  <Icon {...p}><path d="M5 12h13M13 6l6 6-6 6" /></Icon>
);
export const FiltersIcon: React.FC<IconProps> = (p) => (
  <Icon strokeWidth={1.5} {...p}><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></Icon>
);
export const MinusIcon: React.FC<IconProps> = (p) => (
  <Icon {...p}><path d="M6 12h12" /></Icon>
);
export const PlusIcon: React.FC<IconProps> = (p) => (
  <Icon {...p}><path d="M12 6v12M6 12h12" /></Icon>
);

/** Small up-arrow; rotate 180° for descending. */
export const SortArrow: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 12 12" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={`shrink-0 ${className ?? ''}`}>
    <path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" />
  </svg>
);

/**
 * The grease-pencil mark (DESIGN.md → Sort buttons / Tabs). Place inside a
 * `relative` control with aria-pressed or aria-selected; it draws in when true.
 */
export const PencilMark: React.FC = () => (
  <svg className="pencil-mark" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path d="M2 5.2c14-2.6 34-3.4 52-2.6 15 .6 30 1.4 44 .4" />
  </svg>
);
