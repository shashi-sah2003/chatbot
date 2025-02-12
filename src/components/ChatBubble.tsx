"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";

interface ChatBubbleProps {
  sender: "user" | "ai";
  message: React.ReactNode; // Updated type to support JSX elements.
}

const ChatBubble = ({ sender, message }: ChatBubbleProps) => {
  const isUser = sender === "user";

  return (
    <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          {isUser ? (
            <Avatar sx={{ bgcolor: deepPurple[400] }}>U</Avatar>
          ) : (
            <Avatar sx={{ bgcolor: deepOrange[400] }}>AI</Avatar>
          )}
        </div>
      </div>
      
      <div className="chat-bubble max-w-[70%] break-words text-white">
        {message}
      </div>
    </div>
  );
};

export default ChatBubble;
