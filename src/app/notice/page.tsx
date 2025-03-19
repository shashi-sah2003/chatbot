"use client";
import ChatPage from "@/components/ChatPage";

export default function Notice() {
  return (
    <ChatPage 
      apiEndpoint="/chat/information"
      welcomeMessage="DTU Notifier with latest notices!"
    />
  );
}