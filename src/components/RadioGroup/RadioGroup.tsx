import { useTheme } from '@emotion/react';
import { useId, useState } from 'react';
import type { ReactNode } from 'react';

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  onValueChange?: (details: { value: string | null }) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation?: 'horizontal' | 'vertical';
  readOnly?: boolean;
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  options: RadioOption[];
}

const RadioGroup = ({
  onValueChange,
  disabled = false,
  required = false,
  name,
  orientation = 'vertical',
  readOnly = false,
  children,
  value,
  defaultValue,
  options,
}: RadioGroupProps) => {
  const t = useTheme();
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const [internalValue, setInternalValue] = useState<string | null>(
    defaultValue ?? null,
  );
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const selectOption = (option: RadioOption) => {
    if (disabled || readOnly || option.disabled) return;
    if (!isControlled) setInternalValue(option.value);
    onValueChange?.({ value: option.value });
  };

  return (
    <div
      role="radiogroup"
      aria-orientation={orientation}
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: t.spacing[3],
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
          {required && (
            <span css={{ color: t.color.pink600, marginLeft: t.spacing[1] }}>
              *
            </span>
          )}
        </span>
      )}
      <div
        css={{
          display: 'flex',
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          gap: orientation === 'horizontal' ? t.spacing[4] : t.spacing[3],
          flexWrap: 'wrap',
        }}
      >
        {options.map((option) => {
          const isItemDisabled = disabled || option.disabled || false;
          const checked = selectedValue === option.value;

          return (
            <label
              key={option.value}
              css={{
                display: 'flex',
                alignItems: 'center',
                gap: t.spacing[2],
                cursor:
                  disabled || readOnly || option.disabled
                    ? 'not-allowed'
                    : 'pointer',
                opacity: disabled || option.disabled ? 0.5 : 1,
                userSelect: 'none',
              }}
            >
              <input
                type="radio"
                name={groupName}
                value={option.value}
                checked={checked}
                disabled={isItemDisabled}
                required={required}
                onChange={() => selectOption(option)}
                css={{
                  position: 'absolute',
                  width: '1px',
                  height: '1px',
                  padding: 0,
                  margin: '-1px',
                  overflow: 'hidden',
                  clip: 'rect(0 0 0 0)',
                  whiteSpace: 'nowrap',
                  border: 0,
                }}
              />
              <span
                aria-hidden="true"
                data-state={checked ? 'checked' : 'unchecked'}
                data-disabled={isItemDisabled || undefined}
                css={{
                  position: 'relative',
                  width: t.spacing[5],
                  height: t.spacing[5],
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: t.color.slate300,
                  backgroundColor: t.color.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  '&:hover:not([data-disabled])': {
                    borderColor: t.color.blue500,
                  },
                  '&[data-state="checked"]': {
                    borderColor: t.color.blue500,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: t.color.blue500,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    },
                  },
                }}
              />
              <span
                css={{
                  fontSize: t.fontSize[14],
                  color:
                    disabled || option.disabled
                      ? t.color.slate400
                      : t.color.slate700,
                }}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default RadioGroup;
