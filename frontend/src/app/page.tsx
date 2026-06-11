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
        background: "linear-gradient(120deg, #dbeafe, #f0f9ff, #eef2ff)",
        padding: "20px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #2563eb, #1d4ed8, #3b82f6)",
          color: "white",
          padding: "18px 20px",
          borderRadius: "12px",
          fontSize: "28px",
          fontWeight: "600",
          marginBottom: "15px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(37, 99, 235, 0.4)",
          letterSpacing: "0.5px",
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
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          borderRadius: "15px",
          padding: "10px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            width: "15%",
            borderRadius: "12px",
            background: "linear-gradient(#eff6ff, #f1f5f9)",
            padding: "6px",
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
          }}
        >
          <RoomList />
        </div>

        {/* ✅ RIGHT SIDE (ONLY CHANGE HERE) */}
        <div
          style={{
            width: "85%",
            borderRadius: "12px",
            background: "#ffffff",
            backgroundImage:
              "linear-gradient(to bottom right, #ffffff, #f8fafc)",
            overflow: "hidden",

            padding: "12px",   // ✅ ✅ THIS FIXES YOUR ISSUE
          }}
        >
          <BookingList onOpenForm={() => setShowForm(true)} />
        </div>
      </div>

      {/* DIALOG */}
      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "600", color: "#1d4ed8" }}>
          Book Room
        </DialogTitle>

        <DialogContent>
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
