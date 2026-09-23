import React from 'react';
import { useTextSize } from '../hooks/useTextSize';
import { useLanguage } from '../hooks/useLanguage';
import { getTranslation } from '../utils/translations';
import { SegmentedControl } from './SegmentedControl';

/** Text size preference: Normal / Large (large scales the root to 112.5%). */
export const TextSizeSelector: React.FC<{ labelledBy?: string }> = ({ labelledBy }) => {
  const { textSize, setTextSize } = useTextSize();
  const { language } = useLanguage();
  return (
    <SegmentedControl
      labelledBy={labelledBy}
      ariaLabel={labelledBy ? undefined : getTranslation('textSize', language)}
      value={textSize}
      onChange={setTextSize}
      options={[
        { value: 'normal', label: getTranslation('normal', language) },
        { value: 'large', label: getTranslation('large', language) },
      ]}
    />
  );
};
