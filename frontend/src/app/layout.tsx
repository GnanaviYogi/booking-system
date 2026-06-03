import Providers from "@/store/Provider";
import SnackbarWrapper from "./SnackbarWrapper";

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          margin: 0,
        }}
      >
        <Providers>
          {/* ✅ Correct usage */}
          <SnackbarWrapper>
            {children}
          </SnackbarWrapper>
        </Providers>
      </body>
    </html>
  );
}
