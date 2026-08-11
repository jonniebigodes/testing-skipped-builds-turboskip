import { useTheme } from '@emotion/react';
import type { Theme } from '@emotion/react';
import type { ReactNode } from 'react';

export interface PillProps {
  /**
   * Variant style of the pill
   */
  variant?: 'default' | 'inverted' | 'warning' | 'success';

  /**
   * Size of the pill: 'small', 'medium', or 'large'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Content displayed in the pill
   */
  children: ReactNode;

  /**
   * Click event handler
   */
  onClick?: () => void;

  /**
   * Whether the pill is disabled
   */
  disabled?: boolean;
}

const getSizeStyles = (size: 'small' | 'medium' | 'large', t: Theme) => {
  const sizeMap = {
    small: {
      padding: `${t.spacing[1]} ${t.spacing[2]}`,
      fontSize: t.fontSize[11],
      height: t.spacing[5],
      borderRadius: t.spacing[3],
    },
    medium: {
      padding: `${t.spacing[2]} ${t.spacing[3]}`,
      fontSize: t.fontSize[14],
      height: t.spacing[6],
      borderRadius: t.spacing[3],
    },
    large: {
      padding: `${t.spacing[2]} ${t.spacing[4]}`,
      fontSize: t.fontSize[16],
      height: t.spacing[8],
      borderRadius: t.spacing[4],
    },
  };

  return sizeMap[size];
};

const getVariantStyles = (
  variant: 'default' | 'inverted' | 'warning' | 'success',
  disabled: boolean,
  t: Theme,
) => {
  if (disabled) {
    return {
      backgroundColor: t.color.slate200,
      color: t.color.slate400,
      cursor: 'not-allowed',
    };
  }

  const variantMap = {
    default: {
      backgroundColor: t.color.blue500,
      color: t.color.white,
    },
    inverted: {
      backgroundColor: t.color.white,
      color: t.color.blue500,
      border: `1px solid ${t.color.blue500}`,
    },
    warning: {
      backgroundColor: t.color.yellow500,
      color: t.color.white,
    },
    success: {
      backgroundColor: t.color.green500,
      color: t.color.white,
    },
  };

  return variantMap[variant];
};

const Pill = ({
  variant = 'default',
  size = 'medium',
  children,
  onClick,
  disabled = false,
}: PillProps) => {
  const t = useTheme();
  const sizeStyles = getSizeStyles(size, t);
  const variantStyles = getVariantStyles(variant, disabled, t);
  const isInteractive = !disabled && !!onClick;

  return (
    <span
      onClick={disabled ? undefined : onClick}
      css={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: t.fontWeight.medium,
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        outline: 'none',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...sizeStyles,
        ...variantStyles,
        ...(isInteractive && {
          '&:hover': {
            opacity: 0.85,
            transform: 'translateY(-1px)',
          },
        }),
      }}
    >
      {children}
    </span>
  );
};

export default Pill;
