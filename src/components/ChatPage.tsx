
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ChatInput from "@/components/ChatInput";
import ChatBubble from "./ChatBubble";
import { useScrollToBottom } from "./useScrollToBottom";
import { FeedbackProvider } from "@/components/FeedbackContext";
import FeedbackDialog from "@/components/FeedbackDialog";

export interface ChatMessage {
  id: number;
  sender: "user" | "ai";
  message: string;
  fullText?: string; // Final AI response for streaming.
  isLoading?: boolean; // Indicates if streaming is in progress.
  stream?: boolean;    // Flag for streaming mode.
}

interface ChatPageProps {
  apiEndpoint: string;
  welcomeMessage: string;
}

export default function ChatPage({ apiEndpoint, welcomeMessage }: ChatPageProps) {
  const [containerRef, bottomRef] = useScrollToBottom<HTMLDivElement>();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    localStorage.removeItem("chatHistory");
    setChatHistory([]);
  }, []);

  const handleUserSubmit = async (userQuery: string) => {
    const userMsgId = Date.now() + Math.random();
    const aiMsgId = Date.now() + Math.random();

    // Append the user message and an AI placeholder.
    setChatHistory((prev) => [
      ...prev,
      { id: userMsgId, sender: "user", message: userQuery },
      { id: aiMsgId, sender: "ai", message: "", isLoading: true, stream: true },
    ]);

    try {
      const response = await axios.post(`http://127.0.0.1:8000${apiEndpoint}`, { query: userQuery });
      let fullText = response.data.response;
      fullText = fullText ? fullText.toString() : "";
      // Update the AI message with the full response text.
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId ? { ...msg, fullText, isLoading: true, stream: true } : msg
        )
      );
    } catch (error) {
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? { ...msg, message: "Error fetching response", isLoading: false, stream: false }
            : msg
        )
      );
    }
  };

  const handleNewSession = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  };

  useEffect(() => {
    const handleNewSessionEvent = () => {
      handleNewSession();
    };
    window.addEventListener("new-session", handleNewSessionEvent);
    return () => window.removeEventListener("new-session", handleNewSessionEvent);
  }, []);

  const conversationOpen = chatHistory.length > 0;
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("conversation-changed", { detail: { conversationOpen } }));
  }, [conversationOpen]);

  return (
    <FeedbackProvider>
      <div className="flex flex-col h-screen w-full max-w-screen-md mx-auto bg-[#212121]">
        {!conversationOpen && (
          <div className="text-center mt-36 mb-8">
            <h2 className="text-3xl sm:text-5xl font-semibold bg-gradient-to-r from-blue-500 to-red-400 bg-clip-text text-transparent">
              {welcomeMessage}
            </h2>
          </div>
        )}

        {conversationOpen && (
          <div className="flex-1 overflow-auto mb-16">
            <div ref={containerRef} className="flex flex-col space-y-4 p-4">
              {chatHistory.map((msg, index) => {
                let associatedUserQuery = "";
                let showFeedbackIcons = false;
                let onStreamComplete;
                if (msg.sender === "ai" && msg.stream && msg.isLoading) {
                  // When streaming is active, provide a callback to update the message once streaming completes.
                  onStreamComplete = () => {
                    setChatHistory((prev) =>
                      prev.map((m) =>
                        m.id === msg.id
                          ? { ...m, isLoading: false, stream: false, message: m.fullText || "" }
                          : m
                      )
                    );
                  };
                }
                if (
                  msg.sender === "ai" &&
                  index === chatHistory.length - 1 &&
                  chatHistory[index - 1]?.sender === "user" &&
                  !msg.isLoading
                ) {
                  associatedUserQuery = chatHistory[index - 1].message;
                  showFeedbackIcons = true;
                }
                return (
                  <ChatBubble
                    key={msg.id}
                    sender={msg.sender}
                    message={msg.message}
                    fullText={msg.fullText}
                    isLoading={msg.isLoading}
                    stream={msg.stream} // Pass streaming flag.
                    associatedUserQuery={associatedUserQuery}
                    showFeedbackIcons={showFeedbackIcons}
                    onStreamComplete={onStreamComplete}
                  />
                );
              })}
              <div ref={bottomRef} />
            </div>
          </div>
        )}

        <div className="sticky bottom-0 z-10 bg-[#212121] w-full p-4 border-t border-gray-700">
          <ChatInput onSubmit={handleUserSubmit} conversationOpen={conversationOpen} />
        </div>
      </div>
      <FeedbackDialog />
    </FeedbackProvider>
  );
}









// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import ChatInput from "@/components/ChatInput";
// import ChatBubble from "./ChatBubble";
// import { useScrollToBottom } from "./useScrollToBottom";

// export interface ChatMessage {
//   sender: "user" | "ai";
//   message: React.ReactNode;
// }

// interface ChatPageProps {
//   apiEndpoint: string;
//   welcomeMessage: string;
// }

// export default function ChatPage({ apiEndpoint, welcomeMessage }: ChatPageProps) {
//   const [containerRef, bottomRef] = useScrollToBottom<HTMLDivElement>();
//   const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

//   // Clear conversation on mount
//   useEffect(() => {
//     localStorage.removeItem("chatHistory");
//     setChatHistory([]);
//   }, []);

//   const handleUserSubmit = async (userQuery: string) => {
//     setChatHistory(prev => [
//       ...prev,
//       { sender: "user", message: userQuery },
//       { sender: "ai", message: <span className="loading loading-dots loading-md"></span> }
//     ]);

//     try {
//       const response = await axios.post(`http://127.0.0.1:8000${apiEndpoint}`,{ query: userQuery });
//       let aiResponse = response.data.response;
//       if (aiResponse === undefined || aiResponse === null) {
//         aiResponse = "";
//       } else {
//         aiResponse = aiResponse.toString();
//       }

//       setChatHistory(prev => {
//         const updated = [...prev];
//         updated[updated.length - 1] = { sender: "ai", message: aiResponse };
//         return updated;
//       });
//     } catch (error) {
//       setChatHistory(prev => {
//         const updated = [...prev];
//         updated[updated.length - 1] = { sender: "ai", message: "Error fetching response" };
//         return updated;
//       });
//     }
//   };

//   const handleNewSession = () => {
//     setChatHistory([]);
//     localStorage.removeItem("chatHistory");
//   };

//   // Determine if a conversation is open
//   const conversationOpen = chatHistory.length > 0;

//   // Listen for "new-session" events dispatched by Header
//   useEffect(() => {
//     const handleNewSessionEvent = () => {
//       handleNewSession();
//     };
//     window.addEventListener("new-session", handleNewSessionEvent);
//     return () => window.removeEventListener("new-session", handleNewSessionEvent);
//   }, []);

//   // Dispatch the conversation state so Header can know when to display the button
//   useEffect(() => {
//     window.dispatchEvent(new CustomEvent("conversation-changed", { detail: { conversationOpen } }));
//   }, [conversationOpen]);

//   return (
//     <div className="flex flex-col h-screen w-full max-w-screen-md mx-auto overflow-auto bg-[#212121]">
//       {!conversationOpen && (
//         <div className="text-center mt-36 mb-8">
//           <h2 className="text-3xl sm:text-5xl font-semibold bg-gradient-to-r from-blue-500 to-red-400 bg-clip-text text-transparent">
//             {welcomeMessage}
//           </h2>
//         </div>
//       )}

//       {conversationOpen && (
//         <div className="flex flex-col overflow-auto mb-16 w-full h-full">
//           <div ref={containerRef} className="flex flex-col space-y-2 p-4">
//             {chatHistory.map((msg, index) => (
//               <ChatBubble key={index} sender={msg.sender} message={msg.message} />
//             ))}
//             <div ref={bottomRef} />
//           </div>
//         </div>
//       )}

//       {/* Sticky input area */}
//       <div className="sticky bottom-20 z-10 bg-[#212121] w-full">
//         <div className="px-4 py-2">
//           <ChatInput onSubmit={handleUserSubmit} /* onNewSession removed */ conversationOpen={conversationOpen} />
//         </div>
//       </div>
//     </div>
//   );
// }
