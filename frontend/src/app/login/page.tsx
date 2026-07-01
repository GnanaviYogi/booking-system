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

import {
  useLoginMutation,
  useRegisterMutation
} from "@/services/api";

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // ✅ VALIDATION STATES
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [openSnack, setOpenSnack] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] =
    useState<"success" | "error">("success");

  const [loginUser] = useLoginMutation();
  const [registerUser] = useRegisterMutation();

  // ✅ Logout message
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("logout") === "1") {
      setMessage("Logged out successfully ✅");
      setSeverity("success");
      setOpenSnack(true);
    }
  }, []);

  // ✅ VALIDATION FUNCTION
  const validateForm = () => {
    let valid = true;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError("Must include a special character");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  // ✅ LOGIN
  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const res = await loginUser({ email, password }).unwrap();

      localStorage.setItem("token", res.access_token);
      localStorage.setItem("user", email);

      router.push("/?login=1");

    } catch (err: any) {
      setMessage(err?.data?.detail || "Login failed ❌");
      setSeverity("error");
      setOpenSnack(true);
    }
  };

  // ✅ REGISTER
  const handleRegister = async () => {
    if (!validateForm()) return;

    if (!username) {
      setMessage("Username required ❌");
      setSeverity("error");
      setOpenSnack(true);
      return;
    }

    try {
      await registerUser({ username, email, password }).unwrap();

      setMessage("Registered successfully ✅");
      setSeverity("success");
      setOpenSnack(true);

      setIsRegister(false);
      setUsername("");
      setEmail("");
      setPassword("");

    } catch (err: any) {
      setMessage(err?.data?.detail || "Registration failed ❌");
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
          "linear-gradient(135deg, #6366f1, #3b82f6, #06b6d4)"
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: "40px",
          width: 360,
          borderRadius: "18px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          background: "rgba(255,255,255,0.95)"
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="700"
          color="#1d4ed8"
        >
          {isRegister ? "Create Account ✨" : "Welcome Back"}
        </Typography>

        {/* USERNAME */}
        {isRegister && (
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
        )}

        {/* EMAIL */}
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          error={!!emailError}
          helperText={emailError}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: emailError
                  ? "red"
                  : email
                  ? "green"
                  : "#ccc",
              },
              "&.Mui-focused fieldset": {
                borderColor: emailError ? "red" : "green",
              },
            },
          }}
        />

        {/* PASSWORD */}
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          error={!!passwordError}
          helperText={passwordError}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: passwordError
                  ? "red"
                  : password
                  ? "green"
                  : "#ccc",
              },
              "&.Mui-focused fieldset": {
                borderColor: passwordError ? "red" : "green",
              },
            },
          }}
        />

        {/* BUTTON */}
        <Button
          variant="contained"
          onClick={isRegister ? handleRegister : handleLogin}
          sx={{
            mt: 1,
            padding: "10px",
            borderRadius: "10px",
            fontWeight: "600",
          }}
        >
          {isRegister ? "Register" : "Login"}
        </Button>

        {/* SWITCH */}
        <Typography
          textAlign="center"
          sx={{
            cursor: "pointer",
            fontSize: "14px",
            color: "#2563eb",
            mt: 1
          }}
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "New here? Create an account"}
        </Typography>
      </Paper>

      {/* SNACKBAR */}
      <StatusSnackbar
        open={openSnack}
        message={message}
        severity={severity}
        onClose={() => setOpenSnack(false)}
      />
    </Box>
  );
}
