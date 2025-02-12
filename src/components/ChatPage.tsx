"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ChatInput from "@/components/ChatInput";
import ChatConvoUI from "@/components/ChatConvoUI";
import React from "react";

export interface ChatMessage {
  sender: "user" | "ai";
  message: React.ReactNode;
}

interface ChatPageProps {
  apiEndpoint: string;
  welcomeMessage: string;
}

export default function ChatPage({ apiEndpoint, welcomeMessage }: ChatPageProps) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Clear conversation on mount
  useEffect(() => {
    localStorage.removeItem("chatHistory");
    setChatHistory([]);
  }, []);

  const handleUserSubmit = async (userQuery: string) => {
    setChatHistory((prev) => [
      ...prev,
      { sender: "user", message: userQuery },
      {
        sender: "ai",
        message: <span className="loading loading-dots loading-md"></span>,
      },
    ]);

    try {
      const response = await axios.post(`http://127.0.0.1:8000${apiEndpoint}`, {
        query: userQuery,
      });

      const aiResponse = response.data.response;
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "ai", message: aiResponse };
        return updated;
      });
    } catch (error) {
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "ai",
          message: "Error fetching response",
        };
        return updated;
      });
    }
  };

  const handleNewSession = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  };

  const conversationOpen = chatHistory.length > 0;

  return (
    <div className="flex flex-col h-screen w-full max-w-screen-lg mx-auto overflow-hidden bg-[#212121] overflow-y-hidden">
      {/* Display welcome message only if no conversation is active */}
      {!conversationOpen && (
        <div className="text-center mt-48 mb-12">
          <h2 className="text-3xl sm:text-5xl font-semibold bg-gradient-to-r from-blue-500 to-red-400 bg-clip-text text-transparent">
            {welcomeMessage}
          </h2>
        </div>
      )}

      {/* Chat conversation area: only this section scrolls */}
      {conversationOpen && (
        // Added top padding (pt-20) so the first message isn't hidden under a header.
        <div className="flex-1 overflow-y-auto pt-20">
          <ChatConvoUI chatHistory={chatHistory} onNewSession={handleNewSession} />
        </div>
      )}

      {/* Sticky input area with New Session button moved slightly up */}
      <div className="sticky bottom-8 z-10 bg-[#212121] w-full">
        <div className="px-4 py-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <ChatInput onSubmit={handleUserSubmit} conversationOpen={conversationOpen} />
            {conversationOpen && (
              <button className="p-[3px] relative" onClick={handleNewSession}>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-purple-500 rounded-lg" />
                <div className="px-8 py-2 bg-gray-950 rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                  New Session
                </div>
              </button>
              
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
