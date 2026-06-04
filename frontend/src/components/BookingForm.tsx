"use client";

import {
  TextField,
  Select,
  MenuItem,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  useCreateBookingMutation,
  useGetRoomsQuery,
  useGetBookingsQuery,
} from "@/services/api";
import { useSnackbar } from "notistack";

export default function BookingForm({ open, selected }: any) {

  const { data: rooms = [] } = useGetRoomsQuery(undefined);
  const { data: bookings = [] } = useGetBookingsQuery(undefined);

  const [createBooking] = useCreateBookingMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");

  // ✅ PREFILL
  useEffect(() => {
    if (selected?.prefill) {
      setRoomName(selected.room_name);
      setDate(selected.date);
      setStartTime(selected.start_time);
      setEndTime(selected.end_time);
    }
  }, [selected]);

  // ✅ RESET
  const resetForm = () => {
    setUserName("");
    setRoomName("");
    setCapacity("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setReason("");
  };

  // ✅ BOOKING COUNT
  const getBookingCount = () => {
    if (!userName || !date) return 0;

    return bookings.filter((b: any) => {
      return (
        b.user_name?.toLowerCase().trim() ===
          userName.toLowerCase().trim() &&
        b.date?.split("T")[0] === date
      );
    }).length;
  };

  const bookingCount = getBookingCount();

  // ✅ SUBMIT (✅ ONLY user_name is sent)
  const handleSubmit = async () => {
    if (bookingCount >= 3) {
      enqueueSnackbar("❌ Max 3 bookings per day", {
        variant: "error",
      });
      return;
    }

    try {
      await createBooking({
        user_name: userName,   // ✅ CORRECT (no user_id)

        room_name: roomName,
        required_capacity: Number(capacity),
        date,
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
        reason,
      }).unwrap();

      enqueueSnackbar("✅ Booking Successful", {
        variant: "success",
      });

      resetForm();

    } catch (err: any) {
      const message =
        err?.data?.detail?.message ||
        err?.data?.detail ||
        "Booking Failed ❌";

      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={0.5}>

      {/* ✅ USER NAME */}
      <Typography fontSize={12}>
        User Name <span style={{ color: "red" }}>*</span>
      </Typography>
      <TextField
        size="small"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      {/* ✅ BOOKING COUNT */}
      <Typography fontSize={11} color="error">
        {bookingCount}/3 bookings for selected date
      </Typography>

      {/* ✅ ROOM */}
      <Typography fontSize={12}>
        Room <span style={{ color: "red" }}>*</span>
      </Typography>
      <Select
        size="small"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      >
        {rooms.map((r: any) => (
          <MenuItem key={r.id} value={r.name}>
            {r.name}
          </MenuItem>
        ))}
      </Select>

      {/* ✅ CAPACITY */}
      <Typography fontSize={12}>
        Capacity <span style={{ color: "red" }}>*</span>
      </Typography>
      <TextField
        size="small"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />

      {/* ✅ DATE */}
      <Typography fontSize={12}>
        Date <span style={{ color: "red" }}>*</span>
      </Typography>
      <TextField
        type="date"
        size="small"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* ✅ START TIME */}
      <Typography fontSize={12}>
        Start Time <span style={{ color: "red" }}>*</span>
      </Typography>
      <TextField
        type="time"
        size="small"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />

      {/* ✅ END TIME */}
      <Typography fontSize={12}>
        End Time <span style={{ color: "red" }}>*</span>
      </Typography>
      <TextField
        type="time"
        size="small"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />

      {/* ✅ REASON */}
      <Typography fontSize={12}>
        Reason <span style={{ color: "red" }}>*</span>
      </Typography>
      <Select
        size="small"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        <MenuItem value="Meeting">Meeting</MenuItem>
        <MenuItem value="Interview">Interview</MenuItem>
        <MenuItem value="Training">Training</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </Select>

      {/* ✅ BUTTONS */}
      <Box display="flex" gap={1} mt={1}>
        <Button
          variant="contained"
          size="small"
          sx={{ flex: 1 }}
          onClick={handleSubmit}
        >
          Book
        </Button>

        <Button
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
          onClick={resetForm}
        >
          Reset
        </Button>
      </Box>

    </Box>
  );
}