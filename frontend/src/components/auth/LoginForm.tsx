import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";

import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";

interface LoginFormProps {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  emailError: string;
  passwordError: string;
  handleLogin: () => void;
  onSwitch: () => void;
}

export default function LoginForm({
  email,
  password,
  setEmail,
  setPassword,
  emailError,
  passwordError,
  handleLogin,
  onSwitch,
}: LoginFormProps) {
  const getFieldStyles = (
    value: string,
    isValid: boolean
  ) => ({
    mb: 1.4,

    "& .MuiOutlinedInput-root": {
      height: 42,

      borderRadius: "14px",

      background: "#FFFFFF",

      "& fieldset": {
        borderColor: !value
          ? "#E2E8F0"
          : isValid
          ? "#22C55E"
          : "#EF4444",
      },

      "&:hover fieldset": {
        borderColor: !value
          ? "#CBD5E1"
          : isValid
          ? "#22C55E"
          : "#EF4444",
      },

      "&.Mui-focused fieldset": {
        borderWidth: "2px",

        borderColor: !value
          ? "#6366F1"
          : isValid
          ? "#22C55E"
          : "#EF4444",
      },
    },

    "& .MuiInputLabel-root": {
      color: !value
        ? "#64748B"
        : isValid
        ? "#22C55E"
        : "#EF4444",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: !value
        ? "#6366F1"
        : isValid
        ? "#22C55E"
        : "#EF4444",
    },
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <BusinessRoundedIcon
          sx={{
            color: "#6366F1",
            fontSize: 20,
          }}
        />

        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: "#4F46E5",
          }}
        >
          Room Booking
        </Typography>
      </Box>

      <Typography
        variant="h5"
        textAlign="center"
        sx={{
          color: "#111827",
          fontWeight: 500,
          letterSpacing: "-0.6px",
          mb: 0.5,
        }}
      >
        Welcome Back
      </Typography>

      <Typography
        textAlign="center"
        color="#64748B"
        fontSize={13}
        mb={2}
      >
        Sign in to continue
      </Typography>

      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        error={!!emailError}
        helperText={emailError}
        sx={getFieldStyles(
          email,
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
          )
        )}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        error={!!passwordError}
        helperText={passwordError}
        sx={getFieldStyles(
          password,
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(
            password
          )
        )}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleLogin}
        sx={{
          height: 44,

          mt: 1,

          borderRadius: "14px",

          fontWeight: 600,

          textTransform: "none",

          background:
            "linear-gradient(135deg,#2563EB,#8B5CF6)",

          boxShadow:
            "0 10px 20px rgba(99,102,241,.30)",

          "&:hover": {
            background:
              "linear-gradient(135deg,#1D4ED8,#7C3AED)",
          },
        }}
      >
        Login
      </Button>

      <Divider sx={{ my: 2 }}>
        <Typography
          sx={{
            fontSize: 10,
            color: "#94A3B8",
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          QUICK ACCESS
        </Typography>
      </Divider>

      <Typography
        textAlign="center"
        sx={{
          cursor: "pointer",
          color: "#6366F1",
          fontWeight: 600,
          fontSize: 14,

          "&:hover": {
            textDecoration: "underline",
          },
        }}
        onClick={onSwitch}
      >
        Create a new account
      </Typography>
    </>
  );
}