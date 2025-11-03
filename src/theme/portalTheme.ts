import { createTheme } from '@mui/material/styles'
import type { ThemeConfig } from '../types/portal'
// Layout classes are available but not applied via theme - use className prop on Box components
// import { layoutClasses } from './layoutClasses'

// Inject CSS custom properties for dynamic color management
const injectCSSVariables = (themeConfig: ThemeConfig) => {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', themeConfig.primaryColor);
  root.style.setProperty('--secondary-color', themeConfig.secondaryColor);
  root.style.setProperty('--background-color', themeConfig.mode === 'light' ? '#E8E3EB' : '#1F2937');
  root.style.setProperty('--text-primary', themeConfig.mode === 'light' ? '#1F2937' : '#F9FAFB');
  root.style.setProperty('--text-secondary', themeConfig.mode === 'light' ? '#6B7280' : '#9CA3AF');
  root.style.setProperty('--border-color', themeConfig.mode === 'light' ? '#F3F4F6' : '#374151');
  root.style.setProperty('--card-background', themeConfig.mode === 'light' ? '#FFFFFF' : '#374151');
  root.style.setProperty('--surface-color', themeConfig.mode === 'light' ? '#FFFFFF' : '#374151');
};

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
      main: '#10B981',
      light: '#34D399',
      dark: '#047857',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    background: {
      default: themeConfig.mode === 'light' ? '#E8E3EB' : '#1F2937',
      paper: themeConfig.mode === 'light' ? '#FFFFFF' : '#374151',
    },
    text: {
      primary: themeConfig.mode === 'light' ? '#1F2937' : '#F9FAFB',
      secondary: themeConfig.mode === 'light' ? '#6B7280' : '#9CA3AF',
    },
  },
  typography: {
    fontFamily: themeConfig.fontFamily,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.3,
      marginBottom: '0.875rem',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      marginBottom: '0.75rem',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      marginBottom: '0.625rem',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
      marginBottom: '0.5rem',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
      marginBottom: '0.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      marginBottom: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      marginBottom: '0.75rem',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  components: {
    // Card component defaults
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid var(--border-color)`,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease-in-out',
          marginBottom: '24px',
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
          padding: '20px',
          '&:last-child': {
            paddingBottom: '20px',
          },
        },
      },
    },
    // Button component defaults
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    // Chip component defaults
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
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
          paddingTop: '24px',
          paddingBottom: '24px',
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (max-width: 640px)': {
            paddingTop: '16px',
            paddingBottom: '16px',
            paddingLeft: '12px',
            paddingRight: '12px',
          },
          '@media (max-width: 480px)': {
            paddingTop: '12px',
            paddingBottom: '12px',
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
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
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
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
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
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
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