import { useTheme } from "@emotion/react";
import type { Theme } from "@emotion/react";

export interface ButtonProps {
  /**
   * Background color of the button
   */
  backgroundColor?: string;

  /**
   * Size of the button: 'small', 'medium', or 'large'
   */
  size?: "small" | "medium" | "large";

  /**
   * Label text displayed on the button
   */
  label: string;

  /**
   * Click event handler
   */
  onClick?: () => void;
}

const getSizeStyles = (size: "small" | "medium" | "large", t: Theme) => {
  const sizeMap = {
    small: {
      padding: `${t.spacing[1]} ${t.spacing[3]}`,
      fontSize: t.fontSize[12],
      height: t.spacing[6],
    },
    medium: {
      padding: `${t.spacing[2]} ${t.spacing[4]}`,
      fontSize: t.fontSize[14],
      height: t.spacing[8],
    },
    large: {
      padding: `${t.spacing[3]} ${t.spacing[5]}`,
      fontSize: t.fontSize[16],
      height: t.spacing[10],
    },
  };

  return sizeMap[size];
};

const Button = ({
  backgroundColor,
  size = "medium",
  label,
  onClick,
}: ButtonProps) => {
  const t = useTheme();
  const sizeStyles = getSizeStyles(size, t);

  return (
    <button
      type="button"
      onClick={onClick}
      css={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backgroundColor ?? t.color.blue500,
        color: t.color.white,
        border: "none",
        borderRadius: t.spacing[2],
        fontWeight: t.fontWeight.medium,
        cursor: "pointer",
        transition: "all 0.2s ease",
        outline: "none",
        ...sizeStyles,
        "&:hover": {
          opacity: 0.9,
          transform: "translateY(-2px)",
        },
      }}
    >
      {label}
    </button>
  );
};

export default Button;
