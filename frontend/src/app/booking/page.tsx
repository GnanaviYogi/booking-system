"use client";

import AppLayout from "@/components/layouts/AppLayout";
import BookingForm from "@/components/BookingForm";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function BookingPage() {
  return (
    <ProtectedRoute permission="booking:create">
      <AppLayout>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            paddingBottom: "40px",
          }}
        >
          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <h1
              style={{
                color: "white",
                margin: 0,
              }}
            >
              ➕ New Booking
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,.7)",
              }}
            >
              Create a new room reservation
            </p>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,.08)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <BookingForm />
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}