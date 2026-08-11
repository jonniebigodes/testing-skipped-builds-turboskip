import { useTheme } from '@emotion/react';

export interface HeaderLink {
  label: string;
  href: string;
}

export interface HeaderProps {
  title?: string;
  links?: HeaderLink[];
  isSticky?: boolean;
  inverted?: boolean;
  logo?: string;
  fullWidth?: boolean;
  onLinkClick?: (link: HeaderLink) => void;
}

const Header = ({
  title = 'Application',
  links = [],
  isSticky = false,
  inverted = false,
  logo,
  fullWidth = false,
  onLinkClick,
}: HeaderProps) => {
  const t = useTheme();
  const bg = inverted ? t.color.slate900 : t.color.white;
  const fg = inverted ? t.color.white : t.color.slate900;
  const border = inverted ? t.color.slate800 : t.color.slate200;
  const linkColor = inverted ? t.color.blue200 : t.color.blue600;
  const linkHover = inverted ? t.color.blue100 : t.color.blue600;

  return (
    <header
      css={{
        position: isSticky ? 'sticky' : 'relative',
        top: isSticky ? 0 : undefined,
        zIndex: 100,
        width: '100%',
        backgroundColor: bg,
        borderBottom: `1px solid ${border}`,
      }}
    >
      <div
        css={{
          margin: fullWidth ? 0 : '0 auto',
          maxWidth: fullWidth ? '100%' : '1200px',
          padding: `${t.spacing[3]} ${t.spacing[4]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: t.spacing[4],
        }}
      >
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: t.spacing[2],
            color: fg,
          }}
        >
          {logo && (
            <img
              src={logo}
              alt="Logo"
              css={{
                width: t.spacing[6],
                height: t.spacing[6],
                borderRadius: t.spacing[2],
              }}
            />
          )}
          <h1
            css={{
              margin: 0,
              fontSize: t.fontSize[18],
              fontWeight: t.fontWeight.semibold,
              color: fg,
            }}
          >
            {title}
          </h1>
        </div>
        {links && links.length > 0 && (
          <nav
            css={{
              display: 'flex',
              alignItems: 'center',
              gap: t.spacing[4],
            }}
          >
            {links.map((l, i) => (
              <a
                key={`${l.label}-${i}`}
                href={l.href}
                css={{
                  color: linkColor,
                  textDecoration: 'none',
                  fontSize: t.fontSize[14],
                  transition: 'color 0.2s ease',
                  '&:hover': { color: linkHover },
                }}
                onClick={() => {
                  onLinkClick?.(l);
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
