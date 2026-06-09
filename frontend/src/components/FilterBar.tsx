"use client";

import { Box, TextField, Select, MenuItem, Button } from "@mui/material";

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
  onSearch, // ✅ needed for search trigger
}: any) {
  return (
    <Box display="flex" gap={2} mb={2} alignItems="center">

      {/* ✅ SEARCH USER */}
      <TextField
        size="small"
        label="Search User"
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch(); // ✅ ENTER triggers search
          }
        }}
      />

      {/* ✅ STEP 1: ADD REASON FILTER */}
<Select
  size="small"
  value={reason}
  onChange={(e) => setReason(e.target.value)}
  displayEmpty
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
      >
        <MenuItem value="">All Rooms</MenuItem>
        {rooms.map((r: any) => (
          <MenuItem key={r.id} value={r.name}>
            {r.name}
          </MenuItem>
        ))}
      </Select>

      {/* ✅ DATE FILTER */}
      <TextField
        type="date"
        size="small"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />

      {/* ✅ SEARCH BUTTON */}
  <Button
  variant="outlined"
  size="small"
  sx={{ textTransform: "none" }}
  onClick={() => {
    // ✅ Reset ALL fields
    setSearchUser("");
    setFilterRoom("");
    setFilterDate("");
    setReason("");                 

    // ✅ Reset backend filters also
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