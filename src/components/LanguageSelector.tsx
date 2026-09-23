import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { SegmentedControl } from './SegmentedControl';

/** Language preference: RO / EN (DESIGN.md → Segmented control). */
export const LanguageSelector: React.FC<{ labelledBy?: string }> = ({ labelledBy }) => {
  const { language, setLanguage } = useLanguage();
  return (
    <SegmentedControl
      labelledBy={labelledBy}
      ariaLabel={labelledBy ? undefined : getTranslation('language', language)}
      value={language}
      onChange={setLanguage}
      options={[
        { value: 'ro', label: 'RO', ariaLabel: getTranslation('romanian', language), lang: 'ro' },
        { value: 'en', label: 'EN', ariaLabel: getTranslation('english', language), lang: 'en' },
      ]}
    />
  );
};
