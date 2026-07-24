"use client";

import { useRouter, usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import { hasPermission } from "@/utils/permissions";
import { useGetMeQuery } from "@/services/api";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: me } =
    useGetMeQuery(undefined);

  const navItems = [
  {
    label: "Dashboard",
    path: "/",
    visible: true,
  },
  {
    label: "Bookings",
    path: "/list",
    visible: hasPermission("booking:view"),
  },
  {
    label: "Calendar",
    path: "/calendar",
    visible: hasPermission("booking:view"),
  },
  {
    label: "Reserve Room",
    path: "/booking",
    visible: hasPermission("booking:create"),
  },
  {
    label: "Users",
    path: "/users",
    visible: hasPermission("user:view"),
  },
].filter((item) => item.visible);

  return (
    <div
      style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  position: "sticky",
  top: 10,
  zIndex: 9999,

  padding: "18px 24px",
  marginBottom: "24px",

  background: "rgba(15,23,42,.95)",
  backdropFilter: "blur(20px)",

  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: "20px",
}}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          overflowX: "auto",
          overflowY:"hidden",
          scrollbarWidth: "thin",
          maxWidth: "100%",
          paddingBottom:"4px",
        }}
      >
        <div
          onClick={() => router.push("/")}
          style={{
            cursor: "pointer",
            color: "white",
            fontWeight: 700,
            fontSize: "22px",
            marginRight: "24px",
          }}
        >
          🏢 Room Booking
        </div>

        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() =>
              router.push(item.path)
            }
            style={{
              background:
                pathname === item.path
                  ? "linear-gradient(135deg,#3B82F6,#8B5CF6)"
                  : "transparent",

              border:
                "1px solid rgba(255,255,255,.12)",

              color: "white",

              padding: "10px 18px",

              borderRadius: "12px",

              cursor: "pointer",

              transition: ".3s",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

<UserMenu
  userEmail={me?.email || "User"}
/>

    </div>
  );
}