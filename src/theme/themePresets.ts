/**
 * Theme Presets
 *
 * Defines CSS variable mappings for each theme to eliminate conditional logic
 * in the theme creation process. Each preset specifies light and dark mode values.
 */

export interface ThemePreset {
  light: {
    accent: string
    background: string
    surface: string
    border: string
    cardBackground: string
    textPrimary: string
    textSecondary: string
    primary?: string  // Optional override for dark mode
    secondary?: string
  }
  dark: {
    accent: string
    background: string
    surface: string
    border: string
    cardBackground: string
    textPrimary: string
    textSecondary: string
    primary?: string  // Optional override for dark mode
    secondary?: string
  }
}

/**
 * Constructivism Theme Preset
 * Inspired by 1920s Russian avant-garde art (Stepanova, Popova, Exter)
 * - Warm, earthy colors in light mode
 * - Deep, rich tones in dark mode
 * - Bold contrasts and geometric emphasis
 */
export const constructivismPreset: ThemePreset = {
  light: {
    accent: '#2C5F2D',        // Forest green
    background: '#FAF7F2',    // Warm off-white
    surface: '#FFFFFF',       // Pure white
    border: '#E0E0E0',        // Light gray
    cardBackground: '#FFFFFF',
    textPrimary: '#1A1A1A',   // Near-black
    textSecondary: '#4A4A4A', // Medium gray
  },
  dark: {
    accent: '#4A8A4B',        // Lighter forest green for contrast
    background: '#1A1212',    // Deep burgundy-black
    surface: '#2A2020',       // Dark burgundy-gray
    border: '#4A4040',        // Medium burgundy-gray
    cardBackground: '#2A2020',
    textPrimary: '#FAF7F2',   // Warm off-white
    textSecondary: '#D4A574', // Warm tan
    primary: '#B22222',       // Brighter red for visibility
    secondary: '#E0B896',     // Lighter tan for visibility
  },
}

/**
 * Basic Theme Preset
 * Modern, clean design with cool colors
 * - Purple/blue tones
 * - Rounded corners
 * - Standard Material Design approach
 */
export const basicPreset: ThemePreset = {
  light: {
    accent: '#8B5CF6',        // Purple accent
    background: '#E8E3EB',    // Light purple-gray
    surface: '#FFFFFF',       // Pure white
    border: '#E0E0E0',        // Light gray
    cardBackground: '#FFFFFF',
    textPrimary: '#1F2937',   // Dark gray
    textSecondary: '#6B7280', // Medium gray
  },
  dark: {
    accent: '#A78BFA',        // Lighter purple for contrast
    background: '#1F2937',    // Dark gray
    surface: '#374151',       // Medium-dark gray
    border: '#374151',        // Medium-dark gray
    cardBackground: '#374151',
    textPrimary: '#F9FAFB',   // Almost white
    textSecondary: '#9CA3AF', // Light gray
  },
}

/**
 * Theme Preset Registry
 * Maps theme names to their preset configurations
 *
 * To add a new theme:
 * 1. Create a preset object following the ThemePreset interface
 * 2. Add it to this registry with a unique key
 * 3. Update ThemeConfig.name type in portal.ts (optional for TypeScript autocomplete)
 */
export const themePresets: Record<string, ThemePreset> = {
  constructivism: constructivismPreset,
  basic: basicPreset,
}

/**
 * Get the appropriate preset for a theme name
 * Falls back to basic preset if theme name is not found
 */
export const getThemePreset = (themeName?: string): ThemePreset => {
  if (!themeName) return basicPreset
  return themePresets[themeName] || basicPreset
}
