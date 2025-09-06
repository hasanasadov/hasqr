import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import queryClient from "@/config/query";
// import CircleCursor from "@/components/shared/Cursor";
import "@/styles/globals.css";

export default function CustomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={false}
      >
        {/* <CircleCursor /> */}
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
