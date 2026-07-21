"use client";

import { hasPermission } from "@/utils/permissions";

export function useAuth() {
  const user =
    localStorage.getItem("user") || "";

  const roles = JSON.parse(
    localStorage.getItem("roles") || "[]"
  );

  const permissions = JSON.parse(
    localStorage.getItem("permissions") || "[]"
  );

  return {
    user,
    roles,
    permissions,
    hasPermission,
  };
}