import { memo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardIcon from '@mui/icons-material/Keyboard'
import { defaultShortcuts } from '../hooks/useKeyboardShortcuts'

interface KeyboardShortcutsDialogProps {
  open: boolean
  onClose: () => void
}

export const KeyboardShortcutsDialog = memo(({ open, onClose }: KeyboardShortcutsDialogProps) => {
  const renderShortcutKey = (keys: string) => {
    return keys.split('+').map((key, index, array) => (
      <Box key={key} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
        <Chip
          label={key}
          size="small"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 600,
            bgcolor: 'action.selected',
            minWidth: '40px',
          }}
        />
        {index < array.length - 1 && <Typography variant="body2">+</Typography>}
      </Box>
    ))
  }

  const navigationShortcuts = [
    defaultShortcuts.home,
    defaultShortcuts.tasks,
    defaultShortcuts.discussions,
    defaultShortcuts.documents,
    defaultShortcuts.payments,
    defaultShortcuts.timeline,
  ]

  const generalShortcuts = [
    defaultShortcuts.escape,
    { keys: '?', description: 'Show keyboard shortcuts' },
    { keys: 'Tab', description: 'Navigate between elements' },
    { keys: 'Shift+Tab', description: 'Navigate backwards' },
    { keys: 'Enter', description: 'Activate focused element' },
    { keys: 'Space', description: 'Toggle checkboxes/buttons' },
  ]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="keyboard-shortcuts-title"
      aria-describedby="keyboard-shortcuts-description"
    >
      <DialogTitle
        id="keyboard-shortcuts-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyboardIcon color="primary" />
          <Typography variant="h6" component="span">
            Keyboard Shortcuts
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close keyboard shortcuts dialog"
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

      <DialogContent id="keyboard-shortcuts-description">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Navigation Shortcuts */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {navigationShortcuts.map((shortcut) => (
                <Box
                  key={shortcut.keys}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {shortcut.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {renderShortcutKey(shortcut.keys)}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider />

          {/* General Shortcuts */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              General
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {generalShortcuts.map((shortcut) => (
                <Box
                  key={shortcut.keys}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {shortcut.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {renderShortcutKey(shortcut.keys)}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider />

          {/* Help Text */}
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            Press <strong>?</strong> anywhere to open this dialog
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
})

KeyboardShortcutsDialog.displayName = 'KeyboardShortcutsDialog'
