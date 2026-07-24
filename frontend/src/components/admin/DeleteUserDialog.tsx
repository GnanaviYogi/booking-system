"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  user: any;
};

export default function DeleteUserDialog({
  open,
  onClose,
  onDelete,
  user,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      BackdropProps={{
        sx: {
          backdropFilter: "blur(8px)",
          background: "rgba(2,6,23,.65)",
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
        },
      }}
    >
      <DialogTitle>
        <Typography
          fontSize={20}
          fontWeight={700}
        >
          Delete User
        </Typography>

        <Typography
          fontSize={13}
          color="rgba(255,255,255,.65)"
        >
          This action cannot be undone
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          mt={1}
          sx={{
            p: 2,
            borderRadius: "16px",
            background:
              "rgba(239,68,68,.08)",
            border:
              "1px solid rgba(239,68,68,.25)",
          }}
        >
          <Typography mb={1}>
            Are you sure you want to delete this user?
          </Typography>

          <Typography
            fontWeight={700}
            color="white"
          >
            {user?.username}
          </Typography>

          <Typography
            color="rgba(255,255,255,.65)"
          >
            {user?.email}
          </Typography>
        </Box>
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
            textTransform: "none",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onDelete}
          sx={{
            textTransform: "none",
            borderRadius: "12px",
            px: 3,
            background:
              "linear-gradient(135deg,#EF4444,#DC2626)",

            "&:hover": {
              background:
                "linear-gradient(135deg,#DC2626,#B91C1C)",
            },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}