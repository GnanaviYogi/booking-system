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
      (total: number, booking: any) => {
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

  const utilization = Math.min(
    100,
    Math.round(
      (bookedMinutes / 600) * 100
    )
  );

  const color =
    utilization > 70
      ? "#ef4444"
      : utilization > 30
      ? "#f59e0b"
      : "#22c55e";

  return (
    <div style={{ marginTop: 5 }}>
      <div
        style={{
          fontSize: "10px",
          fontWeight: 600,
          color,
        }}
      >
        Utilization {utilization}%
      </div>

      <div
        style={{
          height: 5,
          background: "#e5e7eb",
          borderRadius: 999,
          overflow: "hidden",
          marginTop: 3,
        }}
      >
        <div
          style={{
            width: `${utilization}%`,
            height: "100%",
            background: color,
          }}
        />
      </div>
    </div>
  );
}