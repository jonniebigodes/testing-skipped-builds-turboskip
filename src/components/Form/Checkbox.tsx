import { useTheme } from '@emotion/react';
import type { ChangeEvent, ReactNode } from 'react';
import { useState, useEffect } from 'react';

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (details: { checked: boolean | string }) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  readOnly?: boolean;
  children?: ReactNode;
}

const Checkbox = ({
  checked,
  onCheckedChange,
  disabled = false,
  required = false,
  name,
  value = 'on',
  readOnly = false,
  children,
}: CheckboxProps) => {
  const t = useTheme();
  const [isChecked, setIsChecked] = useState(checked || false);

  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const next = event.target.checked;
    if (checked === undefined) setIsChecked(next);
    onCheckedChange?.({ checked: next });
  };

  return (
    <label
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: t.spacing[2],
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        name={name}
        value={value}
        readOnly={readOnly}
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
        css={{
          width: t.spacing[5],
          height: t.spacing[5],
          border: '2px solid',
          borderColor: isChecked ? t.color.blue500 : t.color.slate300,
          borderRadius: t.spacing[1],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isChecked ? t.color.blue500 : t.color.white,
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
      >
        <span
          css={{
            width: t.spacing[3],
            height: t.spacing[3],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            visibility: isChecked ? 'visible' : 'hidden',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
      {children && (
        <span
          css={{
            fontSize: t.fontSize[14],
            color: t.color.slate700,
            cursor: disabled ? 'not-allowed' : 'pointer',
            userSelect: 'none',
          }}
        >
          {children}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
