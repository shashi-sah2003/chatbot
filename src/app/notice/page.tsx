"use client";
import ChatPage from "@/components/ChatPage";

export default function Notice() {
  return (
    <ChatPage 
      apiEndpoint="/chat/notice"
      welcomeMessage="DTU Notifier with latest notices!"
    />
  );
}