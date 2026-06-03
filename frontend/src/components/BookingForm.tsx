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
} from "@/services/api";
import { useSnackbar } from "notistack";

export default function BookingForm({ open, selected }: any) {

  const { data: rooms = [] } = useGetRoomsQuery(undefined);
  const [createBooking] = useCreateBookingMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");

  // ✅ PREFILL (optional)
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

  // ✅ ✅ FINAL FIXED SUBMIT
  const handleSubmit = async () => {
    try {
      await createBooking({

        // ✅ Required fields (backend expects these)
        user_name: userName,

        user_id: userName,   // ✅ TEMP mapping (name → id)

        room_name: roomName,   // ✅ correct field name

        required_capacity: Number(capacity),  // ✅ correct field

        date: date,

        // ✅ correct time format
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,

        reason: reason,

      }).unwrap();

      enqueueSnackbar("✅ Booking Successful", {
        variant: "success",
      });

      resetForm();

    } catch (err: any) {
      console.log("ERROR:", err?.data);

      const message =
        err?.data?.detail?.map((e: any) => e.msg).join(", ") ||
        "Booking Failed ❌";

      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={0.4}>

      <Typography fontSize={12}>User Name</Typography>
      <TextField size="small" value={userName} onChange={(e) => setUserName(e.target.value)} />

      <Typography fontSize={12}>Room</Typography>
      <Select size="small" value={roomName} onChange={(e) => setRoomName(e.target.value)}>
        {rooms.map((r: any) => (
          <MenuItem key={r.id} value={r.name}>{r.name}</MenuItem>
        ))}
      </Select>

      <Typography fontSize={12}>Capacity</Typography>
      <TextField size="small" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />

      <Typography fontSize={12}>Date</Typography>
      <TextField type="date" size="small" value={date} onChange={(e) => setDate(e.target.value)} />

      <Typography fontSize={12}>Start Time</Typography>
      <TextField type="time" size="small" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

      <Typography fontSize={12}>End Time</Typography>
      <TextField type="time" size="small" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

      <Typography fontSize={12}>Reason</Typography>
      <Select size="small" value={reason} onChange={(e) => setReason(e.target.value)}>
        <MenuItem value="Meeting">Meeting</MenuItem>
        <MenuItem value="Interview">Interview</MenuItem>
        <MenuItem value="Training">Training</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </Select>

      <Box display="flex" gap={1} mt={1}>
        <Button variant="contained" size="small" onClick={handleSubmit} sx={{ flex: 1 }}>
          Book
        </Button>
        <Button variant="outlined" size="small" onClick={resetForm} sx={{ flex: 1 }}>
          Reset
        </Button>
      </Box>

    </Box>
  );
}