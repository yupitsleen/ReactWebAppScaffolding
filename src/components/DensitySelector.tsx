import { memo } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  ViewCompact as CompactIcon,
  ViewComfy as ComfortableIcon,
  ViewStream as SpaciousIcon,
  DensityMedium as DensityIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useDensity, type LayoutDensity } from '../hooks/useLayoutDensity';

const densityOptions: Array<{
  value: LayoutDensity;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: 'compact',
    label: 'Compact',
    description: 'Maximum data density',
    icon: <CompactIcon />,
  },
  {
    value: 'comfortable',
    label: 'Comfortable',
    description: 'Balanced spacing (default)',
    icon: <ComfortableIcon />,
  },
  {
    value: 'spacious',
    label: 'Spacious',
    description: 'Extra breathing room',
    icon: <SpaciousIcon />,
  },
];

export const DensitySelector = memo(() => {
  const { density, setDensity } = useDensity();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectDensity = (newDensity: LayoutDensity) => {
    setDensity(newDensity);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Layout Density">
        <IconButton
          onClick={handleClick}
          aria-label="layout density options"
          aria-controls={open ? 'density-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ color: 'inherit' }}
        >
          <DensityIcon />
        </IconButton>
      </Tooltip>

      <Menu
        id="density-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 280,
              mt: 1,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Layout Density
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Adjust spacing to match your preference
          </Typography>
        </Box>
        <Divider />

        {densityOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleSelectDensity(option.value)}
            selected={density === option.value}
            sx={{
              py: 1.5,
              px: 2,
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{option.icon}</ListItemIcon>
            <ListItemText
              primary={option.label}
              secondary={option.description}
              primaryTypographyProps={{
                fontWeight: density === option.value ? 600 : 400,
              }}
            />
            {density === option.value && (
              <CheckIcon fontSize="small" sx={{ ml: 1, color: 'primary.main' }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});

DensitySelector.displayName = 'DensitySelector';
