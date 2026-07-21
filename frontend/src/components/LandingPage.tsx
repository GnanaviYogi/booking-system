"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Paper,
} from "@mui/material";

export default function LandingPage() {
  const router = useRouter();

  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  const features = [
    {
      icon: "📅",
      title: "Smart Booking",
      description:
        "Reserve meeting rooms instantly with real-time availability and quick scheduling.",
    },
    {
      icon: "🛡️",
      title: "Conflict Detection",
      description:
        "Prevent overlapping reservations automatically and eliminate booking conflicts.",
    },
    {
      icon: "📊",
      title: "Utilization Tracking",
      description:
        "Monitor occupancy trends and optimize how meeting spaces are used.",
    },
    {
      icon: "🗓️",
      title: "Calendar View",
      description:
        "Visualize bookings clearly with an intuitive and organized calendar.",
    },
  ];

  return (
    <Box
      onMouseMove={(e) =>
        setMouse({
          x: e.clientX,
          y: e.clientY,
        })
      }
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top left, #1e3a8a 0%, #081028 45%, #020617 100%)",
      }}
    >
      {/* Mouse Glow */}

      <Box
        sx={{
          position: "fixed",
          left: mouse.x - 200,
          top: mouse.y - 200,
          width: 400,
          height: 400,
          borderRadius: "50%",
          pointerEvents: "none",
          background:
            "radial-gradient(circle, rgba(59,130,246,.15), transparent)",
          filter: "blur(70px)",
          zIndex: 1,
        }}
      />

      {/* Floating Orb 1 */}

      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.35), transparent)",
          filter: "blur(100px)",
          top: -100,
          left: -80,
          animation: "float1 18s ease-in-out infinite",
        }}
      />

      {/* Floating Orb 2 */}

      <Box
        sx={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.25), transparent)",
          filter: "blur(120px)",
          bottom: -100,
          right: -100,
          animation: "float2 22s ease-in-out infinite",
        }}
      />

      {/* Floating Orb 3 */}

      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,0.22), transparent)",
          filter: "blur(100px)",
          top: "35%",
          left: "40%",
          animation: "float3 14s ease-in-out infinite",
        }}
      />

      {/* Floating Stars */}

      {[...Array(35)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "white",
            opacity: 0.5,

            left: `${(i * 7) % 100}%`,
            top: `${(i * 13) % 100}%`,

            animation: `star ${
              4 + (i % 6)
            }s linear infinite`,
          }}
        />
      ))}

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 6,
            alignItems: "center",
          }}
        >
          {/* Left Side */}

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: "3rem",
                  md: "4.5rem",
                },
                fontWeight: 800,
                lineHeight: 1.05,
                color: "#fff",
                textShadow:
                  "0 0 20px rgba(255,255,255,.15), 0 0 40px rgba(96,165,250,.25)",
              }}
            >
              Room Booking
              <br />
              System
            </Typography>

            <Typography
              sx={{
                mt: 3,
                maxWidth: "580px",
                color: "rgba(255,255,255,.82)",
                fontSize: "1rem",
                lineHeight: 1.8,
              }}
            >
              Effortlessly manage meeting rooms,
              avoid scheduling conflicts, monitor
              utilization, and organize bookings
              through a modern workspace solution.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                variant="contained"
                onClick={() =>
                  router.push("/login?register=1")
                }
                sx={{
                  textTransform: "none",
                  px: 4,
                  py: 1.4,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg,#3b82f6,#2563eb)",
                  boxShadow:
                    "0 0 25px rgba(59,130,246,.5)",

                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 0 35px rgba(59,130,246,.7)",
                  },
                }}
              >
                Try for free
              </Button>

              <Button
                variant="outlined"
                onClick={() =>
                  router.push("/login")
                }
                sx={{
                  textTransform: "none",
                  px: 4,
                  py: 1.4,
                  borderRadius: 3,
                  color: "white",
                  borderColor:
                    "rgba(255,255,255,.5)",
                }}
              >
                Login
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 5,
                mt: 5,
              }}
            >
              <Box>
                <Typography
                  color="white"
                  fontSize="2rem"
                  fontWeight={800}
                >
                  500+
                </Typography>
                <Typography
                  color="rgba(255,255,255,.7)"
                >
                  Bookings
                </Typography>
              </Box>

              <Box>
                <Typography
                  color="white"
                  fontSize="2rem"
                  fontWeight={800}
                >
                  12
                </Typography>
                <Typography
                  color="rgba(255,255,255,.7)"
                >
                  Rooms
                </Typography>
              </Box>

              <Box>
                <Typography
                  color="white"
                  fontSize="2rem"
                  fontWeight={800}
                >
                  99%
                </Typography>
                <Typography
                  color="rgba(255,255,255,.7)"
                >
                  Reliability
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Side */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, minmax(0,1fr))",
              gap: 2,
            }}
          >
            {features.map((item) => (
              <Paper
                key={item.title}
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,.14), rgba(255,255,255,.06))",
                  backdropFilter: "blur(20px)",
                  border:
                    "1px solid rgba(255,255,255,.12)",
                  color: "white",
                  transition: ".3s",

                  "&:hover": {
                    transform:
                      "translateY(-8px) scale(1.03)",
                    boxShadow:
                      "0 0 35px rgba(59,130,246,.35)",
                  },
                }}
              >
                <Typography fontSize="1.8rem">
                  {item.icon}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    fontSize: ".85rem",
                    lineHeight: 1.7,
                    color:
                      "rgba(255,255,255,.78)",
                  }}
                >
                  {item.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      <style jsx global>{`
        @keyframes float1 {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(120px, 80px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @keyframes float2 {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-150px, -100px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @keyframes float3 {
          0% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(80px, -80px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @keyframes star {
          0% {
            opacity: 0;
            transform: translateY(0px);
          }

          50% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: translateY(-35px);
          }
        }
      `}</style>
    </Box>
  );
}