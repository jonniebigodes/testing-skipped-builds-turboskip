import { useTheme } from '@emotion/react';
import {
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

export interface PinInputProps {
  value?: string[];
  onValueChange?: (details: { value: string[]; valueAsString: string }) => void;
  disabled?: boolean;
  maxLength?: number;
  children?: ReactNode;
  required?: boolean;
  name?: string;
  type?: 'numeric' | 'alphanumeric' | 'alphabetic';
  mask?: boolean;
  placeholder?: string;
  otp?: boolean;
}

const sanitize = (
  raw: string,
  type: 'numeric' | 'alphanumeric' | 'alphabetic',
) => {
  switch (type) {
    case 'numeric':
      return raw.replace(/[^0-9]/g, '');
    case 'alphabetic':
      return raw.replace(/[^a-zA-Z]/g, '');
    default:
      return raw.replace(/[^a-zA-Z0-9]/g, '');
  }
};

export default function PinInput({
  value,
  onValueChange,
  disabled = false,
  maxLength = 4,
  children,
  required = false,
  name,
  type = 'numeric',
  mask = false,
  placeholder = '○',
  otp = false,
}: PinInputProps) {
  const t = useTheme();

  const buildValues = (source?: string[]) => {
    const next = Array.from({ length: maxLength }, (_, i) => source?.[i] ?? '');
    return next;
  };

  const [internal, setInternal] = useState<string[]>(() => buildValues(value));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const values = value !== undefined ? buildValues(value) : internal;

  const emit = (next: string[]) => {
    if (value === undefined) {
      setInternal(next);
    }
    const trimmed = next.filter((char) => char !== '');
    onValueChange?.({ value: trimmed, valueAsString: next.join('') });
  };

  const focusInput = (index: number) => {
    const target = inputRefs.current[index];
    if (target) {
      target.focus();
      target.select();
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const sanitized = sanitize(event.target.value, type);
    const char = sanitized.slice(-1);
    const next = [...values];
    next[index] = char;
    emit(next);
    if (char && index < maxLength - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === 'Backspace') {
      if (!values[index] && index > 0) {
        event.preventDefault();
        const next = [...values];
        next[index - 1] = '';
        emit(next);
        focusInput(index - 1);
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < maxLength - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (
    event: ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    event.preventDefault();
    const pasted = sanitize(event.clipboardData.getData('text'), type);
    if (!pasted) return;
    const next = [...values];
    let cursor = index;
    for (const char of pasted) {
      if (cursor >= maxLength) break;
      next[cursor] = char;
      cursor += 1;
    }
    emit(next);
    focusInput(Math.min(cursor, maxLength - 1));
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
        </label>
      )}

      <div
        css={{
          display: 'flex',
          gap: t.spacing[2],
        }}
      >
        {Array.from({ length: maxLength }, (_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={values[index] ?? ''}
            onChange={(event) => handleChange(event, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onPaste={(event) => handlePaste(event, index)}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            type={mask ? 'password' : 'text'}
            inputMode={type === 'numeric' ? 'numeric' : 'text'}
            autoComplete={otp ? 'one-time-code' : 'off'}
            aria-label={`Digit ${index + 1}`}
            maxLength={1}
            css={{
              width: t.spacing[12],
              height: t.spacing[12],
              textAlign: 'center',
              fontSize: t.fontSize[18],
              fontWeight: t.fontWeight.semibold,
              border: `2px solid ${t.color.slate300}`,
              borderRadius: t.spacing[2],
              outline: 'none',
              transition: 'all 0.2s ease',
              backgroundColor: disabled ? t.color.slate100 : t.color.white,
              color: disabled ? t.color.slate400 : t.color.slate800,
              cursor: disabled ? 'not-allowed' : 'text',
              ...(!disabled && {
                '&:focus': {
                  borderColor: t.color.blue500,
                  boxShadow: `0 0 0 3px ${t.color.blueTr10}`,
                },
              }),
            }}
          />
        ))}
      </div>

      <input type="hidden" name={name} value={values.join('')} />
    </div>
  );
}
