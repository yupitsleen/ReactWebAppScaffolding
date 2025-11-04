import { memo, type ReactNode } from 'react'
import { Card, CardContent, Box, Typography, alpha } from '@mui/material'
import * as Icons from '@mui/icons-material'
import { appConfig } from '../data/configurableData'
import type { DashboardCard } from '../types/portal'
import Sparkline from './Sparkline'

interface DataCardProps {
  card: DashboardCard
  value: string | number
  onClick?: () => void
  icon?: ReactNode
  showClickHint?: boolean
  children?: ReactNode
  trend?: {
    direction: 'up' | 'down'
    value: string
  }
  sparklineData?: number[]
  sparklineColor?: string
}

const DataCard = memo<DataCardProps>(({
  card,
  value,
  onClick,
  icon,
  showClickHint = true,
  children,
  trend,
  sparklineData,
  sparklineColor
}) => {
  const getIconComponent = (iconName: string): ReactNode => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType
    return IconComponent ? <IconComponent /> : null
  }

  const displayIcon = icon || (card.icon && getIconComponent(appConfig.theme.iconMappings[card.icon] || card.icon))
  const TrendUpIcon = Icons.TrendingUp
  const TrendDownIcon = Icons.TrendingDown

  return (
    <Card
      component={onClick ? 'button' : 'div'}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${card.title}: ${value}. ${card.subtitle}. Click to view details.` : `${card.title}: ${value}. ${card.subtitle}`}
      onKeyDown={onClick ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: 'none',
        textAlign: 'inherit',
        ...(onClick && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.08)',
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
          },
          // Disable hover transform on mobile (prevents awkward touch behavior)
          '@media (hover: none)': {
            '&:hover': {
              transform: 'none',
              boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            },
            '&:active': {
              transform: 'scale(0.98)',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            }
          }
        })
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          {displayIcon && (
            <Box
              aria-hidden="true"
              sx={{
                width: 'var(--density-icon-size)',
                height: 'var(--density-icon-size)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette[card.color]?.main || theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette[card.color]?.main || theme.palette.primary.main, 0.2)} 100%)`,
                color: `${card.color}.main`,
                fontSize: 'calc(1.75rem * var(--density-font-scale))',
              }}
            >
              {displayIcon}
            </Box>
          )}
          {trend && (
            <Box
              role="status"
              aria-label={`Trend: ${trend.direction === 'up' ? 'increasing' : 'decreasing'} by ${trend.value}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: trend.direction === 'up' ? alpha('#10B981', 0.1) : alpha('#EF4444', 0.1),
                color: trend.direction === 'up' ? '#047857' : '#DC2626',
              }}
            >
              {trend.direction === 'up' ? <TrendUpIcon sx={{ fontSize: '1rem' }} aria-hidden="true" /> : <TrendDownIcon sx={{ fontSize: '1rem' }} aria-hidden="true" />}
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {trend.value}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              color: 'text.primary',
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              color: 'text.primary',
            }}
          >
            {card.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            {card.subtitle}
          </Typography>
        </Box>

        {children}

        {/* Sparkline visualization */}
        {sparklineData && sparklineData.length > 0 && (
          <Box sx={{ mt: 2, mb: 1 }}>
            <Sparkline
              data={sparklineData}
              color={sparklineColor}
              height={32}
              showTrend={false}
            />
          </Box>
        )}

        {showClickHint && onClick && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="caption"
              color="primary"
              sx={{
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                opacity: 0.8,
                transition: 'opacity 0.2s ease-in-out',
                '&:hover': {
                  opacity: 1,
                }
              }}
            >
              View details
              <Icons.ArrowForward sx={{ fontSize: '0.875rem' }} />
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
})

DataCard.displayName = 'DataCard'

export default DataCard