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
    mb: 1.6,

    "& .MuiOutlinedInput-root": {
      height: 52,

      borderRadius: "14px",

      background: "rgba(255,255,255,0.08)",

      color: "#FFFFFF",

      backdropFilter: "blur(10px)",

      "& fieldset": {
        borderColor: !value
          ? "rgba(255,255,255,0.15)"
          : isValid
          ? "#22C55E"
          : "#EF4444",
      },

      "&:hover fieldset": {
        borderColor: "#60A5FA",
      },

      "&.Mui-focused fieldset": {
        borderWidth: "2px",
        borderColor: "#60A5FA",
      },

      "& input": {
        color: "#FFFFFF",
      },
    },

    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.7)",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#93C5FD",
    },

    "& .MuiFormHelperText-root": {
      color: "#FCA5A5",
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
            color: "#60A5FA",
            fontSize: 20,
          }}
        />

        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 700,
            color: "#60A5FA",
          }}
        >
          Room Booking
        </Typography>
      </Box>

      <Typography
        variant="h4"
        textAlign="center"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
          mb: 0.5,
        }}
      >
        Welcome Back
      </Typography>

      <Typography
        textAlign="center"
        sx={{
          color: "rgba(255,255,255,0.75)",
          fontSize: 14,
          mb: 3,
        }}
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
          height: 50,

          mt: 1,

          borderRadius: "14px",

          fontWeight: 700,

          textTransform: "none",

          fontSize: "1rem",

          background:
            "linear-gradient(135deg,#2563EB,#8B5CF6)",

          boxShadow:
            "0 0 25px rgba(99,102,241,.35)",

          transition: "all .3s ease",

          "&:hover": {
            transform: "translateY(-2px)",
            background:
              "linear-gradient(135deg,#1D4ED8,#7C3AED)",
            boxShadow:
              "0 0 35px rgba(124,58,237,.6)",
          },
        }}
      >
        Login
      </Button>

      <Divider
        sx={{
          my: 3,

          "&::before, &::after": {
            borderColor:
              "rgba(255,255,255,0.12)",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            color:
              "rgba(255,255,255,0.55)",
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
          color: "#93C5FD",
          fontWeight: 600,
          fontSize: 14,

          "&:hover": {
            color: "#BFDBFE",
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