"use client";

import { useState } from "react";
import {
  useGetBookingsQuery,
  useGetRoomsQuery,
  useDeleteBookingMutation,
  useUpdateBookingMutation,
} from "@/services/api";

import { Box, Paper, Typography, Button, TextField } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import ScheduleGrid from "./ScheduleGrid";
import BookingModal from "./BookingModal";
import BookingForm from "./BookingForm";

export default function BookingList() {

  const { data: bookings = [] } = useGetBookingsQuery(undefined);
  const { data: rooms = [] } = useGetRoomsQuery(undefined);

  const [deleteBooking] = useDeleteBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();

  const [selected, setSelected] = useState<any>(null);
  const [date, setDate] = useState<Date>(new Date());

  const [showModal, setShowModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const times = Array.from({ length: 10 }, (_, i) => i + 8);

  // ✅ DATE FIX
  const getLocalDate = (d: Date) => {
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  };

  const currentDateStr = getLocalDate(date);

  const shiftDate = (n: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + n);
    setDate(newDate);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>

      {/* ✅ HEADER */}
      <Paper
        sx={{
          p: 1.5,
          mb: 1,
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg,#1e3c72,#2a5298)",
          color: "white",
        }}
      >

        {/* ✅ LEFT BUTTON */}
        <Button
          variant="outlined"
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "#ccc" },
            textTransform: "none",
          }}
          onClick={() => shiftDate(-1)}
        >
          ⬅ Prev
        </Button>

        {/* ✅ CENTER DATE + PICKER */}
        <Box display="flex" alignItems="center" gap={2}>

          <Typography fontWeight="bold">
            {date.toDateString()}
          </Typography>

          {/* ✅ FIXED DATE PICKER */}
          <TextField
            type="date"
            size="small"
            value={currentDateStr}
            onChange={(e) => {
              if (e.target.value) {
                setDate(new Date(e.target.value));
              }
            }}
            sx={{
              background: "white",
              borderRadius: 1,
              minWidth: 140,
            }}
          />

          <CalendarMonthIcon />
        </Box>

        {/* ✅ RIGHT BUTTONS */}
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              textTransform: "none",
            }}
            onClick={() => setDate(new Date())}
          >
            Today
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              textTransform: "none",
            }}
            onClick={() => shiftDate(1)}
          >
            Next ➡
          </Button>
        </Box>

      </Paper>

      {/* ✅ GRID */}
      <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}>
        <ScheduleGrid
          rooms={rooms}
          bookings={bookings}
          times={times}
          currentDateStr={currentDateStr}

          onEdit={(booking: any) => {
            setSelected(booking);
            setShowModal(true);
          }}

          onDelete={(id: number) => {
            if (confirm("Delete this booking?")) {
              deleteBooking(id);
            }
          }}
        />

        {/* ✅ CREATE BUTTON */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2}}>
          <Button
            variant="contained"
            onClick={() => setShowCreateForm(true)}
            sx={{ textTransform: "none" }}
          >
            + Book Room
          </Button>
        </Box>
      </Box>

      {/* ✅ CREATE FORM */}
      {showCreateForm && (
        <BookingForm
          open={showCreateForm}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {/* ✅ EDIT MODAL */}
      <BookingModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelected(null);
        }}
        selected={selected}
      />

    </Box>
  );
}