"use client";
import ChatBubble from "./ChatBubble";
import { ChatMessage } from "./ChatPage"; // adjust the path if needed
import { useScrollToBottom } from "./useScrollToBottom"; // adjust path as necessary

interface ChatConvoUIProps {
  chatHistory: ChatMessage[];
  onNewSession: () => void;
}

const ChatConvoUI = ({ chatHistory, onNewSession }: ChatConvoUIProps) => {
  // Use our custom scroll hook instead of manual useRef & useEffect
  const [containerRef, bottomRef] = useScrollToBottom<HTMLDivElement>();

  return (
    <div className="overflow-y-auto">	
      {/* Conversation area: padded and scrollable */}
      <div ref={containerRef} className="flex flex-col space-y-2 p-4">
        {chatHistory.map((msg, index) => (
          <ChatBubble key={index} sender={msg.sender} message={msg.message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatConvoUI;