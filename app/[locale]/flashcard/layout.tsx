import React from "react";
import Header from "@/components/header";
import Chat from "../(homepage)/components/chat";
import Footer from "@/components/footer";

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col">
      <Header />
      {children}
      <Chat />
      <Footer />
    </div>
  );
}
