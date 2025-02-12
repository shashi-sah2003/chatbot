"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";
import AnimatedText from "@/components/AnimatedText"; // Adjust the path as needed

interface ChatBubbleProps {
  sender: "user" | "ai";
  message: React.ReactNode; // Supports both plain text and JSX elements.
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
        {/* If sender is AI and message is a string, animate it */}
        {sender === "ai" && typeof message === "string" ? (
          <AnimatedText text={message} interval={100} />
        ) : (
          message
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
