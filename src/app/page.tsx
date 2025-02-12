// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import ChatInput from "@/components/ChatInput";
// import ChatConvoUI from "@/components/ChatConvoUI";

// // Define the ChatMessage type
// export interface ChatMessage {
//   sender: "user" | "ai";
//   message: string;
// }

// export default function Home() {
//   const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

//   // Clear conversation on mount (refresh)
//   useEffect(() => {
//     localStorage.removeItem("chatHistory");
//     setChatHistory([]);
//   }, []);

//   // When user submits a query, append user message and placeholder AI response.
//   const handleUserSubmit = async (userQuery: string) => {
//     // Append user query and a placeholder for AI response
//     setChatHistory((prev) => [
//       ...prev,
//       { sender: "user", message: userQuery },
//       { sender: "ai", message: "loading....." },
//     ]);

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/chat/result", { query: userQuery });
//       const aiResponse = response.data.response;

//       // Replace the last message (the placeholder) with the actual AI response
//       setChatHistory((prev) => {
//         const updated = [...prev];
//         updated[updated.length - 1] = { sender: "ai", message: aiResponse };
//         return updated;
//       });
//     } catch (error) {
//       // On error, replace the placeholder with an error message
//       setChatHistory((prev) => {
//         const updated = [...prev];
//         updated[updated.length - 1] = { sender: "ai", message: "Error fetching response" };
//         return updated;
//       });
//     }
//   };

//   // New Session clears the conversation.
//   const handleNewSession = () => {
//     setChatHistory([]);
//     localStorage.removeItem("chatHistory");
//   };

//   const conversationOpen = chatHistory.length > 0;

//   return (
//     <div className="flex flex-col">
//       {/* Initial Heading appears only when no conversation is open */}
//       {!conversationOpen && (
//         <div className="text-center mt-44 mb-6">
//           <h2 className="text-5xl font-semibold text-primary-foreground">
//             What can I help with?
//           </h2>
//         </div>
//       )}

//       {/* Conversation Container: fixed size between navbar and bottom bar */}
//       {conversationOpen && (
//         <div className="h-[calc(100vh-150px)] overflow-y-auto">
//           <ChatConvoUI chatHistory={chatHistory} onNewSession={handleNewSession} />
//         </div>
//       )}

//       {/* Bottom Bar: Chat Input and New Session Button */}
//       <div className="flex items-center justify-between gap-4 mt-4">
//         <ChatInput onSubmit={handleUserSubmit} conversationOpen={conversationOpen} />
//         <div>{conversationOpen && (
//           <button
//             onClick={handleNewSession}
//             className="p-2 px-4 bg-blue-500 rounded-full text-white shadow-md"
//           >
//             New Session
//           </button>
//         )}</div>
//       </div>
//     </div>
//   );
// }

// app/page.tsx


"use client";
import ChatPage from "@/components/ChatPage";

export default function Home() {
  return (
    
    <ChatPage 
      apiEndpoint="/chat/result"
      welcomeMessage="Welcome to DTU Assistant!"
    />
  );
}