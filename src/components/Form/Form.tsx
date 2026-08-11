import { useTheme } from '@emotion/react';
import type { ReactNode, FormHTMLAttributes } from 'react';

export interface FormProps
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'children'> {
  /**
   * Renders the form in inverted colors
   */
  inverted?: boolean;

  /**
   * Sets the gap between form elements
   */
  gap?: string | number;

  /**
   * Form content (typically form fields)
   */
  children: ReactNode;
}

const Form = ({
  inverted = false,
  gap,
  children,
  ...rest
}: FormProps) => {
  const t = useTheme();
  const backgroundColor = inverted ? t.color.slate800 : t.color.white;
  const borderColor = inverted ? t.color.slate700 : t.color.slate200;
  const resolvedGap = gap ?? t.spacing[4];

  return (
    <form
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: typeof resolvedGap === 'number' ? `${resolvedGap}px` : resolvedGap,
        padding: t.spacing[6],
        backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: t.spacing[2],
        minWidth: '300px',
      }}
      {...rest}
    >
      {children}
    </form>
  );
};

export default Form;
