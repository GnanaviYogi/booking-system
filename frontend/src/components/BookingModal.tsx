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
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  useGetRoomsQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
} from "@/services/api";
import { useSnackbar } from "notistack"; // ✅ ADDED

export default function BookingModal({
  open,
  onClose,
  selected,
}: any) {

  const { data: rooms = [] } = useGetRoomsQuery(undefined);
  const [createBooking] = useCreateBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();

  const { enqueueSnackbar } = useSnackbar(); // ✅ ADDED

  const [userName, setUserName] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    if (selected) {
      setUserName(selected.user_name || "");
      setDate(selected.date?.slice(0, 10) || "");
      setReason(selected.reason || "");
      setStartTime(selected.start_time?.slice(0, 5) || "");
      setEndTime(selected.end_time?.slice(0, 5) || "");
      setRoomName(selected.room_name || "");
      setCapacity(selected.required_capacity || "");
    } else {
      setUserName("");
      setDate("");
      setReason("");
      setStartTime("");
      setEndTime("");
      setRoomName("");
      setCapacity("");
    }
  }, [selected, open]);

  const handleSave = async () => {

    if (
      !userName ||
      !roomName ||
      !date ||
      !startTime ||
      !endTime ||
      !capacity ||
      !reason
    ) {
      // ✅ ✅ ✅ FIX: replaced alert
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      return;
    }

    try {
      if (selected?.id) {
        await updateBooking({
          id: selected.id,
          user_name: userName,
          room_name: roomName,
          required_capacity: Number(capacity),
          date,
          start_time: `${startTime}:00`,
          end_time: `${endTime}:00`,
          reason,
        }).unwrap();
      } else {
        await createBooking({
          user_name: userName,
          room_name: roomName,
          required_capacity: Number(capacity),
          date,
          start_time: `${startTime}:00`,
          end_time: `${endTime}:00`,
          reason,
        }).unwrap();
      }

      // ✅ OPTIONAL SUCCESS MESSAGE (clean UX)
      enqueueSnackbar("✅ Booking saved successfully", {
        variant: "success",
        autoHideDuration: 3000,
      });

      onClose();

    } catch (error: any) {
      console.log("FULL ERROR:", error);

      let message = "Booking failed";

      // ✅ ✅ ✅ FIX: handle FastAPI error properly
      if (error?.data?.detail) {
        if (typeof error.data.detail === "string") {
          message = error.data.detail;
        } else if (typeof error.data.detail === "object") {
          message = error.data.detail.message || message;

          if (error.data.detail.suggested_rooms) {
            const rooms = error.data.detail.suggested_rooms
              .map((r: any) => r.room_name)
              .join(", ");

            message += ` | Try: ${rooms}`;
          }
        }
      }

      enqueueSnackbar(message, { variant: "error" }); // ✅ FIX
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>

      <DialogTitle>
        {selected?.id ? "Edit Booking" : "Book Room"}
      </DialogTitle>

      <DialogContent>

        <Typography>User</Typography>
        <TextField
          fullWidth
          size="small"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <Typography mt={1}>Room</Typography>
        <Select
          fullWidth
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

        <Typography mt={1}>Capacity</Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />

        <Typography mt={1}>Date</Typography>
        <TextField
          type="date"
          fullWidth
          size="small"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Typography mt={1}>Start Time</Typography>
        <TextField
          type="time"
          fullWidth
          size="small"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <Typography mt={1}>End Time</Typography>
        <TextField
          type="time"
          fullWidth
          size="small"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <Typography mt={1}>Reason</Typography>
        <Select
          fullWidth
          size="small"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <MenuItem value="">Select Reason</MenuItem>
          <MenuItem value="Meeting">Meeting</MenuItem>
          <MenuItem value="Interview">Interview</MenuItem>
          <MenuItem value="Training">Training</MenuItem>
          <MenuItem value="Presentation">Presentation</MenuItem>
          <MenuItem value="Workshop">Workshop</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>

      </DialogContent>

      <DialogActions>

        <Button onClick={handleSave}>
          Save
        </Button>

        <Button onClick={onClose}>
          Close
        </Button>

      </DialogActions>

    </Dialog>
  );
}
