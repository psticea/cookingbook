import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getTranslation } from '../utils/translations';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default value when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    expect(result.current[0]).toBe('defaultValue');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('testKey')).toBe(JSON.stringify('updated'));
  });

  it('reads existing value from localStorage', () => {
    localStorage.setItem('testKey', JSON.stringify('existing'));
    
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));
    expect(result.current[0]).toBe('existing');
  });
});

describe('getTranslation', () => {
  it('returns Romanian translation for valid key', () => {
    const translation = getTranslation('home', 'ro');
    expect(translation).toBe('Acasă');
  });

  it('returns English translation for valid key', () => {
    const translation = getTranslation('home', 'en');
    expect(translation).toBe('Home');
  });

  it('returns fallback translation when key missing in requested language', () => {
    const translation = getTranslation('nonexistent', 'ro');
    expect(translation).toBe('nonexistent');
  });

  it('returns key when translation missing in both languages', () => {
    const translation = getTranslation('totallyMissing', 'en');
    expect(translation).toBe('totallyMissing');
  });
});
