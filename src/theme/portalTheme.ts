import { createTheme } from '@mui/material/styles'
import type { ThemeConfig } from '../types/portal'

// Create theme based on configuration
export const createPortalTheme = (themeConfig: ThemeConfig) => createTheme({
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
      default: '#FAFAF9',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
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
    borderRadius: themeConfig.borderRadius,
  },
  components: {
    // Card component defaults
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: themeConfig.borderRadius,
          border: '1px solid #F3F4F6',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(107, 70, 193, 0.15)',
            transform: 'translateY(-2px)',
            borderColor: '#E5E7EB',
          },
        },
      },
    },
    // CardContent component defaults
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
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
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    // Chip component defaults
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: '#EDE9FE',
          color: '#6B46C1',
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
          paddingTop: '32px',
          paddingBottom: '32px',
          '@media (max-width: 768px)': {
            paddingTop: '16px',
            paddingBottom: '16px',
          },
        },
      },
    },
    // Typography component defaults
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontWeight: 600,
          background: 'linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px',
        },
        h3: {
          fontWeight: 600,
          background: 'linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px',
        },
        h4: {
          fontWeight: 600,
          background: 'linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
        },
        h5: {
          fontWeight: 500,
          marginBottom: '24px',
          color: '#1F2937',
        },
        h6: {
          fontWeight: 400,
          lineHeight: 1.6,
          maxWidth: '600px',
          margin: '0 auto 32px',
          '@media (max-width: 768px)': {
            textAlign: 'left',
            margin: '0 0 24px',
          },
        },
      },
    },
    // Grid component defaults
    MuiGrid: {
      styleOverrides: {
        container: {
          marginBottom: '48px',
          '&:last-child': {
            marginBottom: 0,
          },
        },
      },
    },
    // Box component for sections
    MuiBox: {
      styleOverrides: {
        root: {
          '&.dashboard-section': {
            marginBottom: '48px',
            '&:last-child': {
              marginBottom: 0,
            },
          },
          '&.header-section': {
            marginBottom: '48px',
            textAlign: 'center',
            '@media (max-width: 768px)': {
              textAlign: 'left',
              marginBottom: '32px',
            },
          },
          '&.card-content-layout': {
            padding: '24px',
            height: '100%',
            transition: 'all 0.3s ease',
          },
          '&.card-header': {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '16px',
          },
          '&.card-icon': {
            fontSize: '2rem',
            marginRight: '12px',
          },
          '&.card-value': {
            fontWeight: 700,
            lineHeight: 1.2,
          },
        },
      },
    },
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
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
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
          backgroundColor: '#f5f5f5',
        },
      },
    },
    // Dialog components
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
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
})

// Default theme for backward compatibility
export const portalTheme = createPortalTheme({
  primaryColor: "#1976d2",
  secondaryColor: "#9c27b0",
  mode: "light",
  borderRadius: 12,
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
})

export default createPortalTheme