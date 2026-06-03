"use client";

import { useGetRoomsQuery } from "@/services/api";

export default function RoomList() {
  const { data: rooms } = useGetRoomsQuery(undefined);

  const format = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div>
      <h3 style={{ marginBottom: "10px" }}>Rooms</h3>

      {rooms?.map((room: any) => (
        <div
          key={room.id}
          style={{
            marginBottom: "10px",
            padding: "12px",
            borderRadius: "10px",
            background: "linear-gradient(135deg,#f8f9fb,#eef3f9)",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ fontWeight: "600" }}>
            {format(room.name)}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {room.capacity} seats available
          </div>
        </div>
      ))}
    </div>
  );
}