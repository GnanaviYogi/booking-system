"use client";

import { useState, useRef } from "react";
import {
  useGetBookingsQuery,
  useGetRoomsQuery,
  useDeleteBookingMutation,
  useUpdateBookingMutation,
} from "@/services/api";

import { Box, Paper, Typography, Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import ScheduleGrid from "./ScheduleGrid";
import BookingModal from "./BookingModal";

export default function BookingList() {

  const { data: bookings = [] } = useGetBookingsQuery(undefined);
  const { data: rooms = [] } = useGetRoomsQuery(undefined);

  const [deleteBooking] = useDeleteBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();

  const [selected, setSelected] = useState<any>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState<boolean>(false);

  const dateRef = useRef<HTMLInputElement>(null);

  const times = Array.from({ length: 10 }, (_, i) => i + 8);

  // ✅ DATE FIX (SAFE LOCAL FORMAT)
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

      {/* HEADER */}
      <Paper
        sx={{
          p: 1,
          mb: 1,
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg,#1e3c72,#2a5298)",
          color: "white",
        }}
      >
        <Button
          variant="contained"
          onClick={() => shiftDate(-1)}
          sx={{ textTransform: "none" }}
        >
          ⬅ Prev
        </Button>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography fontWeight="bold">
            {date.toDateString()}
          </Typography>

          <CalendarMonthIcon
            sx={{ cursor: "pointer" }}
            onClick={() => dateRef.current?.showPicker()}
          />

          <input
            type="date"
            ref={dateRef}
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.value) {
                setDate(new Date(e.target.value));
              }
            }}
          />
        </Box>

        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            onClick={() => setDate(new Date())}
            sx={{ textTransform: "none" }}
          >
            Today
          </Button>

          <Button
            variant="contained"
            onClick={() => shiftDate(1)}
            sx={{ textTransform: "none" }}
          >
            Next ➡
          </Button>
        </Box>
      </Paper>

      {/* GRID + BUTTON */}
      <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}>
        <ScheduleGrid
          rooms={rooms}
          bookings={bookings}
          times={times}
          currentDateStr={currentDateStr}
          onEdit={(booking: any) => {
            setSelected(booking);   // ✅ EDIT MODE
            setShowForm(true);
          }}
          onDelete={(id: number) => {
            if (confirm("Delete this booking?")) {
              deleteBooking(id);
            }
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              setSelected(null);    // ✅ NEW BOOKING MODE
              setShowForm(true);
            }}
            sx={{ textTransform: "none" }}
          >
            + Book Room
          </Button>
        </Box>
      </Box>

      {/* MODAL */}
      <BookingModal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setSelected(null);
        }}
        selected={selected}
        updateBooking={updateBooking}
      />

    </Box>
  );
}