import { useTheme } from '@emotion/react';
import { useId, useState } from 'react';
import type { ReactNode } from 'react';

export interface CollapsibleProps {
  /**
   * The controlled open state of the collapsible
   */
  open?: boolean;
  /**
   * The callback invoked when the open state changes
   */
  onOpenChange?: (details: { open: boolean }) => void;
  /**
   * Whether the collapsible is disabled
   */
  disabled?: boolean;
  /**
   * Content to be rendered as the trigger/header
   */
  label?: ReactNode;
  /**
   * Content to be rendered inside the collapsible content area
   */
  children?: ReactNode;
}

const Collapsible = ({
  open,
  onOpenChange,
  disabled = false,
  label = 'Toggle',
  children,
}: CollapsibleProps) => {
  const t = useTheme();
  const contentId = useId();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const toggle = () => {
    if (disabled) return;
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.({ open: next });
  };

  return (
    <div
      css={{
        width: '100%',
        border: `1px solid ${t.color.slate200}`,
        borderRadius: t.spacing[2],
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={contentId}
        css={{
          width: '100%',
          padding: `${t.spacing[3]} ${t.spacing[4]}`,
          backgroundColor: disabled ? t.color.slate50 : t.color.white,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: t.fontSize[14],
          fontWeight: t.fontWeight.medium,
          color: disabled ? t.color.slate400 : t.color.slate700,
          transition: 'background-color 0.2s ease',
          textAlign: 'left',
          ...(!disabled && {
            '&:hover': { backgroundColor: t.color.slate50 },
          }),
        }}
      >
        <span>{label}</span>
        <span
          css={{
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.2s ease',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            css={{
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div
          id={contentId}
          role="region"
          css={{
            padding: t.spacing[4],
            backgroundColor: t.color.white,
            borderTop: `1px solid ${t.color.slate200}`,
            fontSize: t.fontSize[14],
            color: t.color.slate500,
            lineHeight: '1.5',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapsible;
