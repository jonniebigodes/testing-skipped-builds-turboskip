import { useTheme } from '@emotion/react';
import { useRef } from 'react';
import type { ReactNode, ChangeEvent } from 'react';

export interface TimeValue {
  hour: number;
  minute: number;
  second?: number;
}

export interface TimeFieldProps {
  value?: string;
  onValueChange?: (details: { value: string; valueAsTime: TimeValue }) => void;
  placeholder?: string;
  required?: boolean;
  onInvalid?: () => void;
  errorMessageId?: string;
  hourCycle?: 12 | 24;
  hideTimeZone?: boolean;
  minValue?: string;
  maxValue?: string;
  disabled?: boolean;
  readOnly?: boolean;
  children?: ReactNode;
  name?: string;
  allowSeconds?: boolean;
}

function parseTimeString(timeString: string): TimeValue {
  const parts = timeString.split(':');
  return {
    hour: parseInt(parts[0] || '0', 10),
    minute: parseInt(parts[1] || '0', 10),
    second: parts[2] ? parseInt(parts[2], 10) : undefined,
  };
}

export default function TimeField({
  value,
  onValueChange,
  placeholder,
  required = false,
  onInvalid,
  errorMessageId,
  minValue,
  maxValue,
  disabled = false,
  readOnly = false,
  children,
  name,
  allowSeconds = false,
}: TimeFieldProps) {
  const t = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onValueChange) {
      onValueChange({
        value: newValue,
        valueAsTime: parseTimeString(newValue),
      });
    }
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      if (onValueChange) {
        onValueChange({
          value: '',
          valueAsTime: { hour: 0, minute: 0 },
        });
      }
    }
  };

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: t.spacing[2],
      }}
    >
      {children && (
        <label
          css={{
            fontSize: t.fontSize[14],
            fontWeight: t.fontWeight.medium,
            color: t.color.slate700,
          }}
        >
          {children}
          {required && (
            <span
              css={{ color: t.color.pink600, marginLeft: t.spacing[1] }}
            >
              *
            </span>
          )}
        </label>
      )}

      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: t.spacing[2],
          padding: `${t.spacing[2]} ${t.spacing[3]}`,
          border: `2px solid ${t.color.slate300}`,
          borderRadius: t.spacing[2],
          backgroundColor: disabled ? t.color.slate100 : t.color.white,
          transition: 'all 0.2s ease',
        }}
      >
        <input
          ref={inputRef}
          type="time"
          value={value}
          onChange={handleChange}
          name={name}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          min={minValue}
          max={maxValue}
          step={allowSeconds ? 1 : undefined}
          placeholder={placeholder}
          aria-describedby={errorMessageId}
          onInvalid={onInvalid}
          css={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: t.fontSize[14],
            fontFamily: 'inherit',
            color: disabled ? t.color.slate400 : t.color.slate800,
            backgroundColor: 'transparent',
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        />

        {value && !disabled && !readOnly && (
          <button
            type="button"
            onClick={handleClear}
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: t.spacing[5],
              height: t.spacing[5],
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: t.color.slate500,
              fontSize: t.fontSize[18],
              padding: 0,
              lineHeight: 1,
            }}
            aria-label="Clear time"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
