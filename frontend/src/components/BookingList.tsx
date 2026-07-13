"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Pagination,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  useGetBookingsQuery,
  useGetRoomsQuery,
  useDeleteBookingMutation,
} from "@/services/api";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BookingModal from "./BookingModal";
import FilterBar from "./FilterBar";
import ScheduleGrid from "./ScheduleGrid";

export default function BookingList({
  onOpenForm,
  selectedRoom,
}: any) {
  const [searchUser, setSearchUser] = useState("");
  const [filterReason, setFilterReason] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterRoom, setFilterRoom] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [viewMode, setViewMode] = useState<
    "list" | "calendar"
  >("list");

  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const currentDateStr =
    currentDate.toISOString().split("T")[0];
  
  const dayOfWeek = currentDate.getDay(); // 0=Sun, 6=Sat

  const isWeekend =
    dayOfWeek === 0 || dayOfWeek === 6;

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };
  const [bookingToDelete, setBookingToDelete] =
  useState<number | null>(null);

  
  const handleEdit = (booking: any) => {
  setSelected(booking);
  setShowModal(true);
};

const handleDelete = (id: any) => {
  setBookingToDelete(id);
  setConfirmOpen(true);
};
  

  const times = Array.from(
  { length: 10 },
  (_, i) => i + 8
);

useEffect(() => {
  setPage(1);
}, [
  searchUser,
  filterReason,
  filterRoom,
  filterDate,
  selectedRoom,
  itemsPerPage,
]);





const { data: bookingsData } = useGetBookingsQuery({
  ...(searchUser && {
    user_name: searchUser,
  }),

  ...(selectedRoom && {
    room_name: filterRoom || selectedRoom,
  }),

  
 ...(filterReason && {
    reason: filterReason,
  }),

  ...(filterDate && {
    date: filterDate,
  }),

  ...(!filterDate && {
    date: currentDateStr,
  }),


  
  date: currentDateStr,

  limit:
    viewMode === "calendar"
      ? 5000
      : itemsPerPage,

  offset:
    viewMode === "calendar"
      ? 0
      : (page - 1) * itemsPerPage,
});

const bookings = isWeekend
  ? []
  : bookingsData?.data ?? [];
const total = isWeekend
  ? 0
  : bookingsData?.total || 0;

  console.table(
  bookings.map((b: any) => ({
    user: b.user_name,
    start: b.start_time,
    end: b.end_time,
  }))
);


const { data: rooms = [] } =
  useGetRoomsQuery(undefined);

