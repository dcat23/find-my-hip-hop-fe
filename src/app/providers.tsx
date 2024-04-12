"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "next-themes";
import { Modal } from "@dcat23/features/modal";

const ToasterProvider = () => {
  const { theme } = useTheme() as {
    theme: "light" | "dark" | "system";
  };
  return <Toaster theme={theme} />;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        value={{
          light: "light-theme",
          dark: "dark-theme",
        }}
      >
        <Toaster className="dark:hidden" />
        <Toaster theme="dark" className="hidden dark:block" />
        <ToasterProvider />
      </ThemeProvider>
      <Modal />
      {children}
    </SessionProvider>
  );
}
