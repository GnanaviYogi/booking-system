import { Box, Typography, Paper } from "@mui/material";

export default function ScheduleGrid({
  rooms = [],
  bookings = [],
  times = [],
  currentDateStr,
}: any) {

  // ✅ convert time safely
  const toMinutes = (t?: string) => {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  };

  // ✅ 12-hour format for booking time
  const formatTime12 = (time?: string) => {
    if (!time) return "";

    const parts = time.split(":");
    let h = Number(parts[0]);
    let m = Number(parts[1]);

    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;

    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  // ✅ Header time format
  const formatHeaderTime = (hour: number) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    return `${h}:00 ${ampm}`;
  };

  // ✅ ✅ Capitalize room names
  const formatRoomName = (name: string) => {
    return name
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  return (
    <Paper sx={{ p: 2 }}>

      {/* ✅ HEADER */}
      <Box display="grid" gridTemplateColumns={`120px repeat(${times.length},1fr)`}>
        <Box />
        {times.map((t: number) => (
          <Typography key={t} align="center" fontSize={12}>
            {formatHeaderTime(t)}
          </Typography>
        ))}
      </Box>

      {/* ✅ ROOMS */}
      {rooms.map((room: any) => {

        const roomBookings = bookings.filter((b: any) => {
          return (
            b.room_name?.toLowerCase().trim() === room.name?.toLowerCase().trim() &&
            b.date?.split("T")[0] === currentDateStr
          );
        });

        return (
          <Box
            key={room.id}
            display="grid"
            gridTemplateColumns={`120px repeat(${times.length},1fr)`}
            mt={1}
          >

            {/* ✅ ✅ ROOM NAME FIX */}
            <Typography fontSize={13}>
              {formatRoomName(room.name)}
            </Typography>

            {times.map((h: number, i: number) => {

              const booking = roomBookings.find((b: any) => {
                const start = toMinutes(b.start_time);
                const end = toMinutes(b.end_time);
                const slotStart = h * 60;
                const slotEnd = (h + 1) * 60;

                return start < slotEnd && end > slotStart;
              });

              if (!booking) {
                return (
                  <Paper
                    key={i}
                    sx={{
                      height: 60,
                      background: "#f5f7fa",
                      margin: "2px",
                    }}
                  />
                );
              }

              const startHour = Math.floor(toMinutes(booking.start_time) / 60);
              if (h !== startHour) return null;

              const endHour = Math.ceil(toMinutes(booking.end_time) / 60);
              const span = endHour - startHour;

              return (
                <Paper
                  key={i}
                  sx={{
                    gridColumn: `${i + 2} / span ${span}`,
                    height: 60,
                    background: "#1976d2",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    borderRadius: 2,
                    margin: "2px",
                    textAlign: "center",
                  }}
                >
                  {/* ✅ REASON */}
                  <Typography fontSize={11} fontWeight="bold">
                    {booking.reason}
                  </Typography>

                  {/* ✅ TIME */}
                  <Typography fontSize={10}>
                    {formatTime12(booking.start_time)} -{" "}
                    {formatTime12(booking.end_time)}
                  </Typography>

                </Paper>
              );
            })}
          </Box>
        );
      })}
    </Paper>
  );
}