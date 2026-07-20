"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext = createContext<any>(null);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] =
    useState(false);

  useEffect(() => {
    const theme =
      localStorage.getItem("theme");

    if (theme === "dark") {
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const nextValue = !darkMode;

    setDarkMode(nextValue);

    localStorage.setItem(
      "theme",
      nextValue ? "dark" : "light"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () =>
  useContext(ThemeContext);