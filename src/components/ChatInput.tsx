"use client";

import { useState, useRef, useEffect, FormEvent, useLayoutEffect } from "react";
import { Button } from "./ui/button";
import { ArrowUp, CircleStop } from "lucide-react";
import toast from "react-hot-toast";
import { Textarea } from "./ui/textarea";
import { useStreaming } from "./StreamingContext";
import { moderateMessage } from "./moderator";

// Define a type for moderated responses
export interface ModeratedResponse {
  simulatedResponse: {
    id: number;
    sender: "user";
    message: string;
  };
  aiResponse: {
    id: number;
    sender: "ai";
    message: string;
    fullText: string;
    isLoading: boolean;
    stream: boolean;
  };
}

interface ChatInputProps {
  onSubmit: (query: string, moderatedResponse?: ModeratedResponse) => Promise<void>;
  conversationOpen?: boolean;
}

const ChatInput = ({ onSubmit, conversationOpen = false }: ChatInputProps) => {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isStreaming, isStreamingComplete, setIsStreaming, setIsStreamingComplete } = useStreaming();
  const [submitClicked, setSubmitClicked] = useState(false);
  const [isInputBlocked, setIsInputBlocked] = useState(false);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const computedStyle = window.getComputedStyle(textareaRef.current);
      // Ensure the lineHeight is parsed as a number (default to 20px if parsing fails)
      const lineHeight = parseInt(computedStyle.lineHeight) || 20;
      const maxRows = 8;
      const queryRows = maxRows - 2; // Reserve 2 rows for buttons
      const maxHeight = lineHeight * queryRows;
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
      textareaRef.current.style.overflowY =
        textareaRef.current.scrollHeight > maxHeight ? "auto" : "hidden";
    }
  };

  useLayoutEffect(() => {
    autoResize();
  }, [prompt]);

  // Effect to reset streaming state when a new session is triggered
  useEffect(() => {
    const handleNewSession = () => {
      setIsStreaming(false);
      setIsStreamingComplete(true);
      setPrompt("");
      setIsInputBlocked(false);
    };
    window.addEventListener("new-session", handleNewSession);
    return () => window.removeEventListener("new-session", handleNewSession);
  }, [setIsStreaming, setIsStreamingComplete]);

  // Set streaming to true as soon as the submit button is pressed
  useEffect(() => {
    if (submitClicked) {
      setIsStreaming(true);
    }
  }, [submitClicked, setIsStreaming]);

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt) return;
    
    // Prevent sending if input is blocked or streaming is in progress
    if (isInputBlocked || isStreaming || !isStreamingComplete) {
      toast.error("Please wait for the current response to finish!");
      return;
    }
    
    // Apply the moderator function
    const moderation = moderateMessage(prompt);
    
    if (moderation.shouldBlock) {
      if (moderation.isToast) {
        toast.error(moderation.response);
        if (prompt.length > 200) {
          setIsInputBlocked(true);
          setTimeout(() => {
            setIsInputBlocked(false);
            toast.success("You can now continue typing");
          }, 3000);
        }
      } else {
        // Simulate responses when moderation blocks the query
        const simulatedResponse = {
          id: Date.now() + Math.random(),
          sender: "user" as const,
          message: prompt
        };
        
        const aiResponse = {
          id: Date.now() + Math.random(),
          sender: "ai" as const,
          message: moderation.response || "",
          fullText: moderation.response || "",
          isLoading: false,
          stream: false
        };
        
        await onSubmit(prompt, { simulatedResponse, aiResponse });
      }
      setPrompt("");
      return;
    }
    
    // If the message passes moderation, proceed normally
    setSubmitClicked(true);
    try {
      await onSubmit(prompt);
    } catch (err) {
      toast.error("Error while sending query!");
    }
    setPrompt("");
    setSubmitClicked(false);
  };

  // Function to handle stopping the streaming response
  const handleStopStreaming = () => {
    setIsStreaming(false);
    setIsStreamingComplete(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 relative">
      <form onSubmit={handleSendMessage} className="w-full">
        <div className="bg-zinc-800 rounded-2xl relative overflow-y-hidden">
          <Textarea
            ref={textareaRef}
            placeholder="Type your queries here..."
            disabled={isStreaming || !isStreamingComplete || isInputBlocked}
            className="w-full bg-transparent rounded-2xl text-white placeholder:text-zinc-400 resize-none border-2 border-zinc-600 outline-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 pb-12 shadow-lg"
            style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
            value={prompt}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= 200) {
                setPrompt(newValue);
                autoResize();
              } else {
                toast.error("Please keep your question under 200 characters");
                setIsInputBlocked(true);
                setTimeout(() => {
                  setIsInputBlocked(false);
                  toast.success("You can now continue typing");
                }, 3000);
              }
            }}
            onKeyDown={handleKeyDown}
            rows={2}
            autoFocus
          />

          <div className="absolute inset-y-0 right-3.5 flex items-center">
            <Button
              type={isStreaming || !isStreamingComplete ? "button" : "submit"}
              onClick={(e) => {
                if (isStreaming || !isStreamingComplete) {
                  e.preventDefault();
                  handleStopStreaming();
                }
              }}
              disabled={!isStreaming && (!prompt || isInputBlocked)}
              className="rounded-full px-2 border dark:border-zinc-600 bg-white text-black hover:bg-gray-100 transition-transform duration-150"
            >
              {isStreaming || !isStreamingComplete ? (
                <CircleStop size={8} />
              ) : (
                <ArrowUp size={8} />
              )}
            </Button>
          </div>
        </div>
      </form>

      {!conversationOpen && (
        <p className="flex justify-center items-center text-center text-slate-300 text-xs mt-2 font-medium tracking-wide">
          DTU-ChatBot can make mistakes. Check important info.
        </p>
      )}
    </div>
  );
};

export default ChatInput;
