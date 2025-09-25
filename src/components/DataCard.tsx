import { memo, type ReactNode } from 'react'
import { Card, CardContent, Box, Typography } from '@mui/material'
import * as Icons from '@mui/icons-material'
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
  const iconMap: Record<string, ReactNode> = {
    AssignmentTurnedIn: <Icons.AssignmentTurnedIn />,
    Payment: <Icons.Payment />,
    Description: <Icons.Description />,
    Forum: <Icons.Forum />,
    Warning: <Icons.Warning />,
    CheckCircle: <Icons.CheckCircle />,
  }

  const displayIcon = icon || (card.icon && iconMap[card.icon as keyof typeof iconMap])

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