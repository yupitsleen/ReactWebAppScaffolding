import { Box } from '@mui/material';
import { memo } from 'react';

type GeometricShape = 'circle' | 'triangle' | 'diagonal-bar';

interface GeometricAccentProps {
  shape: GeometricShape;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  opacity?: number;
  position?: {
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
  };
}

export const GeometricAccent = memo(({
  shape,
  color = 'var(--primary-color)',
  size = 'medium',
  opacity = 0.08,
  position = { top: -40, right: -40 }
}: GeometricAccentProps) => {
  const sizes = {
    small: 80,
    medium: 120,
    large: 180,
  };

  const dimension = sizes[size];

  const getShapeStyles = () => {
    switch (shape) {
      case 'circle':
        return {
          width: dimension,
          height: dimension,
          borderRadius: '50%',
          border: `3px solid ${color}`,
          opacity,
        };

      case 'triangle':
        return {
          width: 0,
          height: 0,
          borderLeft: `${dimension / 2}px solid transparent`,
          borderRight: `${dimension / 2}px solid transparent`,
          borderBottom: `${dimension}px solid ${color}`,
          opacity,
        };

      case 'diagonal-bar':
        return {
          width: '4px',
          height: '100%',
          background: color,
          transform: 'skewY(-2deg)',
          opacity: opacity * 2,
        };

      default:
        return {};
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        ...position,
        ...getShapeStyles(),
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
});

GeometricAccent.displayName = 'GeometricAccent';
