import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { SegmentedControl } from './SegmentedControl';

/** Theme preference: Light (Gallery Wall) / Dark (Darkroom). */
export const ThemeSelector: React.FC<{ labelledBy?: string }> = ({ labelledBy }) => {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();
  return (
    <SegmentedControl
      labelledBy={labelledBy}
      ariaLabel={labelledBy ? undefined : getTranslation('theme', language)}
      value={theme}
      onChange={setTheme}
      options={[
        { value: 'light', label: getTranslation('light', language) },
        { value: 'dark', label: getTranslation('dark', language) },
      ]}
    />
  );
};
