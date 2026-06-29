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
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
 
 

  
  const [date, setDate] = useState<Date>(new Date());

  const getLocalDate = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);

  const currentDateStr = getLocalDate(date);

  // ✅ API CALL MUST COME AFTER THIS
  const { data } = useGetBookingsQuery({
    ...(searchUser && { user_name: searchUser }),
    ...(selectedRoom && { room_name: selectedRoom }),
    ...(filterReason && { reason: filterReason }),
    date: currentDateStr,
    limit: itemsPerPage,
    offset: (page - 1) * itemsPerPage,
  });


  // ✅ FIX: extract correctly
  const bookings = data?.data || [];
  const total = data?.total || 0;

  const shuffledBookings = [...bookings].sort(() => Math.random() - 0.5);
  
  const paginatedBookings = shuffledBookings;

  const { data: rooms = [] } = useGetRoomsQuery(undefined);
  const [deleteBooking] = useDeleteBookingMutation();

  const [selected, setSelected] = useState<any>(null);
  

  const [showModal, setShowModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<any>(null);

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // ✅ pagination state (updated)
  

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

  const filteredBookings = bookings;

  


  const totalPages = page + 1;

   

  useEffect(() => {
    setPage(1);
  }, [searchUser, filterRoom, filterDate, filterReason, date, selectedRoom, itemsPerPage]);

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
        <Button sx={{ color: "white" }} onClick={() => shiftDate(-1)}>Prev</Button>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography>{date.toDateString()}</Typography>
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
          <Button sx={{ color: "white", textTransform: "none" }} onClick={() => setDate(new Date())}>Today</Button>
          <Button sx={{ color: "white", textTransform: "none" }} onClick={() => shiftDate(1)}>Next</Button>
          <Button variant="contained" sx={{ textTransform: "none" }} onClick={onOpenForm}>Book form</Button>
          <Button sx={{ color: "white", textTransform: "none" }} onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}>
            {viewMode === "list" ? "Calendar view" : "List view"}
          </Button>
        </Box>

      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <FilterBar {...{ searchUser, setSearchUser, filterRoom, setFilterRoom, filterDate, setFilterDate, reason: filterReason, setReason: setFilterReason, rooms }} />
      </Paper>

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
                  <Box
  onClick={() => handleEdit(b)}
  sx={{
    cursor: "pointer",
    color: "#2563eb", // ✅ blue color
    display: "flex",
    alignItems: "center",
    gap: 0.5
  }}
>
  <EditIcon fontSize="small" /> Edit
</Box>
                  <Box onClick={() => handleDelete(b.id)} sx={{ cursor: "pointer", color: "red" }}>
                    <DeleteIcon fontSize="small" /> Delete
                  </Box>
                </Box>
              </Box>
            ))}

            {/* ✅ ONLY THIS BLOCK CHANGED */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} flexWrap="wrap">

              {/* LEFT */}
              <Box display="flex" alignItems="center" gap={2}>
                <Typography fontSize="12px">Per page</Typography>

                <TextField
                  select
                  size="small"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  SelectProps={{ native: true }}
                  sx={{ width: 70 }}
                >
                  {[5, 10, 20, 50].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </TextField>

                <Typography fontSize="12px">
                  {(page - 1) * itemsPerPage + 1}-
                  {Math.min(page * itemsPerPage, shuffledBookings.length)} of {shuffledBookings.length}
                </Typography>
              </Box>

              {/* RIGHT */}
              <Box display="flex" alignItems="center" gap={1}>
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  <ArrowBackIosNewIcon fontSize="small" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                  .map((p, i, arr) => (
                    <span key={p}>
                      {i > 0 && p - arr[i - 1] > 1 && "..."}
                      <Button
                        size="small"
                        variant={p === page ? "contained" : "text"}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    </span>
                  ))}

                <Button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>
                  <ArrowForwardIosIcon fontSize="small" />
                </Button>
              </Box>

            </Box>

          </Paper>
        </Box>
      )}

      {viewMode === "calendar" && (
        <Box sx={{ flex: 1, overflow: "auto", px: 2 }}>
          <ScheduleGrid {...{ rooms, bookings: filteredBookings, times }} />
        </Box>
      )}

      <BookingModal open={showModal} onClose={() => setShowModal(false)} selected={selected} />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Delete this booking?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={async () => {
            if (bookingToDelete) await deleteBooking(bookingToDelete);
            setConfirmOpen(false);
          }}>Delete</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}