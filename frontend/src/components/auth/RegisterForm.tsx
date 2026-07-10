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
}: RegisterFormProps) {
  const [anchorEl, setAnchorEl] =
    useState<HTMLElement | null>(null);

  const getFieldStyles = (
    value: string,
    isValid: boolean
  ) => ({
    mb: 0.8,

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
        Create Account
      </Typography>

      <Typography
        textAlign="center"
        color="#64748B"
        fontSize={12}
        mb={2}
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
                    color: "#6366F1",
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
      >
        <Box
          sx={{
            p: 2,
            width: 240,
          }}
        >
          <Typography
            fontWeight={600}
            fontSize={13}
            mb={1}
          >
            Password Requirements
          </Typography>

          <Typography
            color={
              password.length >= 8
                ? "success.main"
                : "error.main"
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
                ? "success.main"
                : "error.main"
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
                ? "success.main"
                : "error.main"
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
                ? "success.main"
                : "error.main"
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
                ? "success.main"
                : "error.main"
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
        sx={{
          height: 44,

          mt: 1,

          borderRadius: "14px",

          fontWeight: 600,

          fontSize: "0.95rem",

          textTransform: "none",

          background:
            "linear-gradient(135deg,#2563EB,#8B5CF6)",

          boxShadow:
            "0 10px 20px rgba(99,102,241,.25)",

          "&:hover": {
            background:
              "linear-gradient(135deg,#1D4ED8,#7C3AED)",
          },
        }}
      >
        Register
      </Button>

      <Typography
      textAlign="center"
      mt={1.5}
      sx={{
        cursor: "pointer",

        color: "#6366F1",

        fontSize: "13px",

        fontWeight: 500,

        letterSpacing: "0.1px",

        transition: "all 0.2s ease",

        "&:hover": {
          textDecoration: "underline",
          color: "#4F46E5",
        },
      }}
      onClick={onSwitch}
    >
      Already have an account? Login
    </Typography>
    </>
  );
}