import { useTheme } from '@emotion/react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  /**
   * Renders the input in inverted colors
   */
  inverted?: boolean;

  /**
   * Placeholder text for the input
   */
  placeholder?: string;

  /**
   * Input type (text, email, password, etc.)
   */
  type?: string;
}

const Input = ({
  inverted = false,
  placeholder = '',
  type = 'text',
  ...rest
}: InputProps) => {
  const t = useTheme();
  const backgroundColor = inverted ? t.color.slate800 : t.color.white;
  const textColor = inverted ? t.color.white : t.color.slate800;
  const borderColor = inverted ? t.color.slate700 : t.color.slate300;
  const focusBorderColor = inverted ? t.color.blue400 : t.color.blue500;
  const focusShadowColor = inverted ? t.color.blueTr50 : t.color.blueTr10;

  return (
    <input
      type={type}
      placeholder={placeholder}
      css={{
        display: 'block',
        width: '100%',
        padding: `${t.spacing[2]} ${t.spacing[3]}`,
        backgroundColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        borderRadius: t.spacing[2],
        fontSize: t.fontSize[14],
        outline: 'none',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        '&:focus': {
          borderColor: focusBorderColor,
          boxShadow: `0 0 0 3px ${focusShadowColor}`,
        },
      }}
      {...rest}
    />
  );
};

export default Input;
