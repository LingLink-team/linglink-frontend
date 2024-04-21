import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import TanstackProvider from "@/components/providers/TanstackProvider";
import { StoreProvider } from "../redux/StoreProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import { Suspense } from "react";
import Loading from "./loading";
import { Toaster } from "@/components/ui/sonner";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const locales = ["en", "vi"];

export const metadata: Metadata = {
  title: "Ling Link",
  description: "Ứng dụng học tiếng Anh",
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: any;
}) {
  if (!locales.includes(locale as any)) notFound();
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  return (
    <html lang={locale}>
      <head></head>
      <body
        className={cn(
          "min-h-screen bg-secondary font-sans antialiased",
          fontSans.variable
        )}
      >
        <StoreProvider>
          <TanstackProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Suspense fallback={<Loading />}>
                {children}
                <ToastContainer
                  position="bottom-center"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </Suspense>
              <Toaster />
            </NextIntlClientProvider>
          </TanstackProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
