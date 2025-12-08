/**
 * Fuzzy ingredient matching utility
 * Matches ingredients by finding common substrings of at least 4 consecutive letters
 */

/**
 * Find the longest common substring between two strings
 */
function longestCommonSubstring(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  let maxLength = 0;
  
  for (let i = 0; i < s1.length; i++) {
    for (let j = 0; j < s2.length; j++) {
      let length = 0;
      while (
        i + length < s1.length &&
        j + length < s2.length &&
        s1[i + length] === s2[j + length]
      ) {
        length++;
      }
      maxLength = Math.max(maxLength, length);
    }
  }
  
  return maxLength;
}

/**
 * Check if two strings have a common substring of at least 4 consecutive letters
 */
export function hasCommonSubstring(str1: string, str2: string, minLength: number = 4): boolean {
  return longestCommonSubstring(str1, str2) >= minLength;
}

/**
 * Find matching ingredient key from prices data
 * Returns the key with the longest common substring, or undefined if no match with 4+ letters
 */
export function findMatchingIngredient(
  ingredientName: string,
  pricesData: { [key: string]: { name: string } }
): string | undefined {
  const normalizedName = ingredientName.toLowerCase();
  let bestMatch: string | undefined;
  let bestMatchLength = 3; // Must be at least 4 to match
  
  for (const [key, value] of Object.entries(pricesData)) {
    // Check match against both the key and the name
    const keyMatch = longestCommonSubstring(normalizedName, key);
    const nameMatch = longestCommonSubstring(normalizedName, value.name);
    const maxMatch = Math.max(keyMatch, nameMatch);
    
    if (maxMatch > bestMatchLength) {
      bestMatchLength = maxMatch;
      bestMatch = key;
    }
  }
  
  return bestMatch;
}

/**
 * Get all matching ingredients (for debugging/testing)
 */
export function getAllMatches(
  ingredientName: string,
  pricesData: { [key: string]: { name: string } }
): Array<{ key: string; matchLength: number }> {
  const normalizedName = ingredientName.toLowerCase();
  const matches: Array<{ key: string; matchLength: number }> = [];
  
  for (const [key, value] of Object.entries(pricesData)) {
    const keyMatch = longestCommonSubstring(normalizedName, key);
    const nameMatch = longestCommonSubstring(normalizedName, value.name);
    const maxMatch = Math.max(keyMatch, nameMatch);
    
    if (maxMatch >= 4) {
      matches.push({ key, matchLength: maxMatch });
    }
  }
  
  return matches.sort((a, b) => b.matchLength - a.matchLength);
}
