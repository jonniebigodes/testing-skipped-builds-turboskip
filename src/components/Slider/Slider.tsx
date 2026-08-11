import { useTheme } from '@emotion/react';
import {
  useCallback,
  useRef,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';

export interface SliderProps {
  value?: number[];
  onValueChange?: (details: { value: number[] }) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  children?: ReactNode;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const Slider = ({
  value,
  onValueChange,
  disabled = false,
  min = 0,
  max = 100,
  step = 1,
  orientation = 'horizontal',
  children,
}: SliderProps) => {
  const t = useTheme();
  const isVertical = orientation === 'vertical';
  const trackRef = useRef<HTMLDivElement>(null);

  const currentValue = value?.[0] ?? min;
  const range = max - min || 1;
  const percent = clamp(((currentValue - min) / range) * 100, 0, 100);

  const snapToStep = useCallback(
    (raw: number) => {
      const steps = Math.round((raw - min) / step);
      const snapped = min + steps * step;
      return clamp(Number(snapped.toFixed(10)), min, max);
    },
    [min, max, step],
  );

  const commit = useCallback(
    (next: number) => {
      if (next === currentValue) return;
      onValueChange?.({ value: [next] });
    },
    [currentValue, onValueChange],
  );

  const valueFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const track = trackRef.current;
      if (!track) return currentValue;
      const rect = track.getBoundingClientRect();
      const ratio = isVertical
        ? 1 - (clientY - rect.top) / (rect.height || 1)
        : (clientX - rect.left) / (rect.width || 1);
      return snapToStep(min + clamp(ratio, 0, 1) * range);
    },
    [currentValue, isVertical, min, range, snapToStep],
  );

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    commit(valueFromPointer(event.clientX, event.clientY));
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || !event.currentTarget.hasPointerCapture(event.pointerId))
      return;
    commit(valueFromPointer(event.clientX, event.clientY));
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    let next = currentValue;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = clamp(currentValue + step, min, max);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = clamp(currentValue - step, min, max);
        break;
      case 'Home':
        next = min;
        break;
      case 'End':
        next = max;
        break;
      default:
        return;
    }
    event.preventDefault();
    commit(snapToStep(next));
  };

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: isVertical ? 'row' : 'column',
        gap: isVertical ? t.spacing[4] : t.spacing[2],
        width: isVertical ? 'auto' : '300px',
        height: isVertical ? '300px' : 'auto',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children && (
        <label
          css={{
            fontSize: t.fontSize[14],
            fontWeight: t.fontWeight.medium,
            color: t.color.slate700,
            userSelect: 'none',
          }}
        >
          {children}
        </label>
      )}
      <span
        css={{
          fontSize: t.fontSize[14],
          color: t.color.slate500,
          userSelect: 'none',
        }}
      >
        {currentValue}
      </span>
      <div
        css={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flexGrow: 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          ref={trackRef}
          css={{
            position: 'relative',
            flexGrow: 1,
            backgroundColor: t.color.slate200,
            borderRadius: t.spacing[1],
            width: isVertical ? t.spacing[2] : '100%',
            height: isVertical ? '100%' : t.spacing[2],
          }}
        >
          <div
            css={{
              position: 'absolute',
              backgroundColor: disabled ? t.color.slate400 : t.color.blue500,
              borderRadius: t.spacing[1],
              width: isVertical ? '100%' : `${percent}%`,
              height: isVertical ? `${percent}%` : '100%',
              ...(isVertical
                ? { bottom: 0, left: 0 }
                : { top: 0, left: 0 }),
            }}
          />
        </div>
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-orientation={orientation}
          aria-disabled={disabled || undefined}
          onKeyDown={handleKeyDown}
          css={{
            position: 'absolute',
            width: t.spacing[5],
            height: t.spacing[5],
            backgroundColor: t.color.white,
            border: '2px solid',
            borderColor: disabled ? t.color.slate400 : t.color.blue500,
            borderRadius: '50%',
            cursor: disabled ? 'not-allowed' : 'grab',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.1s ease',
            outline: 'none',
            transform: 'translate(-50%, -50%)',
            ...(isVertical
              ? { left: '50%', top: `${100 - percent}%` }
              : { top: '50%', left: `${percent}%` }),
            '&:active': {
              cursor: 'grabbing',
              transform: 'translate(-50%, -50%) scale(1.1)',
            },
            '&:focus-visible': {
              boxShadow: `0 0 0 3px ${t.color.blueTr10}, 0 1px 3px rgba(0, 0, 0, 0.1)`,
            },
          }}
        />
      </div>
    </div>
  );
};

export default Slider;
