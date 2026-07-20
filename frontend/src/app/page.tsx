"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AppLayout from "@/components/layouts/AppLayout";
import DashboardCards from "@/components/DashboardCards";
import StatusSnackbar from "@/components/StatusSnackbar";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userEmail, setUserEmail] =
    useState<string | null>(null);

  const [openSnack, setOpenSnack] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [severity, setSeverity] =
    useState<"success" | "error">(
      "success"
    );

  // Auth Check
  useEffect(() => {
    const token =
      localStorage.getItem("access_token");

    const user =
      localStorage.getItem("user");

    if (!token) {
      router.push("/login");
    } else {
      setUserEmail(user);
    }
  }, [router]);

  // Login Success Message
  useEffect(() => {
    const login =
      searchParams.get("login");

    if (login === "1") {
      setMessage(
        "Login successful ✅"
      );

      setSeverity("success");
      setOpenSnack(true);

      router.replace("/");
    }
  }, [searchParams, router]);

  return (
    <AppLayout>
      <div
        style={{
          minHeight: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "10px 20px",
              borderRadius: "999px",

              background:
                "rgba(255,255,255,.08)",

              backdropFilter:
                "blur(20px)",

              border:
                "1px solid rgba(255,255,255,.12)",

              color: "#93C5FD",

              marginBottom: "24px",
            }}
          >
            Workspace Reservation Portal
          </div>

          <h1
            style={{
              color: "white",
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Room Booking
            <br />
            Management System
          </h1>

          <p
            style={{
              color:
                "rgba(255,255,255,.75)",

              fontSize: "18px",

              lineHeight: 1.8,

              marginTop: "20px",
            }}
          >
            Welcome back{" "}
            <strong>
              {userEmail
                ? userEmail.split("@")[0]
                : "User"}
            </strong>
            .
            <br />
            Manage bookings, room schedules,
            and workspace reservations from
            one modern portal.
          </p>
        </div>

        <DashboardCards />
      </div>

      <StatusSnackbar
        open={openSnack}
        message={message}
        severity={severity}
        onClose={() =>
          setOpenSnack(false)
        }
      />
    </AppLayout>
  );
}