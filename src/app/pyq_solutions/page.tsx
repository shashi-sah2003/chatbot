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

// Define the chat message interface
export interface ChatMessage {
  id: number;
  sender: "user" | "ai";
  message: React.ReactNode;
  fullText?: React.ReactNode;
  isLoading?: boolean;
  stream?: boolean;
}

const sampleMarkdown = `Unexpected error occurred. Please try again later.`;

// Define a type for a question paper
interface QuestionPaper {
  id: number;
  subjectName: string;
  subjectCode: string;
  year: number;
  examType: string;
  month: string;
  dept: string;
  pdfUrl: string;
  filePath: string;
}

// Component to render the list of question papers
const QuestionPapersList = ({ papers }: { papers: QuestionPaper[] }) => {
  return (
    <div className="space-y-4">
      {papers.map((paper) => (
        <div key={paper.id} className="p-4 bg-gray-800 rounded-md">
          <h3 className="text-xl font-semibold text-white">
            {paper.subjectName} ({paper.subjectCode})
          </h3>
          <p className="text-gray-300">
            {paper.month} {paper.year} -{" "}
            {paper.examType === "Mid" ? "Mid Sem" : paper.examType === "End" ? "End Sem" : paper.examType}
          </p>
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline mt-2 inline-block"
          >
            See Paper
          </a>
        </div>
      ))}
    </div>
  );
};

export default function ChatPage() {
  const [containerRef, bottomRef] = useScrollToBottom<HTMLDivElement>();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isStreamingComplete, setIsStreamingComplete] = useState(true);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[] | null>(null);
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
      const response = await axios.post(`https://api.res-umer.tech/v2/pyq_papers`, { query: userQuery });

      // If the response data is an array then assume it's a list of question papers
      if (Array.isArray(response.data.response)) {
        const papersArray = response.data.response;
        // Map the array to our QuestionPaper type:
        const papers: QuestionPaper[] = papersArray.map((paper: any[]) => ({
          id: paper[0],
          subjectName: paper[1],
          subjectCode: paper[2],
          year: paper[3],
          examType: paper[4],
          month: paper[5],
          dept: paper[6],
          pdfUrl: paper[7],
          filePath: paper[8],
        }));
        setQuestionPapers(papers);

        // Update the AI message in chat history
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? { ...msg, message: "Question papers loaded.", fullText: "Question papers loaded.", isLoading: false, stream: false }
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
              ? { ...msg, fullText, isLoading: false, stream: false, message: fullText }
              : msg
          )
        );
      }
    } catch (error) {
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? { ...msg, message: sampleMarkdown, fullText: sampleMarkdown, isLoading: false, stream: false }
            : msg
        )
      );
    }
  };

  // Handle a new session event
  const handleNewSession = () => {
    setChatHistory([]);
    setQuestionPapers(null);
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

          {/* Render the chat input */}
          <div className="sticky bottom-0 z-10 bg-[#212121] w-full p-4">
            <ChatInput onSubmit={handleUserSubmit} conversationOpen={conversationOpen} />
          </div>

          {/* Render UploadQuestionPaper below ChatInput if welcomeMessage exists */}
          {welcomeMessage && <UploadQuestionPaper />}

          {/* Render the list of question papers if available */}
          {questionPapers && (
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-white mb-4">Question Papers</h2>
              <QuestionPapersList papers={questionPapers} />
            </div>
          )}
        </div>
        <FeedbackDialog />
      </FeedbackProvider>
    </StreamingContext.Provider>
  );
}
