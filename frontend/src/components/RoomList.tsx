"use client";

import { useGetBookingsQuery, useGetRoomsQuery } from "@/services/api";
import RoomUtilization from "./RoomUtilization";

export default function RoomList({ selectedRoom, onSelectRoom, selectedDate }: any) {
  const { data: rooms } = useGetRoomsQuery(undefined);
  const { data: bookingsData } =
    useGetBookingsQuery({
      date: selectedDate,
      limit: 5000,
      offset: 0,
    });

  const bookings =
    bookingsData?.data || [];

  const dayOfWeek =
    new Date(selectedDate).getDay();

  const isWeekend =
    dayOfWeek === 0 || dayOfWeek === 6;

  const format = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1);

  const roomColors: any = {
    Ganga: "#2563eb",
    Yamuna: "#16a34a",
    Kaveri: "#7c3aed",
    Narmada: "#ea580c",
    Saraswathi: "#0891b2",
    Brahmaputra: "#dc2626",
    Godavari: "#4f46e5",
    Krishna: "#0d9488",
    Mahanadi: "#ca8a04",
    Sabarmati: "#c026d3",
    Tapti: "#65a30d",
    Indus: "#0284c7",
    Saraswati: "#9333ea",
  };

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        paddingRight: "5px",
      }}
    >
      <h3 style={{ marginBottom: "8px", fontSize: "14px" }}>Rooms</h3>

      {rooms?.map((room: any) => {
        const color = roomColors[room.name] || "#ccc";

        return (
          <div
            key={room.id}
            onClick={() =>
              onSelectRoom(selectedRoom === room.name ? null : room.name)
            }
            style={{
              marginBottom: "6px",
              padding: "6px 8px",
              borderRadius: "8px",
              cursor: "pointer",

              // ✅ COLOR ALWAYS VISIBLE
              background: `${color}15`,

              // ✅ BORDER ALWAYS COLORED
              border: `1px solid ${color}`,

              // ✅ WHEN SELECTED → STRONG HIGHLIGHT
              ...(selectedRoom === room.name && {
                background: `${color}35`,
                border: `2px solid ${color}`,
                boxShadow: `0 0 6px ${color}66`,
              }),

              color: selectedRoom === room.name ? color : "inherit",

              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontWeight: "600", fontSize: "12px" }}>
              {format(room.name)}
            </div>

            <div style={{ fontSize: "10px", color: "#666" }}>
              {room.capacity} seats available
            </div>
            {!isWeekend && (
              <RoomUtilization
                roomName={room.name}
                bookings={bookings}
              />
            )}
         
            
          </div>
        );
      })}
    </div>
  );
}