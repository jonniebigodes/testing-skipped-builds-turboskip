import { keyframes } from "@emotion/react";

export type LoadingPulseDotsProps = {
  dotCount?: number;
  cycleMs?: number;
  color?: string;
};

export const LoadingPulseDots = ({
  dotCount = 5,
  cycleMs = 1400,
  color = "#6366f1",
}: LoadingPulseDotsProps) => {
  const dots = Array.from({ length: dotCount }, (_, i) => i);

  const pulseAnimation = keyframes`
    0% {
      opacity: 0.35;
      transform: scale(0.65);
    }
    50% {
      opacity: 1;
      transform: scale(1.25);
    }
    100% {
      opacity: 0.35;
      transform: scale(0.65);
    }
  `;

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        minHeight: 80,
      }}
    >
      {dots.map((i) => (
        <div
          key={i}
          css={{
            width: 12,
            height: 12,
            borderRadius: 999,
            animationName: pulseAnimation,
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
          }}
          style={{
            backgroundColor: color,
            animationDuration: `${cycleMs}ms`,
            animationDelay: `${-(i / dotCount) * cycleMs}ms`,
          }}
        />
      ))}
    </div>
  );
};
