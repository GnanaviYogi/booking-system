"use client";

import { useGetRoomsQuery } from "@/services/api";

export default function RoomList() {
  const { data: rooms } = useGetRoomsQuery(undefined);

  const format = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div
      style={{
        height: "100%",            
        overflowY: "auto",         
        paddingRight: "5px",
      }}
    >
      <h3 style={{ marginBottom: "8px", fontSize: "14px" }}>Rooms</h3>

      {rooms?.map((room: any) => (
        <div
          key={room.id}
          style={{
            marginBottom: "6px",            
            padding: "6px 8px",            
            borderRadius: "8px",
            background: "linear-gradient(135deg,#f8f9fb,#eef3f9)",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)", 
          }}
        >
          <div style={{ fontWeight: "600", fontSize: "12px" }}> 
            {format(room.name)}
          </div>

          <div style={{ fontSize: "10px", color: "#666" }}> 
            {room.capacity} seats available
          </div>
        </div>
      ))}
    </div>
  );
}
