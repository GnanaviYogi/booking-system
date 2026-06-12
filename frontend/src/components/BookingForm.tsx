"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  useCreateBookingMutation,
  useGetRoomsQuery,
  useGetBookingsQuery,
} from "@/services/api";
import { useSnackbar } from "notistack";

export default function BookingForm({ open, selected, onClose }: any) {

  const { data: rooms = [] } = useGetRoomsQuery(undefined);
  const { data: bookings = [] } = useGetBookingsQuery(undefined);

  const [createBooking] = useCreateBookingMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");

  const getTodayDate = () => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  };
  const [date, setDate] = useState(getTodayDate());

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (selected?.prefill) {
      setRoomName(selected.room_name);
      setDate(selected.date?.split("T")[0] || "");
      setStartTime(selected.start_time?.slice(0, 5) || "");
      setEndTime(selected.end_time?.slice(0, 5) || "");
    }
  }, [selected]);

  const resetForm = () => {
    setUserName("");
    setRoomName("");
    setCapacity("");
    setDate(getTodayDate());
    setStartTime("");
    setEndTime("");
    setReason("");
  };

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

  const handleSubmit = async () => {

    if (!userName || !roomName || !capacity || !date || !startTime || !endTime || !reason) {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      return;
    }

    const selectedRoom = rooms.find((r: any) => r.name === roomName);

    if (!selectedRoom) {
      enqueueSnackbar("Please select a valid room", { variant: "error" });
      return;
    }

    const enteredCapacity = Number(capacity);
    const roomCapacity = Number(selectedRoom.capacity);

    if (enteredCapacity > roomCapacity) {
      enqueueSnackbar(
        `❌ ${roomName} supports only ${roomCapacity}`,
        { variant: "error" }
      );
      return;
    }

    try {
      await createBooking({
        user_name: userName,
        room_name: roomName,
        required_capacity: enteredCapacity,
        date: date.split("T")[0],
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
        reason,
      }).unwrap();

      enqueueSnackbar("Room booked successfully", {
        variant: "success",
        autoHideDuration: 3000,
      });

      onClose();
      resetForm();

    } catch (err: any) {
      console.log("FULL ERROR:", err);

      let message = "Booking Failed";

      if (err?.data?.detail) {
        if (typeof err.data.detail === "string") {
          message = err.data.detail;
        } else if (typeof err.data.detail === "object") {
          message = err.data.detail.message || message;

          if (err.data.detail.suggested_rooms) {
            const suggested = err.data.detail.suggested_rooms
              .map((r: any) => r.room_name)
              .join(", ");

            message += ` | Try: ${suggested}`;
          }
        }
      }

      enqueueSnackbar(message, { variant: "error" });
    }
  };

 return (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    transitionDuration={{ appear: 0, enter: 0, exit: 0 }}
  >

    <DialogTitle sx={{ fontSize: "16px", pb: 1 }}>
      Book Room
    </DialogTitle>

    <DialogContent sx={{ pt: 1, pb: 1 }}>

      <Box display="flex" flexDirection="column" gap={0.7} mt={1}>

        <Typography sx={{ fontSize: "13px" }}>User Name *</Typography>
        <TextField size="small" value={userName} onChange={(e) => setUserName(e.target.value)} />

        <Typography sx={{ fontSize: "13px" }}>Room *</Typography>
        <Select size="small" value={roomName} onChange={(e) => setRoomName(e.target.value)}>
          {rooms.map((r: any) => (
            <MenuItem key={r.id} value={r.name}>{r.name}</MenuItem>
          ))}
        </Select>

        <Typography sx={{ fontSize: "13px" }}>Capacity *</Typography>
        <TextField size="small" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />

        <Typography sx={{ fontSize: "13px" }}>Date *</Typography>
        <TextField type="date" size="small" value={date} onChange={(e) => setDate(e.target.value)} />

        <Typography sx={{ fontSize: "13px" }}>Start Time *</Typography>
        <TextField type="time" size="small" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

        <Typography sx={{ fontSize: "13px" }}>End Time *</Typography>
        <TextField type="time" size="small" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

        <Typography sx={{ fontSize: "13px" }}>Reason *</Typography>
        <Select size="small" value={reason} onChange={(e) => setReason(e.target.value)}>
          <MenuItem value="">Select Reason</MenuItem>
          <MenuItem value="Meeting">Meeting</MenuItem>
          <MenuItem value="Interview">Interview</MenuItem>
          <MenuItem value="Training">Training</MenuItem>
          <MenuItem value="Presentation">Presentation</MenuItem>
          <MenuItem value="Workshop">Workshop</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>

      </Box>

    </DialogContent>

    <DialogActions sx={{ p: 1 }}>

      <Button
        onClick={handleSubmit}
        variant="contained"
        size="small"
        sx={{ textTransform: "none" }}   // ✅ FIX
      >
        Book
      </Button>

      <Button
        onClick={onClose}
        variant="outlined"
        size="small"
        sx={{ textTransform: "none" }}   // ✅ FIX
      >
        Close
      </Button>

    </DialogActions>

  </Dialog>
 );
}
