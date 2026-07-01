"use client";

import { useState } from "react";
import {
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Typography
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function UserMenu({ userEmail }: { userEmail: string | null }) {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const [openDialog, setOpenDialog] = useState(false);

  // ✅ MENU HANDLERS
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleCloseMenu();
    setOpenDialog(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login?logout=1";
  };

  return (
    <>
      {/* ✅ USER BUTTON (NEW DESIGN) */}
      <Box
        onClick={handleMenuClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          background: "rgba(255,255,255,0.9)",
          padding: "6px 14px",
          borderRadius: "25px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          transition: "0.2s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
          }
        }}
      >
        {/* ✅ AVATAR */}
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#2563eb",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            fontSize: "14px"
          }}
        >
          {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
        </Box>

        {/* ✅ EMAIL */}
        <Typography sx={{ fontSize: "14px", color: "#1e293b" }}>
          {userEmail || "User"} 
        </Typography>
      </Box>

      {/* ✅ DROPDOWN MENU */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            marginTop: "8px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
          }
        }}
      >
        <MenuItem
          onClick={handleLogoutClick}
          sx={{
            fontSize: "14px",
            padding: "10px 20px",
            "&:hover": {
              background: "#fee2e2",
              color: "#dc2626"
            }
          }}
        >
          ⏻ Logout
        </MenuItem>
      </Menu>

      {/* ✅ CONFIRMATION DIALOG */}
   <Dialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  PaperProps={{
    sx: {
      borderRadius: "14px",
      padding: "12px 16px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.12)", // ✅ soft shadow
      border: "none", // ✅ remove unwanted border
      minWidth: "320px"
    }
  }}
>
  {/* ✅ TITLE */}
  <DialogTitle
    sx={{
      fontWeight: "500",   // ✅ less bold
      fontSize: "17px",    // ✅ slightly smaller
      textAlign: "center",
      color: "#374151",    // ✅ soft dark color
      paddingBottom: "6px"
    }}
  >
    Are you sure you want to logout?
  </DialogTitle>

  {/* ✅ ACTION BUTTONS */}
  <DialogActions
    sx={{
      justifyContent: "center",
      gap: "24px",
      paddingBottom: "12px"
    }}
  >
    {/* ❌ NO BUTTON (SOFT BLUE) */}
    <Button
      onClick={() => setOpenDialog(false)}
      sx={{
        textTransform: "none",
        borderRadius: "8px",
        padding: "6px 18px",
        fontWeight: "500",
        color: "#2563eb",
        border: "1px solid #dbeafe",
        "&:hover": {
          backgroundColor: "#eff6ff"
        }
      }}
    >
      No
    </Button>

    {/* ✅ YES BUTTON (SOFT RED) */}
    <Button
      onClick={confirmLogout}
      sx={{
        textTransform: "none",
        borderRadius: "8px",
        padding: "6px 18px",
        fontWeight: "500",
        color: "#dc2626",
        border: "1px solid #fee2e2",
        "&:hover": {
          backgroundColor: "#fee2e2"
        }
      }}
    >
      Yes
    </Button>
  </DialogActions>
</Dialog>

    </>
  );
}