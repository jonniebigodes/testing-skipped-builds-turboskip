import { keyframes } from "@emotion/react";

export type LoadingRipplesProps = {
  ringCount?: number;
  cycleMs?: number;
  color?: string;
};

/**
 * This is a LoadingRipples component that renders concentric circular rings expanding and fading out via a shared CSS keyframe animation, with each ring's animation offset by a negative delay proportional to its index so the rings emanate continuously like a radar sweep. It accepts ringCount, cycleMs, and color to control the number of rings, animation speed, and ring color.
 */
export const LoadingRipples = ({
  ringCount = 3,
  cycleMs = 2400,
  color = "#3b82f6",
}: LoadingRipplesProps) => {
  const rings = Array.from({ length: ringCount }, (_, i) => i);

  const pulseAnimation = keyframes`
    0% {
      opacity: 0.55;
      transform: scale(0.2);
    }
    85% {
      opacity: 0.12;
      transform: scale(2.07);
    }
    100% {
      opacity: 0;
      transform: scale(2.4);
    }
  `;

  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 140,
      }}
    >
      <div
        css={{
          position: "relative",
          width: 100,
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {rings.map((i) => (
          <div
            key={i}
            css={{
              position: "absolute",
              width: 72,
              height: 72,
              borderRadius: 999,
              borderWidth: 2,
              borderStyle: "solid",
              boxSizing: "border-box",
              animationName: pulseAnimation,
              animationIterationCount: "infinite",
              animationTimingFunction: "linear",
            }}
            style={{
              borderColor: color,
              animationDuration: `${cycleMs}ms`,
              animationDelay: `${-(i / ringCount) * cycleMs}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
