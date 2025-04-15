"use client";
import { useEffect, useState } from "react";
import ChatInput from "@/components/ChatInput";
import ChatBubble from "./ChatBubble";
import { useScrollToBottom } from "./useScrollToBottom";
import { FeedbackProvider } from "@/components/FeedbackContext";
import FeedbackDialog from "@/components/FeedbackDialog";
import { StreamingContext } from "./StreamingContext";
import api from "@/utils/axiosConfig";
import SuggestionChips from "./SuggestionChips";

/**z
 * Removes the word "None" when it appears as a last name.
 * The function looks for patterns where a non-space sequence is followed by one or more spaces and then "None",
 * and replaces the match with just the first name.
 *
 * @param {string} text - The input text containing names.
 * @returns {string} The processed text with "None" removed from names.
 */
function removeNoneLastName(text: string): string {
  return text.replace(/\b(\S+)\s+None\b/g, '$1');
}

export interface ChatMessage {
  id: number;
  sender: "user" | "ai";
  message: React.ReactNode;
  fullText?: React.ReactNode;
  isLoading?: boolean;
  stream?: boolean;
}

interface ChatPageProps {
  apiEndpoint: string;
  welcomeMessage: string;
}

// Define the interface for moderatedResponse
interface ModeratedResponse {
  aiResponse: {
    message: string | React.ReactNode;
    fullText?: string | React.ReactNode;
  };
}

const sampleMarkdown = "Unexpected error occurred. Please try again later.";

export default function ChatPage({ apiEndpoint, welcomeMessage }: ChatPageProps) {
  const [containerRef, bottomRef] = useScrollToBottom<HTMLDivElement>();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isStreamingComplete, setIsStreamingComplete] = useState(true);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    localStorage.removeItem("chatHistory");
    setChatHistory([]);
  }, []);

  const handleUserSubmit = async (userQuery: string, moderatedResponse?: ModeratedResponse) => {
    const userMsgId = Date.now() + Math.random();
    const aiMsgId = Date.now() + Math.random();

    // Add user's message and a loading AI message immediately
    setChatHistory((prev) => [
      ...prev,
      { id: userMsgId, sender: "user", message: userQuery },
      { id: aiMsgId, sender: "ai", message: "", isLoading: true, stream: true }
    ]);
    setIsStreaming(true); // Disable input during processing

    if (moderatedResponse) {
      const { aiResponse } = moderatedResponse;
      // Delay the moderated response by 1 second
      setTimeout(() => {
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? { ...msg, message: aiResponse.message, fullText: aiResponse.fullText, isLoading: false, stream: false }
              : msg
          )
        );
        setIsStreaming(false); // Re-enable input after response
        setIsStreamingComplete(true); // Ensure streaming is marked as complete
      }, 1000);
    } else {
      // Proceed to backend for non-moderated queries
      try {
        const response = await api.post(`api${apiEndpoint}`,
          { query: userQuery },
          {
            headers: {
              "x-vercel-secret": process.env.NEXT_PUBLIC_VERCEL_SECRET,
            },
          });


        // Handle different response types more robustly
        let fullText = sampleMarkdown;
        if (response.data && response.data.response !== undefined) {
          if (typeof response.data.response === "string") {
            fullText = response.data.response.trim().length > 0
              ? removeNoneLastName(response.data.response)
              : sampleMarkdown;
          } else if (response.data.response !== null) {
            // If response is not string but is a valid data object/array, convert to string
            try {
              fullText = JSON.stringify(response.data.response);
            } catch (e) {
              fullText = sampleMarkdown;
            }
          }
        }

        // Update with a small delay to ensure state has settled
        setTimeout(() => {
          setChatHistory((prev) => {
            // Check if the message still exists in the chat history
            const messageExists = prev.some(msg => msg.id === aiMsgId);
            if (!messageExists) {
              return prev;
            }

            return prev.map((msg) =>
              msg.id === aiMsgId
                ? { ...msg, message: fullText, fullText, isLoading: false, stream: false }
                : msg
            );
          });
          setIsStreaming(false);
          setIsStreamingComplete(true);
        }, 100);
      } catch (error) {
        const plainText = sampleMarkdown;

        // Use timeout to ensure consistent behavior
        setTimeout(() => {
          setChatHistory((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId
                ? { ...msg, message: plainText, fullText: sampleMarkdown, isLoading: false, stream: false }
                : msg
            )
          );
          setIsStreaming(false);
          setIsStreamingComplete(true);
        }, 100);
      }
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
        <div className="flex flex-col overflow-auto h-[90dvh] w-full max-w-screen-md mx-auto bg-[#212121]a">
          {!conversationOpen && (
            <div className="text-center mt-28">
              <h2 className="text-3xl sm:text-5xl font-semibold bg-gradient-to-r from-blue-500 to-red-400 bg-clip-text text-transparent">
                {welcomeMessage}
              </h2>
              <SuggestionChips
                onSelectSuggestion={(suggestion) => {
                  setInputValue(suggestion);
                }}
              />
            </div>
          )}

          {conversationOpen && (
            <div className="flex-1 overflow-auto">
              <div ref={containerRef} className="flex flex-col space-y-4 px-4 pt-4">
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

          <div className="sticky bottom-0 z-10 bg-[#212121] w-full px-4 pb-4">
            <ChatInput 
            onSubmit={handleUserSubmit} 
            conversationOpen={conversationOpen} 
            inputValue={inputValue}
            setInputValue={setInputValue}
            />
          </div>
        </div>

        <FeedbackDialog />
      </FeedbackProvider>
    </StreamingContext.Provider>
  );
}