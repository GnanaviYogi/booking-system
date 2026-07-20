"use client";

import {
  useGetBookingsQuery,
  useGetRoomsQuery,
} from "@/services/api";

import RoomUtilization from "./RoomUtilization";

export default function RoomList({
  selectedRoom,
  onSelectRoom,
  selectedDate,
}: any) {
  const { data: rooms } =
    useGetRoomsQuery(undefined);

  const { data: bookingsData } =
    useGetBookingsQuery({
      date: selectedDate,
      limit: 5000,
      offset: 0,
    });

  const bookings =
    bookingsData?.data || [];

  const dayOfWeek = new Date(
    selectedDate
  ).getDay();

  const isWeekend =
    dayOfWeek === 0 ||
    dayOfWeek === 6;

  const format = (name: string) =>
    name
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        paddingRight: "6px",
      }}
    
    >
      {/* HEADER */}

      <div
        style={{
          padding: "18px",

          marginBottom: "16px",

          borderRadius: "20px",

          background:
            "rgba(255,255,255,.08)",

          backdropFilter:
            "blur(20px)",

          border:
            "1px solid rgba(255,255,255,.12)",
        }}
      >
        <div
          style={{
            
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            paddingRight: "6px",
          }}
        >
          Rooms
        </div>

        <div
          style={{
            color:
              "rgba(255,255,255,.7)",

            fontSize: "13px",

            marginTop: "4px",
          }}
        >
          Select a room to filter
          bookings
        </div>
      </div>

      {rooms?.map((room: any) => {
        const isSelected =
          selectedRoom === room.name;

        return (
          <div
            key={room.id}
            onClick={() =>
              onSelectRoom(
                isSelected
                  ? null
                  : room.name
              )
            }
            style={{
              marginBottom: "14px",

              padding: "18px",

              cursor: "pointer",

              borderRadius: "20px",

              background: isSelected
                ? "linear-gradient(135deg,#3B82F6,#8B5CF6)"
                : "rgba(255,255,255,.08)",

              backdropFilter:
                "blur(20px)",

              border: isSelected
                ? "2px solid #60A5FA"
                : "1px solid rgba(255,255,255,.12)",

              transition:
                "all .3s ease",

              boxShadow: isSelected
                ? "0 12px 30px rgba(59,130,246,.35)"
                : "0 8px 20px rgba(0,0,0,.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0px)";
            }}
          >
            {/* ROOM NAME */}

            <div
              style={{
                color: "white",

                fontWeight: 700,

                fontSize: "16px",

                marginBottom: "10px",
              }}
            >
              {format(room.name)}
            </div>

            {/* CAPACITY */}

            <div
              style={{
                display: "inline-block",

                padding:
                  "6px 12px",

                borderRadius:
                  "999px",

                background:
                  "rgba(255,255,255,.15)",

                color: "white",

                fontSize: "12px",

                marginBottom: "14px",
              }}
            >
              👥 Capacity:{" "}
              {room.capacity}
            </div>

            {/* UTILIZATION */}

            {!isWeekend && (
              <RoomUtilization
                roomName={room.name}
                bookings={bookings}
              />
            )}

            {/* SELECTED BADGE */}

            {isSelected && (
              <div
                style={{
                  marginTop: "12px",

                  color: "white",

                  fontSize: "12px",

                  fontWeight: 600,
                }}
              >
                ✓ Selected Room
              </div>
            )}
          </div>
        );
      })}

      {rooms?.length === 0 && (
        <div
          style={{
            padding: "30px",

            borderRadius: "20px",

            textAlign: "center",

            background:
              "rgba(255,255,255,.08)",

            backdropFilter:
              "blur(20px)",

            border:
              "1px solid rgba(255,255,255,.12)",

            color: "white",
          }}
        >
          No rooms available
        </div>
      )}
    </div>
  );
}