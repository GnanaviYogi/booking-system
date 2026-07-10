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

        background: `
        radial-gradient(
          circle at 15% 20%,
          rgba(37,99,235,0.25),
          transparent 30%
        ),

        radial-gradient(
          circle at 85% 80%,
          rgba(59,130,246,0.18),
          transparent 35%
        ),

        linear-gradient(
          135deg,
          #020617 0%,
          #06142E 40%,
          #020617 100%
        )

        `,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -150,
          left: -150,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "#2563EB",
          filter: "blur(140px)",
          opacity: 0.2,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: -150,
          right: -150,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "#7C3AED",
          filter: "blur(140px)",
          opacity: 0.2,
        }}
      />

      <Paper
        elevation={0}
        sx={{
          width: {
            xs: "90%",
            sm: 350,
          },

          p: 2.5,

          borderRadius: "26px",

          position: "relative",
          overflow: "hidden",

          background:
            "rgba(255,255,255,0.90)",

          backdropFilter: "blur(24px)",

          border:
            "1px solid rgba(255,255,255,.18)",

          boxShadow:
            "0 20px 50px rgba(0,0,0,.25)",
        }}
      >
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

        <Box
          sx={{
            position: "absolute",
            top: 18,
            right: 18,

            width: 70,
            height: 70,

            borderRadius: "50%",

            background:
              "linear-gradient(135deg,#2563EB,#8B5CF6)",

            opacity: 0.05,
          }}
        />

        {children}
      </Paper>
    </Box>
  );
}