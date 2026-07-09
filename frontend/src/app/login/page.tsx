"use client";

import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel
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

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [acceptPolicy, setAcceptPolicy] =
    useState(false);

  const [usernameError, setUsernameError] =
    useState("");

  const [confirmPasswordError,
    setConfirmPasswordError] = useState("");



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

    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (
      isRegister &&
      username.trim().length < 3
    ) {
      setUsernameError(
        "Username must be at least 3 characters"
      );
      valid = false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError(
        "Enter a valid email"
      );
      valid = false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (
      !passwordRegex.test(password)
    ) {
      setPasswordError(
        "Min 8 chars, uppercase, lowercase, number & special character required"
      );
      valid = false;
    }

    if (
      isRegister &&
      password !== confirmPassword
    ) {
      setConfirmPasswordError(
        "Passwords do not match"
      );
      valid = false;
    }

    if (
      isRegister &&
      !acceptPolicy
    ) {
      setMessage(
        "Accept Privacy Policy"
      );
      setSeverity("error");
      setOpenSnack(true);
      valid = false;
    }

    return valid;
  };

  // ✅ LOGIN
  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const res = await loginUser({ email, password }).unwrap();
       
          localStorage.setItem(
      "access_token",
      res.access_token
    );

    localStorage.setItem(
      "refresh_token",
      res.refresh_token
    );

    localStorage.setItem(
      "user",
      res.username
    );

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
          "linear-gradient(135deg,#edf4ff,#dbeafe,#e0e7ff)",
        p: 3,
      }}

    >
      
      
      <Paper
        elevation={0}
        sx={{
          width: 450,
          p: 5,
          borderRadius: "32px",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow:
            "0 20px 50px rgba(37,99,235,0.15)",
        }}
      >

        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={700}
          color="#1E40AF"
          mb={1}
        >
          {isRegister
            ? "Create Account ✨"
            : "Welcome Back"}
        </Typography>


        {/* USERNAME */}
        {isRegister && (
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)
            }
            fullWidth
            error={!!usernameError}
            helperText={usernameError}
          />
        )}
        <Typography
            textAlign="center"
            color="#64748B"
            mb={3}
          >
            {isRegister
              ? "Create your account to continue"
              : "Sign in to your account"}
          </Typography>


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

        {isRegister && (
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              fullWidth
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
            />
          )}

          {isRegister && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptPolicy}
                  onChange={(e) =>
                    setAcceptPolicy(
                      e.target.checked
                    )
                  }
                />
              }
              label="I agree to Terms & Privacy Policy"
            />
          )}

          {isRegister && (
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Password must contain:
              <br />
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
          )}                    






        {/* BUTTON */}
        <Button
          variant="contained"
          onClick={isRegister ? handleRegister : handleLogin}
          sx={{
            mt: 2,
            height: 54,
            borderRadius: "16px",
            fontWeight: 700,
            fontSize: "16px",
            textTransform: "none",
            background:
              "linear-gradient(135deg,#3B82F6,#6366F1)",
            boxShadow:
              "0 10px 30px rgba(59,130,246,0.3)",

            "&:hover": {
              background:
                "linear-gradient(135deg,#2563EB,#4F46E5)",
              transform: "translateY(-2px)",
            },

            transition: "all 0.3s ease"
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
