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
} from "@mui/material";

import { useEffect } from "react";
import {
  useGetRoomsQuery,
  useUpdateBookingMutation,
} from "@/services/api";
import { useSnackbar } from "notistack";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


// ✅ ZOD SCHEMA
const schema = z.object({
  userName: z.string().min(1, "User is required"),
  roomName: z.string().min(1, "Room is required"),
  capacity: z.string().min(1, "Capacity is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  reason: z.string().min(1, "Reason is required"),
}).refine((data) => {
  return data.endTime > data.startTime;
}, {
  message: "End time must be greater than start time",
  path: ["endTime"],
});


export default function BookingModal({ open, onClose, selected }: any) {

  const { data: rooms = [] } = useGetRoomsQuery(undefined);
  const [updateBooking] = useUpdateBookingMutation();

  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      userName: "",
      roomName: "",
      capacity: "",
      date: "",
      startTime: "",
      endTime: "",
      reason: "",
    },
  });

  useEffect(() => {
    if (selected) {
      setValue("userName", selected.user_name || "");
      setValue("date", selected.date?.slice(0, 10) || "");
      setValue("reason", selected.reason || "");
      setValue("startTime", selected.start_time?.slice(0, 5) || "");
      setValue("endTime", selected.end_time?.slice(0, 5) || "");
      setValue("roomName", selected.room_name || "");
      setValue("capacity", selected.required_capacity?.toString() || "");
    } else {
      reset();
    }
  }, [selected, open, setValue, reset]);


  const onSubmit = async (data: any) => {

    if (!selected?.id) {
      enqueueSnackbar("Invalid edit operation", { variant: "error" });
      return;
    }

    try {
      await updateBooking({
        id: selected.id,
        user_name: data.userName,
        room_name: data.roomName,
        required_capacity: Number(data.capacity),
        date: data.date,
        start_time: `${data.startTime}:00`,
        end_time: `${data.endTime}:00`,
        reason: data.reason,
      }).unwrap();

      enqueueSnackbar("Booking updated successfully", {
        variant: "success",
      });

      onClose();

    } catch (error: any) {
      let message = "Booking failed";

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

      enqueueSnackbar(message, { variant: "error" });
    }
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth>

      <DialogTitle>
        Edit Booking
      </DialogTitle>

      <DialogContent>

        <Typography>User</Typography>
        <Controller
          name="userName"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              size="small"
              {...field}
              error={!!errors.userName}
              helperText={errors.userName?.message}
            />
          )}
        />

        <Typography mt={1}>Room</Typography>
        <Controller
          name="roomName"
          control={control}
          render={({ field }) => (
            <Select fullWidth size="small" {...field} error={!!errors.roomName}>
              {rooms.map((r: any) => (
                <MenuItem key={r.id} value={r.name}>
                  {r.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />

        <Typography mt={1}>Capacity</Typography>
        <Controller
          name="capacity"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              size="small"
              type="number"
              {...field}
              error={!!errors.capacity}
              helperText={errors.capacity?.message}
            />
          )}
        />

        <Typography mt={1}>Date</Typography>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <TextField
              type="date"
              fullWidth
              size="small"
              {...field}
              error={!!errors.date}
            />
          )}
        />

        <Typography mt={1}>Start Time</Typography>
        <Controller
          name="startTime"
          control={control}
          render={({ field }) => (
            <TextField
              type="time"
              fullWidth
              size="small"
              {...field}
              error={!!errors.startTime}
            />
          )}
        />

        <Typography mt={1}>End Time</Typography>
        <Controller
          name="endTime"
          control={control}
          render={({ field }) => (
            <TextField
              type="time"
              fullWidth
              size="small"
              {...field}
              error={!!errors.endTime}
              helperText={errors.endTime?.message}
            />
          )}
        />

        <Typography mt={1}>Reason</Typography>
        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <Select fullWidth size="small" {...field} error={!!errors.reason}>
              <MenuItem value="">Select Reason</MenuItem>
              <MenuItem value="Meeting">Meeting</MenuItem>
              <MenuItem value="Interview">Interview</MenuItem>
              <MenuItem value="Training">Training</MenuItem>
              <MenuItem value="Presentation">Presentation</MenuItem>
              <MenuItem value="Workshop">Workshop</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          )}
        />

      </DialogContent>

      {/* ✅ ONLY FIXED HERE */}
      <DialogActions>

        <Button
          onClick={handleSubmit(onSubmit)}
          sx={{ textTransform: "none" }}
        >
          Save
        </Button>

        <Button
          onClick={onClose}
          sx={{ textTransform: "none" }}
        >
          Close
        </Button>

      </DialogActions>

    </Dialog>
  );
}