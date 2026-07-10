"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import RoomList from "@/components/RoomList";
import BookingList from "@/components/BookingList";
import BookingForm from "@/components/BookingForm";
import UserMenu from "@/components/UserMenu";
import StatusSnackbar from "@/components/StatusSnackbar";

import { Dialog, DialogTitle, DialogContent } from "@mui/material";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showForm, setShowForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // ✅ Snackbar state
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] =
    useState<"success" | "error">("success");

  // ✅ AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
    } else {
      setUserEmail(user);
    }
  }, [router]);

  // ✅ ✅ LOGIN SUCCESS MESSAGE 
  useEffect(() => {
    const login = searchParams.get("login");

    if (login === "1") {
      setMessage("Login successful ✅");
      setSeverity("success");
      setOpenSnack(true);

      // ✅ remove query param after showing
      router.replace("/");
    }
  }, [searchParams, router]);

  return (
    <div
      style={{
        height: "100vh",
        padding: "10px",
        background: "linear-gradient(120deg, #dbeafe, #f0f9ff, #eef2ff)",
      }}
    >
      {/* ✅ HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#2563eb",
          color: "white",
          padding: "15px 20px",
          borderRadius: "10px",
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        <span>Room Booking System</span>

        <UserMenu userEmail={userEmail || "User"} />
      </div>

      {/* ✅ MAIN */}
      <div
        style={{
          display: "flex",
          marginTop: "10px",
          height: "90%",
          gap: "10px",
          background: "rgba(255,255,255,0.9)",
          borderRadius: "12px",
          padding: "10px",
        }}
      >
        {/* LEFT */}
        <div style={{ width: "20%" }}>
          <RoomList
            selectedRoom={selectedRoom}
            onSelectRoom={setSelectedRoom}
          />
        </div>

        {/* RIGHT */}
        <div style={{ width: "80%" }}>
          <BookingList
            onOpenForm={() => setShowForm(true)}
            selectedRoom={selectedRoom}
          />
        </div>
      </div>

      {/* ✅ MODAL */}
     <BookingForm
        open={showForm}
        onClose={() => setShowForm(false)}
/>

      {/* ✅ ✅ SNACKBAR */}
      <StatusSnackbar
        open={openSnack}
        message={message}
        severity={severity}
        onClose={() => setOpenSnack(false)}
      />
    </div>
  );
}