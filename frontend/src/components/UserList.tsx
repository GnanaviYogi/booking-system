"use client";

import { useState } from "react";

import {
  Paper,
  Typography,
  Button,
  Box,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { useGetUsersQuery } from "@/services/api";

import AppSkeleton from "./skeletons/AppSkeleton";






export default function UserList() {
 const {
  data: users = [],
  isLoading,
} = useGetUsersQuery(undefined);
if (isLoading) {
  return <AppSkeleton count={5} />;
}


  const [search, setSearch] =
    useState("");



  const filteredUsers = users.filter(
    (user: any) =>
      user.username
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );




  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "24px",

        background:
          "linear-gradient(135deg,#243B73 0%,#1B2746 100%)",

        backdropFilter: "blur(20px)",

        border:
          "1px solid rgba(255,255,255,.08)",

        boxShadow:
          "0 10px 30px rgba(0,0,0,.15)",

        color: "white",
      }}
    >
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "26px",
              fontWeight: 800,
              letterSpacing: "-0.5px",

              background:
                "linear-gradient(90deg,#FFFFFF,#93C5FD)",

              WebkitBackgroundClip:
                "text",

              WebkitTextFillColor:
                "transparent",
            }}
          >
            Users Management
          </Typography>

          <Typography
            sx={{
              fontSize: "13px",
              color:
                "rgba(255,255,255,.55)",
              mt: 0.5,
            }}
          >
            Manage users and reset passwords
          </Typography>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1.2,

            minWidth: 130,

            borderRadius: "18px",

            background:
              "linear-gradient(135deg,rgba(59,130,246,.18),rgba(96,165,250,.08))",

            border:
              "1px solid rgba(96,165,250,.25)",

            boxShadow:
              "0 8px 20px rgba(59,130,246,.12)",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
          >
            <PeopleAltIcon
              sx={{
                fontSize: 18,
              }}
            />

            <Typography
              sx={{
                fontSize: 11,
                textTransform:
                  "uppercase",
                letterSpacing: 1,
                color:
                  "rgba(255,255,255,.65)",
              }}
            >
              Users
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {users.length}
          </Typography>
        </Box>
      </Box>

      {/* SEARCH */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search username or email..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        sx={{
          mb: 2.5,

          "& .MuiOutlinedInput-root":
            {
              borderRadius: "12px",

              color: "white",

              background:
                "rgba(255,255,255,.03)",

              "& fieldset": {
                borderColor:
                  "rgba(255,255,255,.10)",
              },

              "&:hover fieldset":
                {
                  borderColor:
                    "rgba(96,165,250,.25)",
                },
            },

          "& .MuiInputBase-input::placeholder":
            {
              color:
                "rgba(255,255,255,.4)",
              opacity: 1,
            },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  color:
                    "rgba(255,255,255,.4)",
                }}
              />
            </InputAdornment>
          ),
        }}
      />

      {/* USER LIST */}
      <Box
        display="flex"
        flexDirection="column"
        gap={0.8}
      >
        {filteredUsers.map(
          (user: any) => (
            <Box
              key={user.id}
              sx={{
                px: 1.5,
                py: 1,

                borderRadius: "14px",

                background:
                  "linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.02))",

                border:
                  "1px solid rgba(255,255,255,.06)",

                display: "grid",

                gridTemplateColumns:
                  "1fr auto",

                alignItems: "center",

                transition:
                  "all .2s ease",

                "&:hover": {
                  background:
                    "rgba(255,255,255,.05)",

                  borderColor:
                    "rgba(96,165,250,.20)",

                  transform:
                    "translateY(-1px)",

                  boxShadow:
                    "0 4px 14px rgba(59,130,246,.12)",
                },
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={1.2}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,

                    fontSize: 14,

                    fontWeight: 700,

                    background:
                      "linear-gradient(135deg,#7DD3FC,#3B82F6)",

                    boxShadow:
                      "0 2px 8px rgba(59,130,246,.2)",
                  }}
                >
                  {user.username?.[0]?.toUpperCase()}
                </Avatar>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#fff",
                      lineHeight: 1.2,
                    }}
                  >
                    {user.username}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color:
                        "rgba(255,255,255,.5)",
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Box>
<Box
  sx={{
    px: 1.5,
    py: 0.6,

    borderRadius: "999px",

    background:
      "rgba(255,255,255,.04)",

    border:
      "1px solid rgba(255,255,255,.08)",
  }}
>
  <Typography
    sx={{
      fontSize: 12,
      color:
        "rgba(255,255,255,.55)",
      fontWeight: 500,
    }}
  >
    View Only
  </Typography>
</Box>

            </Box>
          )
        )}
      </Box>

   


    </Paper>
  );
}