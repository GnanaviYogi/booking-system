"use client";

import { useState } from "react";
import RoomList from "@/components/RoomList";
import BookingList from "@/components/BookingList";
import BookingForm from "@/components/BookingForm";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
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
          fontSize: "28px",
          fontWeight: "600",
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
          minHeight: "500px",
          background: "white",
          borderRadius: "15px",
          padding: "10px",
        }}
      >
        <div style={{ width: "15%" }}>
          <RoomList />
        </div>

        <div style={{ width: "85%", overflow: "auto" }}>
          <BookingList onOpenForm={() => setShowForm(true)} />
        </div>
      </div>

      {/* ✅ SINGLE DIALOG */}
      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        fullWidth
      >
        <DialogTitle>Book Room</DialogTitle>

        <DialogContent>
          {/* ✅ FIXED */}
          <BookingForm
            open={showForm}
            selected={null}
            onClose={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
