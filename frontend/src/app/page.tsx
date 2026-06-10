"use client";

import { useState, useEffect } from "react";
import RoomList from "@/components/RoomList";
import BookingList from "@/components/BookingList";
import BookingForm from "@/components/BookingForm";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  // ✅ lock background movement
  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "auto";
  }, [showForm]);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "auto",
        background: "#f1f4f9",
        padding: "20px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#1976d2",
          color: "white",
          padding: "18px 20px",
          borderRadius: "12px",
          fontSize: "30px",
          fontWeight: "700",
          marginBottom: "15px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        Room Booking System
      </div>

      {/* MAIN */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          height: "calc(100% - 80px)",
          background: "white",
          borderRadius: "15px",
          padding: "10px",
        }}
      >
        {/* LEFT */}
        <div style={{ width: "15%", paddingRight: "10px" }}>
          <RoomList />

        
        </div>

        {/* RIGHT */}
        <div style={{ width: "85%", overflow: "hidden"}}>
          <BookingList />
        </div>
      </div>

      {/* ✅ FULLY STATIC DIALOG */}
      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        fullWidth
        transitionDuration={0}
        disableScrollLock
        keepMounted
        sx={{
          "& .MuiDialog-paper": {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle>Book Room</DialogTitle>

        <DialogContent sx={{ overflow: "hidden" }}>
          <BookingForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}

