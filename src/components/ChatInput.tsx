// ChatInput.tsx
"use client";

import { useState, useRef, useEffect, FormEvent, useLayoutEffect } from "react";
import { Button } from "./ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Textarea } from "./ui/textarea";
import { useStreaming } from "./StreamingContext";

interface ChatInputProps {
  onSubmit: (query: string) => Promise<void>;
  conversationOpen?: boolean;
}

const ChatInput = ({ onSubmit, conversationOpen = false }: ChatInputProps) => {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isStreaming, isStreamingComplete, setIsStreaming } = useStreaming();
  const [submitClicked, setSubmitClicked] = useState(false);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const computedStyle = window.getComputedStyle(textareaRef.current);
      const lineHeight = parseInt(computedStyle.lineHeight);
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

  // New useEffect: Set streaming to true as soon as the submit button is pressed
  useEffect(() => {
    if (submitClicked) {
      setIsStreaming(true);
    }
  }, [submitClicked, setIsStreaming]);

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt) return;
    if (isStreaming || !isStreamingComplete) {
      toast.error("Please wait for the current response to finish!");
      return;
    }
    setSubmitClicked(true);
    try {
      await onSubmit(prompt);
    } catch (err) {
      toast.error("Error while sending query!");
    }
    setPrompt("");
    setSubmitClicked(false); // Reset the submit flag after the query is handled
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
            disabled={isStreaming || !isStreamingComplete}
            className="w-full bg-transparent rounded-2xl text-white placeholder:text-zinc-400 resize-none border-2 border-zinc-600 outline-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 pb-12 shadow-lg"
            style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            rows={2}
            autoFocus
          />

          <div className="absolute inset-y-0 right-3.5 flex items-center">
            <Button
              type="submit"
              disabled={!prompt || isStreaming || !isStreamingComplete}
              className="rounded-full px-2 border dark:border-zinc-600 bg-white text-black hover:bg-gray-100 transition-transform duration-150"
            >
              {isStreaming || !isStreamingComplete ? (
                <Loader2 size={8} className="animate-spin" />
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
