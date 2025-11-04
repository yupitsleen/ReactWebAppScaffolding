import { memo, useState, useEffect, useRef, useMemo } from 'react';
import {
  Dialog,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Task as TaskIcon,
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  Forum as ForumIcon,
  TableChart as TableIcon,
  Timeline as TimelineIcon,
  ContactMail as ContactIcon,
  Settings as SettingsIcon,
  Brightness4 as ThemeIcon,
  Palette as PaletteIcon,
  Contrast as ContrastIcon,
  DensityMedium as DensityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme as useAppTheme } from '../context/ContextProvider';
import { useHighContrast } from '../hooks/useHighContrast';
import { appConfig } from '../data/configurableData';

interface Command {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  icon: React.ReactNode;
  action: () => void;
  category: 'navigation' | 'settings' | 'actions';
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export const CommandPalette = memo<CommandPaletteProps>(({ open, onClose }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useAppTheme();
  const { toggleHighContrast } = useHighContrast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Icon mapping for navigation
  const iconMap: Record<string, React.ReactNode> = {
    home: <HomeIcon />,
    tasks: <TaskIcon />,
    payments: <PaymentIcon />,
    documents: <DescriptionIcon />,
    discussions: <ForumIcon />,
    table: <TableIcon />,
    timeline: <TimelineIcon />,
    contact: <ContactIcon />,
  };

  // Generate commands
  const commands = useMemo<Command[]>(() => {
    const navCommands: Command[] = appConfig.navigation
      .filter(nav => nav.enabled)
      .map(nav => ({
        id: `nav-${nav.id}`,
        label: `Go to ${nav.label}`,
        description: `Navigate to ${nav.label} page`,
        keywords: [nav.label.toLowerCase(), nav.path, 'navigate', 'goto'],
        icon: iconMap[nav.id] || <HomeIcon />,
        action: () => {
          navigate(nav.path);
          onClose();
        },
        category: 'navigation' as const,
      }));

    const settingsCommands: Command[] = [
      {
        id: 'toggle-theme',
        label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
        description: 'Toggle between light and dark theme',
        keywords: ['theme', 'dark', 'light', 'mode', 'appearance'],
        icon: <ThemeIcon />,
        action: () => {
          toggleTheme();
          onClose();
        },
        category: 'settings',
      },
      {
        id: 'toggle-contrast',
        label: 'Toggle High Contrast Mode',
        description: 'Enable/disable high contrast accessibility mode',
        keywords: ['contrast', 'accessibility', 'a11y', 'wcag', 'vision'],
        icon: <ContrastIcon />,
        action: () => {
          toggleHighContrast();
          onClose();
        },
        category: 'settings',
      },
      {
        id: 'change-colors',
        label: 'Change Color Scheme',
        description: 'Choose a different color preset',
        keywords: ['color', 'palette', 'theme', 'customize'],
        icon: <PaletteIcon />,
        action: () => {
          onClose();
          // Trigger color preset dialog (you can add this callback as a prop)
        },
        category: 'settings',
      },
      {
        id: 'change-density',
        label: 'Adjust Layout Density',
        description: 'Change spacing (compact/comfortable/spacious)',
        keywords: ['density', 'spacing', 'compact', 'comfortable', 'spacious', 'layout'],
        icon: <DensityIcon />,
        action: () => {
          onClose();
          // Trigger density selector (you can add this callback as a prop)
        },
        category: 'settings',
      },
      {
        id: 'my-account',
        label: 'My Account',
        description: 'View and edit account settings',
        keywords: ['account', 'profile', 'settings', 'user'],
        icon: <SettingsIcon />,
        action: () => {
          navigate('/my-account');
          onClose();
        },
        category: 'settings',
      },
    ];

    return [...navCommands, ...settingsCommands];
  }, [navigate, onClose, theme, toggleTheme, toggleHighContrast]);

  // Filter commands based on search query
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) {
      return commands;
    }

    const query = searchQuery.toLowerCase();
    return commands.filter(cmd => {
      const labelMatch = cmd.label.toLowerCase().includes(query);
      const descMatch = cmd.description?.toLowerCase().includes(query);
      const keywordMatch = cmd.keywords?.some(kw => kw.includes(query));
      return labelMatch || descMatch || keywordMatch;
    });
  }, [searchQuery, commands]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSearchQuery('');
      setSelectedIndex(0);
      // Focus search input after a short delay to ensure dialog is mounted
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredCommands, selectedIndex]);

  // Ensure selected index is visible
  useEffect(() => {
    setSelectedIndex(prev => Math.min(prev, filteredCommands.length - 1));
  }, [filteredCommands]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          position: 'fixed',
          top: '15%',
          m: 0,
          maxHeight: '70vh',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <TextField
          inputRef={searchInputRef}
          fullWidth
          placeholder="Type a command or search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '1.1rem',
            },
          }}
          autoComplete="off"
        />
      </Box>

      <Box sx={{ px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          {filteredCommands.length} {filteredCommands.length === 1 ? 'command' : 'commands'} available
        </Typography>
      </Box>

      <List
        sx={{
          maxHeight: '50vh',
          overflow: 'auto',
          p: 1,
        }}
      >
        {filteredCommands.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No commands found for "{searchQuery}"
            </Typography>
          </Box>
        ) : (
          filteredCommands.map((command, index) => (
            <ListItem
              key={command.id}
              disablePadding
              sx={{ mb: 0.5 }}
            >
              <ListItemButton
                selected={index === selectedIndex}
                onClick={command.action}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    '&:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.18),
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {command.icon}
                </ListItemIcon>
                <ListItemText
                  primary={command.label}
                  secondary={command.description}
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                />
                <Chip
                  label={command.category}
                  size="small"
                  sx={{
                    ml: 1,
                    textTransform: 'capitalize',
                    fontSize: '0.65rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>

      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Chip label="↑↓" size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
          Navigate
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Chip label="Enter" size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
          Select
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Chip label="Esc" size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
          Close
        </Typography>
      </Box>
    </Dialog>
  );
});

CommandPalette.displayName = 'CommandPalette';
