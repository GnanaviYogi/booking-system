"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  Divider,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SecurityIcon from "@mui/icons-material/Security";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";

import {
  useUpdateUserMutation,
  useResetPasswordMutation,
} from "@/services/api";

import StatusSnackbar from "../StatusSnackbar";

type Props = {
  open: boolean;
  onClose: () => void;
  user: any;
};

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    background: "rgba(255,255,255,.05)",
    borderRadius: "14px",

    "& fieldset": {
      borderColor: "rgba(255,255,255,.12)",
    },

    "&:hover fieldset": {
      borderColor: "rgba(96,165,250,.25)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#60A5FA",
    },
  },

  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,.65)",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#93C5FD",
  },
};

export default function EditUserDialog({
  open,
  onClose,
  user,
}: Props) {
  const [activeTab, setActiveTab] =
    useState<"profile" | "security">(
      "profile"
    );

  const [updateUser] =
    useUpdateUserMutation();

  const [resetPassword] =
    useResetPasswordMutation();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [snackbar, setSnackbar] =
    useState({
      open: false,
      message: "",
      severity: "success" as
        | "success"
        | "error",
    });

  useEffect(() => {
    if (user && open) {
      setUsername(user.username || "");
      setEmail(user.email || "");

      setNewPassword("");
      setConfirmPassword("");

      setActiveTab("profile");
    }
  }, [user, open]);

  const handleUpdateUser =
    async () => {
      try {
        await updateUser({
          userId: user.id,
          data: {
            username,
            email,
          },
        }).unwrap();

        setSnackbar({
          open: true,
          message:
            "User updated successfully",
          severity: "success",
        });

        onClose();
      } catch (err: any) {
        setSnackbar({
          open: true,
          message:
            err?.data?.detail ||
            "Failed to update user",
          severity: "error",
        });
      }
    };

  const handleResetPassword =
    async () => {
      if (!newPassword.trim()) {
        setSnackbar({
          open: true,
          message:
            "Please enter a password",
          severity: "error",
        });

        return;
      }

      if (
        newPassword !== confirmPassword
      ) {
        setSnackbar({
          open: true,
          message:
            "Passwords do not match",
          severity: "error",
        });

        return;
      }

      try {
        await resetPassword({
          userId: user.id,
          new_password:
            newPassword,
        }).unwrap();

        setNewPassword("");
        setConfirmPassword("");

        setSnackbar({
          open: true,
          message:
            "Password reset successfully",
          severity: "success",
        });
      } catch (err: any) {
        setSnackbar({
          open: true,
          message:
            err?.data?.detail ||
            "Failed to reset password",
          severity: "error",
        });
      }
    };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        BackdropProps={{
          sx: {
            backdropFilter: "blur(8px)",
            background:
              "rgba(2,6,23,.65)",
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "28px",
            background:
              "linear-gradient(180deg,#112244 0%,#0f172a 100%)",
            border:
              "1px solid rgba(96,165,250,.35)",
            boxShadow:
              "0 0 40px rgba(59,130,246,.25), 0 20px 60px rgba(0,0,0,.55)",
            color: "white",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle>
          <Typography
            fontSize={20}
            fontWeight={700}
            color="white"
          >
            Edit User
          </Typography>

          <Typography
            fontSize={13}
            color="rgba(255,255,255,.65)"
          >
            Manage user profile and
            security
          </Typography>
        </DialogTitle>

        <Divider
          sx={{
            borderColor:
              "rgba(255,255,255,.08)",
          }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            px: 3,
            py: 2,
          }}
        >
          <Button
            startIcon={
              <PersonOutlineIcon />
            }
            variant={
              activeTab === "profile"
                ? "contained"
                : "text"
            }
            onClick={() =>
              setActiveTab("profile")
            }
            sx={{
              textTransform: "none",
              borderRadius: "12px",

              ...(activeTab ===
                "profile" && {
                background:
                  "linear-gradient(135deg,#60A5FA,#2563EB)",
                boxShadow:
                  "0 4px 14px rgba(59,130,246,.25)",
              }),
            }}
          >
            Profile
          </Button>

          <Button
            startIcon={
              <SecurityIcon />
            }
            variant={
              activeTab === "security"
                ? "contained"
                : "text"
            }
            onClick={() =>
              setActiveTab("security")
            }
            sx={{
              textTransform: "none",
              borderRadius: "12px",

              ...(activeTab ===
                "security" && {
                background:
                  "linear-gradient(135deg,#60A5FA,#2563EB)",
                boxShadow:
                  "0 4px 14px rgba(59,130,246,.25)",
              }),
            }}
          >
            Security
          </Button>
        </Box>

        <DialogContent>
          {activeTab ===
            "profile" && (
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
            >
              <TextField
                label="Username"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                fullWidth
                sx={textFieldStyles}
              />

              <TextField
                label="Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                fullWidth
                sx={textFieldStyles}
              />
            </Box>
          )}

          {activeTab ===
            "security" && (
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "14px",
                  background:
                    "rgba(249,115,22,.12)",
                  border:
                    "1px solid rgba(249,115,22,.35)",
                }}
              >
                <Typography
                  fontSize={12}
                  color="#FDBA74"
                >
                  Current password
                  becomes invalid after
                  reset.
                </Typography>
              </Box>

              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                fullWidth
                sx={textFieldStyles}
              />

              <TextField
                label="Confirm Password"
                type="password"
                value={
                  confirmPassword
                }
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                fullWidth
                sx={textFieldStyles}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              color: "white",
              textTransform:
                "none",
            }}
          >
            Cancel
          </Button>

          {activeTab ===
            "profile" && (
            <Button
              variant="contained"
              startIcon={
                <SaveOutlinedIcon />
              }
              onClick={
                handleUpdateUser
              }
              sx={{
                textTransform:
                  "none",
                px: 3,
                borderRadius:
                  "12px",
                background:
                  "linear-gradient(135deg,#3B82F6,#2563EB)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg,#2563EB,#1D4ED8)",
                },
              }}
            >
              Save
            </Button>
          )}

          {activeTab ===
            "security" && (
            <Button
              variant="contained"
              startIcon={
                <LockResetIcon />
              }
              onClick={
                handleResetPassword
              }
              sx={{
                textTransform:
                  "none",
                px: 3,
                borderRadius:
                  "12px",
                background:
                  "linear-gradient(135deg,#F59E0B,#EA580C)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg,#D97706,#C2410C)",
                },
              }}
            >
              Reset Password
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <StatusSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={
          snackbar.severity
        }
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </>
  );
}