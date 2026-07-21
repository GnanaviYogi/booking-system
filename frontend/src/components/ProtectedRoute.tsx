"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { hasPermission } from "@/utils/permissions";

interface Props {
  permission: string;
  children: React.ReactNode;
}

export default function ProtectedRoute({
  permission,
  children,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!hasPermission(permission)) {
      router.push("/unauthorized");
    }
  }, [permission, router]);

  if (!hasPermission(permission)) {
    return null;
  }

  return <>{children}</>;
}