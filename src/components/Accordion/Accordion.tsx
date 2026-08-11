import { useTheme } from '@emotion/react';
import { useId, useState } from 'react';

export interface AccordionItem {
  title: string;
  content: string;
}

export interface AccordionProps {
  inverted?: boolean;
  items: AccordionItem[];
}

export default function AccordionComponent({
  inverted = false,
  items,
}: AccordionProps) {
  const t = useTheme();
  const baseId = useId();
  const backgroundColor = inverted ? t.color.slate900 : t.color.white;
  const textColor = inverted ? t.color.white : t.color.slate900;
  const borderColor = inverted ? t.color.slate700 : t.color.slate200;
  const hoverBackgroundColor = inverted ? t.color.slate800 : t.color.slate50;

  const [openItems, setOpenItems] = useState<string[]>(
    items.length > 0 ? ['item-0'] : [],
  );

  const toggleItem = (value: string) => {
    setOpenItems((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    );
  };

  return (
    <div
      css={{
        width: '100%',
        backgroundColor,
        color: textColor,
        borderRadius: t.spacing[2],
        overflow: 'hidden',
        border: `1px solid ${borderColor}`,
      }}
    >
      {items.map((item, index) => {
        const value = `item-${index}`;
        const isOpen = openItems.includes(value);
        const triggerId = `${baseId}-trigger-${index}`;
        const contentId = `${baseId}-content-${index}`;

        return (
          <div
            key={index}
            css={{ borderBottom: `1px solid ${borderColor}` }}
          >
            <button
              type="button"
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => toggleItem(value)}
              css={{
                width: '100%',
                padding: `${t.spacing[4]} ${t.spacing[5]}`,
                backgroundColor,
                color: textColor,
                border: 'none',
                textAlign: 'left',
                fontSize: t.fontSize[16],
                fontWeight: t.fontWeight.medium,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'background-color 0.2s ease',
                '&:hover': { backgroundColor: hoverBackgroundColor },
              }}
            >
              <span>{item.title}</span>
              <span
                css={{
                  transition: 'transform 0.2s ease',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  fontSize: t.fontSize[12],
                }}
              >
                ▼
              </span>
            </button>
            {isOpen && (
              <div
                id={contentId}
                role="region"
                aria-labelledby={triggerId}
                css={{
                  padding: `${t.spacing[4]} ${t.spacing[5]}`,
                  fontSize: t.fontSize[14],
                  lineHeight: t.lineHeight[24],
                  backgroundColor,
                  color: textColor,
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
