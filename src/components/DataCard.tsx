import { memo, type ReactNode } from 'react'
import { Card, CardContent, Box, Typography, alpha } from '@mui/material'
import * as Icons from '@mui/icons-material'
import { appConfig } from '../data/configurableData'
import type { DashboardCard } from '../types/portal'

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
}

const DataCard = memo<DataCardProps>(({
  card,
  value,
  onClick,
  icon,
  showClickHint = true,
  children,
  trend
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
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(onClick && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.08)',
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
              sx={{
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 },
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette[card.color]?.main || theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette[card.color]?.main || theme.palette.primary.main, 0.2)} 100%)`,
                color: `${card.color}.main`,
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
              }}
            >
              {displayIcon}
            </Box>
          )}
          {trend && (
            <Box
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
              {trend.direction === 'up' ? <TrendUpIcon sx={{ fontSize: '1rem' }} /> : <TrendDownIcon sx={{ fontSize: '1rem' }} />}
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