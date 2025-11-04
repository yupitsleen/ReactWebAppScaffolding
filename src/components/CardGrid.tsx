import { memo } from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { appConfig } from '../data/configurableData'
import FieldRenderer from './FieldRenderer'

interface CardGridProps {
  data: any[]
  entityType: string
  onCardClick?: (item: any) => void
}

export const CardGrid = memo(({ data, entityType, onCardClick }: CardGridProps) => {
  const { fieldConfig, statusConfig } = appConfig
  const entityFieldConfig = fieldConfig[entityType]

  if (!entityFieldConfig) {
    return (
      <Typography color="text.secondary">
        Field configuration not found for entity type: {entityType}
      </Typography>
    )
  }

  if (data.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          color: 'text.secondary'
        }}
      >
        <Typography variant="h6" gutterBottom>
          No items found
        </Typography>
        <Typography variant="body2">
          Try adjusting your filters or create a new item
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 3
      }}
    >
      {data.map((item) => (
        <Box key={item.id}>
          <Card
            sx={{
              height: '100%',
              cursor: onCardClick ? 'pointer' : 'default',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': onCardClick
                ? {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                : undefined
            }}
            onClick={() => onCardClick?.(item)}
          >
            <CardContent>
              {/* Primary field */}
              <Typography variant="h6" component="div" gutterBottom>
                {item[entityFieldConfig.primary]}
              </Typography>

              {/* Secondary fields as chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {entityFieldConfig.secondary
                  .filter((field) => !entityFieldConfig.hidden?.includes(field))
                  .map((field) => {
                    const value = item[field]
                    if (value === undefined || value === null) return null

                    return (
                      <FieldRenderer
                        key={field}
                        field={field}
                        value={value}
                        entity={item}
                        entityType={entityType}
                        statusConfig={statusConfig}
                        variant="chip"
                      />
                    )
                  })}
              </Box>

              {/* Additional metadata */}
              {item.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {item.description}
                </Typography>
              )}

              {item.createdAt && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Created {new Date(item.createdAt).toLocaleDateString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  )
})

CardGrid.displayName = 'CardGrid'
