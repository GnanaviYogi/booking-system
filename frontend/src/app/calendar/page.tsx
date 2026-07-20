"use client";

import { useState } from "react";

import AppLayout from "@/components/layouts/AppLayout";
import RoomList from "@/components/RoomList";
import ScheduleGrid from "@/components/ScheduleGrid";
import CalendarToolbar from "@/components/CalendarToolbar";

import {
  useGetRoomsQuery,
  useGetBookingsQuery,
} from "@/services/api";

export default function CalendarPage() {
  const [selectedRoom, setSelectedRoom] =
    useState<string | null>(null);

  const [selectedDate, setSelectedDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const handlePrevDay = () => {
    const d = new Date(currentDate);

    d.setDate(d.getDate() - 1);

    setCurrentDate(d);

    setSelectedDate(
      d.toISOString().split("T")[0]
    );
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);

    d.setDate(d.getDate() + 1);

    setCurrentDate(d);

    setSelectedDate(
      d.toISOString().split("T")[0]
    );
  };

  const handleToday = () => {
    const today = new Date();

    setCurrentDate(today);

    setSelectedDate(
      today.toISOString().split("T")[0]
    );
  };

  const { data: rooms = [] } =
    useGetRoomsQuery(undefined);

  const { data: bookingsData } =
    useGetBookingsQuery({
      date: selectedDate,
      limit: 5000,
      offset: 0,
    });

  const bookings =
    bookingsData?.data || [];

  const filteredRooms = selectedRoom
    ? rooms.filter(
        (room: any) =>
          room.name === selectedRoom
      )
    : rooms;

  const times = Array.from(
    { length: 10 },
    (_, i) => i + 8
  );

  return (
    <AppLayout>
      <CalendarToolbar
        currentDate={currentDate}
        onPrev={handlePrevDay}
        onToday={handleToday}
        onNext={handleNextDay}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: "20px",

          height: "calc(100vh - 180px)",

          overflow: "hidden",
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
            selectedRoom={
              selectedRoom
            }
            onSelectRoom={
              setSelectedRoom
            }
            selectedDate={
              selectedDate
            }
          />
        </div>


       {/* CALENDAR GRID */}

      <div
        style={{
          height: "100%",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <ScheduleGrid
          rooms={filteredRooms}
          bookings={bookings}
          times={times}
          currentDateStr={selectedDate}
        />
      </div>
      </div>
    </AppLayout>
  );
}