import { useTheme } from '@emotion/react';
import type { ReactNode } from 'react';

export interface ProgressProps {
  min?: number;
  max?: number;
  value?: number;
  disabled?: boolean;
  readonly?: boolean;
  orientation?: 'horizontal' | 'vertical';
  children?: ReactNode;
}

export default function Progress({
  min = 0,
  max = 100,
  value,
  disabled = false,
  readonly = false,
  orientation = 'horizontal',
  children,
}: ProgressProps) {
  const t = useTheme();
  const isVertical = orientation === 'vertical';

  const currentValue = value ?? min;
  const percentage = ((currentValue - min) / (max - min)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div
      role="progressbar"
      aria-valuenow={currentValue}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-orientation={orientation}
      aria-disabled={disabled || undefined}
      aria-readonly={readonly || undefined}
      css={{
        display: 'flex',
        flexDirection: isVertical ? 'row' : 'column',
        gap: t.spacing[2],
        width: isVertical ? 'fit-content' : '300px',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled || readonly ? 'none' : 'auto',
      }}
    >
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: t.spacing[2],
        }}
      >
        <span
          css={{
            fontSize: t.fontSize[14],
            fontWeight: t.fontWeight.medium,
            color: t.color.slate700,
          }}
        >
          {children || 'Loading...'}
        </span>

        <span
          css={{
            fontSize: t.fontSize[12],
            color: t.color.slate500,
            fontWeight: t.fontWeight.semibold,
            minWidth: '45px',
            textAlign: 'right',
          }}
        >
          {`${Math.round(clampedPercentage)}%`}
        </span>
      </div>

      <div
        css={{
          position: 'relative',
          width: isVertical ? t.spacing[2] : '100%',
          height: isVertical ? '200px' : t.spacing[2],
          backgroundColor: t.color.slate200,
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          css={{
            position: 'absolute',
            top: isVertical ? 'auto' : 0,
            bottom: isVertical ? 0 : 'auto',
            left: 0,
            width: isVertical ? '100%' : `${clampedPercentage}%`,
            height: isVertical ? `${clampedPercentage}%` : '100%',
            backgroundColor: readonly ? t.color.slate400 : t.color.blue500,
            transition: 'all 0.3s ease',
            borderRadius: '9999px',
          }}
        />
      </div>
    </div>
  );
}
