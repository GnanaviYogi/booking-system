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

export default function BookingModal({
  selected,
  setSelected,
  updateBooking,
  rooms = [],
}: any) {

  const [reason, setReason] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    if (selected) {
      setReason(selected.reason);
      setStartTime(selected.start_time);
      setEndTime(selected.end_time);
      setRoomName(selected.room_name);
    }
  }, [selected]);

  return (
    <Dialog
      open={!!selected}
      onClose={() => setSelected(null)}
      fullWidth
      PaperProps={{
        sx: {
          mt: "-80px",   // ✅ moves modal slightly up
          borderRadius: 3,
        },
      }}
    >

      <DialogTitle sx={{ fontSize: 16 }}>Booking Details</DialogTitle>

      <DialogContent>

        <Typography fontSize={13}>
          <b>User:</b> {selected?.user_name}
        </Typography>

        <Typography fontSize={13}>
          <b>Date:</b> {selected?.date}
        </Typography>

        <Typography mt={1} fontSize={13}><b>Room:</b></Typography>
        <Select fullWidth size="small" value={roomName}
          onChange={(e)=>setRoomName(e.target.value)}>
          {rooms.map((r:any)=>(
            <MenuItem key={r.id} value={r.name}>{r.name}</MenuItem>
          ))}
        </Select>

        <Typography mt={1} fontSize={13}><b>Start Time:</b></Typography>
        <TextField type="time" size="small" fullWidth value={startTime}
          onChange={(e)=>setStartTime(e.target.value)} />

        <Typography mt={1} fontSize={13}><b>End Time:</b></Typography>
        <TextField type="time" size="small" fullWidth value={endTime}
          onChange={(e)=>setEndTime(e.target.value)} />

        <Typography mt={1} fontSize={13}><b>Reason:</b></Typography>
        <TextField size="small" fullWidth value={reason}
          onChange={(e)=>setReason(e.target.value)} />

      </DialogContent>

      <DialogActions>
        <Button size="small"
          onClick={async () => {
            await updateBooking({
              id: selected.id,
              reason,
              start_time: startTime,
              end_time: endTime,
              room_name: roomName,
            });
            setSelected(null);
          }}
        >
          Save
        </Button>

        <Button size="small" onClick={() => setSelected(null)}>
          Close
        </Button>
      </DialogActions>

    </Dialog>
  );
}
