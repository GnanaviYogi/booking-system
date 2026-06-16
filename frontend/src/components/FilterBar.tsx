"use client";

import { Box, TextField, Select, MenuItem, Button, Typography } from "@mui/material";
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
  onSearch,
}: any) {

  const [error, setError] = useState("");

  // ✅ INPUT VALIDATION + AUTO CLEAR ERROR
  const handleUserChange = (value: string) => {
    const regex = /^[A-Za-z\s]*$/;

    if (regex.test(value)) {
      setSearchUser(value);
      setError("");
    } else {
      setError("Only alphabets allowed");

      // ✅ clear error after 5 seconds
      setTimeout(() => {
        setError("");
      }, 1000);
    }
  };

  const validateAndSearch = () => {
    const regex = /^[A-Za-z\s]*$/;

    if (searchUser && !regex.test(searchUser)) {
      setError("User name should contain only alphabets");

      setTimeout(() => {
        setError("");
      }, 1000);

      return;
    }

    setError("");
    onSearch();
  };

  return (
    <Box display="flex" gap={2} mb={2} alignItems="center" flexWrap="wrap">

      {/* ✅ SEARCH USER */}
      <Box display="flex" flexDirection="column">
        <TextField
          size="small"
          label="Search User"
          value={searchUser}
          onChange={(e) => handleUserChange(e.target.value)}
          error={!!error}
          helperText={error}
          onKeyDown={(e) => {
            if (e.key === "Enter") validateAndSearch();
          }}
        />
      </Box>

      {/* ✅ REASON FILTER */}
      <Select
        size="small"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        displayEmpty
        onKeyDown={(e) => {
          if (e.key === "Enter") validateAndSearch();
        }}
      >
        <MenuItem value="">All Reasons</MenuItem>
        <MenuItem value="Meeting">Meeting</MenuItem>
        <MenuItem value="Interview">Interview</MenuItem>
        <MenuItem value="Training">Training</MenuItem>
        <MenuItem value="Presentation">Presentation</MenuItem>
        <MenuItem value="Workshop">Workshop</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </Select>

      {/* ✅ ROOM FILTER */}
      <Select
        size="small"
        value={filterRoom}
        onChange={(e) => setFilterRoom(e.target.value)}
        displayEmpty
        onKeyDown={(e) => {
          if (e.key === "Enter") validateAndSearch();
        }}
      >
        <MenuItem value="">All Rooms</MenuItem>
        {rooms.map((r: any) => (
          <MenuItem key={r.id} value={r.name}>
            {r.name} ({r.capacity} seats)
          </MenuItem>
        ))}
      </Select>

      {/* ✅ DATE FILTER */}
      <TextField
        type="date"
        size="small"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") validateAndSearch();
        }}
      />

      {/* ✅ CLEAR BUTTON */}
      <Button
        variant="outlined"
        size="small"
        sx={{ textTransform: "none" }}
        onClick={() => {
          setSearchUser("");
          setFilterRoom("");
          setFilterDate("");
          setReason("");
          setError("");

          onSearch({
            user_name: "",
            room_name: "",
            date: "",
            reason: "",
          });
        }}
      >
        Clear
      </Button>

    </Box>
  );
}
