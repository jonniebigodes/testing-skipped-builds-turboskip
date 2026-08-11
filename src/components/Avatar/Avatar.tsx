import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";

export interface AvatarProps {
  /**
   * The source URL of the avatar image
   */
  src?: string;
  /**
   * Alternative text for the avatar image
   */
  alt: string;
  /**
   * Fallback text to display when the image fails to load or is loading
   * Typically initials (e.g., "JD" for John Doe)
   */
  fallback: string;
  /**
   * Callback function called when the image loading status changes
   */
  onStatusChange?: (details: {
    status: "loading" | "loaded" | "error";
  }) => void;
  /**
   * Custom IDs for the avatar elements
   */
  ids?: Partial<{ root: string; image: string; fallback: string }>;
  /**
   * Additional props to pass to the root element
   */
  rootProps?: Omit<ComponentPropsWithoutRef<"div">, "id">;
}

export const Avatar = ({
  src,
  alt,
  fallback,
  onStatusChange,
  ids,
  rootProps,
}: AvatarProps) => {
  const t = useTheme();
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error",
  );

  useEffect(() => {
    const next = src ? "loading" : "error";
    setStatus(next);
    onStatusChange?.({ status: next });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const updateStatus = (next: "loading" | "loaded" | "error") => {
    setStatus(next);
    onStatusChange?.({ status: next });
  };

  const showImage = !!src && status !== "error";

  return (
    <div
      id={ids?.root}
      {...rootProps}
      css={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: t.spacing[12],
        height: t.spacing[12],
        borderRadius: "50%",
        backgroundColor: t.color.slate500,
        color: t.color.white,
        fontWeight: t.fontWeight.medium,
        fontSize: t.fontSize[16],
        overflow: "hidden",
      }}
      style={rootProps?.style}
    >
      {!showImage && <span id={ids?.fallback}>{fallback}</span>}
      {src && (
        <img
          id={ids?.image}
          src={src}
          alt={alt}
          onLoad={() => updateStatus("loaded")}
          onError={() => updateStatus("error")}
          css={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: status === "loaded" ? "block" : "none",
          }}
        />
      )}
    </div>
  );
};
