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

  return (
    <Paper sx={{ p: 2 }}>

      {/* HEADER */}
      <Box display="grid" gridTemplateColumns={`120px repeat(${times.length},1fr)`}>
        <Box />
        {times.map((t: number) => (
          <Typography key={t} align="center" fontSize={12}>
            {t}:00
          </Typography>
        ))}
      </Box>

      {/* ROOMS */}
      {rooms.map((room: any) => {

        // ✅ ✅ MATCH BOOKINGS TO ROOM + DATE
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

            <Typography fontSize={13}>
              {room.name}
            </Typography>

            {times.map((h: number, i: number) => {

              // ✅ ✅ FIND BOOKING FOR SLOT
              const booking = roomBookings.find((b: any) => {
                const start = toMinutes(b.start_time);
                const end = toMinutes(b.end_time);
                const slotStart = h * 60;
                const slotEnd = (h + 1) * 60;

                return start < slotEnd && end > slotStart;
              });

              // ✅ EMPTY SLOT
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

              // ✅ SHOW ONLY AT START
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
                  {/* ✅ SHOW REASON */}
                  <Typography fontSize={11} fontWeight="bold">
                    {booking.reason}
                  </Typography>

                  {/* ✅ SHOW TIME */}
                  <Typography fontSize={10}>
                    {booking.start_time.slice(0,5)} - {booking.end_time.slice(0,5)}
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