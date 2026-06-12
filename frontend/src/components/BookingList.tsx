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
  Chip
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import BookingModal from "./BookingModal";
import FilterBar from "./FilterBar";

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
  const selectedDateStr = currentDateStr;

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
      b.date?.slice(0, 10) === selectedDateStr &&
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
        color: "white",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        zIndex: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
      }}>
        <Button variant="outlined" sx={{ color: "white", borderColor: "white", textTransform: "none" }} onClick={() => shiftDate(-1)}>
          Prev
        </Button>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography fontWeight="bold">{date.toDateString()}</Typography>
          <TextField type="date" size="small" value={currentDateStr} onChange={(e) => setDate(new Date(e.target.value))} sx={{ background: "white", borderRadius: 1 }} />
          <CalendarMonthIcon />
        </Box>

        <Box display="flex" gap={1}>
          <Button sx={{ textTransform: "none", color: "white", borderColor: "white" }} variant="outlined" onClick={() => setDate(new Date())}>
            Today
          </Button>

          <Button sx={{ textTransform: "none", color: "white", borderColor: "white" }} variant="outlined" onClick={() => shiftDate(1)}>
            Next
          </Button>

          <Button variant="contained" sx={{ background: "white", color: "#1e3c72", ml: 1, textTransform: "none" }} onClick={onOpenForm}>
            Book Form
          </Button>
        </Box>
      </Paper>

      {/* MAIN */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

        {/* FILTER (STATIC) */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 3, mx: 2 }}>
          <FilterBar {...{
            searchUser, setSearchUser, filterRoom, setFilterRoom,
            filterDate, setFilterDate, reason: filterReason,
            setReason: setFilterReason, rooms
          }} onSearch={() => {}} />
        </Paper>

        {/* BOOKINGS SCROLL ONLY */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 2 }}>

          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography fontWeight="bold" mb={2}>
              {selectedRoom ? `Bookings for ${selectedRoom}` : "All Bookings"}
            </Typography>

            {(selectedRoom
              ? filteredBookings.filter((b: any) => b.room_name === selectedRoom)
              : filteredBookings
            )
              .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time))
              .map((b: any) => (
                <Box
                  key={b.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: "6px 10px",
                    minHeight: "36px",
                    borderBottom: "1px solid #eee",
                    borderLeft: `4px solid ${roomColors[b.room_name] || "#ccc"}`,
                    background: `${roomColors[b.room_name]}10`,
                    "&:hover": {
                      background: `${roomColors[b.room_name]}20`,
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography fontSize={11} fontWeight="600" minWidth={70} sx={{ color: roomColors[b.room_name] }}>
                      {b.room_name}
                    </Typography>

                    <Typography fontSize={11} minWidth={90}>
                      {b.user_name}
                    </Typography>

                    <Typography fontSize={11} minWidth={130}>
                      {formatTime12(b.start_time)} - {formatTime12(b.end_time)}
                    </Typography>

                    <Chip
                      label={b.reason}
                      size="small"
                      sx={{
                        height: "20px",
                        fontSize: "10px",
                        background: `${roomColors[b.room_name]}20`,
                        color: roomColors[b.room_name],
                      }}
                    />
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button size="small" variant="outlined" startIcon={<EditIcon />} sx={{ textTransform: "none", padding: "2px 6px" }} onClick={() => { setSelected(b); setShowModal(true); }}>
                      Edit
                    </Button>

                    <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} sx={{ textTransform: "none", padding: "2px 6px" }} onClick={() => { setBookingToDelete(b.id); setConfirmOpen(true); }}>
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}

            {filteredBookings.length === 0 && (
              <Typography textAlign="center" mt={2} color="gray">
                No bookings for this date
              </Typography>
            )}
          </Paper>

        </Box>
      </Box>

      {/* MODAL */}
      <BookingModal open={showModal} onClose={() => { setShowModal(false); setSelected(null); }} selected={selected} />

      {/* DELETE CONFIRM */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          <Typography>Are you sure you want to delete this booking?</Typography>
        </DialogContent>

        <DialogActions>
          <Button sx={{ textTransform: "none" }} onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>

          <Button color="error" variant="contained" sx={{ textTransform: "none" }} onClick={async () => {
            if (bookingToDelete) await deleteBooking(bookingToDelete);
            setConfirmOpen(false);
          }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}