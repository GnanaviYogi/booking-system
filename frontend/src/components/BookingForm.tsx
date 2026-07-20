"use client";

import {

  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Box,
  
} from "@mui/material";



import { useEffect, useState } from "react";
import {
  useCreateBookingMutation,
  useGetRoomsQuery,
  useGetAvailabilityQuery,
  useGetBookingsQuery,
} from "@/services/api";
import { useSnackbar } from "notistack";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import BookingConflictAlert from "./BookingConflictAlert";




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
  
  selected,
  
}: any) {
  const { data: rooms = [] } = useGetRoomsQuery(undefined);
  const { data: bookingsData } =
    useGetBookingsQuery({
      limit: 5000,
      offset: 0,
    });

  const bookings =
    bookingsData?.data || [];

  const [createBooking] = useCreateBookingMutation();

  const { enqueueSnackbar } = useSnackbar();
  const [conflictMessage, setConflictMessage] =
    useState("");

  const [conflictBooking, setConflictBooking] =
    useState<any>(null);



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

  useEffect(() => {
    const loggedInUser =
      localStorage.getItem("user");

    if (loggedInUser) {
      setValue(
        "userName",
        loggedInUser.split("@")[0]
      );
    }
  }, [setValue]);

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
      setConflictBooking(null);

      reset();
      window.location.href = "/list";

      
    } catch (error: any) {

  console.log(
    "FULL CONFLICT RESPONSE",
    error
  );

  console.error("Booking Error:", error);


  let message = "Booking Failed";
  const conflict = bookings.find(
    (b: any) =>
      b.room_name === data.roomName &&
      b.date === data.date &&
      data.startTime < b.end_time &&
      data.endTime > b.start_time
  );









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

  if (conflict) {
    setConflictBooking(conflict);
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

      const glassField = {
        "& .MuiOutlinedInput-root": {
          background:
            "rgba(255,255,255,.08)",

          backdropFilter:
            "blur(20px)",

          borderRadius: "14px",

          color: "white",
        },

        "& input": {
          color: "white",
        },

        "& .MuiInputLabel-root": {
          color:
            "rgba(255,255,255,.7)",
        },

        "& .MuiOutlinedInput-notchedOutline": {
          borderColor:
            "rgba(255,255,255,.12)",
        },

        "& .MuiFormHelperText-root": {
          color: "#FCA5A5",
        },
      };



  return (
    <>
      


      <Box>
        
      <BookingConflictAlert
        booking={conflictBooking}
      />




       <Box
        
        display="flex"
        flexDirection="column"
        gap={2}
        mt={2}
      >
          <Typography
            fontSize="13px"
            fontWeight={600}
            color="white"
          >
            User Name *
          </Typography>

          <Controller
            name="userName"
            control={control}
            render={({ field }) => (
              <TextField
                size="small"
                sx={glassField}
                {...field}
                InputProps={{
                  readOnly: true,
                }}
                error={!!errors.userName}
                helperText={
                  errors.userName?.message
                }
              />
            )}
          />
        

          <Typography
             fontSize="13px"
            fontWeight={600}
            color="white"
            >
            Room *
          </Typography>

          <Controller
            name="roomName"
            control={control}
            render={({ field }) => (
              <Select
                size="small"
                {...field}
                
                sx={{
                    
                  ...glassField,
                    "& .MuiInputBase-root": {
                      height: 44,
                    },

                    background:
                      "rgba(255,255,255,.08)",

                    borderRadius: "14px",

                    color: "white",

                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        "rgba(255,255,255,.12)",
                    },
                  }}

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

          <Typography
            fontSize="13px"
            fontWeight={600}
            color="white"
            >
            Capacity *
          </Typography>

          <Controller
            name="capacity"
            control={control}
            render={({ field }) => (
              <TextField
                size="small"
                type="number"
                sx={glassField}
                {...field}
                error={!!errors.capacity}
                helperText={
                  errors.capacity?.message
                }
              />
            )}
          />

          <Typography
            fontSize="13px"
            fontWeight={600}
            color="white"
            >
            Date *
          </Typography>

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                type="date"
                size="small"
                sx={glassField}
                {...field}
              />
            )}
          />

          <Typography
            fontSize="13px"
            fontWeight={600}
            color="white"
          >
            Start Time *
          </Typography>

          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TextField
                type="time"
                size="small"
                sx={glassField}
                {...field}
              />
            )}
          />

          <Typography
            fontSize="13px"
            fontWeight={600}
            color="white"
            >
            End Time *
          </Typography>

          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <TextField
                type="time"
                size="small"
                sx={glassField}
                {...field}
                error={!!errors.endTime}
                helperText={
                  errors.endTime?.message
                }
              />
            )}
          />

          <Typography 
            fontSize="13px"
            fontWeight={600}
            color="white"
            >
            Reason *
          </Typography>

          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <Select
                size="small"
                {...field}
                
            sx={{
                background:
                  "rgba(255,255,255,.08)",

                borderRadius: "14px",

                color: "white",

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor:
                    "rgba(255,255,255,.12)",
                },
              }}

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
      </Box>

      <Box
        mt={3}
        display="flex"
        gap={2}
      >


      <Button
        onClick={handleSubmit(onSubmit)}
        variant="contained"
        sx={{
          px: 4,
          py: 1,
          borderRadius: "12px",
          fontWeight: 700,
          textTransform: "none",
          background:
            "linear-gradient(135deg,#3B82F6,#8B5CF6)",
        }}
      >
        📅 Book Room
      </Button>



        <Button
          onClick={() => {
            window.history.back();
        
          }}

        
          variant="outlined"
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            borderColor:
              "rgba(255,255,255,.2)",
            color:"white",
          }}
         
        >
          Close
        </Button>
      </Box>
    </>
  );
}