import { ConvexClientProvider } from "@/components/convex-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { ModalProvider } from "@/components/modal-provider";

export const metadata: Metadata = {
  title: "Jotion Extended",
  description: "Submission for Convex Bounty Bugs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-switzerRegular">
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="Mosiac-theme-2"
            >
              <Toaster position="bottom-center" />
              <ModalProvider />
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
