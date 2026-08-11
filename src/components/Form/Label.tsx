import { useTheme } from '@emotion/react';
import type { ReactNode } from 'react';

export interface LabelProps {
  /**
   * Links the label to a form element by ID
   */
  htmlFor?: string;

  /**
   * Renders the label in inverted colors
   */
  inverted?: boolean;

  /**
   * Content to display inside the label
   */
  children: ReactNode;
}

const Label = ({ htmlFor, inverted = false, children }: LabelProps) => {
  const t = useTheme();
  const textColor = inverted ? t.color.white : t.color.slate700;
  const backgroundColor = inverted ? t.color.slate800 : 'transparent';

  return (
    <label
      htmlFor={htmlFor}
      css={{
        display: 'inline-block',
        fontSize: t.fontSize[14],
        fontWeight: t.fontWeight.medium,
        color: textColor,
        backgroundColor,
        padding: inverted ? `${t.spacing[1]} ${t.spacing[2]}` : '0',
        borderRadius: inverted ? t.spacing[1] : '0',
        marginBottom: t.spacing[2],
        cursor: htmlFor ? 'pointer' : 'default',
        transition: 'color 0.2s ease',
      }}
    >
      {children}
    </label>
  );
};

export default Label;
