"use client";

import { useState, useMemo, useEffect } from "react";
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

// ✅ NEW ICONS
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // ✅ PAGINATION STATE
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const times = Array.from({ length: 10 }, (_, i) => i + 9);

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

  const formatTime12 = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  const filteredBookings = bookings.filter((b: any) => {

    const roomMatch =
      !selectedRoom ||
      b.room_id === selectedRoom ||
      b.room_name === selectedRoom;

    return (
      b.date?.slice(0, 10) === currentDateStr &&
      (!searchUser || b.user_name?.toLowerCase().includes(searchUser.toLowerCase())) &&
      (!filterRoom || b.room_id === filterRoom || b.room_name === filterRoom) &&
      (!filterReason || b.reason === filterReason) &&
      (!filterDate || b.date?.slice(0, 10) === filterDate) &&
      roomMatch
    );
  });

 const shuffledBookings = useMemo(() => {
  const arr = [...filteredBookings];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}, [filteredBookings]);


  const totalPages = Math.ceil(shuffledBookings.length / itemsPerPage);

  const paginatedBookings = shuffledBookings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [searchUser, filterRoom, filterDate, filterReason, date, selectedRoom]);

  const handleEdit = (b: any) => {
    setSelected(b);
    setShowModal(true);
  };

  const handleDelete = (id: any) => {
    setBookingToDelete(id);
    setConfirmOpen(true);
  };

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
        <Button sx={{ color: "white", textTransform: "none", fontSize: "13px" }} onClick={() => shiftDate(-1)}>
          Prev
        </Button>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography fontSize="13px">{date.toDateString()}</Typography>

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
            sx={{ color: "white", borderColor: "white", textTransform: "none", fontSize: "13px" }}
            onClick={() => setDate(new Date())}
          >
            Today
          </Button>

          <Button
            sx={{ color: "white", borderColor: "white", textTransform: "none", fontSize: "13px" }}
            onClick={() => shiftDate(1)}
          >
            Next
          </Button>

          <Button
            variant="contained"
            sx={{ textTransform: "none", fontSize: "13px" }}
            onClick={onOpenForm}
          >
            Book form
          </Button>

          <Button
            sx={{ color: "white", borderColor: "white", textTransform: "none", fontSize: "13px" }}
            onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
          >
            {viewMode === "list" ? "Calendar view" : "List view"}
          </Button>
        </Box>
      </Paper>

      {/* FILTER */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <FilterBar {...{ searchUser, setSearchUser, filterRoom, setFilterRoom, filterDate, setFilterDate, reason: filterReason, setReason: setFilterReason, rooms }} />
      </Paper>

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <Box sx={{ flex: 1, overflowY: "auto", px: 2 }}>
          <Paper sx={{ p: 2 }}>

            <Typography mb={2} fontSize="14px">
              {selectedRoom
                ? `Bookings for ${typeof selectedRoom === "number"
                  ? rooms.find((r: any) => r.id === selectedRoom)?.name
                  : selectedRoom}`
                : "All Bookings"}
            </Typography>

            <Box display="grid" gridTemplateColumns="1.5fr 1fr 1.5fr 1fr 1fr" fontWeight={700}>
              <Typography fontSize="13px">Meeting Room</Typography>
              <Typography fontSize="13px">User</Typography>
              <Typography fontSize="13px">Time</Typography>
              <Typography fontSize="13px">Reason</Typography>
              <Typography align="right" fontSize="13px">Actions</Typography>
            </Box>

            {paginatedBookings.map((b: any) => (
              <Box key={b.id} sx={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1.5fr 1fr 1fr",
                alignItems: "center",
                p: 1,
                borderLeft: `4px solid ${roomColors[b.room_name]}`,
                background: `${roomColors[b.room_name]}10`,
                mb: 0.5,
              }}>
                <Typography sx={{ color: roomColors[b.room_name], fontWeight: 600, fontSize: "13px" }}>
                  {b.room_name}
                </Typography>

                <Typography fontSize="13px">{b.user_name}</Typography>

                <Typography fontSize="13px">
                  {formatTime12(b.start_time)} - {formatTime12(b.end_time)}
                </Typography>

                <Typography sx={{ color: roomColors[b.room_name], fontSize: "13px" }}>
                  {b.reason}
                </Typography>

                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Box sx={{ cursor: "pointer", color: "#2563eb", fontSize: "13px" }} onClick={() => handleEdit(b)}>
                    <EditIcon sx={{ fontSize: 16 }} /> Edit
                  </Box>

                  <Box sx={{ cursor: "pointer", color: "#dc2626", fontSize: "13px" }} onClick={() => handleDelete(b.id)}>
                    <DeleteIcon sx={{ fontSize: 16 }} /> Delete
                  </Box>
                </Box>
              </Box>
            ))}

            {/* ✅ UPDATED PAGINATION */}
            <Box display="flex" justifyContent="center" alignItems="center" gap={1} mt={2}>

              <Button
                size="small"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                sx={{ minWidth: "30px", p: 0.5 }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
              </Button>

              <Typography fontSize="12px">
                {page} / {totalPages || 1}
              </Typography>

              <Button
                size="small"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(page + 1)}
                sx={{ minWidth: "30px", p: 0.5 }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
              </Button>

            </Box>

          </Paper>
        </Box>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <Box sx={{ flex: 1, overflowY: "auto", px: 2 }}>
          <ScheduleGrid {...{ rooms, bookings: filteredBookings, times, currentDateStr, onEdit: handleEdit, onDelete: handleDelete }} />
        </Box>
      )}

      <BookingModal open={showModal} onClose={() => setShowModal(false)} selected={selected} />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography fontSize="13px">Delete this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button sx={{ fontSize: "13px" }} onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button sx={{ fontSize: "13px" }} color="error"
            onClick={async () => {
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