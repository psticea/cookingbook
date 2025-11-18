/**
 * Filter keyword type definitions
 */

import { MultilingualText } from './common';

export type FilterKeywordType = 'difficulty' | 'meatType' | 'cookType' | 'ingredient';

export interface FilterKeyword {
  id: string;
  type: FilterKeywordType;
  label: MultilingualText;
}
