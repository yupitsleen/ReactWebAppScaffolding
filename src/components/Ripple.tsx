import { useState, useCallback, memo } from 'react'
import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'

interface RippleProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  disabled?: boolean
  sx?: SxProps<Theme>
  className?: string
}

interface RippleType {
  x: number
  y: number
  size: number
  id: number
}

const Ripple = memo(({ children, onClick, disabled, sx, className }: RippleProps) => {
  const [ripples, setRipples] = useState<RippleType[]>([])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return

    const rect = e.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const newRipple: RippleType = {
      x,
      y,
      size,
      id: Date.now()
    }

    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)

    onClick?.(e)
  }, [disabled, onClick])

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...sx
      }}
      className={className}
    >
      {children}
      {ripples.map(ripple => (
        <Box
          key={ripple.id}
          sx={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            borderRadius: '50%',
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(0, 0, 0, 0.2)',
            transform: 'scale(0)',
            animation: 'ripple 600ms ease-out',
            pointerEvents: 'none',
            '@keyframes ripple': {
              to: {
                transform: 'scale(4)',
                opacity: 0
              }
            }
          }}
        />
      ))}
    </Box>
  )
})

Ripple.displayName = 'Ripple'

export default Ripple
