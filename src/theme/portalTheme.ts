import { createTheme } from '@mui/material/styles'
import type { ThemeConfig } from '../types/portal'
import { getThemePreset } from './themePresets'
// Layout classes are available but not applied via theme - use className prop on Box components
// import { layoutClasses } from './layoutClasses'

/**
 * Validate theme configuration
 * Ensures required properties are present and valid
 */
const validateThemeConfig = (themeConfig: ThemeConfig): void => {
  if (!themeConfig.primaryColor || typeof themeConfig.primaryColor !== 'string') {
    throw new Error('ThemeConfig.primaryColor is required and must be a string')
  }
  if (!themeConfig.secondaryColor || typeof themeConfig.secondaryColor !== 'string') {
    throw new Error('ThemeConfig.secondaryColor is required and must be a string')
  }
  if (!themeConfig.mode || !['light', 'dark'].includes(themeConfig.mode)) {
    throw new Error('ThemeConfig.mode must be either "light" or "dark"')
  }
}

// Inject CSS custom properties for dynamic color management
const injectCSSVariables = (themeConfig: ThemeConfig) => {
  validateThemeConfig(themeConfig)

  const root = document.documentElement
  const preset = getThemePreset(themeConfig.name)
  const modeValues = themeConfig.mode === 'light' ? preset.light : preset.dark

  // Set primary and secondary colors (with optional preset overrides)
  root.style.setProperty('--primary-color', modeValues.primary || themeConfig.primaryColor)
  root.style.setProperty('--secondary-color', modeValues.secondary || themeConfig.secondaryColor)

  // Set theme-specific colors from preset
  root.style.setProperty('--accent-color', modeValues.accent)
  root.style.setProperty('--background-color', modeValues.background)
  root.style.setProperty('--surface-color', modeValues.surface)
  root.style.setProperty('--border-color', modeValues.border)
  root.style.setProperty('--card-background', modeValues.cardBackground)
  root.style.setProperty('--text-primary', modeValues.textPrimary)
  root.style.setProperty('--text-secondary', modeValues.textSecondary)
}

