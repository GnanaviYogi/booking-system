"use client";

import {
  Paper,
  Typography,
  Button,
} from "@mui/material";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "@/services/api";

import { useAuth } from "@/hooks/useAuth";

export default function UserList() {
  const { hasPermission } = useAuth();

  const { data: users = [] } =
    useGetUsersQuery(undefined);

  const [deleteUser] =
    useDeleteUserMutation();

  return (
    <Paper
      sx={{
        p: 3,
      }}
    >
      <Typography
        variant="h5"
        mb={3}
      >
        Users
      </Typography>

      {users.map((user: any) => (
        <div
          key={user.id}
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: "12px",
          }}
        >
          <span>
            {user.username}
          </span>

          {hasPermission(
            "user:delete"
          ) && (
            <Button
              color="error"
              onClick={() =>
                deleteUser(user.id)
              }
            >
              Delete
            </Button>
          )}
        </div>
      ))}
    </Paper>
  );
}