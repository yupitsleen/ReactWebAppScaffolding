import { memo, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Button,
  Grid,
  alpha,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PaletteIcon from '@mui/icons-material/Palette'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

interface ColorPreset {
  id: string
  name: string
  description: string
  primaryColor: string
  secondaryColor: string
}

interface ColorPresetSelectorProps {
  open: boolean
  onClose: () => void
  currentPrimary: string
  currentSecondary: string
  onPresetSelect: (primary: string, secondary: string) => void
}

const colorPresets: ColorPreset[] = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Professional SaaS - Current default',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
  },
  {
    id: 'tech-teal',
    name: 'Tech Teal',
    description: 'Fresh & Modern',
    primaryColor: '#14B8A6',
    secondaryColor: '#F59E0B',
  },
  {
    id: 'professional-indigo',
    name: 'Professional Indigo',
    description: 'Sophisticated & Elegant',
    primaryColor: '#6366F1',
    secondaryColor: '#EC4899',
  },
  {
    id: 'emerald-green',
    name: 'Emerald Green',
    description: 'Natural & Fresh',
    primaryColor: '#10B981',
    secondaryColor: '#F59E0B',
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Creative & Bold',
    primaryColor: '#8B5CF6',
    secondaryColor: '#EF4444',
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Calm & Trustworthy',
    primaryColor: '#0EA5E9',
    secondaryColor: '#14B8A6',
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Energetic & Warm',
    primaryColor: '#F97316',
    secondaryColor: '#EF4444',
  },
  {
    id: 'rose-pink',
    name: 'Rose Pink',
    description: 'Elegant & Feminine',
    primaryColor: '#EC4899',
    secondaryColor: '#8B5CF6',
  },
]

export const ColorPresetSelector = memo(({
  open,
  onClose,
  currentPrimary,
  currentSecondary,
  onPresetSelect,
}: ColorPresetSelectorProps) => {
  const [selectedPreset, setSelectedPreset] = useState<ColorPreset | null>(null)

  const isPresetActive = (preset: ColorPreset) => {
    return preset.primaryColor.toLowerCase() === currentPrimary.toLowerCase() &&
           preset.secondaryColor.toLowerCase() === currentSecondary.toLowerCase()
  }

  const handlePresetClick = (preset: ColorPreset) => {
    setSelectedPreset(preset)
  }

  const handleApply = () => {
    if (selectedPreset) {
      onPresetSelect(selectedPreset.primaryColor, selectedPreset.secondaryColor)
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="color-preset-title"
      aria-describedby="color-preset-description"
    >
      <DialogTitle
        id="color-preset-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PaletteIcon color="primary" />
          <Typography variant="h6" component="span">
            Color Presets
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close color preset dialog"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent id="color-preset-description">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Choose a color scheme for your application. Changes are saved automatically.
        </Typography>

        <Grid container spacing={2}>
          {colorPresets.map((preset) => {
            const isActive = isPresetActive(preset)
            const isSelected = selectedPreset?.id === preset.id

            return (
              <Grid item xs={12} sm={6} md={4} key={preset.id}>
                <Button
                  onClick={() => handlePresetClick(preset)}
                  sx={{
                    width: '100%',
                    height: '100%',
                    p: 2,
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    gap: 1.5,
                    border: '2px solid',
                    borderColor: isSelected
                      ? 'primary.main'
                      : isActive
                      ? 'success.main'
                      : 'divider',
                    borderRadius: 2,
                    backgroundColor: isSelected || isActive ? alpha('#3B82F6', 0.05) : 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: isSelected ? 'primary.main' : 'primary.light',
                      backgroundColor: alpha('#3B82F6', 0.08),
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                  aria-label={`${preset.name}: ${preset.description}${isActive ? ' (currently active)' : ''}`}
                  aria-pressed={isSelected}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          backgroundColor: preset.primaryColor,
                          border: '2px solid white',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        aria-hidden="true"
                      />
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          backgroundColor: preset.secondaryColor,
                          border: '2px solid white',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        aria-hidden="true"
                      />
                    </Box>
                    {isActive && (
                      <CheckCircleIcon
                        sx={{ color: 'success.main', fontSize: '1.25rem' }}
                        aria-label="Currently active"
                      />
                    )}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                      {preset.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {preset.description}
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            )
          })}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            disabled={!selectedPreset}
          >
            Apply
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
})

ColorPresetSelector.displayName = 'ColorPresetSelector'
