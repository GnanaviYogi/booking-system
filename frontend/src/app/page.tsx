"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import RoomList from "@/components/RoomList";
import BookingList from "@/components/BookingList";
import BookingForm from "@/components/BookingForm";

import { Dialog, DialogTitle, DialogContent } from "@mui/material";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        boxSizing: "border-box",
        background: "linear-gradient(120deg, #dbeafe, #f0f9ff, #eef2ff)",
        padding: "10px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #2563eb, #1d4ed8, #3b82f6)",
          color: "white",
          padding: "18px 20px",
          borderRadius: "12px",
          fontSize: "28px",
          fontWeight: "600",
          marginBottom: "15px",
          boxShadow: "0 8px 20px rgba(37, 99, 235, 0.4)",
        }}
      >
        <span>Room Booking System</span>

        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            border: "none",
            color: "white",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          height: "calc(100% - 80px)",
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
            overflowY: "auto",
          }}
        >
          <RoomList
            selectedRoom={selectedRoom}
            onSelectRoom={setSelectedRoom}
          />
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            width: "85%",
            borderRadius: "12px",
            background: "#ffffff",
            backgroundImage:
              "linear-gradient(to bottom right, #ffffff, #f8fafc)",
            overflow: "hidden",
            padding: "12px",
          }}
        >
          <BookingList
            onOpenForm={() => setShowForm(true)}
            selectedRoom={selectedRoom}
          />
        </div>
      </div>

      {/* DIALOG */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} fullWidth>
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