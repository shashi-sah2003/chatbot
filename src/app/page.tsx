"use client";
import ChatPage from "@/components/ChatPage";

export default function Home() {
  return (
    
    <ChatPage 
      apiEndpoint="/chat"
      welcomeMessage="Welcome to DTU Assistant!"
    />
  );
}