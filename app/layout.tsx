import "@/styles/globals.css";
import type { Metadata } from "next";

import { fontMono, fontSans } from "@/lib/fonts";
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ReduxProvider } from "@/providers/redux-provider";

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
          <ReduxProvider>
            <div vaul-drawer-wrapper="" className="bg-background min-h-screen">
              {children}
            </div>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
