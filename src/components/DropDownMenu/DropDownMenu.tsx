import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@emotion/react';

export interface DropDownMenuProps {
  /**
   * Color of the dropdown menu button
   */
  color?: string;

  /**
   * Label text displayed on the dropdown button
   */
  label: string;

  /**
   * Array of strings to populate the dropdown options
   */
  children: string[];

  /**
   * Renders the dropdown menu in inverted colors
   */
  inverted?: boolean;

  /**
   * Callback when an option is selected
   */
  onSelect?: (item: string) => void;
}

const DropDownMenu = ({
  color: customColor,
  label,
  children,
  inverted = false,
  onSelect,
}: DropDownMenuProps) => {
  const t = useTheme();
  const buttonColor = inverted ? t.color.slate800 : customColor ?? t.color.blue500;
  const buttonTextColor = t.color.white;
  const menuBg = inverted ? t.color.slate700 : t.color.white;
  const menuTextColor = inverted ? t.color.white : t.color.slate800;
  const menuBorder = inverted ? t.color.slate600 : t.color.slate300;
  const hoverBg = inverted ? t.color.slate600 : t.color.slate100;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} css={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        css={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: buttonColor,
          color: buttonTextColor,
          border: 'none',
          borderRadius: t.spacing[2],
          padding: `${t.spacing[2]} ${t.spacing[4]}`,
          fontSize: t.fontSize[14],
          fontWeight: t.fontWeight.medium,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '150px',
          '&:hover': { opacity: 0.9 },
        }}
      >
        {label}
        <span css={{ marginLeft: t.spacing[2], fontSize: t.fontSize[12] }}>
          ▼
        </span>
      </button>
      {open && (
        <div
          css={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: t.spacing[1],
          }}
        >
          <div
            role="menu"
            css={{
              backgroundColor: menuBg,
              border: `1px solid ${menuBorder}`,
              borderRadius: t.spacing[2],
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              padding: `${t.spacing[2]} 0`,
              minWidth: '150px',
              maxHeight: '300px',
              overflowY: 'auto',
              overflowX: 'hidden',
              zIndex: 50,
            }}
          >
            {children.map((item, index) => (
              <button
                key={index}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item);
                  setOpen(false);
                }}
                css={{
                  padding: `${t.spacing[2]} ${t.spacing[4]}`,
                  cursor: 'pointer',
                  color: menuTextColor,
                  backgroundColor: 'transparent',
                  border: 'none',
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'background-color 0.15s',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  '&:hover': { backgroundColor: hoverBg },
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownMenu;
