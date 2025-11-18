/**
 * Filter keyword type definitions
 */

import { MultilingualText } from './common';

export type FilterKeywordType = 'difficulty' | 'meat' | 'vegetable' | 'sauce' | 'cooking';

export interface FilterKeyword {
  id: string;
  type: FilterKeywordType;
  label: MultilingualText;
}
