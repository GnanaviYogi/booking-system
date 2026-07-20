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

import { useRouter } from "next/navigation";

import {
  useGetBookingsQuery,
  useGetRoomsQuery,
  useDeleteBookingMutation,
} from "@/services/api";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import BookingModal from "./BookingModal";
import FilterBar from "./FilterBar";

export default function BookingList({
  selectedRoom,
  selectedDate,
  setSelectedDate,
}: any) {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] =
    useState(10);

  const [searchUser, setSearchUser] =
    useState("");

  const [filterReason, setFilterReason] =
    useState("");

  const [filterRoom, setFilterRoom] =
    useState("");

  const [filterDate, setFilterDate] =
    useState("");

  const [selected, setSelected] =
    useState<any>(null);

  const [showModal, setShowModal] =
    useState(false);

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const [
    bookingToDelete,
    setBookingToDelete,
  ] = useState<number | null>(null);

  const [currentDate, setCurrentDate] =
    useState(new Date(selectedDate));

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

  const handlePrevDay = () => {
    const d = new Date(selectedDate);

    d.setDate(d.getDate() - 1);

    setCurrentDate(d);

    setSelectedDate(
      d.toISOString().split("T")[0]
    );
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);

    d.setDate(d.getDate() + 1);

    setCurrentDate(d);

    setSelectedDate(
      d.toISOString().split("T")[0]
    );
  };

  const handleToday = () => {
    const today = new Date();

    setCurrentDate(today);

    setSelectedDate(
      today.toISOString().split("T")[0]
    );
  };

  const { data: bookingsData } =
    useGetBookingsQuery({
      ...(searchUser && {
        user_name: searchUser,
      }),

      ...(selectedRoom && {
        room_name:
          filterRoom || selectedRoom,
      }),

      ...(filterReason && {
        reason: filterReason,
      }),

      ...(filterDate && {
        date: filterDate,
      }),

      ...(!filterDate && {
        date: selectedDate,
      }),

      limit: itemsPerPage,

      offset:
        (page - 1) * itemsPerPage,
    });

  const bookings =
    bookingsData?.data || [];

  const total =
    bookingsData?.total || 0;

  const totalPages = Math.max(
    1,
    Math.ceil(total / itemsPerPage)
  );

  const { data: rooms = [] } =
    useGetRoomsQuery(undefined);

  const [deleteBooking] =
    useDeleteBookingMutation();

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

  return (
    <Box>
      {/* HEADER */}

      <Paper
        sx={{
          p: 3,
          height:"100%",
          flexDirection: "column",

          borderRadius: "24px",

          background:
            "rgba(255,255,255,.08)",

          backdropFilter:
            "blur(20px)",

          border:
            "1px solid rgba(255,255,255,.12)",

          boxShadow:
            "0 20px 40px rgba(0,0,0,.25)",

          color: "white",
        }}
      >
        <Box

          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Typography
            fontSize={20}
            fontWeight={700}
          >
            {selectedRoom
              ? `${selectedRoom} Room Bookings`
              : "All Bookings"}
          </Typography>

          <Box
            display="flex"
            gap={1}
            alignItems="center"
            flexWrap="wrap"
          >
            <Button
              variant="outlined"
              onClick={handlePrevDay}
            >
              ◀ Prev
            </Button>

            <Typography>
              {currentDate.toDateString()}
            </Typography>

            <TextField
              type="date"
              size="small"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
            />

            <Button
              variant="contained"
              onClick={handleToday}
            >
              Today
            </Button>

            <Button
              variant="outlined"
              onClick={handleNextDay}
            >
              Next ▶
            </Button>

            <Button
              variant="contained"
              onClick={() =>
                router.push("/booking")
              }
            >
              ➕ New Booking
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* FILTERS */}

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

      {/* TABLE */}

      

      <Paper
        sx={{
          p: 3,
          
          height: "100%",

          overflowY: "auto",

          background:
            "rgba(255,255,255,.08)",

          backdropFilter:
            "blur(20px)",

          border:
            "1px solid rgba(255,255,255,.12)",
          
          borderRadius: "24px",

          color: "white",


                
        }}
      >
        <Box
          sx={{
            overflowX: "auto",
            overflowY: "hidden",
            width: "100%",

          }}
        >
          <Box
           sx={{
            minWidth: "1200px",
           }}
        ></Box>

        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "220px 220px 220px 180px 220px",

            p: 2,

            mb: 2,


            borderRadius: "16px",

            background:
              "rgba(255,255,255,.05)",
          }}
        >
          <Typography fontWeight={700}>
            Room
          </Typography>

          <Typography fontWeight={700}>
            User
          </Typography>

          <Typography fontWeight={700}>
            Time
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
                "220px 220px 220px 180px 220px",

              alignItems: "center",

              p: 2,

              mb: 1.5,

              borderRadius: "16px",

              background:
                "rgba(255,255,255,.04)",

              border:
                "1px solid rgba(255,255,255,.08)",

              borderLeft: `6px solid ${
                roomColors[b.room_name] ||
                "#ccc"
              }`,
            }}
          >
            
            <Typography
              fontWeight={700}
              color={
                roomColors[b.room_name]
              }
            >
              {b.room_name}
            </Typography>

            <Typography>
              {b.user_name}
            </Typography>

            <Typography>
              {b.start_time} -{" "}
              {b.end_time}
            </Typography>

            <Typography>
              {b.reason}
            </Typography>

            <Box
              display="flex"
              gap={1}
            >
              <Button
                variant="contained"
                startIcon={
                  <EditIcon />
                }
                onClick={() => {
                  setSelected(b);
                  setShowModal(true);
                }}
              >
                Edit
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={
                  <DeleteIcon />
                }
                onClick={() => {
                  setBookingToDelete(
                    b.id
                  );
                  setConfirmOpen(true);
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ))}
        
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop:
               "1px solid rgba(255,255,255,.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            bottom: 0,
            background:
               "rgba(15,23,42,.95)",
            zIndex: 10,
          }}
        
        >
          <Select
            size="small"
            value={itemsPerPage}
            onChange={(e) =>
              setItemsPerPage(
                Number(
                  e.target.value
                )
              )
            }
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

          <Pagination
  page={page}
  count={totalPages}
  showFirstButton
  showLastButton
  onChange={(_, value) =>
    setPage(value)
  }
  sx={{
    "& .MuiPaginationItem-root": {
      color: "white",
      border:
        "1px solid rgba(255,255,255,.12)",

      background:
        "rgba(255,255,255,.05)",

      backdropFilter:
        "blur(20px)",

      transition: "all .3s ease",

      "&:hover": {
        background:
          "rgba(255,255,255,.12)",

        transform:
          "translateY(-2px)",
      },
    },

    "& .Mui-selected": {
      background:
        "linear-gradient(135deg,#3B82F6,#8B5CF6) !important",

      color: "white",

      fontWeight: 700,

      boxShadow:
        "0 8px 20px rgba(59,130,246,.4)",
    },
  }}
/>
        </Box>
      </Paper>

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
              if (
                bookingToDelete !==
                null
              ) {
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