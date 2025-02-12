"use client";
import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import { ChatMessage } from "./ChatPage"; // adjust the path if needed

interface ChatConvoUIProps {
  chatHistory: ChatMessage[];
  onNewSession: () => void;
}

const ChatConvoUI = ({ chatHistory, onNewSession }: ChatConvoUIProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added using a dummy element
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="w-full flex flex-col h-full">
      {/* Conversation area: padded and scrollable */}
      <div ref={scrollRef} className="flex flex-col space-y-4 p-4 overflow-y-auto">
        {chatHistory.map((msg, index) => (
          <ChatBubble key={index} sender={msg.sender} message={msg.message} />
        ))}
        {/* Dummy element to scroll into view */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatConvoUI;
