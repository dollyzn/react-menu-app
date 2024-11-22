import "@/styles/globals.css";
import type { Metadata } from "next";

import { fontMono, fontSans } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "JJ Pastéis",
  description: "Cardápio digital",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div vaul-drawer-wrapper="" className="bg-background min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
