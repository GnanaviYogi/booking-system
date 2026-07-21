"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layouts/AppLayout";
import UserList from "@/components/UserList";

export default function UsersPage() {
  return (
    <ProtectedRoute permission="user:view">
      <AppLayout>
        <UserList />
      </AppLayout>
    </ProtectedRoute>
  );
}