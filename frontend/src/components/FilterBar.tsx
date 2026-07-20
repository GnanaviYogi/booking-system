"use client";

import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";

import { useState } from "react";

export default function FilterBar({
  searchUser,
  setSearchUser,
  filterRoom,
  setFilterRoom,
  filterDate,
  setFilterDate,
  reason,
  setReason,
  rooms = [],
}: any) {
  const [error, setError] =
    useState("");

  const handleUserChange = (
    value: string
  ) => {
    const regex = /^[A-Za-z\s]*$/;

    if (regex.test(value)) {
      setSearchUser(value);
      setError("");
    } else {
      setError(
        "Only alphabets allowed"
      );

      setTimeout(() => {
        setError("");
      }, 1000);
    }
  };

  const glassField = {
    minWidth: 200,

    "& .MuiOutlinedInput-root": {
      background:
        "rgba(255,255,255,.08)",

      borderRadius: "14px",

      color: "white",

      backdropFilter:
        "blur(20px)",
    },

    "& .MuiOutlinedInput-notchedOutline":
      {
        borderColor:
          "rgba(255,255,255,.12)",
      },

    "& .MuiInputLabel-root": {
      color:
        "rgba(255,255,255,.7)",
    },

    "& input": {
      color: "white",
    },
  };

  return (
    <Box
      sx={{
        p: 3,

        mb: 2,

        background:
          "rgba(255,255,255,.08)",

        backdropFilter:
          "blur(20px)",

        border:
          "1px solid rgba(255,255,255,.12)",

        borderRadius: "24px",
      }}
    >
      <Box mb={2}>
        <Typography
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: "18px",
          }}
        >
          Search & Filters
        </Typography>

        <Typography
          sx={{
            color:
              "rgba(255,255,255,.7)",
            fontSize: "13px",
          }}
        >
          Quickly find room bookings
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* USER */}

        <TextField
          label="🔍 Search User"
          value={searchUser}
          size="small"
          error={!!error}
          helperText={error}
          onChange={(e) =>
            handleUserChange(
              e.target.value
            )
          }
          sx={glassField}
        />

        {/* REASON */}

        <Select
          size="small"
          value={reason}
          displayEmpty
          onChange={(e) =>
            setReason(
              e.target.value
            )
          }
          sx={{
            ...glassField,

            minWidth: 180,

            color: "white",
          }}
        >
          <MenuItem value="">
            All Reasons
          </MenuItem>

          <MenuItem value="Meeting">
            Meeting
          </MenuItem>

          <MenuItem value="Interview">
            Interview
          </MenuItem>

          <MenuItem value="Training">
            Training
          </MenuItem>

          <MenuItem value="Presentation">
            Presentation
          </MenuItem>

          <MenuItem value="Workshop">
            Workshop
          </MenuItem>

          <MenuItem value="Other">
            Other
          </MenuItem>
        </Select>

        {/* ROOM */}

        <Select
          size="small"
          value={filterRoom}
          displayEmpty
          onChange={(e) =>
            setFilterRoom(
              e.target.value
            )
          }
          sx={{
            ...glassField,

            minWidth: 220,

            color: "white",
          }}
        >
          <MenuItem value="">
            All Rooms
          </MenuItem>

          {rooms.map((r: any) => (
            <MenuItem
              key={r.id}
              value={r.name}
            >
              {r.name} (
              {r.capacity} seats)
            </MenuItem>
          ))}
        </Select>

        {/* DATE */}

        <TextField
          type="date"
          size="small"
          value={filterDate}
          onChange={(e) =>
            setFilterDate(
              e.target.value
            )
          }
          sx={glassField}
        />

        {/* CLEAR */}

        <Button
          variant="contained"
          onClick={() => {
            setSearchUser("");
            setFilterRoom("");
            setFilterDate("");
            setReason("");
            setError("");
          }}
          sx={{
            height: "40px",

            borderRadius: "14px",

            textTransform:
              "none",

            fontWeight: 600,

            background:
              "linear-gradient(135deg,#3B82F6,#8B5CF6)",

            "&:hover": {
              background:
                "linear-gradient(135deg,#2563EB,#7C3AED)",
            },
          }}
        >
          Clear Filters
        </Button>
      </Box>
    </Box>
  );
}