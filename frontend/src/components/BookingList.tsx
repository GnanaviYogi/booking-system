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

export default function BookingList({ onOpenForm }: any) {

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
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ✅ STICKY HEADER */}
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
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}
      >
        <Button
          variant="outlined"
          sx={{ color: "white", borderColor: "white", textTransform: "none" }}
          onClick={() => shiftDate(-1)}
        >
          Prev
        </Button>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography fontWeight="bold">{date.toDateString()}</Typography>

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
          <Button sx={{ textTransform: "none", color: "white", borderColor: "white" }} variant="outlined" onClick={() => setDate(new Date())}>
            Today
          </Button>

          <Button sx={{ textTransform: "none", color: "white", borderColor: "white" }} variant="outlined" onClick={() => shiftDate(1)}>
            Next
          </Button>

          <Button
            variant="contained"
            sx={{
              background: "white",
              color: "#1e3c72",
              ml: 1,
              textTransform: "none"
            }}
            onClick={onOpenForm}
          >
            Book Form
          </Button>
        </Box>
      </Paper>

      {/* MAIN */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <Box sx={{ flex: 1, overflowY: "auto", scrollBehavior: "smooth", px: 2 }}>

          {/* ✅ ROOM GRID */}
          <Box display="grid" gridTemplateColumns="repeat(7,1fr)" gap={1} mb={2}>
            {rooms.map((room: any) => (
              <Paper
                key={room.id}
                onClick={() => {
                  if (selected && selected.id === room.id) setSelected(null);
                  else setSelected(room);
                }}
                sx={{
                  p: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  textAlign: "center",
                  background: selected?.id === room.id ? "#dbeafe" : "#fafbff",
                  border: selected?.id === room.id ? "2px solid #3b82f6" : "1px solid #ddd"
                }}
              >
                <Typography fontSize={13} fontWeight="600">
                  {room.name}
                </Typography>

                <Typography fontSize={10} color="gray">
                  {room.capacity}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* FILTER */}
          <Paper sx={{ p: 2, mb: 2, borderRadius: 3 }}>
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
              onSearch={() => {}}
            />
          </Paper>

          {/* BOOKINGS */}
          <Paper sx={{ mt: 2, p: 2, borderRadius: 3 }}>
            <Typography fontWeight="bold" mb={2}>
              {selected ? `Bookings for ${selected.name}` : "All Bookings"}
            </Typography>

            {(selected
              ? filteredBookings.filter((b: any) => b.room_name === selected.name)
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
                    p: 1,
                    borderBottom: "1px solid #eee",
                    transition: "0.2s",
                    "&:hover": {
                      background: "#f1f5f9",
                      transform: "scale(1.01)"
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={3}>
                    <Typography fontSize={12} fontWeight="600" minWidth={80}>
                      {b.room_name}
                    </Typography>

                    <Typography fontSize={12} minWidth={100}>
                      {b.user_name}
                    </Typography>

                    <Typography fontSize={12} minWidth={140}>
                      {formatTime12(b.start_time)} - {formatTime12(b.end_time)}
                    </Typography>

                    <Chip label={b.reason} size="small" />
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      sx={{ textTransform: "none" }}
                      onClick={() => {
                        setSelected(b);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{ textTransform: "none" }}
                      onClick={() => {
                        setBookingToDelete(b.id);
                        setConfirmOpen(true);
                      }}
                    >
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

      <BookingModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelected(null);
        }}
        selected={selected}
      />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete this booking?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button sx={{ textTransform: "none" }} onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            sx={{ textTransform: "none" }}
            onClick={async () => {
              if (bookingToDelete) {
                await deleteBooking(bookingToDelete);
              }
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