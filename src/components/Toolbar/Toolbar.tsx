import { useTheme } from '@emotion/react';
import type { ReactNode } from 'react';

export interface ToolbarProps {
  /**
   * The orientation of the toolbar
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Content to be rendered inside the toolbar
   */
  children?: ReactNode;
}

const Toolbar = ({ orientation = 'horizontal', children }: ToolbarProps) => {
  const t = useTheme();
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      role="toolbar"
      aria-orientation={orientation}
      css={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        alignItems: 'center',
        gap: t.spacing[2],
        padding: t.spacing[2],
        backgroundColor: t.color.slate50,
        border: `1px solid ${t.color.slate200}`,
        borderRadius: t.spacing[2],
        width: isHorizontal ? 'auto' : 'fit-content',
      }}
    >
      {children}
    </div>
  );
};

export default Toolbar;
