"use client";

import { Switch } from "@mui/material";
import {
  useThemeContext,
} from "@/components/ThemeContext";

export default function ThemeToggle() {
  const {
    darkMode,
    toggleTheme,
  } = useThemeContext();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span>
        {darkMode ? "" : ""}
      </span>

      <Switch
        checked={darkMode}
        onChange={toggleTheme}
      />
    </div>
  );
}