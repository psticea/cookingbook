import React, { useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { LanguageSelector } from './LanguageSelector';
import { TextSizeSelector } from './TextSizeSelector';
import { ThemeSelector } from './ThemeSelector';
import { CloseIcon } from './icons';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  /** Optional element to focus on open (e.g. the first filter chip). */
  initialFocusSelector?: string;
}

const CLOSE_MS = 520;
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** A hairline-separated section inside the side menu (DESIGN.md → Navigation). */
export const MenuSection: React.FC<{ title: string; action?: React.ReactNode; children: React.ReactNode }> = ({ title, action, children }) => {
  const id = useId();
  return (
    <section aria-labelledby={id} className="py-[18px] [&+&]:border-t [&+&]:border-line">
      <div className="flex items-center justify-between gap-3 min-h-target">
        <h3 id={id} className="type-section text-ink">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
};

/**
 * SideMenu — a Paper sheet sliding in from the right over a scrim.
 * Escape, backdrop and the close button close it; the page behind is inert and
 * scroll-locked; focus is trapped inside and returned to the trigger.
 */
export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, children, initialFocusSelector }) => {
  const { language } = useLanguage();
  const [rendered, setRendered] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const prefsId = useId();

  // Mount → animate in; animate out → unmount.
  useEffect(() => {
    if (isOpen) {
      lastFocus.current = document.activeElement as HTMLElement | null;
      setRendered(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setRendered(false), reduce ? 0 : CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  // Focus, scroll lock and inert background while open.
  useEffect(() => {
    if (!rendered || !isOpen) return;
    const target = (initialFocusSelector && sheetRef.current?.querySelector<HTMLElement>(initialFocusSelector)) || closeRef.current;
    target?.focus({ preventScroll: true });

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const siblings = Array.from(rootRef.current?.parentElement?.children ?? []).filter(
      (el) => el !== rootRef.current && !el.hasAttribute('inert')
    ) as HTMLElement[];
    siblings.forEach((el) => el.setAttribute('inert', ''));

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      siblings.forEach((el) => el.removeAttribute('inert'));
      const back = lastFocus.current;
      if (back && document.contains(back)) back.focus({ preventScroll: true });
    };
  }, [rendered, isOpen, initialFocusSelector]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !sheetRef.current) return;
      const items = Array.from(sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!rendered) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-[var(--scrim)] transition-opacity duration-[360ms] ease-ease ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute inset-y-0 right-0 w-[min(420px,calc(100vw-36px))] flex flex-col bg-paper shadow-sheet transition-transform duration-[520ms] ease-ease ${
          visible ? 'translate-x-0' : 'translate-x-[104%]'
        }`}
      >
        <div className="flex-none h-[var(--bar-h)] flex items-center justify-between pl-5 pr-2 border-b border-line">
          <h2 id={titleId} className="type-title text-ink">{getTranslation('menu', language)}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="grid place-items-center w-11 h-11 rounded-full text-ink hover:bg-ink/[.06] transition-colors"
            aria-label={getTranslation('close', language)}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-1 pb-[calc(32px+env(safe-area-inset-bottom))]">
          {children}
          <MenuSection title={getTranslation('preferences', language)}>
            <div className="grid gap-3 mt-1.5" id={prefsId}>
              {([
                ['language', LanguageSelector],
                ['theme', ThemeSelector],
                ['textSize', TextSizeSelector],
              ] as const).map(([key, Control]) => (
                <div key={key} className="flex items-center justify-between gap-3 flex-wrap">
                  <span id={`${prefsId}-${key}`} className="text-ui text-ink-2">{getTranslation(key, language)}</span>
                  <Control labelledBy={`${prefsId}-${key}`} />
                </div>
              ))}
            </div>
          </MenuSection>
        </div>
      </div>
    </div>
  );
};
