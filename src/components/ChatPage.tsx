// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import ChatInput from "@/components/ChatInput";
// import ChatBubble from "./ChatBubble";
// import { useScrollToBottom } from "./useScrollToBottom";
// import { FeedbackProvider } from "@/components/FeedbackContext";
// import FeedbackDialog from "@/components/FeedbackDialog";

// export interface ChatMessage {
//   id: number;
//   sender: "user" | "ai";
//   message: string;
//   fullText?: string; // Final AI response for streaming.
//   isLoading?: boolean; // Indicates if streaming is in progress.
//   stream?: boolean; // Flag for streaming mode.
// }

// interface ChatPageProps {
//   apiEndpoint: string;
//   welcomeMessage: string;
// }

// export default function ChatPage({ apiEndpoint, welcomeMessage }: ChatPageProps) {
//   const [containerRef, bottomRef] = useScrollToBottom<HTMLDivElement>();
//   const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

//   useEffect(() => {
//     localStorage.removeItem("chatHistory");
//     setChatHistory([]);
//   }, []);

//   const handleUserSubmit = async (userQuery: string) => {
//     const userMsgId = Date.now() + Math.random();
//     const aiMsgId = Date.now() + Math.random();

//     // Append the user message and an AI placeholder.
//     setChatHistory((prev) => [
//       ...prev,
//       { id: userMsgId, sender: "user", message: userQuery },
//       { id: aiMsgId, sender: "ai", message: "", isLoading: true, stream: true },
//     ]);

//     try {
//       const response = await axios.post(`http://127.0.0.1:8000${apiEndpoint}`, { query: userQuery });
//       let fullText = response.data.response?.toString() || "";

//       // Update the AI message with the full response text.
//       setChatHistory((prev) =>
//         prev.map((msg) =>
//           msg.id === aiMsgId ? { ...msg, fullText, isLoading: false, stream: false } : msg
//         )
//       );
//     } catch (error) {
//       setChatHistory((prev) =>
//         prev.map((msg) =>
//           msg.id === aiMsgId
//             ? { ...msg, message: "Error fetching response", isLoading: false, stream: false }
//             : msg
//         )
//       );
//     }
//   };

//   const handleNewSession = () => {
//     setChatHistory([]);
//     localStorage.removeItem("chatHistory");
//   };

//   useEffect(() => {
//     const handleNewSessionEvent = () => handleNewSession();

//     window.addEventListener("new-session", handleNewSessionEvent);
//     return () => window.removeEventListener("new-session", handleNewSessionEvent);
//   }, []);

//   const conversationOpen = chatHistory.length > 0;

//   useEffect(() => {
//     window.dispatchEvent(new CustomEvent("conversation-changed", { detail: { conversationOpen } }));
//   }, [conversationOpen]);

//   return (
//     <FeedbackProvider>
//       <div className="flex flex-col h-screen w-full max-w-screen-md mx-auto bg-[#212121]">
//         {!conversationOpen && (
//           <div className="text-center mt-36 mb-8">
//             <h2 className="text-3xl sm:text-5xl font-semibold bg-gradient-to-r from-blue-500 to-red-400 bg-clip-text text-transparent">
//               {welcomeMessage}
//             </h2>
//           </div>
//         )}

//         {conversationOpen && (
//           <div className="flex-1 overflow-auto mb-16">
//             <div ref={containerRef} className="flex flex-col space-y-4 p-4">
//               {chatHistory.map((msg, index) => {
//                 let associatedUserQuery = "";
//                 let showFeedbackIcons = false;
//                 let onStreamComplete;

//                 if (msg.sender === "ai" && msg.stream && msg.isLoading) {
//                   // When streaming is active, provide a callback to update the message once streaming completes.
//                   onStreamComplete = () => {
//                     setChatHistory((prev) =>
//                       prev.map((m) =>
//                         m.id === msg.id
//                           ? { ...m, isLoading: false, stream: false, message: m.fullText || "" }
//                           : m
//                       )
//                     );
//                   };
//                 }

//                 if (
//                   msg.sender === "ai" &&
//                   index === chatHistory.length - 1 &&
//                   chatHistory[index - 1]?.sender === "user" &&
//                   !msg.isLoading
//                 ) {
//                   associatedUserQuery = chatHistory[index - 1].message;
//                   showFeedbackIcons = true;
//                 }

