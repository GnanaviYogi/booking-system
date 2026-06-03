"use client";

import { useState, useEffect, useRef } from "react";
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
import BookingForm from "./BookingForm";

export default function BookingList() {
  const { data: bookings = [] } = useGetBookingsQuery(undefined);
  const { data: rooms = [] } = useGetRoomsQuery(undefined);

  const [updateBooking] = useUpdateBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();

  const [selected, setSelected] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const dateRef = useRef<HTMLInputElement>(null);

  const times = Array.from({ length: 10 }, (_, i) => i + 8);

  // ✅ ✅ ✅ ONLY FIX (LOCAL DATE — THIS WAS THE BUG)
  const getLocalDate = (d: Date) => {
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  };

  const currentDateStr = getLocalDate(date);
  // ✅ ✅ ✅ FIX END

  // ✅ TIME FORMAT
  const formatTime = (time?: string) => {
    if (!time) return "";
    let [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  // ✅ DATE SHIFT
  const shiftDate = (n: number) =>
    setDate(new Date(new Date(date).setDate(date.getDate() + n)));

  // ✅ DELETE
  useEffect(() => {
    if (selected?.delete) {
      const confirmDelete = window.confirm("Delete this booking?");
      if (confirmDelete) deleteBooking(selected.id);
      setSelected(null);
    }
  }, [selected, deleteBooking]);

  // ✅ DOUBLE CLICK
  useEffect(() => {
    if (selected?.prefill) {
      setShowForm(true);
    }
  }, [selected]);

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
        {/* LEFT */}
        <Button variant="contained" onClick={() => shiftDate(-1)}>
          ⬅ Prev
        </Button>

        {/* CENTER */}
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

        {/* RIGHT */}
        <Box display="flex" gap={1}>
          <Button variant="contained" onClick={() => setDate(new Date())}>
            Today
          </Button>

          <Button variant="contained" onClick={() => shiftDate(1)}>
            Next ➡
          </Button>

          <Button variant="contained" onClick={() => setShowSummary(true)}>
            📋 Bookings
          </Button>
        </Box>
      </Paper>

      {/* GRID */}
      <Box sx={{ flex: 1 }}>
        <ScheduleGrid
          rooms={rooms}
          bookings={bookings}
          times={times}
          currentDateStr={currentDateStr}
          onSelect={setSelected}
        />
      </Box>

      {/* FORM */}
      <BookingModal open={showForm} onClose={() => setShowForm(false)}>
        <BookingForm open={showForm} selected={selected} />
      </BookingModal>

      {/* SUMMARY */}
      {showSummary && (
        <Paper
          sx={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "420px",
            maxHeight: "450px",
            overflowY: "auto",
            p: 2,
            borderRadius: 3,
            zIndex: 1000,
          }}
        >
          <Typography fontWeight="bold" mb={1}>
            📋 Bookings for {currentDateStr}
          </Typography>

          {bookings
            .filter((b: any) => b.date?.split("T")[0] === currentDateStr) // ✅ FIX
            .map((b: any) => (
              <Box
                key={b.id}
                sx={{
                  mb: 1,
                  p: 1,
                  borderRadius: 2,
                  background: "#f1f4f9",
                }}
              >
                <Typography fontSize={13}>
                  <b>{b.room_name}</b>
                </Typography>

                <Typography fontSize={12}>
                  {formatTime(b.start_time)} - {formatTime(b.end_time)}
                </Typography>

                <Typography fontSize={12}>
                  👤 {b.user_name}
                </Typography>
              </Box>
            ))}

          <Button
            fullWidth
            variant="contained"
            onClick={() => setShowSummary(false)}
            sx={{ mt: 1 }}
          >
            Close
          </Button>
        </Paper>
      )}

    </Box>
  );
}