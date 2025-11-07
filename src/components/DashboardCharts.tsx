import { memo, useMemo } from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { TodoItem } from '../types/portal';

interface DashboardChartsProps {
  todos: TodoItem[];
}

const DashboardCharts = memo(({ todos }: DashboardChartsProps) => {
  const theme = useTheme();

  // Generate activity data (last 7 days)
  const activityData = useMemo(() => {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayTodos = todos.filter(todo => {
        const todoDate = new Date(todo.createdAt || todo.dueDate);
        return todoDate.toDateString() === date.toDateString();
      });

      const completed = dayTodos.filter(t => t.status === 'completed').length;
      const inProgress = dayTodos.filter(t => t.status === 'in-progress').length;
      const pending = dayTodos.filter(t => t.status === 'pending').length;

      days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed,
        inProgress,
        pending,
        total: completed + inProgress + pending
      });
    }

    return days;
  }, [todos]);

  // Status distribution data
  const statusData = useMemo(() => {
    const completed = todos.filter(t => t.status === 'completed').length;
    const inProgress = todos.filter(t => t.status === 'in-progress').length;
    const pending = todos.filter(t => t.status === 'pending').length;

    return [
      { name: 'Completed', value: completed, color: theme.palette.success.main },
      { name: 'In Progress', value: inProgress, color: theme.palette.info.main },
      { name: 'Pending', value: pending, color: theme.palette.warning.main }
    ].filter(item => item.value > 0); // Only show non-zero values
  }, [todos, theme]);

  // Priority distribution data
  const priorityData = useMemo(() => {
    const high = todos.filter(t => t.priority === 'high').length;
    const medium = todos.filter(t => t.priority === 'medium').length;
    const low = todos.filter(t => t.priority === 'low').length;

    return [
      { priority: 'High', count: high, fill: theme.palette.error.main },
      { priority: 'Medium', count: medium, fill: theme.palette.warning.main },
      { priority: 'Low', count: low, fill: theme.palette.success.main }
    ];
  }, [todos, theme]);

  // Custom tooltip styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 1.5,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: theme.shadows[3]
          }}
        >
          {payload.map((entry: any, index: number) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Activity Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Activity Timeline
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Task activity over the last 7 days
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.info.main} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.palette.info.main} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.warning.main} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={theme.palette.warning.main} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis
                dataKey="date"
                stroke={theme.palette.text.secondary}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="completed"
                stroke={theme.palette.success.main}
                fillOpacity={1}
                fill="url(#colorCompleted)"
                name="Completed"
              />
              <Area
                type="monotone"
                dataKey="inProgress"
                stroke={theme.palette.info.main}
                fillOpacity={1}
                fill="url(#colorInProgress)"
                name="In Progress"
              />
              <Area
                type="monotone"
                dataKey="pending"
                stroke={theme.palette.warning.main}
                fillOpacity={1}
                fill="url(#colorPending)"
                name="Pending"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status and Priority Distribution */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Status Distribution */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Status Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Current task status breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Color Legend */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 2 }}>
              {statusData.map((entry, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: entry.color,
                      borderRadius: '2px',
                      flexShrink: 0
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    {entry.name}: {entry.value} ({((entry.value / todos.length) * 100).toFixed(0)}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Priority Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Tasks by priority level
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis
                  dataKey="priority"
                  stroke={theme.palette.text.secondary}
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke={theme.palette.text.secondary}
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill={theme.palette.primary.main} radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
});

DashboardCharts.displayName = 'DashboardCharts';

export default DashboardCharts;
