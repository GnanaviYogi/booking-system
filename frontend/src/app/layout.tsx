import Providers from "@/store/Provider";
import SnackbarWrapper from "./SnackbarWrapper";
import { ThemeProvider } from "@/components/ThemeContext";

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            "'Inter', 'Segoe UI', Arial, sans-serif",
          margin: 0,
        }}
      >
        <Providers>

          <ThemeProvider>

            <SnackbarWrapper>
              {children}
            </SnackbarWrapper>

          </ThemeProvider>

        </Providers>
      </body>
    </html>
  );
}