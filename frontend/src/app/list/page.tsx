"use client";

import { useState } from "react";

import AppLayout from "@/components/layouts/AppLayout";
import RoomList from "@/components/RoomList";
import BookingList from "@/components/BookingList";

export default function ListPage() {
  const [selectedRoom, setSelectedRoom] =
    useState<string | null>(null);

  const [selectedDate, setSelectedDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  return (
    <AppLayout>
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            color: "white",
            margin: 0,
          }}
        >
          📋 Booking Management
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,.7)",
            marginTop: "8px",
          }}
        >
          View and manage room reservations
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "20px",

          height: "calc(100vh - 180px)",
        }}
      >
        {/* ROOM LIST */}

        <div
          style={{
            height: "100%",

            overflowY: "auto",
            overflowX: "hidden",

            paddingRight: "8px",
          }}
        >
          <RoomList
            selectedRoom={selectedRoom}
            onSelectRoom={setSelectedRoom}
            selectedDate={selectedDate}
          />
        </div>

        {/* BOOKING LIST */}

        <div
          style={{
            height: "100%",

            overflowY: "auto",
            overflowX: "hidden",

            minWidth: 0,

            paddingRight: "8px",
          }}
        >
          <BookingList
            selectedRoom={selectedRoom}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
      </div>
    </AppLayout>
  );
}