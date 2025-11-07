import { memo } from 'react'
import { useTheme as useMuiTheme } from '@mui/material/styles'

/**
 * Stepanova-inspired geometric pattern background
 * Recreates the zigzag textile pattern from Varvara Stepanova's 1920s designs
 * Rendered as SVG for perfect scaling and tiny file size
 * Adapts colors for light/dark mode
 */
const StepanovaPattern = memo(() => {
  const theme = useMuiTheme()
  const isDark = theme.palette.mode === 'dark'

  // Color configuration based on theme
  const colors = isDark ? {
    background: '#E0B896',  // Lighter tan for dark mode
    zigzag: '#B22222',      // Red zigzags
    outline: '#FAF7F2',     // Cream outlines
    bgOpacity: 0.25,
    zigzagOpacity: 0.35,
    outlineOpacity: 0.40,
  } : {
    background: '#D4A574',  // Warm tan
    zigzag: '#8B0000',      // Dark red zigzags
    outline: '#2C5F2D',     // Forest green outlines
    bgOpacity: 0.30,
    zigzagOpacity: 0.40,
    outlineOpacity: 0.45,
  }

  return (
    <svg
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Define the repeating pattern tile */}
        <pattern
          id="stepanova-pattern"
          x="0"
          y="0"
          width="120"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          {/* Base color background */}
          <rect width="120" height="80" fill={colors.background} opacity={colors.bgOpacity} />

          {/* Zigzag stripes */}
          <polygon
            points="0,40 30,20 60,40 30,60"
            fill={colors.zigzag}
            opacity={colors.zigzagOpacity}
          />
          <polygon
            points="60,40 90,20 120,40 90,60"
            fill={colors.zigzag}
            opacity={colors.zigzagOpacity}
          />

          {/* Outline stripes */}
          <polyline
            points="0,40 30,20 60,40 90,20 120,40"
            fill="none"
            stroke={colors.outline}
            strokeWidth="2"
            opacity={colors.outlineOpacity}
          />
          <polyline
            points="0,40 30,60 60,40 90,60 120,40"
            fill="none"
            stroke={colors.outline}
            strokeWidth="2"
            opacity={colors.outlineOpacity}
          />
        </pattern>
      </defs>

      {/* Apply the pattern to fill the entire viewport */}
      <rect width="100%" height="100%" fill="url(#stepanova-pattern)" />
    </svg>
  )
})

StepanovaPattern.displayName = 'StepanovaPattern'

export default StepanovaPattern