//                 return (
//                   <ChatBubble
//                     key={msg.id}
//                     sender={msg.sender}
//                     message={msg.message}
//                     fullText={msg.fullText}
//                     isLoading={msg.isLoading}
//                     stream={msg.stream} // Pass streaming flag.
//                     associatedUserQuery={associatedUserQuery}
//                     showFeedbackIcons={showFeedbackIcons}
//                     onStreamComplete={onStreamComplete}
//                   />
//                 );
//               })}
//               <div ref={bottomRef} />
//             </div>
//           </div>
//         )}

//         <div className="sticky bottom-0 z-10 bg-[#212121] w-full p-4 border-t border-gray-700">
//           <ChatInput onSubmit={handleUserSubmit} conversationOpen={conversationOpen} />
//         </div>
//       </div>
//       <FeedbackDialog />
//     </FeedbackProvider>
//   );
// }























"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import ChatInput from "@/components/ChatInput";
import ChatBubble from "./ChatBubble";
import { useScrollToBottom } from "./useScrollToBottom";
import { FeedbackProvider } from "@/components/FeedbackContext";
import FeedbackDialog from "@/components/FeedbackDialog";
import { extractTextFromHtml } from "./htmlTextExtractor";
import { StreamingContext } from "./StreamingContext";


export interface ChatMessage {
  id: number;
  sender: "user" | "ai";
  // Allow either plain text, JSX, or HTML string as response.
  message: React.ReactNode;
  fullText?: React.ReactNode;
  isLoading?: boolean;
  stream?: boolean;
}

interface ChatPageProps {
  apiEndpoint: string;
  welcomeMessage: string;
}

// Dummy full HTML document response simulating an LLM output
const sampleHTML =`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Delhi Technological University (DTU)</title>
</head>
<body>
  <header>
    <h1>Delhi Technological University (DTU)</h1>
    <p>Formerly known as Delhi College of Engineering (DCE)</p>
  </header>

  <section>
    <h2>About DTU</h2>
    <p>
      Delhi Technological University, located in New Delhi, India, is one of the country's premier engineering institutions.
      Established in 1941, DTU has a rich legacy of academic excellence and innovation in engineering and technology.
    </p>
  </section>

  <section>
    <h2>Academic Programs</h2>
    <p>
      DTU offers a diverse range of undergraduate, postgraduate, and doctoral programs in fields such as engineering, technology,
      management, and architecture. The curriculum is designed to foster critical thinking, problem-solving, and hands-on learning.
    </p>
  </section>

  <section>
    <h2>Campus & Facilities</h2>
    <p>
      The campus is well-equipped with modern infrastructure including state-of-the-art laboratories, libraries, and recreational facilities,
      creating an environment conducive to both academic and personal growth.
    </p>
  </section>

  <section>
    <h2>Research & Collaborations</h2>
    <p>
      DTU is committed to research and innovation, collaborating with industry leaders and academic institutions worldwide. 
      Its initiatives aim to bridge the gap between theoretical knowledge and practical application.
    </p>
  </section>

  <footer>
    <p>
      For more details, please visit the official
      <a href="https://www.dtu.ac.in" target="_blank">DTU website</a>.
    </p>
  </footer>
</body>
</html>
`;

