import { Box, Paper } from "@mui/material";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top left, #1e3a8a 0%, #081028 45%, #020617 100%)",
      }}
    >
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
          top: -120,
          left: -120,
          
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
            "radial-gradient(circle, rgba(139,92,246,0.28), transparent)",
          filter: "blur(120px)",
          bottom: -120,
          right: -120,
          
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
          
        }}
      />

      {/* Stars */}

      {[...Array(30)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "#fff",
            opacity: 0.4,
            left: `${(i * 7) % 100}%`,
            top: `${(i * 13) % 100}%`,
            animation: `star ${5 + (i % 6)}s linear infinite`,
          }}
        />
      ))}



      {/* Login Card */}

      <Paper
        elevation={0}
        sx={{
          width: {
            xs: "92%",
            sm: 430,
          },

          p: 3,

          borderRadius: "28px",

          position: "relative",
          overflow: "hidden",

          background:
            "rgba(255,255,255,0.08)",

          backdropFilter: "blur(25px)",

          border:
            "1px solid rgba(255,255,255,0.15)",

          boxShadow:
            "0 20px 60px rgba(0,0,0,0.45)",

          animation:
            "floatCard 6s ease-in-out infinite",
        }}
      >
        {/* Top Gradient Line */}

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 4,
            background:
              "linear-gradient(90deg,#2563EB,#8B5CF6,#EC4899)",
          }}
        />

        {/* Decorative Circle */}

        <Box
          sx={{
            position: "absolute",
            top: 18,
            right: 18,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg,#2563EB,#8B5CF6)",
            opacity: 0.12,
          }}
        />

        {children}
      </Paper>

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

        @keyframes floatCard {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes star {
          0% {
            opacity: 0;
            transform: translateY(0);
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