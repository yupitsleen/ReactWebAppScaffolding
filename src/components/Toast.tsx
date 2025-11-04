import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Alert, AlertTitle, Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import type { Notification } from '../context/NotificationContext'
import { useNotifications } from '../context/NotificationContext'

interface ToastProps {
  notification: Notification
}

const Toast = memo(({ notification }: ToastProps) => {
  const { removeNotification } = useNotifications()

  const iconMap = {
    success: CheckCircleIcon,
    error: ErrorIcon,
    info: InfoIcon,
    warning: WarningIcon,
  }

  const Icon = iconMap[notification.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 1,
      }}
      style={{ marginBottom: 12 }}
    >
      <Alert
        severity={notification.type}
        icon={<Icon />}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => removeNotification(notification.id)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          minWidth: 320,
          maxWidth: 500,
          backdropFilter: 'blur(10px)',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(18, 18, 18, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <AlertTitle sx={{ fontWeight: 600 }}>{notification.title}</AlertTitle>
        {notification.message}
      </Alert>
    </motion.div>
  )
})

Toast.displayName = 'Toast'

export const ToastContainer = memo(() => {
  const { notifications } = useNotifications()

  // Only show toasts with autoHide (transient notifications)
  const toasts = notifications.filter(n => n.autoHide !== false)

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80, // Below header
        right: 24,
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((notification) => (
          <Box
            key={notification.id}
            sx={{ pointerEvents: 'auto' }}
          >
            <Toast notification={notification} />
          </Box>
        ))}
      </AnimatePresence>
    </Box>
  )
})

ToastContainer.displayName = 'ToastContainer'

export default Toast
