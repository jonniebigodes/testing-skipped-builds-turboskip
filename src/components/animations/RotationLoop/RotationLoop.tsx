import { keyframes } from "@emotion/react";

export type RotationLoopProps = {
  /** One full revolution duration in ms. */
  durationMs?: number;
};

export const RotationLoop = ({ durationMs = 3200 }: RotationLoopProps) => {
  const spinAnimation = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
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
          width: 88,
          height: 88,
          borderRadius: 16,
          backgroundColor: "#0ea5e9",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "column",
          paddingTop: 10,
          boxSizing: "border-box",
          animationName: spinAnimation,
          animationIterationCount: "infinite",
          animationTimingFunction: "linear",
        }}
        style={{ animationDuration: `${durationMs}ms` }}
      >
        <div
          css={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: "#f8fafc",
          }}
        />
      </div>
    </div>
  );
};
