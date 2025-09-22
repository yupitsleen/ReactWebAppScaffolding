// Utility for dynamic color management
export const setThemeColor = (colorName: string, colorValue: string) => {
  document.documentElement.style.setProperty(`--${colorName}`, colorValue);
};

export const getThemeColor = (colorName: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${colorName}`);
};

// Quick color presets for testing
export const applyColorPreset = (preset: 'dark-purple' | 'blue' | 'green' | 'red') => {
  switch (preset) {
    case 'dark-purple':
      setThemeColor('primary-color', '#312E81');
      setThemeColor('secondary-color', '#F59E0B');
      break;
    case 'blue':
      setThemeColor('primary-color', '#1976d2');
      setThemeColor('secondary-color', '#dc004e');
      break;
    case 'green':
      setThemeColor('primary-color', '#2e7d32');
      setThemeColor('secondary-color', '#ed6c02');
      break;
    case 'red':
      setThemeColor('primary-color', '#d32f2f');
      setThemeColor('secondary-color', '#1976d2');
      break;
  }
};

// Make available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).setThemeColor = setThemeColor;
  (window as any).applyColorPreset = applyColorPreset;
  (window as any).getThemeColor = getThemeColor;
}