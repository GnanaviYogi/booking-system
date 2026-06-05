import { Box, Typography, Paper, Modal, Button } from "@mui/material";
import { useState } from "react";

export default function ScheduleGrid({
  rooms = [],
  bookings = [],
  times = [],
  currentDateStr,
  onEdit,
  onDelete,
}: any) {

  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const toMinutes = (t?: string) => {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  };

  const formatTime12 = (time?: string) => {
    if (!time) return "";
    const [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const formatHeaderTime = (hour: number) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    return `${h}:00 ${ampm}`;
  };

  const formatRoomName = (name: string) =>
    name
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  return (
    <>
      <Paper sx={{ p: 2 }}>

        {/* HEADER */}
        <Box display="grid" gridTemplateColumns={`120px repeat(${times.length},1fr)`}>
          <Box />
          {times.map((t: number) => (
            <Typography key={t} align="center" fontSize={12}>
              {formatHeaderTime(t)}
            </Typography>
          ))}
        </Box>

        {/* ROOMS */}
        {rooms.map((room: any) => {

          const roomBookings = bookings.filter((b: any) =>
            b.room_name === room.name &&
            b.date?.slice(0, 10) === currentDateStr
          );

          return (
            <Box
              key={room.id}
              display="grid"
              gridTemplateColumns={`120px repeat(${times.length},1fr)`}
              mt={1}
            >

              <Typography fontSize={13}>
                {formatRoomName(room.name)}
              </Typography>

              {times.map((h: number, i: number) => {

                // ✅ ✅ ✅ FIX: Get ALL bookings for this slot
                const slotBookings = roomBookings.filter((b: any) => {
                  const start = toMinutes(b.start_time);
                  const end = toMinutes(b.end_time);
                  const slotStart = h * 60;
                  const slotEnd = (h + 1) * 60;
                  return start < slotEnd && end > slotStart;
                });

                if (!slotBookings.length) {
                  return (
                    <Paper
                      key={i}
                      sx={{ height: 60, background: "#f5f7fa", m: "2px" }}
                    />
                  );
                }

                return slotBookings.map((booking: any) => {

                  const startHour = Math.floor(
                    toMinutes(booking.start_time) / 60
                  );

                  if (h !== startHour) return null;

                  const endHour = Math.ceil(
                    toMinutes(booking.end_time) / 60
                  );

                  const span = endHour - startHour;

                  return (
                    <Paper
                      key={booking.id} // ✅ FIX: real unique key
                      onClick={() => handleBookingClick(booking)}
                      sx={{
                        gridColumn: `${i + 2} / span ${span}`,
                        height: 60,
                        background: "#1976d2",
                        color: "white",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        m: "2px",

                        width: "calc(200% + 4px)",
                        marginRight: "-100%",
                        zIndex: 1,

                        "&:hover": { background: "#1565c0" },
                      }}
                    >
                      <Typography fontSize={11} fontWeight="bold">
                        {booking.reason}
                      </Typography>

                      <Typography fontSize={10}>
                        {formatTime12(booking.start_time)} -{" "}
                        {formatTime12(booking.end_time)}
                      </Typography>
                    </Paper>
                  );
                });
              })}
            </Box>
          );
        })}
      </Paper>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          bgcolor: "white",
          borderRadius: 3,
          p: 2,
          boxShadow: 24,
        }}>
          {selectedBooking && (
            <>
              <Typography fontWeight="bold" mb={1}>
                Booking Details
              </Typography>

              <Typography>{selectedBooking.room_name}</Typography>
              <Typography>{selectedBooking.user_name}</Typography>

              <Typography>
                {formatTime12(selectedBooking.start_time)} -{" "}
                {formatTime12(selectedBooking.end_time)}
              </Typography>

              <Typography>{selectedBooking.reason}</Typography>

              <Box display="flex" gap={1} mt={2}>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={() => {
                    onEdit && onEdit(selectedBooking);
                    setOpen(false);
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  fullWidth
                  onClick={() => {
                    if (confirm("Delete this booking?")) {
                      onDelete && onDelete(selectedBooking.id);
                      setOpen(false);
                    }
                  }}
                >
                  Delete
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}