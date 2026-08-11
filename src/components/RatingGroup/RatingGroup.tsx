import { useTheme } from '@emotion/react';
import { useState } from 'react';
import type { ReactNode } from 'react';

export interface RatingGroupProps {
  onValueChange?: (details: { value: number }) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  min?: number;
  max?: number;
  readOnly?: boolean;
  orientation?: 'horizontal' | 'vertical';
  children?: ReactNode;
  value?: number;
  defaultValue?: number;
}

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    css={{ display: 'block' }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const RatingGroup = ({
  onValueChange,
  disabled = false,
  required = false,
  name,
  min = 1,
  max = 5,
  readOnly = false,
  orientation = 'horizontal',
  children,
  value,
  defaultValue,
}: RatingGroupProps) => {
  const t = useTheme();
  const isVertical = orientation === 'vertical';
  const count = max - min + 1;
  const interactive = !disabled && !readOnly;

  const [internalValue, setInternalValue] = useState(defaultValue ?? 0);
  const [hovered, setHovered] = useState<number | null>(null);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const highlightValue = hovered ?? currentValue;

  const selectValue = (ratingValue: number) => {
    if (!interactive) return;
    if (!isControlled) setInternalValue(ratingValue);
    onValueChange?.({ value: ratingValue });
  };

  return (
    <div
      role="radiogroup"
      css={{
        display: 'flex',
        flexDirection: isVertical ? 'row' : 'column',
        gap: isVertical ? t.spacing[4] : t.spacing[2],
        alignItems: isVertical ? 'center' : 'flex-start',
      }}
    >
      {children && (
        <span
          css={{
            fontSize: t.fontSize[14],
            fontWeight: t.fontWeight.medium,
            color: t.color.slate700,
            userSelect: 'none',
          }}
        >
          {children}
        </span>
      )}
      <div
        css={{
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          gap: t.spacing[1],
        }}
      >
        {Array.from({ length: count }, (_, i) => {
          const ratingValue = min + i;
          const highlighted = ratingValue <= highlightValue;

          return (
            <span
              key={ratingValue}
              role="radio"
              aria-checked={currentValue === ratingValue}
              aria-label={`${ratingValue}`}
              tabIndex={interactive ? 0 : -1}
              onClick={() => selectValue(ratingValue)}
              onMouseEnter={() => interactive && setHovered(ratingValue)}
              onMouseLeave={() => interactive && setHovered(null)}
              onKeyDown={(event) => {
                if (interactive && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault();
                  selectValue(ratingValue);
                }
              }}
              css={{
                cursor: interactive ? 'pointer' : 'default',
                color: t.color.yellow500,
                opacity: disabled ? 0.5 : 1,
                transition: 'transform 0.15s ease, opacity 0.15s ease',
                outline: 'none',
                ...(interactive && {
                  '&:hover': { transform: 'scale(1.1)' },
                  '&:focus-visible': {
                    transform: 'scale(1.1)',
                    filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.4))',
                  },
                }),
              }}
            >
              <StarIcon filled={highlighted} />
            </span>
          );
        })}
        {name && (
          <input type="hidden" name={name} value={currentValue} required={required} />
        )}
      </div>
    </div>
  );
};

export default RatingGroup;