export default function ChatPage({ apiEndpoint, welcomeMessage }: ChatPageProps) {
  const [containerRef, bottomRef] = useScrollToBottom<HTMLDivElement>();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isStreamingComplete, setIsStreamingComplete] = useState(true);

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
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;  // Define the base URL
      const response = await axios.post(`http://127.0.0.1:8000${apiEndpoint}`, { query: userQuery });
      let fullText = response.data.response;
      // For demonstration, if fullText is not provided, we use sampleHTML.
      if (!fullText || typeof fullText !== "string") {
        fullText = sampleHTML;
      }
      const plainText = extractTextFromHtml(fullText);
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? { ...msg, fullText, isLoading: false, stream: false, message: plainText }
            : msg
        )
      );
    } catch (error) {
      const plainText = extractTextFromHtml(sampleHTML);
      // On error, assign our dummy full HTML document response as plain text.
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? { ...msg, message: plainText, fullText: sampleHTML, isLoading: false, stream: false }
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
    <StreamingContext.Provider value={{ isStreaming, setIsStreaming, isStreamingComplete, setIsStreamingComplete }}>
  <FeedbackProvider>
    {/* Existing content */}
    <div className="flex flex-col h-screen w-full max-w-screen-md mx-auto bg-[#212121]">
      {!conversationOpen && (
        <div className="text-center mt-28">
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
              if (
                msg.sender === "ai" &&
                index === chatHistory.length - 1 &&
                chatHistory[index - 1]?.sender === "user" &&
                !msg.isLoading &&
                !isStreaming
              ) {
                associatedUserQuery = chatHistory[index - 1].message as string;
                showFeedbackIcons = true;
              }
              return (
                <ChatBubble
                  key={msg.id}
                  sender={msg.sender}
                  message={msg.message}
                  fullText={msg.fullText}
                  isLoading={msg.isLoading}
                  stream={msg.stream}
                  associatedUserQuery={associatedUserQuery}
                  showFeedbackIcons={showFeedbackIcons}
                />
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>
    )}

    <div className="sticky bottom-0 z-10 bg-[#212121] w-full p-4 ">
      <ChatInput onSubmit={handleUserSubmit} conversationOpen={conversationOpen} />
    </div>
    </div>
    <FeedbackDialog />
  </FeedbackProvider>
</StreamingContext.Provider>


  );
}























// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Anmol CGPA Table</title>
//   </head>
// <body>
//   <h2>There are multiple students named Anmol. Here's their CGPA:</h2>
//   <table>
//       <thead>
//           <tr>
//               <th>Name</th>
//               <th>CGPA</th>
//           </tr>
//       </thead>
//       <tbody>
//           <tr>
//               <td>Anmol Ahsaas Sharan</td>
//               <td>9.93</td>
//           </tr>
//           <tr>
//               <td>Anmol Bhardwaj</td>
//               <td>8.47</td>
//           </tr>
//           <tr>
//               <td>Anmol Pandey</td>
//               <td>8.32</td>
//           </tr>
//           <tr>
//               <td>Anmol Dhanker</td>
//               <td>6.56</td>
//           </tr>
//           <tr>
//               <td>Anmol Chaudhary</td>
//               <td>5.67</td>
//           </tr>
//           <tr>
//               <td>Anmol Singh Fulanekar</td>
//               <td>5.54</td>
//           </tr>
//           <tr>
//               <td>Anmol Sharma</td>
//               <td>5.29 👍</td>
//           </tr>
//       </tbody>
//   </table>
// </body>
// </html>










// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Delhi Technological University (DTU)</title>
// </head>
// <body>
//   <header>
//     <h1>Delhi Technological University (DTU)</h1>
//     <p>Formerly known as Delhi College of Engineering (DCE)</p>
//   </header>

//   <section>
//     <h2>About DTU</h2>
//     <p>
//       Delhi Technological University, located in New Delhi, India, is one of the country's premier engineering institutions.
//       Established in 1941, DTU has a rich legacy of academic excellence and innovation in engineering and technology.
//     </p>
//   </section>

//   <section>
//     <h2>Academic Programs</h2>
//     <p>
//       DTU offers a diverse range of undergraduate, postgraduate, and doctoral programs in fields such as engineering, technology,
//       management, and architecture. The curriculum is designed to foster critical thinking, problem-solving, and hands-on learning.
//     </p>
//   </section>

//   <section>
//     <h2>Campus & Facilities</h2>
//     <p>
//       The campus is well-equipped with modern infrastructure including state-of-the-art laboratories, libraries, and recreational facilities,
//       creating an environment conducive to both academic and personal growth.
//     </p>
//   </section>

//   <section>
//     <h2>Research & Collaborations</h2>
//     <p>
//       DTU is committed to research and innovation, collaborating with industry leaders and academic institutions worldwide. 
//       Its initiatives aim to bridge the gap between theoretical knowledge and practical application.
//     </p>
//   </section>

//   <footer>
//     <p>
//       For more details, please visit the official
//       <a href="https://www.dtu.ac.in" target="_blank">DTU website</a>.
//     </p>
//   </footer>
// </body>
// </html>
