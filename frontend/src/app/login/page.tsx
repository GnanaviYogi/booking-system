"use client";

import { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");        // ✅ NEW
  const [messageType, setMessageType] = useState<"success" | "error" | "">(""); // ✅ NEW

  const router = useRouter();

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // ✅ LOGIN
  const handleLogin = async () => {
    setMessage("");

    const res = await fetch("http://127.0.0.1:8000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.access_token);

      setMessage("Login successful ✅");
      setMessageType("success");

      setTimeout(() => {
        router.push("/");
      }, 1000); // smooth delay
    } else {
      setMessage(data.detail || "Login failed");
      setMessageType("error");
    }
  };

  // ✅ REGISTER
  const handleRegister = async () => {
    setMessage("");

    const res = await fetch("http://127.0.0.1:8000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Registered successfully! Please login ✅");
      setMessageType("success");

      setIsRegister(false);
      setUsername("");
      setEmail("");
      setPassword("");
    } else {
      setMessage(data.detail || "Registration failed");
      setMessageType("error");
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} width={300} mx="auto" mt={10}>
      <Typography variant="h5">
        {isRegister ? "Register" : "Login"}
      </Typography>

      {/* ✅ MESSAGE COMPONENT */}
      {message && (
        <Alert severity={messageType === "success" ? "success" : "error"}>
          {message}
        </Alert>
      )}

      {/* ✅ USERNAME */}
      {isRegister && (
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={username !== "" && username.length < 3}
          helperText={
            username !== "" && username.length < 3
              ? "Username must be at least 3 characters"
              : "Example: gnanavi"
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
            ? "Invalid email (e.g., example@gmail.com)"
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
            ? "Must include at least 1 special char (e.g., @)"
            : "Example: password@123"
        }
      />

      {/* ✅ SUBMIT BUTTON */}
      <Button
        variant="contained"
        onClick={isRegister ? handleRegister : handleLogin}
        sx={{ textTransform: "none" }}
        disabled={
          !email ||
          !password ||
          (isRegister && !username) ||
          !isEmailValid ||
          !hasSpecialChar
        }
      >
        {isRegister ? "Register" : "Login"}
      </Button>

      {/* ✅ SWITCH MODE */}
      <Button
        onClick={() => {
          setIsRegister(!isRegister);
          setMessage("");
        }}
        sx={{ textTransform: "none" }}
      >
        {isRegister
          ? "Already have an account? Login"
          : "New user? Register"}
      </Button>
    </Box>
  );
}
