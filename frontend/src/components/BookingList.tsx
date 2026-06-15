"use client";

import { useState, useEffect } from "react";
import {
  useGetBookingsQuery,
  useGetRoomsQuery,
  useDeleteBookingMutation,
} from "@/services/api";

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import BookingModal from "./BookingModal";
import FilterBar from "./FilterBar";
import ScheduleGrid from "./ScheduleGrid";


export default function BookingList({ onOpenForm, selectedRoom }: any) {

  const [searchUser, setSearchUser] = useState("");
  const [filterRoom, setFilterRoom] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterReason, setFilterReason] = useState("");

  const { data: bookings = [] } = useGetBookingsQuery({});
  const { data: rooms = [] } = useGetRoomsQuery(undefined);

  const [deleteBooking] = useDeleteBookingMutation();

  const [selected, setSelected] = useState<any>(null);
  const [date, setDate] = useState<Date>(new Date());

  const [showModal, setShowModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<any>(null);

  const roomColors: any = {
    Ganga: "#2563eb",
    Yamuna: "#16a34a",
    Kaveri: "#7c3aed",
    Narmada: "#ea580c",
    Saraswathi: "#0891b2",
    Brahmaputra: "#dc2626",
    Godavari: "#4f46e5",
    Krishna: "#0d9488",
    Mahanadi: "#ca8a04",
    Sabarmati: "#c026d3",
    Tapti: "#65a30d",
    Indus: "#0284c7",
    Saraswati: "#9333ea",
  };

  const getLocalDate = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);

  const currentDateStr = getLocalDate(date);

  const shiftDate = (n: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + n);
    setDate(newDate);
  };

  useEffect(() => {
    const timer = setTimeout(() => {}, 500);
    return () => clearTimeout(timer);
  }, [searchUser, filterRoom, filterDate, filterReason]);

  const formatTime12 = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const filteredBookings = bookings.filter((b: any) => {
    return (
      b.date?.slice(0, 10) === currentDateStr &&
      (!searchUser || b.user_name?.toLowerCase().includes(searchUser.toLowerCase())) &&
      (!filterRoom || b.room_name === filterRoom) &&
      (!filterReason || b.reason === filterReason) &&
      (!filterDate || b.date?.slice(0, 10) === filterDate)
    );
  });

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <Paper sx={{
        p: 1.5,
        mb: 1,
        borderRadius: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "linear-gradient(135deg,#1e3c72,#2a5298)",
        color: "white"
      }}>
        <Button
          variant="outlined"
          size="small"
          sx={{ color: "white", borderColor: "white", textTransform: "none" }}
          onClick={() => shiftDate(-1)}
        >
          Prev
        </Button>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography fontWeight="bold" fontSize={15}>
            {date.toDateString()}
          </Typography>

          <TextField
            type="date"
            size="small"
            value={currentDateStr}
            onChange={(e) => setDate(new Date(e.target.value))}
            sx={{ background: "white", borderRadius: 1 }}
          />

          <CalendarMonthIcon />
        </Box>

        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            sx={{ color: "white", borderColor: "white", textTransform: "none" }}
            onClick={() => setDate(new Date())}
          >
            Today
          </Button>

          <Button
            variant="outlined"
            size="small"
            sx={{ color: "white", borderColor: "white", textTransform: "none" }}
            onClick={() => shiftDate(1)}
          >
            Next
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{ textTransform: "none" }}
            onClick={onOpenForm}
          >
            Book Form
          </Button>
        </Box>
      </Paper>

      {/* FILTER */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <FilterBar
          searchUser={searchUser}
          setSearchUser={setSearchUser}
          filterRoom={filterRoom}
          setFilterRoom={setFilterRoom}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          reason={filterReason}
          setReason={setFilterReason}
          rooms={rooms}
        />
      </Paper>

      {/* BOOKINGS */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2 }}>
        <Paper sx={{ p: 2 }}>

          <Typography fontWeight="bold" mb={2} fontSize={16}>
            {selectedRoom ? `Bookings for ${selectedRoom}` : "All Bookings"}
          </Typography>

          {/* HEADER ROW */}
          <Box sx={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1.5fr 1fr 1fr",
            mb: 1,
            fontWeight: 700
          }}>
            <Typography fontSize={14}>Meeting Room</Typography>
            <Typography fontSize={14}>User</Typography>
            <Typography fontSize={14}>Time</Typography>
            <Typography fontSize={14}>Reason</Typography>
            <Typography fontSize={14} align="right">Actions</Typography>
          </Box>

          {(selectedRoom
            ? filteredBookings.filter((b: any) => b.room_name === selectedRoom)
            : filteredBookings
          )
            .sort(() => Math.random() - 0.5)
            .map((b: any) => (
              <Box
                key={b.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr 1.5fr 1fr 1fr",
                  alignItems: "center",
                  p: "6px 8px",
                  borderLeft: `4px solid ${roomColors[b.room_name]}`,
                  background: `${roomColors[b.room_name]}10`,
                  mb: 0.5
                }}
              >
                <Typography fontSize={13} fontWeight={600} sx={{ color: roomColors[b.room_name] }}>
                  {b.room_name}
                </Typography>

                <Typography fontSize={13}>{b.user_name}</Typography>

                <Typography fontSize={13}>
                  {formatTime12(b.start_time)} - {formatTime12(b.end_time)}
                </Typography>

                <Typography fontSize={13} sx={{ color: roomColors[b.room_name] }}>
                  {b.reason}
                </Typography>

                <Box display="flex" gap={2} justifyContent="flex-end" alignItems="center">
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                    sx={{ cursor: "pointer", color: "#2563eb" }}
                    onClick={() => { setSelected(b); setShowModal(true); }}
                  >
                    <EditIcon fontSize="small" />
                    <Typography fontSize={13}>Edit</Typography>
                  </Box>

                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                    sx={{ cursor: "pointer", color: "#dc2626" }}
                    onClick={() => { setBookingToDelete(b.id); setConfirmOpen(true); }}
                  >
                    <DeleteIcon fontSize="small" />
                    <Typography fontSize={13}>Delete</Typography>
                  </Box>
                </Box>
              </Box>
            ))}

        </Paper>
      </Box>

      <BookingModal open={showModal} onClose={() => { setShowModal(false); setSelected(null); }} selected={selected} />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained"
            onClick={async () => {
              if (bookingToDelete) await deleteBooking(bookingToDelete);
              setConfirmOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
