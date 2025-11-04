import { Box, Skeleton, Card, CardContent } from '@mui/material'

export type SkeletonVariant = 'card' | 'table' | 'text' | 'avatar' | 'list'

interface SkeletonLoaderProps {
  variant?: SkeletonVariant
  count?: number
  height?: number | string
  width?: number | string
  animate?: boolean
}

export const SkeletonLoader = ({
  variant = 'text',
  count = 1,
  height,
  width,
  animate = true,
}: SkeletonLoaderProps) => {
  const animation = animate ? 'wave' : false

  // Card skeleton - for DataCard components
  if (variant === 'card') {
    return (
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} sx={{ height: height || 140 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Skeleton animation={animation} variant="circular" width={56} height={56} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton animation={animation} variant="text" width="60%" height={24} />
                  <Skeleton animation={animation} variant="text" width="40%" height={20} />
                </Box>
              </Box>
              <Skeleton animation={animation} variant="text" width="80%" height={32} sx={{ mb: 1 }} />
            </CardContent>
          </Card>
        ))}
      </Box>
    )
  }

  // Table skeleton - for DataTable components
  if (variant === 'table') {
    return (
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: '2px solid rgba(0, 0, 0, 0.12)' }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} animation={animation} variant="text" width="25%" height={24} />
          ))}
        </Box>
        {/* Rows */}
        {Array.from({ length: count }).map((_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: 'flex',
              gap: 2,
              py: 2,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              backgroundColor: rowIndex % 2 === 1 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
            }}
          >
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <Skeleton key={colIndex} animation={animation} variant="text" width="25%" height={20} />
            ))}
          </Box>
        ))}
      </Box>
    )
  }

  // List skeleton - for list items
  if (variant === 'list') {
    return (
      <Box>
        {Array.from({ length: count }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 2,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <Skeleton animation={animation} variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton animation={animation} variant="text" width="70%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton animation={animation} variant="text" width="50%" height={16} />
            </Box>
          </Box>
        ))}
      </Box>
    )
  }

  // Avatar skeleton
  if (variant === 'avatar') {
    return (
      <Box sx={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton
            key={index}
            animation={animation}
            variant="circular"
            width={width || 40}
            height={height || 40}
          />
        ))}
      </Box>
    )
  }

  // Text skeleton (default)
  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          animation={animation}
          variant="text"
          width={width || '100%'}
          height={height || 20}
          sx={{ mb: index < count - 1 ? 1 : 0 }}
        />
      ))}
    </Box>
  )
}

export default SkeletonLoader
