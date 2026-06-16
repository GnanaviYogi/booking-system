"use client";

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

  const reasonColors: any = {
    Meeting: "#BBDEFB",
    Interview: "#D1C4E9",
    Training: "#F8BBD0",
    Presentation: "#FFF9C4",
    Workshop: "#EF9A9A",
    Other: "#CFD8DC",
  };

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
      <Paper sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>

        {/* HEADER */}
        <Box display="grid" gridTemplateColumns={`120px repeat(${times.length},1fr)`}>
          <Box />
          {times.map((t: number) => (
            <Typography key={t} align="center" fontSize={12}>
              {formatHeaderTime(t)}
            </Typography>
          ))}
        </Box>

        {/* BODY */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>

          {rooms.map((room: any) => {

            const roomBookings = bookings.filter((b: any) =>
              b.room_name === room.name &&
              (!currentDateStr || b.date?.slice(0, 10) === currentDateStr)
            );

            const usedSlots = new Set<string>();

            return (
              <Box
                key={room.id}
                display="grid"
                gridTemplateColumns={`120px repeat(${times.length},1fr)`}
                mt={1}
              >

                {/* ROOM NAME */}
                <Typography fontSize={13}>
                  {formatRoomName(room.name)}
                </Typography>

                {/* TIME SLOTS */}
                {times.map((h: number, i: number) => {

                  const booking = roomBookings.find((b: any) => {
                    const startHour = Math.floor(toMinutes(b.start_time) / 60);
                    return startHour === h;
                  });

                  const slotKey = `${room.id}-${h}`;

                  if (usedSlots.has(slotKey)) return null;

                  if (!booking) {
                    return (
                      <Paper
                        key={i}
                        sx={{
                          height: 60,
                          background: "#f5f7fa",
                          m: "4px",
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": { background: "#e3f2fd" }
                        }}
                        onClick={() => {
                          onEdit && onEdit({
                            room_name: room.name,
                            start_time: `${h.toString().padStart(2, "0")}:00`,
                            end_time: `${(h + 1).toString().padStart(2, "0")}:00`,
                            date: currentDateStr
                          });
                        }}
                      />
                    );
                  }

                  const duration =
                    (toMinutes(booking.end_time) - toMinutes(booking.start_time)) / 60;

                  const span = Math.max(1, Math.round(duration));

                  for (let offset = 0; offset < span; offset++) {
                    usedSlots.add(`${room.id}-${h + offset}`);
                  }

                  return (
                    <Paper
                      key={booking.id}
                      onClick={() => handleBookingClick(booking)}
                      sx={{
                        gridColumn: `${i + 2} / span ${span}`,
                        height: 60,
                        background: reasonColors[booking.reason] || "#E0E0E0",
                        color: "#1A1A1A",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        m: "6px",
                        boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
                        border: "1px solid rgba(0,0,0,0.08)",
                        transition: "0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0px 4px 10px rgba(0,0,0,0.18)"
                        }
                      }}
                    >
                      {/* ✅ KEEP ONLY THESE */}
                      <Typography fontSize={11} fontWeight="600">
                        {booking.reason}
                      </Typography>

                      <Typography fontSize={10}>
                        {booking.user_name}
                      </Typography>

                      {/* ❌ REMOVED TIME DISPLAY HERE */}
                    </Paper>
                  );
                })}

              </Box>
            );
          })}

        </Box>

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
