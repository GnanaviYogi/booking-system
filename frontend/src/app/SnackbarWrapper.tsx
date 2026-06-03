"use client";

import { SnackbarProvider } from "notistack";

export default function SnackbarWrapper({ children }: any) {
  return (
    <SnackbarProvider maxSnack={3}>
      {children}
    </SnackbarProvider>
  );
}
