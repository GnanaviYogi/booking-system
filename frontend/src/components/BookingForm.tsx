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

import { useEffect } from "react";
import {
  useCreateBookingMutation,
  useGetRoomsQuery,
  useGetAvailabilityQuery,
} from "@/services/api";
import { useSnackbar } from "notistack";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    userName: z.string().min(1, "User name is required"),
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
      message: "End time must be greater than start time",
      path: ["endTime"],
    }
  );

export default function BookingForm({
  open,
  selected,
  onClose,
}: any) {
  const { data: rooms = [] } = useGetRoomsQuery(undefined);

  const [createBooking] = useCreateBookingMutation();

  const { enqueueSnackbar } = useSnackbar();

  const getTodayDate = () => {
    const d = new Date();

    return new Date(
      d.getTime() - d.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 10);
  };

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
      date: getTodayDate(),
      startTime: "",
      endTime: "",
      reason: "",
    },
  });

  const startTime = useWatch({
    control,
    name: "startTime",
  });

  const endTime = useWatch({
    control,
    name: "endTime",
  });

  const capacity = useWatch({
    control,
    name: "capacity",
  });

  const { data: availabilityData } = useGetAvailabilityQuery(
    {
      start_time: startTime
        ? new Date(
            `1970-01-01T${startTime}:00`
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "",

      end_time: endTime
        ? new Date(
            `1970-01-01T${endTime}:00`
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "",

      required_capacity: Number(capacity),
    },
    {
      skip: !startTime || !endTime || !capacity,
    }
  );

  useEffect(() => {
    if (selected?.prefill) {
      setValue("roomName", selected.room_name || "");
      setValue("date", selected.date?.split("T")[0] || "");
      setValue(
        "startTime",
        selected.start_time?.slice(0, 5) || ""
      );
      setValue(
        "endTime",
        selected.end_time?.slice(0, 5) || ""
      );
    }
  }, [selected, setValue]);

  const onSubmit = async (data: any) => {
    const selectedRoom = rooms.find(
      (r: any) => r.name === data.roomName
    );

    const enteredCapacity = Number(data.capacity);

    const roomCapacity = Number(
      selectedRoom?.capacity
    );

    if (enteredCapacity > roomCapacity) {
      enqueueSnackbar(
        `❌ ${data.roomName} supports only ${roomCapacity}`,
        {
          variant: "error",
        }
      );
      return;
    }

    try {
      await createBooking({
        user_name: data.userName,
        room_name: data.roomName,
        required_capacity: enteredCapacity,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        reason: data.reason,
      }).unwrap();

      enqueueSnackbar(
        "Room booked successfully",
        {
          variant: "success",
        }
      );

      reset();

      onClose();
    } catch (error: any) {
  console.error("Booking Error:", error);

  let message = "Booking Failed";

  if (error?.data?.detail) {
    if (typeof error.data.detail === "string") {
      message = error.data.detail;
    } else if (
      typeof error.data.detail === "object"
    ) {
      message =
        error.data.detail.message ||
        JSON.stringify(error.data.detail);
    }
  }

  enqueueSnackbar(message, {
    variant: "error",
  });
  }
  };

  const availableRooms =
    availabilityData?.available_rooms?.map(
      (r: any) => r.room_name
    ) || [];

  const roomsToShow =
    availableRooms.length > 0
      ? rooms.filter((r: any) =>
          availableRooms.includes(r.name)
        )
      : rooms;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          fontSize: "16px",
          pb: 1,
        }}
      >
        Book Room
      </DialogTitle>

      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          mt={1}
        >
          <Typography fontSize="13px">
            User Name *
          </Typography>

          <Controller
            name="userName"
            control={control}
            render={({ field }) => (
              <TextField
                size="small"
                {...field}
                error={!!errors.userName}
                helperText={
                  errors.userName?.message
                }
              />
            )}
          />

          <Typography fontSize="13px">
            Room *
          </Typography>

          <Controller
            name="roomName"
            control={control}
            render={({ field }) => (
              <Select
                size="small"
                {...field}
                error={!!errors.roomName}
              >
                {roomsToShow.map((r: any) => (
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

          <Typography fontSize="13px">
            Capacity *
          </Typography>

          <Controller
            name="capacity"
            control={control}
            render={({ field }) => (
              <TextField
                size="small"
                type="number"
                {...field}
                error={!!errors.capacity}
                helperText={
                  errors.capacity?.message
                }
              />
            )}
          />

          <Typography fontSize="13px">
            Date *
          </Typography>

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                type="date"
                size="small"
                {...field}
              />
            )}
          />

          <Typography fontSize="13px">
            Start Time *
          </Typography>

          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TextField
                type="time"
                size="small"
                {...field}
              />
            )}
          />

          <Typography fontSize="13px">
            End Time *
          </Typography>

          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <TextField
                type="time"
                size="small"
                {...field}
                error={!!errors.endTime}
                helperText={
                  errors.endTime?.message
                }
              />
            )}
          />

          <Typography fontSize="13px">
            Reason *
          </Typography>

          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <Select
                size="small"
                {...field}
                error={!!errors.reason}
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
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 1 }}>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          size="small"
          sx={{ textTransform: "none" }}
        >
          Book
        </Button>

        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          sx={{ textTransform: "none" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}