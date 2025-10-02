import { memo, useMemo, useState } from 'react'
import { Typography, Box, Paper, Chip, Tooltip } from '@mui/material'
import { Circle as CircleIcon } from '@mui/icons-material'
import PageLayout from '../components/PageLayout'
import FieldRenderer from '../components/FieldRenderer'
import { usePageLoading } from '../hooks/usePageLoading'
import { useData } from '../context/ContextProvider'
import { appConfig } from '../data/configurableData'
import type { TodoItem } from '../types/portal'

interface TimelinePoint {
  date: Date
  dateLabel: string
  tasks: TodoItem[]
  position: number // 0-100 percentage on timeline
}

const Timeline = memo(() => {
  const [loading] = usePageLoading(false)
  const { todos } = useData()
  const { statusConfig } = appConfig
  const [selectedPoint, setSelectedPoint] = useState<TimelinePoint | null>(null)

  // Create timeline points
  const timelineData = useMemo(() => {
    const tasksWithDates = todos.filter(todo => todo.dueDate)

    if (tasksWithDates.length === 0) {
      return { points: [], minDate: null, maxDate: null }
    }

    const dates = tasksWithDates.map(t => new Date(t.dueDate).getTime())
    const minDate = new Date(Math.min(...dates))
    const maxDate = new Date(Math.max(...dates))
    const range = maxDate.getTime() - minDate.getTime()

    // Group tasks by date
    const pointsMap = new Map<string, TimelinePoint>()

    tasksWithDates.forEach(task => {
      const date = new Date(task.dueDate)
      const dateKey = date.toDateString()
      const position = range > 0 ? ((date.getTime() - minDate.getTime()) / range) * 100 : 50

      if (!pointsMap.has(dateKey)) {
        pointsMap.set(dateKey, {
          date,
          dateLabel: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          tasks: [],
          position
        })
      }

      pointsMap.get(dateKey)!.tasks.push(task)
    })

    return {
      points: Array.from(pointsMap.values()).sort((a, b) => a.date.getTime() - b.date.getTime()),
      minDate,
      maxDate
    }
  }, [todos])

  const getPointColor = (tasks: TodoItem[]): string => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const pointDate = new Date(tasks[0].dueDate)
    pointDate.setHours(0, 0, 0, 0)

    const hasIncomplete = tasks.some(t => t.status !== 'completed')

    if (pointDate < today && hasIncomplete) return '#ef4444' // Overdue - red
    if (pointDate.getTime() === today.getTime() && hasIncomplete) return '#f59e0b' // Today - yellow
    if (!hasIncomplete) return '#10b981' // All completed - green
    return '#3b82f6' // Upcoming - blue
  }

  const getPointSize = (tasks: TodoItem[]): number => {
    return Math.min(12 + tasks.length * 2, 24)
  }

  if (timelineData.points.length === 0) {
    return (
      <PageLayout pageId="timeline" loading={loading}>
        <Box className="spacing-top-lg">
          <Box className="empty-state">
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks with due dates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add due dates to your tasks to see them on the timeline.
            </Typography>
          </Box>
        </Box>
      </PageLayout>
    )
  }

  return (
    <PageLayout pageId="timeline" loading={loading}>
      <Box className="spacing-top-lg">
        {/* Timeline Visualization */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Task Timeline
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Hover over points to see task details. Click to keep details visible.
          </Typography>

          {/* Timeline container */}
          <Box sx={{ position: 'relative', height: 120, mb: 2 }}>
            {/* Timeline line */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: 'divider',
                transform: 'translateY(-50%)'
              }}
            />

            {/* Start marker */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'text.secondary'
              }}
            />

            {/* End marker */}
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translate(50%, -50%)',
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'text.secondary'
              }}
            />

            {/* Timeline points */}
            {timelineData.points.map((point, index) => {
              const size = getPointSize(point.tasks)
              const color = getPointColor(point.tasks)

              return (
                <Tooltip
                  key={index}
                  title={
                    <Box sx={{ p: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {point.dateLabel}
                      </Typography>
                      <Typography variant="caption">
                        {point.tasks.length} task{point.tasks.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  }
                  arrow
                >
                  <Box
                    onClick={() => setSelectedPoint(selectedPoint === point ? null : point)}
                    sx={{
                      position: 'absolute',
                      left: `${point.position}%`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      backgroundColor: color,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      zIndex: selectedPoint === point ? 10 : 5,
                      border: selectedPoint === point ? '3px solid white' : 'none',
                      boxShadow: selectedPoint === point
                        ? '0 4px 12px rgba(0,0,0,0.3)'
                        : '0 2px 4px rgba(0,0,0,0.2)',
                      '&:hover': {
                        transform: 'translate(-50%, -50%) scale(1.2)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        zIndex: 10
                      }
                    }}
                  />
                </Tooltip>
              )
            })}

            {/* Date labels at start and end */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                position: 'absolute',
                bottom: -24,
                left: 0,
                transform: 'translateX(-50%)'
              }}
            >
              {timelineData.minDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                position: 'absolute',
                bottom: -24,
                right: 0,
                transform: 'translateX(50%)'
              }}
            >
              {timelineData.maxDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Typography>
          </Box>

          {/* Legend */}
          <Box className="flex-row-wrap" sx={{ gap: 2, mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box className="flex-row" sx={{ gap: 0.5 }}>
              <CircleIcon sx={{ fontSize: 16, color: '#ef4444' }} />
              <Typography variant="caption">Overdue</Typography>
            </Box>
            <Box className="flex-row" sx={{ gap: 0.5 }}>
              <CircleIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
              <Typography variant="caption">Today</Typography>
            </Box>
            <Box className="flex-row" sx={{ gap: 0.5 }}>
              <CircleIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
              <Typography variant="caption">Upcoming</Typography>
            </Box>
            <Box className="flex-row" sx={{ gap: 0.5 }}>
              <CircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
              <Typography variant="caption">Completed</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              Point size indicates number of tasks
            </Typography>
          </Box>
        </Paper>

        {/* Selected point details */}
        {selectedPoint && (
          <Paper sx={{ p: 3 }}>
            <Box className="flex-row" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ flex: 1 }}>
                {selectedPoint.dateLabel}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedPoint.tasks.length} task{selectedPoint.tasks.length !== 1 ? 's' : ''}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedPoint.tasks.map(task => {
                const isCompleted = task.status === 'completed'

                return (
                  <Paper
                    key={task.id}
                    variant="outlined"
                    sx={{
                      p: 2,
                      opacity: isCompleted ? 0.6 : 1,
                      backgroundColor: isCompleted ? 'action.hover' : 'background.paper'
                    }}
                  >
                    <Box className="flex-row-wrap" sx={{ gap: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 500,
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            color: isCompleted ? 'text.disabled' : 'text.primary'
                          }}
                        >
                          {task.title}
                        </Typography>
                        {task.description && (
                          <Typography
                            variant="body2"
                            color={isCompleted ? 'text.disabled' : 'text.secondary'}
                            sx={{
                              textDecoration: isCompleted ? 'line-through' : 'none'
                            }}
                          >
                            {task.description}
                          </Typography>
                        )}
                      </Box>

                      <Box className="flex-row-wrap" sx={{ gap: 1 }}>
                        <FieldRenderer
                          field="priority"
                          value={task.priority}
                          entity={task}
                          statusConfig={statusConfig}
                          variant="chip"
                          isCompleted={isCompleted}
                        />
                        <FieldRenderer
                          field="status"
                          value={task.status}
                          entity={task}
                          statusConfig={statusConfig}
                          variant="chip"
                          isCompleted={isCompleted}
                        />
                        {task.assignedTo && (
                          <Chip
                            label={task.assignedTo}
                            size="small"
                            variant="outlined"
                            sx={{ opacity: isCompleted ? 0.7 : 1 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Paper>
                )
              })}
            </Box>
          </Paper>
        )}
      </Box>
    </PageLayout>
  )
})

Timeline.displayName = 'Timeline'

export default Timeline
