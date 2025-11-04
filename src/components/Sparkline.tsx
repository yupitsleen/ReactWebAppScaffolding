import { memo } from 'react';
import { Box, useTheme } from '@mui/material';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  showTrend?: boolean;
}

const Sparkline = memo(({ data, color, height = 40, showTrend = false }: SparklineProps) => {
  const theme = useTheme();
  const lineColor = color || theme.palette.primary.main;

  // Transform data into chart format
  const chartData = data.map((value, index) => ({ value, index }));

  // Calculate trend direction
  const trend = data.length > 1 ? data[data.length - 1] - data[0] : 0;
  const trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        width: '100%'
      }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
      {showTrend && (
        <Box
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color:
              trendDirection === 'up'
                ? theme.palette.success.main
                : trendDirection === 'down'
                ? theme.palette.error.main
                : theme.palette.text.secondary,
            display: 'flex',
            alignItems: 'center',
            minWidth: '32px'
          }}
        >
          {trendDirection === 'up' && '↗'}
          {trendDirection === 'down' && '↘'}
          {trendDirection === 'neutral' && '→'}
        </Box>
      )}
    </Box>
  );
});

Sparkline.displayName = 'Sparkline';

export default Sparkline;
