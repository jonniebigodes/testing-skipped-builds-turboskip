import { useTheme } from '@emotion/react';
import type { Theme } from '@emotion/react';
import type { ReactNode } from 'react';

export interface MeterProps {
  min?: number;
  max?: number;
  value?: number;
  children?: ReactNode;
  optimum?: number;
  low?: number;
  high?: number;
}

export default function Meter({
  min = 0,
  max = 100,
  value = 0,
  children,
  optimum,
  low,
  high,
}: MeterProps) {
  const t = useTheme();

  const currentValue = value ?? min;
  const percentage = ((currentValue - min) / (max - min)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  const getMeterColor = (tokens: Theme): string => {
    const val = currentValue;
    const range = max - min;
    const lowThreshold = low ?? min + range * 0.33;
    const highThreshold = high ?? min + range * 0.66;
    const optimumValue = optimum ?? max;

    if (optimumValue >= lowThreshold && optimumValue <= highThreshold) {
      if (val >= lowThreshold && val <= highThreshold) {
        return tokens.color.green500;
      } else if (val < lowThreshold || val > highThreshold) {
        return tokens.color.yellow500;
      }
    } else if (optimumValue > highThreshold) {
      if (val > highThreshold) {
        return tokens.color.green500;
      } else if (val >= lowThreshold) {
        return tokens.color.yellow500;
      } else {
        return tokens.color.pink600;
      }
    } else {
      if (val < lowThreshold) {
        return tokens.color.green500;
      } else if (val <= highThreshold) {
        return tokens.color.yellow500;
      } else {
        return tokens.color.pink600;
      }
    }

    return tokens.color.blue500;
  };

  const meterColor = getMeterColor(t);

  return (
    <div
      role="meter"
      aria-valuenow={currentValue}
      aria-valuemin={min}
      aria-valuemax={max}
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: t.spacing[2],
        width: '300px',
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
        {children && (
          <span
            css={{
              fontSize: t.fontSize[14],
              fontWeight: t.fontWeight.medium,
              color: t.color.slate700,
            }}
          >
            {children}
          </span>
        )}

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
          width: '100%',
          height: t.spacing[3],
          backgroundColor: t.color.slate200,
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          data-part="range"
          css={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${clampedPercentage}%`,
            height: '100%',
            backgroundColor: meterColor,
            transition: 'all 0.3s ease',
            borderRadius: '9999px',
          }}
        />
      </div>
    </div>
  );
}
