import { useTheme } from '@emotion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface SelectItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  type?: 'single' | 'multiple';
  value?: string[];
  onValueChange?: (details: { value: string[] }) => void;
  open?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  disabled?: boolean;
  placeholder?: string;
  name?: string;
  required?: boolean;
  items: SelectItem[];
  children?: ReactNode;
}

const Select = ({
  type = 'single',
  value,
  onValueChange,
  open,
  onOpenChange,
  disabled = false,
  placeholder = 'Select an option',
  name,
  required = false,
  items,
  children,
}: SelectProps) => {
  const t = useTheme();
  const isMultiple = type === 'multiple';

  const rootRef = useRef<HTMLDivElement>(null);

  const isOpenControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isOpenControlled ? open : internalOpen;

  const isValueControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>([]);
  const selectedValue = isValueControlled ? value : internalValue;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.({ open: next });
    },
    [isOpenControlled, onOpenChange]
  );

  const setValue = useCallback(
    (next: string[]) => {
      if (!isValueControlled) {
        setInternalValue(next);
      }
      onValueChange?.({ value: next });
    },
    [isValueControlled, onValueChange]
  );

  // Close on outside click.
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, setOpen]);

  const selectedItems = items.filter((item) =>
    selectedValue.includes(item.value)
  );
  const valueText =
    selectedItems.length > 0
      ? selectedItems.map((item) => item.label).join(', ')
      : '';

  const handleSelect = (item: SelectItem) => {
    if (item.disabled) return;
    if (isMultiple) {
      const next = selectedValue.includes(item.value)
        ? selectedValue.filter((v) => v !== item.value)
        : [...selectedValue, item.value];
      setValue(next);
    } else {
      setValue([item.value]);
      setOpen(false);
    }
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
    } else if (
      (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') &&
      !isOpen
    ) {
      event.preventDefault();
      setOpen(true);
    }
  };

  const listboxId = name ? `${name}-listbox` : undefined;

  return (
    <div
      ref={rootRef}
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: t.spacing[2],
        width: '300px',
        position: 'relative',
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
      <div>
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          onClick={() => !disabled && setOpen(!isOpen)}
          onKeyDown={handleTriggerKeyDown}
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: `${t.spacing[2]} ${t.spacing[3]}`,
            backgroundColor: t.color.white,
            border: `1px solid ${t.color.slate300}`,
            borderRadius: t.spacing[2],
            fontSize: t.fontSize[14],
            color: t.color.slate700,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            outline: 'none',
            transition: 'all 0.2s ease',
            ...(!disabled && {
              '&:hover': { borderColor: t.color.slate400 },
              '&:focus-visible': {
                borderColor: t.color.blue500,
                boxShadow: `0 0 0 3px ${t.color.blueTr10}`,
              },
            }),
          }}
        >
          <span
            css={{
              flex: 1,
              textAlign: 'left',
              ...(valueText ? {} : { color: t.color.slate400 }),
            }}
          >
            {valueText || placeholder}
          </span>
          <span
            css={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: t.spacing[2],
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>
      {isOpen && (
        <div
          css={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 50,
            marginTop: t.spacing[1],
          }}
        >
          <ul
            id={listboxId}
            role="listbox"
            aria-multiselectable={isMultiple || undefined}
            css={{
              listStyle: 'none',
              margin: 0,
              backgroundColor: t.color.white,
              border: `1px solid ${t.color.slate200}`,
              borderRadius: t.spacing[2],
              boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              maxHeight: '300px',
              overflowY: 'auto',
              padding: t.spacing[1],
            }}
          >
            {items.map((item) => {
              const isSelected = selectedValue.includes(item.value);
              return (
                <li
                  key={item.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={item.disabled || undefined}
                  onClick={() => handleSelect(item)}
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: `${t.spacing[2]} ${t.spacing[3]}`,
                    fontSize: t.fontSize[14],
                    color: item.disabled ? t.color.slate400 : t.color.slate700,
                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                    borderRadius: t.spacing[1],
                    outline: 'none',
                    transition: 'background-color 0.15s ease',
                    ...(!item.disabled && {
                      '&:hover': { backgroundColor: t.color.slate100 },
                      '&[data-highlighted]': {
                        backgroundColor: t.color.slate100,
                      },
                    }),
                  }}
                >
                  <span>{item.label}</span>
                  {isSelected && (
                    <span
                      css={{
                        marginLeft: t.spacing[2],
                        color: t.color.blue500,
                        fontWeight: t.fontWeight.bold,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <select
        name={name}
        required={required}
        disabled={disabled}
        multiple={isMultiple}
        value={isMultiple ? selectedValue : (selectedValue[0] ?? '')}
        aria-hidden="true"
        tabIndex={-1}
        onChange={() => {}}
        css={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {!isMultiple && <option value="" />}
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
