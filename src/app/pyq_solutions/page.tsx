"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatInput from "@/components/ChatInput";
import ChatBubble from "@/components/ChatBubble";
import { useScrollToBottom } from "@/components/useScrollToBottom";
import { FeedbackProvider } from "@/components/FeedbackContext";
import FeedbackDialog from "@/components/FeedbackDialog";
import { StreamingContext } from "@/components/StreamingContext";
import UploadQuestionPaper from "@/components/UploadQuestionPaper";

// Define a tuple type for each paper.
// Adjust the types if you have more specific information.
type Paper = [unknown, unknown, string, string, string, string, string, string];

export type ChatMessage = {
  id: number;
  sender: "user" | "ai";
  message: React.ReactNode;
  fullText?: React.ReactNode;
  isLoading?: boolean;
  stream?: boolean;
};

// Interface for the API response
interface PyqPapersResponse {
  response: Paper[] | string;
}

const sampleMarkdown = `Unexpected error occurred. Please try again later.`;

// Function to generate a markdown table from the CSV-like array response
const generateMarkdownTable = (papersArray: Paper[]): string => {
  if (papersArray.length === 0) {
    return "Currently I can't help you with this query😔.";
  }
  const header =
    "Subject Code | Year | Sem | Month | Branch | Link |\n| --- | --- | --- | --- | --- | --- |\n";
  const rows = papersArray
    .map((paper: Paper) => {
      // Omit the first (id) and last (filePath) columns
      const subjectCode = paper[2];
      const year = paper[3];
      const examType = paper[4];
      const month = paper[5];
      const dept = paper[6];
      const pdfUrl = paper[7];
      const link = `[View Paper](${pdfUrl})`;
      return `|${subjectCode} | ${year} | ${examType} | ${month} | ${dept} | ${link} |`;
    })
    .join("\n");
  return header + rows;
};

export default function ChatPage() {
  const [containerRef, bottomRef] = useScrollToBottom<HTMLDivElement>();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isStreamingComplete, setIsStreamingComplete] = useState(true);
  const welcomeMessage = "Welcome to Pyq's Section";

  // Clear local chat history on mount
  useEffect(() => {
    localStorage.removeItem("chatHistory");
    setChatHistory([]);
  }, []);

  // Handle user submitting a query
  const handleUserSubmit = async (userQuery: string) => {
    const userMsgId = Date.now() + Math.random();
    const aiMsgId = Date.now() + Math.random();

    // Append user message and a loading indicator for the AI
    setChatHistory((prev) => [
      ...prev,
      { id: userMsgId, sender: "user", message: userQuery },
      { id: aiMsgId, sender: "ai", message: "", isLoading: true, stream: true },
    ]);

    try {
      const response = await axios.post<PyqPapersResponse>(
        '/api/pyq_papers',
        { query: userQuery }
      );
      let papersArray: Paper[] | null = null;

      // Check if the response is an array
      if (Array.isArray(response.data.response)) {
        papersArray = response.data.response;
      } else if (typeof response.data.response === "string") {
        // Attempt to parse the string as JSON
        try {
          const parsed = JSON.parse(response.data.response);
          if (Array.isArray(parsed)) {
            papersArray = parsed;
          }
        } catch (e) {
          // If parsing fails, leave papersArray as null
        }
      }

      if (papersArray) {
        const markdownTable = generateMarkdownTable(papersArray);
        // Update the AI message in chat history with the markdown table
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  message: markdownTable,
                  fullText: markdownTable,
                  isLoading: false,
                  stream: false,
                }
              : msg
          )
        );
      } else {
        // Otherwise, assume the response is a plain text message
        let fullText = response.data.response;
        if (!fullText || typeof fullText !== "string") {
          fullText = sampleMarkdown;
        }
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  fullText,
                  isLoading: false,
                  stream: false,
                  message: fullText,
                }
              : msg
          )
        );
      }
    } catch (error) {
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? {
                ...msg,
                message: sampleMarkdown,
                fullText: sampleMarkdown,
                isLoading: false,
                stream: false,
              }
            : msg
        )
      );
    }
  };

  // Handle a new session event
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
    window.dispatchEvent(
      new CustomEvent("conversation-changed", { detail: { conversationOpen } })
    );
  }, [conversationOpen]);

  return (
    <StreamingContext.Provider
      value={{ isStreaming, setIsStreaming, isStreamingComplete, setIsStreamingComplete }}
    >
      <FeedbackProvider>
        <div className="flex flex-col h-screen w-full max-w-screen-md overflow-x-hidden mx-auto bg-[#212121]">
          {!conversationOpen && (
            <div className="text-center mt-28">
              <h2 className="text-3xl sm:text-5xl font-semibold bg-gradient-to-r from-blue-500 to-red-400 bg-clip-text text-transparent">
                {welcomeMessage}
              </h2>
            </div>
          )}

          {conversationOpen && (
            <div className="flex-1 overflow-x-hidden">
              <div ref={containerRef} className="flex flex-col space-y-4 p-4 ">
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

          {/* Render the chat input */}
          <div className="sticky bottom-0 z-10 bg-[#212121] w-full p-4">
            <ChatInput onSubmit={handleUserSubmit} conversationOpen={conversationOpen} />
          </div>

          {/* Render UploadQuestionPaper below ChatInput if welcomeMessage exists */}
          {welcomeMessage && <UploadQuestionPaper />}
        </div>
        <FeedbackDialog />
      </FeedbackProvider>
    </StreamingContext.Provider>
  );
}