// Create theme based on configuration
export const createPortalTheme = (themeConfig: ThemeConfig) => {
  injectCSSVariables(themeConfig);
  return createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  palette: {
    mode: themeConfig.mode,
    primary: {
      main: themeConfig.primaryColor,
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: themeConfig.secondaryColor,
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2C5F2D',    // Forest green (Constructivism)
      light: '#4A8A4B',
      dark: '#1F4420',
    },
    warning: {
      main: '#D4A574',    // Warm tan (Constructivism)
      light: '#E0B896',
      dark: '#B88A5A',
    },
    error: {
      main: '#8B0000',    // Dark red (Constructivism)
      light: '#B22222',
      dark: '#660000',
    },
    info: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    background: {
      // Use values from theme preset for consistency
      default: getThemePreset(themeConfig.name)[themeConfig.mode].background,
      paper: getThemePreset(themeConfig.name)[themeConfig.mode].surface,
    },
    text: {
      primary: themeConfig.mode === 'light' ? '#1F2937' : '#F9FAFB',
      secondary: themeConfig.mode === 'light' ? '#6B7280' : '#9CA3AF',
    },
  },
  // Constructivism typography
  // Headers use Bebas Neue (bold, uppercase) for dramatic hierarchy
  // Body text uses Work Sans (readable, modern) for comfortable reading
  // This creates strong visual contrast while maintaining readability
  typography: {
    fontFamily: themeConfig.fontFamily,
    h1: {
      fontFamily: '"Bebas Neue", "Arial Black", sans-serif',
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      marginBottom: '1rem',
    },
    h2: {
      fontFamily: '"Bebas Neue", "Arial Black", sans-serif',
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      marginBottom: '0.875rem',
    },
    h3: {
      fontFamily: '"Bebas Neue", "Arial Black", sans-serif',
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.4,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      marginBottom: '0.75rem',
    },
    h4: {
      fontFamily: '"Work Sans", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      marginBottom: '0.625rem',
    },
    h5: {
      fontFamily: '"Work Sans", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      marginBottom: '0.5rem',
    },
    h6: {
      fontFamily: '"Work Sans", sans-serif',
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
      marginBottom: '0.5rem',
    },
    body1: {
      fontFamily: '"Work Sans", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
      marginBottom: '1rem',
    },
    body2: {
      fontFamily: '"Work Sans", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.5,
      marginBottom: '0.75rem',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,  // Constructivism: subtle rounds (was 12)
  },
  components: {
    // Card component defaults
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 4,  // Constructivism: subtle rounds (was 12)
          border: `2px solid var(--border-color)`,  // Constructivism: bolder borders (was 1px)
          boxShadow: 'none',  // Constructivism: no shadows (flat design)
          transition: 'all 0.3s ease-in-out',
          marginBottom: '12px',  // Compact spacing (was 24px)
          '&.clickable:hover, &[role="button"]:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderColor: 'var(--primary-color)',
            transform: 'translateY(-2px)',
            backgroundColor: themeConfig.mode === 'light' ? 'rgba(49, 46, 129, 0.02)' : 'rgba(49, 46, 129, 0.1)',
          },
          '&.completed': {
            opacity: 0.6,
            transition: 'opacity 0.3s ease',
          },
        },
      },
    },
    // CardContent component defaults
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '12px 16px',  // Compact padding (was 20px)
          '&:last-child': {
            paddingBottom: '12px',  // Compact padding (was 20px)
          },
        },
      },
    },
    // Button component defaults
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',  // Compact padding (was 10px 24px)
          fontSize: '0.9375rem',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          overflow: 'hidden',

          // Focus ring for accessibility
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: theme.palette.primary.main,
            outlineOffset: '2px',
          },

          // Disabled state
          '&.Mui-disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        }),

        // Size variants
        sizeSmall: {
          padding: '4px 12px',  // Compact (was 6px 16px)
          fontSize: '0.8125rem',
          fontWeight: 500,
        },
        sizeMedium: {
          padding: '8px 20px',  // Compact (was 10px 24px)
          fontSize: '0.9375rem',
        },
        sizeLarge: {
          padding: '10px 28px',  // Compact (was 14px 32px)
          fontSize: '1rem',
          fontWeight: 600,
        },

        // Contained variant (primary action)
        contained: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',

          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)',
          },

          '&:active': {
            transform: 'translateY(0px)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          },
        },

        // Contained Primary
        containedPrimary: ({ theme }) => ({
          background: theme.palette.primary.main,

          '&:hover': {
            background: theme.palette.primary.dark,
          },
        }),

        // Contained Secondary
        containedSecondary: ({ theme }) => ({
          background: theme.palette.secondary.main,

          '&:hover': {
            background: theme.palette.secondary.dark,
          },
        }),

        // Outlined variant (secondary action)
        outlined: {
          borderWidth: '2px',
          textTransform: 'uppercase',      // Constructivism
          letterSpacing: '0.08em',         // Constructivism

          '&:hover': {
            borderWidth: '2px',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            // Keep buttons outlined on hover for better readability
            // MUI will handle background color tinting based on theme
          },

          '&:active': {
            transform: 'translateY(0px)',
            boxShadow: 'none',
          },

          '&:focus-visible': {              // Constructivism: bold focus
            borderWidth: '3px',
            outline: 'none',
          },
        },

        // Outlined Primary
        outlinedPrimary: ({ theme }) => ({
          borderColor: theme.palette.primary.main,

          '&:hover': {
            borderColor: theme.palette.primary.dark,
            backgroundColor: theme.palette.mode === 'light'
              ? 'rgba(59, 130, 246, 0.04)'
              : 'rgba(59, 130, 246, 0.12)',
          },
        }),

        // Outlined Secondary
        outlinedSecondary: ({ theme }) => ({
          borderColor: theme.palette.secondary.main,

          '&:hover': {
            borderColor: theme.palette.secondary.dark,
            backgroundColor: theme.palette.mode === 'light'
              ? 'rgba(139, 92, 246, 0.04)'
              : 'rgba(139, 92, 246, 0.12)',
          },
        }),

        // Text variant (tertiary action)
        text: ({ theme }) => ({
          padding: '10px 16px',

          '&:hover': {
            transform: 'translateY(-1px)',
            backgroundColor: theme.palette.mode === 'light'
              ? 'rgba(0, 0, 0, 0.04)'
              : 'rgba(255, 255, 255, 0.08)',
          },

          '&:active': {
            transform: 'translateY(0px)',
          },
        }),

        // Text Primary
        textPrimary: ({ theme }) => ({
          '&:hover': {
            backgroundColor: theme.palette.mode === 'light'
              ? 'rgba(59, 130, 246, 0.04)'
              : 'rgba(59, 130, 246, 0.12)',
          },
        }),

        // Text Secondary
        textSecondary: ({ theme }) => ({
          '&:hover': {
            backgroundColor: theme.palette.mode === 'light'
              ? 'rgba(139, 92, 246, 0.04)'
              : 'rgba(139, 92, 246, 0.12)',
          },
        }),
      },
    },
    // IconButton component defaults
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: 'all 0.2s ease-in-out',

          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: theme.palette.mode === 'light'
              ? 'rgba(0, 0, 0, 0.04)'
              : 'rgba(255, 255, 255, 0.08)',
          },

          '&:active': {
            transform: 'scale(0.95)',
          },

          // Focus ring for accessibility
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: theme.palette.primary.main,
            outlineOffset: '2px',
          },
        }),

        // Size variants
        sizeSmall: {
          padding: '4px',
          fontSize: '1.125rem',
        },
        sizeMedium: {
          padding: '8px',
          fontSize: '1.5rem',
        },
        sizeLarge: {
          padding: '12px',
          fontSize: '1.75rem',
        },
      },
    },
    // Fab (Floating Action Button) component defaults
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease-in-out',

          '&:hover': {
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transform: 'translateY(-2px) scale(1.05)',
          },

          '&:active': {
            transform: 'translateY(0px) scale(1)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },

        primary: ({ theme }) => ({
          background: theme.palette.primary.main,

          '&:hover': {
            background: theme.palette.primary.dark,
          },
        }),

        secondary: ({ theme }) => ({
          background: theme.palette.secondary.main,

          '&:hover': {
            background: theme.palette.secondary.dark,
          },
        }),
      },
    },
    // Chip component defaults
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 2,       // Constructivism: angular (was 16)
          fontWeight: 600,       // Constructivism: bolder (was 500)
          textTransform: 'uppercase',  // Constructivism
          fontSize: '0.75rem',         // Constructivism
          letterSpacing: '0.05em',     // Constructivism
          border: '2px solid currentColor',  // Constructivism: visible borders
        },
        colorPrimary: {
          backgroundColor: '#EDE9FE',
          color: '#312E81',
        },
        colorSecondary: {
          backgroundColor: '#FEF3C7',
          color: '#D97706',
        },
        colorSuccess: {
          backgroundColor: '#D1FAE5',
          color: '#047857',
        },
        colorWarning: {
          backgroundColor: '#FEF3C7',
          color: '#D97706',
        },
        colorError: {
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
        },
        colorInfo: {
          backgroundColor: '#EDE9FE',
          color: '#7C3AED',
        },
      },
    },
    // Container component defaults
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '16px',  // Compact (was 24px)
          paddingBottom: '16px',  // Compact (was 24px)
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (max-width: 640px)': {
            paddingTop: '12px',  // Compact (was 16px)
            paddingBottom: '12px',  // Compact (was 16px)
            paddingLeft: '12px',
            paddingRight: '12px',
          },
          '@media (max-width: 480px)': {
            paddingTop: '8px',  // Compact (was 12px)
            paddingBottom: '8px',  // Compact (was 12px)
            paddingLeft: '8px',
            paddingRight: '8px',
          },
        },
      },
    },
    // Typography component defaults
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontWeight: 600,
          color: 'var(--primary-color)',
          marginBottom: '8px',
          textAlign: 'center',
          '@media (max-width: 640px)': {
            fontSize: '2rem',
            marginBottom: '6px',
          },
          '@media (max-width: 480px)': {
            fontSize: '1.75rem',
            marginBottom: '4px',
          },
        },
        h3: {
          fontWeight: 600,
          color: 'var(--primary-color)',
          marginBottom: '8px',
          textAlign: 'center',
          '@media (max-width: 640px)': {
            fontSize: '1.5rem',
            marginBottom: '6px',
          },
          '@media (max-width: 480px)': {
            fontSize: '1.25rem',
            marginBottom: '4px',
          },
        },
        h4: {
          fontWeight: 600,
          color: 'var(--primary-color)',
          marginBottom: '6px',
          textAlign: 'center',
          '@media (max-width: 640px)': {
            fontSize: '1.25rem',
            marginBottom: '4px',
          },
          '@media (max-width: 480px)': {
            fontSize: '1.125rem',
            marginBottom: '3px',
          },
        },
        h5: {
          fontWeight: 500,
          marginBottom: '12px',
          color: 'var(--text-primary)',
          textAlign: 'center',
        },
        h6: {
          fontWeight: 400,
          lineHeight: 1.6,
          maxWidth: '600px',
          margin: '0 auto 16px',
          textAlign: 'center',
          '@media (max-width: 768px)': {
            margin: '0 0 12px',
          },
        },
        body1: {
          textAlign: 'left',
        },
        body2: {
          textAlign: 'left',
        },
        subtitle1: {
          textAlign: 'left',
        },
        subtitle2: {
          textAlign: 'left',
        },
      },
    },
    // Grid component defaults
    MuiGrid: {
      styleOverrides: {
        container: {
          marginBottom: '40px',
          justifyContent: 'center',
          '&:last-child': {
            marginBottom: 0,
          },
        },
      },
    },
    // Box component for sections - commented out as MuiBox is not supported in Material-UI v6
    // Layout classes from layoutClasses.ts should be applied directly to Box components via className prop
    // Example: <Box className="flex-row spacing-top-lg">...</Box>
    /*
    MuiBox: {
      styleOverrides: {
        root: {
          '&.flex-row': layoutClasses.flexRow,
          '&.flex-row-wrap': layoutClasses.flexRowWrap,
          '&.flex-column': layoutClasses.flexColumn,
          '&.empty-state': layoutClasses.emptyState,
          '&.actions-right': layoutClasses.actionsRight,
          '&.section-spacing': layoutClasses.sectionSpacing,
          '&.spacing-sm': layoutClasses.spacingSm,
          '&.spacing-top-sm': layoutClasses.spacingTopSm,
          '&.spacing-bottom-sm': layoutClasses.spacingBottomSm,
          '&.spacing-md': layoutClasses.spacingMd,
          '&.spacing-top-md': layoutClasses.spacingTopMd,
          '&.spacing-bottom-md': layoutClasses.spacingBottomMd,
          '&.spacing-lg': layoutClasses.spacingLg,
          '&.spacing-top-lg': layoutClasses.spacingTopLg,
          '&.spacing-bottom-lg': layoutClasses.spacingBottomLg,
          '&.dashboard-section': {
            marginBottom: '48px',
            textAlign: 'center',
            '&:last-child': {
              marginBottom: 0,
            },
            '@media (max-width: 640px)': {
              marginBottom: '32px',
            },
            '@media (max-width: 480px)': {
              marginBottom: '24px',
            },
          },
          '&.header-section': {
            marginBottom: '16px',
            textAlign: 'center',
            '@media (max-width: 768px)': {
              textAlign: 'center',
              marginBottom: '12px',
            },
            '@media (max-width: 480px)': {
              marginBottom: '8px',
            },
          },
          '&.card-content-layout': {
            padding: '12px',
            height: '100%',
            transition: 'all 0.3s ease',
            '@media (max-width: 640px)': {
              padding: '10px',
            },
            '@media (max-width: 480px)': {
              padding: '8px',
            },
          },
          '&.card-header': {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '4px',
          },
          '&.card-icon': {
            fontSize: '1.75rem',
            marginRight: '8px',
          },
          '&.card-value': {
            fontWeight: 700,
            lineHeight: 1.2,
          },
        },
      },
    },
    */
    // Paper component defaults
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    // AppBar component defaults (for headers)
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    // List components
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          '&:hover': {
            backgroundColor: 'rgba(49, 46, 129, 0.04)',
          },
          '.MuiCard-root &': {
            '&:hover': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
    },
    // TextField defaults
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
    // OutlinedInput defaults
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          '&.Mui-focused': {
            backgroundColor: 'white',
            boxShadow: `0 0 0 3px ${themeConfig.primaryColor}1A`, // 10% opacity
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: themeConfig.primaryColor,
              borderWidth: '2px',
            },
          },
          '&.Mui-error': {
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
            },
          },
        },
        notchedOutline: {
          borderColor: 'rgba(0, 0, 0, 0.12)',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    // Input label defaults
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          '&.Mui-focused': {
            fontWeight: 600,
            color: themeConfig.primaryColor,
          },
          '&.Mui-error': {
            '&.Mui-focused': {
              color: '#EF4444',
            },
          },
        },
      },
    },
    // FormHelperText defaults
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 4,
          fontSize: '0.75rem',
          '&.Mui-error': {
            fontWeight: 500,
          },
        },
      },
    },
    // Select component defaults
    MuiSelect: {
      styleOverrides: {
        select: {
          '&:focus': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    // Table components
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: themeConfig.mode === 'light' ? '#f5f5f5' : '#4B5563',
        },
      },
    },
    // Dialog components
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    // LinearProgress
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },
  },
})}

// Default theme for backward compatibility
export const portalTheme = createPortalTheme({
  primaryColor: "#1976d2",
  secondaryColor: "#9c27b0",
  mode: "light",
  borderRadius: 12,
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  iconMappings: {}
})

export default createPortalTheme