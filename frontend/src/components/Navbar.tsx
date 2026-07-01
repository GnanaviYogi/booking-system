"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ remove token

    // ✅ redirect to login page
    router.push("/login?logout=1");
  };

  return (
    <div style={{ padding: "10px", textAlign: "right" }}>
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}