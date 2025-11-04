import { useState, useEffect } from 'react';

const STORAGE_KEY = 'high-contrast-mode';

export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrastState] = useState<boolean>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  });

  const setHighContrast = (enabled: boolean) => {
    setIsHighContrastState(enabled);
    localStorage.setItem(STORAGE_KEY, String(enabled));

    // Update data attribute for CSS targeting
    if (enabled) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(!isHighContrast);
  };

  useEffect(() => {
    // Initialize on mount
    if (isHighContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    }
  }, [isHighContrast]);

  return { isHighContrast, setHighContrast, toggleHighContrast };
};
