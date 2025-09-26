import { memo, type ReactNode } from 'react'
import { Card, CardContent, Box, Typography } from '@mui/material'
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
}

const DataCard = memo<DataCardProps>(({
  card,
  value,
  onClick,
  icon,
  showClickHint = true,
  children
}) => {
  const getIconComponent = (iconName: string): ReactNode => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType
    return IconComponent ? <IconComponent /> : null
  }

  const displayIcon = icon || (card.icon && getIconComponent(appConfig.theme.iconMappings[card.icon] || card.icon))

  return (
    <Card
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        ...(onClick && {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: (theme) => theme.shadows[4],
          }
        })
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box className="card-header">
          {displayIcon && (
            <Box
              className="card-icon"
              sx={{ color: `${card.color}.main` }}
            >
              {displayIcon}
            </Box>
          )}
          <Typography
            variant="h4"
            component="div"
            className="card-value"
          >
            {value}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{ fontWeight: 500, mb: 0.5 }}
        >
          {card.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {card.subtitle}
        </Typography>
        {children}
        {showClickHint && onClick && (
          <Typography
            variant="caption"
            color="primary"
            sx={{
              mt: 0.5,
              display: 'block',
              fontWeight: 500,
              opacity: 0.7,
              transition: 'opacity 0.2s ease-in-out'
            }}
          >
            Click to view details
          </Typography>
        )}
      </CardContent>
    </Card>
  )
})

DataCard.displayName = 'DataCard'

export default DataCard