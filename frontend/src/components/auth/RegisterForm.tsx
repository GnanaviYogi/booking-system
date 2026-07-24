"use client";

import { useState } from "react";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface RegisterFormProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;

  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;

  usernameError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;

  handleRegister: () => void;
  onSwitch: () => void;
  isLoading: boolean;
}

export default function RegisterForm({
  username,
  email,
  password,
  confirmPassword,

  setUsername,
  setEmail,
  setPassword,
  setConfirmPassword,

  usernameError,
  emailError,
  passwordError,
  confirmPasswordError,

  handleRegister,
  onSwitch,
  isLoading,
}: RegisterFormProps) {
  const [anchorEl, setAnchorEl] =
    useState<HTMLElement | null>(null);

  const getFieldStyles = (
    value: string,
    isValid: boolean
  ) => ({
    mb: 1.2,

    "& .MuiOutlinedInput-root": {
      height: 52,

      borderRadius: "14px",

      background: "rgba(255,255,255,0.08)",

      backdropFilter: "blur(10px)",

      color: "#FFFFFF",

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
      minHeight: "20px",
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
        Create Account
      </Typography>

      <Typography
        textAlign="center"
        sx={{
          color: "rgba(255,255,255,0.75)",
          fontSize: 14,
          mb: 3,
        }}
      >
        Create your account to continue
      </Typography>

      <TextField
        label="Username"
        fullWidth
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
        error={!!usernameError}
        helperText={usernameError || " "}
        sx={getFieldStyles(
          username,
          username.trim().length >= 3
        )}
      />

      <TextField
        label="Email"
        fullWidth
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        error={!!emailError}
        helperText={emailError || " "}
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
        helperText={passwordError || " "}
        sx={getFieldStyles(
          password,
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(
            password
          )
        )}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={(e) =>
                  setAnchorEl(
                    e.currentTarget
                  )
                }
              >
                <InfoOutlinedIcon
                  sx={{
                    color: "#93C5FD",
                    fontSize: 20,
                  }}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(
            e.target.value
          )
        }
        error={!!confirmPasswordError}
        helperText={
          confirmPasswordError || " "
        }
        sx={getFieldStyles(
          confirmPassword,
          confirmPassword ===
            password &&
            confirmPassword.length > 0
        )}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() =>
          setAnchorEl(null)
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            background:
              "rgba(15,23,42,0.95)",
            backdropFilter:
              "blur(20px)",
            color: "white",
            border:
              "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            width: 250,
          }}
        >
          <Typography
            fontWeight={700}
            fontSize={13}
            mb={1}
          >
            Password Requirements
          </Typography>

          <Typography
            color={
              password.length >= 8
                ? "#22C55E"
                : "#EF4444"
            }
            fontSize={12}
          >
            {password.length >= 8
              ? "✅"
              : "❌"} Minimum 8 characters
          </Typography>

          <Typography
            color={
              /[A-Z]/.test(password)
                ? "#22C55E"
                : "#EF4444"
            }
            fontSize={12}
          >
            {/[A-Z]/.test(password)
              ? "✅"
              : "❌"} Uppercase letter
          </Typography>

          <Typography
            color={
              /[a-z]/.test(password)
                ? "#22C55E"
                : "#EF4444"
            }
            fontSize={12}
          >
            {/[a-z]/.test(password)
              ? "✅"
              : "❌"} Lowercase letter
          </Typography>

          <Typography
            color={
              /\d/.test(password)
                ? "#22C55E"
                : "#EF4444"
            }
            fontSize={12}
          >
            {/\d/.test(password)
              ? "✅"
              : "❌"} Number
          </Typography>

          <Typography
            color={
              /[!@#$%^&*]/.test(password)
                ? "#22C55E"
                : "#EF4444"
            }
            fontSize={12}
          >
            {/[!@#$%^&*]/.test(password)
              ? "✅"
              : "❌"} Special character
          </Typography>
        </Box>
      </Popover>

      <Button
        fullWidth
        variant="contained"
        onClick={handleRegister}
        disabled={isLoading}
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
        {isLoading ? (
  <>
    <CircularProgress
      size={18}
      color="inherit"
      sx={{ mr: 1 }}
    />
    Creating Account...
  </>
) : (
  "Register"
)}
      </Button>

      <Typography
        textAlign="center"
        mt={2}
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
        Already have an account? Login
      </Typography>
    </>
  );
}