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

  const formatTime12 = (time: string) => {
  const [h, m] = time.split(":").map(Number);

  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;

  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
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
      <Paper
        sx={{
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Box
          display="grid"
          gridTemplateColumns={`140px repeat(${times.length},1fr)`}
          mb={1}
        >
          <Box />
          {times.map((t: number) => (
            <Typography
              key={t}
              align="center"
              fontSize={12}
              fontWeight={600}
            >
              {formatHeaderTime(t)}
            </Typography>
          ))}
        </Box>

        {/* BODY */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {rooms.map((room: any) => {
            const roomBookings = bookings.filter(
              (b: any) =>
                b.room_name === room.name &&
                (!currentDateStr ||
                  b.date?.slice(0, 10) === currentDateStr)
            );

            return (
              <Box
                key={room.id}
                display="grid"
                gridTemplateColumns={`140px repeat(${times.length},1fr)`}
                mb={1}
              >
                {/* Room Name */}
                <Box
                  display="flex"
                  alignItems="center"
                  pl={1}
                >
                  <Typography fontSize={14}>
                    {formatRoomName(room.name)}
                  </Typography>
                </Box>

                {/* Time Slots */}
                {times.map((h: number) => {
                  const booking = roomBookings.find((b: any) => {
                    const bookingHour = Math.floor(
                      toMinutes(b.start_time) / 60
                    );

                    return bookingHour === h;
                  });

                  if (!booking) {
                    return (
                      <Paper
                        key={`${room.id}-${h}`}
                        sx={{
                          height: 72,
                          background: "#f5f7fa",
                          borderRadius: 2,
                          m: 0.5,
                          border: "1px solid #e0e0e0",
                        }}
                      />
                    );
                  }

                  return (
                    <Paper
                      key={`${room.id}-${booking.id}`}
                      onClick={() =>
                        handleBookingClick(booking)
                      }
                      sx={{
                        height: 72,
                        background:
                          reasonColors[booking.reason] ||
                          "#E0E0E0",
                        borderRadius: 2,
                        m: 0.5,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        border:
                          "1px solid rgba(0,0,0,0.08)",
                        boxShadow:
                          "0px 2px 6px rgba(0,0,0,0.12)",

                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow:
                            "0px 4px 10px rgba(0,0,0,0.18)",
                        },
                      }}
                    >
                      <Typography
                        fontSize={11}
                        fontWeight={700}
                        align="center"
                      >
                        {booking.reason}
                      </Typography>

                      <Typography
                        fontSize={10}
                        align="center"
                      >
                        {booking.user_name}
                      </Typography>
                    </Paper>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform:
              "translate(-50%, -50%)",
            width: 320,
            bgcolor: "white",
            borderRadius: 3,
            p: 2,
            boxShadow: 24,
          }}
        >
          {selectedBooking && (
            <>
              <Typography
                fontWeight="bold"
                mb={1}
              >
                Booking Details
              </Typography>

              <Typography>
                {selectedBooking.room_name}
              </Typography>

              <Typography>
                {selectedBooking.user_name}
              </Typography>

              <Typography>
                Start: {formatTime12(selectedBooking.start_time)}
                <br />
                End: {formatTime12(selectedBooking.end_time)}
              </Typography>

              <Typography>
                {selectedBooking.reason}
              </Typography>

              <Box
                display="flex"
                gap={1}
                mt={2}
              >
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={() => {
                    onEdit?.(selectedBooking);
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
                    if (
                      confirm(
                        "Delete this booking?"
                      )
                    ) {
                      onDelete?.(
                        selectedBooking.id
                      );
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