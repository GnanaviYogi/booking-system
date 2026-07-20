"use client";

interface Props {
  roomName: string;
  bookings: any[];
}

export default function RoomUtilization({
  roomName,
  bookings,
}: Props) {
  const roomBookings = bookings.filter(
    (b: any) =>
      b.room_name === roomName
  );

  const bookedMinutes =
    roomBookings.reduce(
      (
        total: number,
        booking: any
      ) => {
        const [sh, sm] =
          booking.start_time
            .slice(0, 5)
            .split(":")
            .map(Number);

        const [eh, em] =
          booking.end_time
            .slice(0, 5)
            .split(":")
            .map(Number);

        return (
          total +
          ((eh * 60 + em) -
            (sh * 60 + sm))
        );
      },
      0
    );

  // 10 hours working day
  const utilization = Math.min(
    100,
    Math.round(
      (bookedMinutes / 600) * 100
    )
  );

  const getColor = () => {
    if (utilization >= 80)
      return "#EF4444";

    if (utilization >= 50)
      return "#F59E0B";

    return "#22C55E";
  };

  const color = getColor();

  return (
    <div
      style={{
        marginTop: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: "6px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color:
              "rgba(255,255,255,.75)",
          }}
        >
          Utilization
        </span>

        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color,
          }}
        >
          {utilization}%
        </span>
      </div>

      {/* Progress Bar */}

      <div
        style={{
          height: "8px",

          borderRadius: "999px",

          background:
            "rgba(255,255,255,.12)",

          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${utilization}%`,

            height: "100%",

            borderRadius: "999px",

            background:
              utilization >= 80
                ? "linear-gradient(90deg,#EF4444,#F87171)"
                : utilization >= 50
                ? "linear-gradient(90deg,#F59E0B,#FBBF24)"
                : "linear-gradient(90deg,#22C55E,#4ADE80)",

            transition:
              "width .5s ease",
          }}
        />
      </div>

      <div
        style={{
          marginTop: "8px",

          fontSize: "11px",

          color:
            "rgba(255,255,255,.65)",
        }}
      >
        {bookedMinutes} mins booked
      </div>
    </div>
  );
}