const [deleteBooking] =
  useDeleteBookingMutation();


  const [selected, setSelected] =
    useState<any>(null);

  const [showModal, setShowModal] =
    useState(false);

  const [confirmOpen, setConfirmOpen] =
    useState(false);
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




  const totalPages = Math.max(
    1,
    Math.ceil(total / itemsPerPage)
  );

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}

      <Paper
        sx={{
          p: 1.5,
          mb: 1,
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          background:
            "linear-gradient(135deg,#1e3c72,#2a5298)",
          color: "white",
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {selectedRoom
            ? `${selectedRoom} Room Bookings`
            : "All Bookings"}
        </Typography>

        <Box
          display="flex"
          gap={2}
          alignItems="center"
          flexWrap="wrap"
        >
          <Button
            
            
            sx={{
              color: "white",
              textTransform: "none",
            }}

            onClick={handlePrevDay}
          >
            Prev
          </Button>

          <Typography>
            {currentDate.toDateString()}
          </Typography>

          <TextField
            type="date"
            size="small"
            value={currentDateStr}
            onChange={(e) =>
              setCurrentDate(
                new Date(e.target.value)
              )
            }
            sx={{
              bgcolor: "white",
              borderRadius: 1,
            }}
          />

          <Button
            
            sx={{
              color: "white",
              textTransform: "none",
            }}
            onClick={handleToday}
          >
            Today
          </Button>

          <Button
            
            sx={{
              color: "white",
              textTransform: "none",
            }} 
            onClick={handleNextDay}
          >
            Next
          </Button>

          <Button
            sx={{
              color: "white",
              textTransform: "none",
            }}
            variant="contained"
            onClick={onOpenForm}
          >
            Book Form
          </Button>

          <Button
      
            sx={{
              color: "white",
              textTransform: "none",
            }}
              onClick={() =>
              setViewMode(
                viewMode === "list"
                  ? "calendar"
                  : "list"
              )
            }
          >
            {viewMode === "list"
              ? "Calendar View"
              : "List View"}
          </Button>
        </Box>
      </Paper>

      {/* FILTERS */}

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


        {isWeekend && (
      <Paper
        sx={{
          p: 3,
          textAlign: "center",
          bgcolor: "#fff8e1",
          mb: 2,
        }}
      >
        <Typography variant="h6">
          No bookings on weekends
        </Typography>

        <Typography>
          Saturday and Sunday are non-working days.
        </Typography>
      </Paper>
    )}

      {/* LIST VIEW */}

      {viewMode === "list" && (
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
          }}
        >
          <Paper sx={{ p: 2 }}>
            {/* rows */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "2fr 1.5fr 2fr 1fr 1fr",
              p: 1.5,
              mb: 1,
              bgcolor: "#e2e8f0",
              borderRadius: 1,
              fontWeight: 700,
            }}
          >
            <Typography fontWeight={700}>
              Room Name
            </Typography>

            <Typography fontWeight={700}>
              User Name
            </Typography>

            <Typography fontWeight={700}>
              Booking Time
            </Typography>

            <Typography fontWeight={700}>
              Reason
            </Typography>

            <Typography fontWeight={700}>
              Actions
            </Typography>
          </Box>

           {bookings.map((b: any) => (
          <Box
            key={b.id}
            sx={{
              display: "grid",
              gridTemplateColumns:
                "2fr 1.5fr 2fr 1fr 1fr",

              alignItems: "center",
              p: 1,
              mb: 0.5,

              background:
                `${roomColors[b.room_name] || "#ccc"}12`,

              borderLeft:
                `6px solid ${
                  roomColors[b.room_name] || "#ccc"
                }`,

              borderRadius: 1,

              transition: "0.2s",

              "&:hover": {
                background:
                  `${roomColors[b.room_name] || "#ccc"}20`,
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                color:
                  roomColors[b.room_name] ||
                  "inherit",
              }}
            >
              {b.room_name}
            </Typography>

            <Typography>
              {b.user_name}
            </Typography>

            <Typography>
          {new Date(
            `1970-01-01T${b.start_time}`
          ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
          {" - "}
          {new Date(
            `1970-01-01T${b.end_time}`
          ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </Typography>


        <Typography>
          {b.reason}
        </Typography>

        <Box display="flex" gap={2}>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(b)}
            sx={{
              textTransform: "none",
              minWidth: "70px",
            }}
          >
            Edit
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(b.id)}
            sx={{
              textTransform: "none",
              minWidth: "80px",
            }}
          >
            Delete
          </Button>

        </Box>
      </Box>
    ))}
            {/* PAGINATION */}

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Typography>
                  Per page
                </Typography>

                <Select
                  size="small"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(
                      Number(e.target.value)
                    );
                    setPage(1);
                  }}
                >
                  <MenuItem value={10}>
                    10
                  </MenuItem>
                  <MenuItem value={20}>
                    20
                  </MenuItem>
                  <MenuItem value={50}>
                    50
                  </MenuItem>
                </Select>

                <Typography>
                  {total === 0
                    ? "0-0"
                    : `${(page - 1) *
                        itemsPerPage +
                        1}-${Math.min(
                        page *
                          itemsPerPage,
                        total
                      )}`}
                  {" "}of {total}
                </Typography>
              </Box>

              <Pagination
                page={page}
                count={totalPages}
                color="primary"
                onChange={(_, value) =>
                  setPage(value)
                }
                showFirstButton
                showLastButton
              />
            </Box>
          </Paper>
        </Box>
      )}

      {/* CALENDAR VIEW */}

      {viewMode === "calendar" && (
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            px: 2,
          }}
        >
          <ScheduleGrid
            rooms={rooms}
            bookings={bookings}
            times={times}
            currentDateStr={currentDateStr}
            onEdit={(booking: any) => {
              handleEdit(booking);
            }}
            onDelete={(id: any) => {
              handleDelete(id);
            }}
          />

        </Box>
      )}

      <BookingModal
        open={showModal}
        onClose={() =>
          setShowModal(false)
        }
        selected={selected}
      />

      <Dialog
        open={confirmOpen}
        onClose={() =>
          setConfirmOpen(false)
        }
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>

        <DialogContent>
          Delete this booking?
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setConfirmOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            color="error"
            onClick={async () => {
              if (bookingToDelete !== null) {
                await deleteBooking(
                  bookingToDelete
                ).unwrap();
              }

              setConfirmOpen(false);
              setBookingToDelete(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}