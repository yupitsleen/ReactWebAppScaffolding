import { useState, useEffect } from 'react';

export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';

const STORAGE_KEY = 'layout-density';
const DEFAULT_DENSITY: LayoutDensity = 'comfortable';

export const useDensity = () => {
  const [density, setDensityState] = useState<LayoutDensity>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as LayoutDensity) || DEFAULT_DENSITY;
  });

  const setDensity = (newDensity: LayoutDensity) => {
    setDensityState(newDensity);
    localStorage.setItem(STORAGE_KEY, newDensity);

    // Update CSS custom property for global density
    document.documentElement.setAttribute('data-density', newDensity);
  };

  useEffect(() => {
    // Initialize density on mount
    document.documentElement.setAttribute('data-density', density);
  }, [density]);

  return { density, setDensity };
};
