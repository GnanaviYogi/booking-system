"use client";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type Props = {
  open: boolean;
  message: string;
  severity:
    | "success"
    | "error"
    | "info"
    | "warning";
  onClose: () => void;
};

export default function StatusSnackbar({
  open,
  message,
  severity,
  onClose,
}: Props) {
  return (
   <Snackbar
  open={open}
  autoHideDuration={3000}
  onClose={onClose}
  anchorOrigin={{
    vertical: "bottom",
    horizontal: "left",
  }}
  sx={{
    position: "fixed",
    bottom: 24,
    left: 24,
  }}
>
      <Alert
        severity={severity}
        variant="filled"
        onClose={onClose}
        sx={{
          minWidth: 320,
          borderRadius: "12px",
          fontWeight: 600,
          boxShadow:
            "0 10px 25px rgba(0,0,0,.35)",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}