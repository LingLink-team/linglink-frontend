"use client"

import React from "react"
import Header from "@/components/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Chat from "../(homepage)/components/chat";
import Footer from "@/components/footer";

const queryClient = new QueryClient();

export default function FlashcardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full flex flex-col">
        <Header />
        {children}
        <Chat />
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
