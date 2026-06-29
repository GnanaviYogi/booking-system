"use client";

import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper
} from "@mui/material";
import { useRouter } from "next/navigation";
import StatusSnackbar from "@/components/StatusSnackbar";

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [openSnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] =
    useState<"success" | "error">("success");

  // ✅ LOGOUT MESSAGE
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("logout") === "1") {
      setMessage("Logged out successfully ✅");
      setSeverity("success");
      setOpenSnack(true);
    }
  }, []);

  // ✅ VALIDATION
  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // ✅ LOGIN API
  const handleLogin = async () => {
    if (!isEmailValid || !hasSpecialChar) {
      setMessage("Invalid email or password");
      setSeverity("error");
      setOpenSnack(true);
      return;
    }

    const res = await fetch("http://127.0.0.1:8000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.access_token);

      setMessage("Login successful ✅");
      setSeverity("success");
      setOpenSnack(true);

      setTimeout(() => {
        router.push("/");
      }, 1200);
    } else {
      setMessage(data.detail || "Login failed");
      setSeverity("error");
      setOpenSnack(true);
    }
  };

  // ✅ REGISTER API
  const handleRegister = async () => {
    if (!isEmailValid || !hasSpecialChar || username.trim() === "") {
      setMessage("Fill all fields correctly");
      setSeverity("error");
      setOpenSnack(true);
      return;
    }

    const res = await fetch("http://127.0.0.1:8000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    });

    if (res.ok) {
      setMessage("Registered successfully ✅");
      setSeverity("success");
      setOpenSnack(true);

      setIsRegister(false);
      setUsername("");
      setEmail("");
      setPassword("");
    } else {
      setMessage("Registration failed");
      setSeverity("error");
      setOpenSnack(true);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #dbeafe, #e0f2fe, #eef2ff)"
      }}
    >
      {/* ✅ CARD */}
      <Paper
        elevation={8}
        sx={{
          padding: "30px",
          width: 360,
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight="600">
          {isRegister ? "Create Account" : "Welcome Back"}
        </Typography>

        {/* ✅ USERNAME */}
        {isRegister && (
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={username !== "" && username.length < 3}
            helperText={
              username !== "" && username.length < 3
                ? "Min 3 characters"
                : "Example: abc"
            }
          />
        )}

        {/* ✅ EMAIL */}
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={email !== "" && !isEmailValid}
          helperText={
            email !== "" && !isEmailValid
              ? "Invalid email"
              : "Example: example@gmail.com"
          }
        />

        {/* ✅ PASSWORD */}
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={password !== "" && !hasSpecialChar}
          helperText={
            password !== "" && !hasSpecialChar
              ? "At least 1 special character"
              : "Example: password@123"
          }
        />

        {/* ✅ BUTTON */}
        <Button
          variant="contained"
          onClick={isRegister ? handleRegister : handleLogin}
          disabled={
            !email ||
            !password ||
            (isRegister && !username) ||
            !isEmailValid ||
            !hasSpecialChar
          }
          sx={{
            padding: "10px",
            borderRadius: "8px",
            fontWeight: "600"
          }}
        >
          {isRegister ? "Register" : "Login"}
        </Button>

        {/* ✅ SWITCH */}
        <Typography
          textAlign="center"
          sx={{
            cursor: "pointer",
            color: "#2563eb",
            fontSize: "14px"
          }}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "New user? Create account"}
        </Typography>
      </Paper>

      {/* ✅ SNACKBAR */}
      <StatusSnackbar
        open={openSnack}
        message={message}
        severity={severity}
        onClose={() => setOpenSnack(false)}
      />
    </Box>
  );
}