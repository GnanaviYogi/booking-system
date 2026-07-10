import { Box, Typography } from "@mui/material";

export default function PasswordRules() {
  return (
    <Box
      sx={{
        p: 2,
        mb: 2,

        borderRadius: "14px",

        background:
          "linear-gradient(135deg,#f8fafc,#eef2ff)",

        border: "1px solid #e2e8f0",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: "#475569",
          mb: 1,
        }}
      >
        Password Requirements
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: "#64748b",
          lineHeight: 1.8,
        }}
      >
        ✓ Minimum 8 characters
        <br />
        ✓ One uppercase letter
        <br />
        ✓ One lowercase letter
        <br />
        ✓ One number
        <br />
        ✓ One special character
      </Typography>
    </Box>
  );
}