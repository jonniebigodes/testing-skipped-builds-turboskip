import { useTheme } from '@emotion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface ComboboxProps {
  type?: 'single' | 'multiple';
  value?: string[];
  onValueChange?: (details: { value: string[] }) => void;
  open?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  disabled?: boolean;
  placeholder?: string;
  name?: string;
  required?: boolean;
  items?: string[];
  label?: string;
}

const Combobox = ({
  type = 'single',
  value,
  onValueChange,
  open,
  onOpenChange,
  disabled = false,
  placeholder = 'Select an option',
  name,
  required = false,
  items = [],
  label,
}: ComboboxProps) => {
  const t = useTheme();
  const isMultiple = type === 'multiple';

  const rootRef = useRef<HTMLDivElement>(null);

  const isOpenControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isOpenControlled ? open : internalOpen;

  const isValueControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>([]);
  const selectedValue = isValueControlled ? value : internalValue;

  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

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

  // For single-select, keep the input text in sync with the selected value.
  useEffect(() => {
    if (!isMultiple && selectedValue.length > 0) {
      setInputValue(selectedValue[0]);
    }
  }, [isMultiple, selectedValue]);

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

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(inputValue.toLowerCase())
  );

  const iconTriggerCss = {
    padding: t.spacing[1],
    backgroundColor: 'transparent',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: t.color.slate500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.spacing[1],
    transition: 'background-color 0.2s',
    ...(!disabled && {
      '&:hover': { backgroundColor: t.color.slate100 },
    }),
  };

  const handleSelect = (item: string) => {
    if (isMultiple) {
      const next = selectedValue.includes(item)
        ? selectedValue.filter((v) => v !== item)
        : [...selectedValue, item];
      setValue(next);
      setInputValue('');
    } else {
      setValue([item]);
      setInputValue(item);
      setOpen(false);
    }
    setHighlightedIndex(-1);
  };

  const handleClear = () => {
    setValue([]);
    setInputValue('');
    setHighlightedIndex(-1);
  };

  const handleInputChange = (next: string) => {
    setInputValue(next);
    setHighlightedIndex(-1);
    if (!isOpen) setOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        setOpen(true);
        return;
      }
      setHighlightedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : prev
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (event.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
        event.preventDefault();
        handleSelect(filteredItems[highlightedIndex]);
      }
    }
  };

  const listboxId = name ? `${name}-listbox` : undefined;

  return (
    <div
      ref={rootRef}
      css={{
        width: '100%',
        position: 'relative',
      }}
    >
      {label && (
        <label
          css={{
            display: 'block',
            fontSize: t.fontSize[14],
            fontWeight: t.fontWeight.medium,
            color: t.color.slate700,
            marginBottom: t.spacing[2],
          }}
        >
          {label}
        </label>
      )}
      <div
        css={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <input
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          name={name}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => !disabled && setOpen(true)}
          onKeyDown={handleKeyDown}
          css={{
            width: '100%',
            padding: `${t.spacing[2]} ${t.spacing[20]} ${t.spacing[2]} ${t.spacing[3]}`,
            backgroundColor: disabled ? t.color.slate50 : t.color.white,
            color: disabled ? t.color.slate400 : t.color.slate800,
            border: `1px solid ${t.color.slate300}`,
            borderRadius: t.spacing[2],
            fontSize: t.fontSize[14],
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            ...(!disabled && {
              '&:focus': {
                borderColor: t.color.blue500,
                boxShadow: `0 0 0 3px ${t.color.blueTr10}`,
              },
            }),
          }}
        />
        <div
          css={{
            position: 'absolute',
            right: t.spacing[2],
            display: 'flex',
            alignItems: 'center',
            gap: t.spacing[1],
          }}
        >
          <button
            type="button"
            aria-label="Clear"
            disabled={disabled}
            onClick={handleClear}
            css={iconTriggerCss}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Toggle"
            disabled={disabled}
            onClick={() => !disabled && setOpen(!isOpen)}
            css={iconTriggerCss}
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
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          css={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1000,
          }}
        >
          <ul
            id={listboxId}
            role="listbox"
            css={{
              listStyle: 'none',
              margin: 0,
              backgroundColor: t.color.white,
              border: `1px solid ${t.color.slate200}`,
              borderRadius: t.spacing[2],
              boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              marginTop: t.spacing[1],
              maxHeight: '300px',
              overflowY: 'auto',
              minWidth: '200px',
              padding: 0,
            }}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const isSelected = selectedValue.includes(item);
                return (
                  <li
                    key={item}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(item)}
                    css={{
                      padding: `${t.spacing[2]} ${t.spacing[3]}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: t.fontSize[14],
                      color: t.color.slate700,
                      transition: 'background-color 0.15s',
                      backgroundColor:
                        index === highlightedIndex
                          ? t.color.slate100
                          : 'transparent',
                      '&:hover': { backgroundColor: t.color.slate100 },
                    }}
                  >
                    <span>{item}</span>
                    {isSelected && (
                      <span
                        css={{
                          color: t.color.blue500,
                          fontWeight: t.fontWeight.bold,
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </li>
                );
              })
            ) : (
              <li
                css={{
                  padding: t.spacing[5],
                  textAlign: 'center',
                  color: t.color.slate400,
                  fontSize: t.fontSize[14],
                  listStyle: 'none',
                }}
              >
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Combobox;
