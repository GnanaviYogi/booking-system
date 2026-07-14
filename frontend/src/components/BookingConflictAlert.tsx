"use client";

import { Alert, Typography } from "@mui/material";

export default function BookingConflictAlert({
  booking,
}: any) {
  if (!booking) return null;

  return (
    <Alert
      severity="error"
      variant="filled"
      sx={{
        mb: 2,
        borderRadius: 2,
      }}
    >
      <Typography fontWeight={700}>
        Booking Conflict
      </Typography>

      <Typography>
        Room: {booking.room_name}
      </Typography>

      <Typography>
        Booked By: {booking.user_name}
      </Typography>

      <Typography>
        Time: {booking.start_time} - {booking.end_time}
      </Typography>

      <Typography>
        Reason: {booking.reason}
      </Typography>
    </Alert>
  );
}