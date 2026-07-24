"use client";

import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  InputAdornment,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

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

  const roomColors: Record<string, string> = {
  Ganga: "#A5C8FF",
  Yamuna: "#A8E6CF",
  Kaveri: "#D6BCFA",
  Narmada: "#FFD6A5",
  Saraswathi: "#BDE0FE",
  Brahmaputra: "#FFCAD4",
  Godavari: "#C7CEEA",
  Krishna: "#B8F2E6",
  Mahanadi: "#FAEDCD",
  Sabarmati: "#E0BBE4",
  Tapti: "#D8F3DC",
  Indus: "#CDE7FF",
  Saraswati: "#E9D5FF",
};


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
    "& .MuiOutlinedInput-root": {
      height: 38,

      borderRadius: "12px",

      background:
        "rgba(255,255,255,.05)",

      color: "white",

      "& fieldset": {
        borderColor:
          "rgba(255,255,255,.08)",
      },

      "&:hover fieldset": {
        borderColor:
          "rgba(96,165,250,.4)",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#60A5FA",
      },
    },

    "& .MuiSvgIcon-root": {
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
        mb: 1,

        p: 1.2,

        borderRadius: "16px",

        background:
          "rgba(255,255,255,.05)",

        backdropFilter:
          "blur(20px)",

        border:
          "1px solid rgba(255,255,255,.08)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* SEARCH */}
        <TextField
          placeholder="Search User"
          value={searchUser}
          size="small"
          error={!!error}
          helperText={error}
          onChange={(e) =>
            handleUserChange(
              e.target.value
            )
          }
          sx={{
            ...glassField,
            minWidth: 220,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon
                  fontSize="small"
                />
              </InputAdornment>
            ),
          }}
        />

        {/* REASON */}
      <Select
  size="small"
  displayEmpty
  value={reason || ""}
  onChange={(e) =>
    setReason(e.target.value)
  }
  MenuProps={{
    PaperProps: {
      sx: {
        mt: 1,
        borderRadius: "16px",
        background:
          "rgba(17,25,40,.96)",
        backdropFilter:
          "blur(24px)",
        border:
          "1px solid rgba(255,255,255,.08)",

        "& .MuiMenuItem-root": {
          color: "white",
          minHeight: 42,
          fontWeight: 500,

          "&:hover": {
            background:
              "rgba(255,255,255,.08)",
          },
        },
      },
    },
  }}
  sx={{
    ...glassField,
    minWidth: 160,
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
        {/* ROOM */}
<Select
  size="small"
  displayEmpty
  value={filterRoom || ""}
  onChange={(e) =>
    setFilterRoom(e.target.value)
  }
  renderValue={(selected) => {
    if (!selected) {
      return (
        <Box
          sx={{
            color:
              "rgba(255,255,255,.9)",
            fontWeight: 500,
            fontSize: "14px",
          }}
        >
          All Rooms
        </Box>
      );
    }

    return (
      <Box
        sx={{
          color:
            "rgba(255,255,255,.9)",
          fontWeight: 500,
          fontSize: "14px",
        }}
      >
        {selected}
      </Box>
    );
  }}
  MenuProps={{
    PaperProps: {
      sx: {
        mt: 1,
        p: 1,

        borderRadius: "18px",

        background:
          "rgba(17,25,40,.96)",

        backdropFilter:
          "blur(24px)",

        border:
          "1px solid rgba(255,255,255,.08)",

        boxShadow:
          "0 20px 50px rgba(0,0,0,.35)",
      },
    },
  }}
  sx={{
    ...glassField,
    minWidth: 180,
    color: "white",
  }}
>
  <MenuItem
    value=""
    sx={{
      borderRadius: "12px",
      color: "white",
    }}
  >
    All Rooms
  </MenuItem>

  {rooms.map((r: any) => (
    <MenuItem
      key={r.id}
      value={r.name}
      sx={{
        borderRadius: "12px",
        mb: 0.5,

        background:
          "rgba(255,255,255,.04)",

        borderLeft: `3px solid ${
          roomColors[r.name]
        }`,

        "&:hover": {
          background:
            "rgba(255,255,255,.08)",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            color: "white",
            fontWeight: 500,
            fontSize: "14px",
          }}
        >
          {r.name}
        </Box>

        <Box
          sx={{
            fontSize: "11px",
            color:
              "rgba(255,255,255,.55)",
          }}
        >
          {r.capacity}
        </Box>
      </Box>
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
          sx={{
            ...glassField,
            minWidth: 150,
          }}
        />

        {/* RESET */}
        <Button
          variant="contained"
          startIcon={
            <RestartAltRoundedIcon />
          }
          onClick={() => {
            setSearchUser("");
            setFilterRoom("");
            setFilterDate("");
            setReason("");
            setError("");
          }}
          sx={{
            height: 38,

            borderRadius: "12px",

            textTransform:
              "none",

            px: 2,

            background:
              "linear-gradient(135deg,#3B82F6,#8B5CF6)",

            "&:hover": {
              background:
                "linear-gradient(135deg,#2563EB,#7C3AED)",
            },
          }}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
}