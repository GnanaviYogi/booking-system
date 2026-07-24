"use client";

import { Skeleton } from "@mui/material";

interface AppSkeletonProps {
  count?: number;
  height?: number;
}

export default function AppSkeleton({
  count = 4,
  height = 220,
}: AppSkeletonProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(250px,1fr))",
        gap: "20px",
        width: "100%",
      }}
    >
      {Array.from({ length: count }).map(
        (_, index) => (
          <div
            key={index}
            style={{
              padding: "24px",
              height,
              borderRadius: "24px",
              background:
                "rgba(255,255,255,.04)",
            }}
          >
            <Skeleton
              variant="rounded"
              width={60}
              height={60}
              animation="wave"
            />

            <Skeleton
              height={50}
              width="60%"
              sx={{ mt: 2 }}
              animation="wave"
            />

            <Skeleton
              width="90%"
              animation="wave"
            />

            <Skeleton
              width="70%"
              animation="wave"
            />

            <Skeleton
              width={120}
              sx={{ mt: 3 }}
              animation="wave"
            />
          </div>
        )
      )}
    </div>
  );
}