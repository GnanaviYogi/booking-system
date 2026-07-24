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

const schema = z
  .object({
    userName: z.string().min(1, "User is required"),
    roomName: z.string().min(1, "Room is required"),
    capacity: z.string().min(1, "Capacity is required"),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    reason: z.string().min(1, "Reason is required"),
  })
  .refine(
    (data) => data.endTime > data.startTime,
    {
      message:
        "End time must be greater than start time",
      path: ["endTime"],
    }
  );

export default function BookingModal({
  open,
  onClose,
  selected,
}: any) {
  const { data: rooms = [] } =
    useGetRoomsQuery(undefined);

  const [updateBooking] =
    useUpdateBookingMutation();

  const { enqueueSnackbar } =
    useSnackbar();

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
      setValue(
        "userName",
        selected.user_name || ""
      );

      setValue(
        "date",
        selected.date?.slice(0, 10) || ""
      );

      setValue(
        "reason",
        selected.reason || ""
      );

      setValue(
        "startTime",
        selected.start_time?.slice(0, 5) || ""
      );

      setValue(
        "endTime",
        selected.end_time?.slice(0, 5) || ""
      );

      setValue(
        "roomName",
        selected.room_name || ""
      );

      setValue(
        "capacity",
        selected.required_capacity?.toString() ||
          ""
      );
    } else {
      reset();
    }
  }, [
    selected,
    open,
    setValue,
    reset,
  ]);

  const onSubmit = async (
    data: any
  ) => {
    try {
      await updateBooking({
        id: selected.id,
        user_name: data.userName,
        room_name: data.roomName,
        required_capacity:
          Number(data.capacity),
        date: data.date,
        start_time: `${data.startTime}:00`,
        end_time: `${data.endTime}:00`,
        reason: data.reason,
      }).unwrap();

      enqueueSnackbar(
        "Booking updated successfully",
        {
          variant: "success",
        }
      );

      onClose();
    } catch (error: any) {
      enqueueSnackbar(
        "Booking update failed",
        {
          variant: "error",
        }
      );
    }
  };

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      background:
        "rgba(255,255,255,.05)",
      borderRadius: "12px",

      "& fieldset": {
        borderColor:
          "rgba(255,255,255,.12)",
      },

      "&:hover fieldset": {
        borderColor:
          "rgba(96,165,250,.5)",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#3B82F6",
      },
    },

    "& .MuiSvgIcon-root": {
      color: "white",
    },

    input: {
      color: "white",
    },
  };

  const selectStyle = {
    color: "white",

    background:
      "rgba(255,255,255,.05)",

    borderRadius: "12px",

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor:
        "rgba(255,255,255,.12)",
    },

    "& .MuiSvgIcon-root": {
      color: "white",
    },
  };

  const labelStyle = {
    color: "rgba(255,255,255,.85)",
    fontWeight: 500,
    marginTop: "12px",
    marginBottom: "4px",
  };

  return (
    <Dialog
  open={open}
  onClose={onClose}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      width: "560px",
      maxWidth: "92vw",

      borderRadius: "20px",

      background: "rgba(15,23,42,.97)",

      backdropFilter: "blur(20px)",

      border:
        "1px solid rgba(255,255,255,.12)",

      color: "white",

      overflow: "hidden",
    },
  }}
  BackdropProps={{
    sx: {
      backdropFilter: "blur(6px)",
      background:
        "rgba(2,6,23,.45)",
    },
  }}
>
      <DialogTitle
  sx={{
    color: "white",
    fontWeight: 700,
    fontSize: "20px",
    pb: 1,
  }}
>
  Edit Booking
</DialogTitle>
      <DialogContent
        sx={{
          overflowY: "visible",
          pb: 1,
        }}
      ></DialogContent>
      

      <DialogContent>
        <Typography sx={labelStyle}>
          User
        </Typography>

        <Controller
          name="userName"
          control={control}
          render={({ field }) => (
            <TextField
              fullWidth
              size="small"
              {...field}
              error={!!errors.userName}
              helperText={
                errors.userName?.message
              }
              sx={fieldStyle}
            />
          )}
        />

        <Typography sx={labelStyle}>
          Room
        </Typography>

        <Controller
          name="roomName"
          control={control}
          render={({ field }) => (
            <Select
              fullWidth
              size="small"
              {...field}
              sx={selectStyle}
            >
              {rooms.map((r: any) => (
                <MenuItem
                  key={r.id}
                  value={r.name}
                >
                  {r.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />

        <Typography sx={labelStyle}>
          Capacity
        </Typography>

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
              helperText={
                errors.capacity?.message
              }
              sx={fieldStyle}
            />
          )}
        />

        <Typography sx={labelStyle}>
          Date
        </Typography>

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <TextField
              type="date"
              fullWidth
              size="small"
              {...field}
              sx={fieldStyle}
            />
          )}
        />

        <Typography sx={labelStyle}>
          Start Time
        </Typography>

        <Controller
          name="startTime"
          control={control}
          render={({ field }) => (
            <TextField
              type="time"
              fullWidth
              size="small"
              {...field}
              sx={fieldStyle}
            />
          )}
        />

        <Typography sx={labelStyle}>
          End Time
        </Typography>

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
              helperText={
                errors.endTime?.message
              }
              sx={fieldStyle}
            />
          )}
        />

        <Typography sx={labelStyle}>
          Reason
        </Typography>

        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <Select
              fullWidth
              size="small"
              {...field}
              sx={selectStyle}
            >
              <MenuItem value="">
                Select Reason
              </MenuItem>
              <MenuItem value="Meeting">
                Meeting
              </MenuItem>
              <MenuItem value="Interview">
                Interview
              </MenuItem>
              <MenuItem value="Training">
                Training
              </MenuItem>
              <MenuItem value="Presentation">
                Presentation
              </MenuItem>
              <MenuItem value="Workshop">
                Workshop
              </MenuItem>
              <MenuItem value="Other">
                Other
              </MenuItem>
            </Select>
          )}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            color: "white",
          }}
        >
          Close
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={{
            textTransform: "none",
            borderRadius: "10px",

            background:
              "linear-gradient(135deg,#3B82F6,#2563EB)",
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}