"use client";

import { useState, useRef, FormEvent, useLayoutEffect } from "react";
import { Button } from "./ui/button";
import { ArrowUp, Loader2 } from "lucide-react"; // Import Loader2 for the spinner icon
import toast from "react-hot-toast";
import { Textarea } from "./ui/textarea";

interface ChatInputProps {
  onSubmit: (query: string) => Promise<void>; // Expect onSubmit to return a Promise
  onNewSession?: () => void; // No longer used here
  conversationOpen?: boolean;
}

const ChatInput = ({ onSubmit, conversationOpen = false }: ChatInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt) return;
    if (loading) {
      toast.error("Please wait for the model to finish its response!");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(prompt);
    } catch (err) {
      toast.error("Error while sending query!");
    }
    setPrompt("");
    setLoading(false);
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
            placeholder="Ask about DTU..."
            disabled={loading}
            className="w-full bg-transparent rounded-2xl text-white placeholder:text-zinc-400 resize-none border-zinc-600 outline-none focus:outline-none focus:ring-0 pb-12 focus:border-white border"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            rows={2}
            autoFocus
          />
          <div className="absolute bottom-1 right-3.5 flex items-center size-8">
            <Button
              type="submit"
              disabled={!prompt || loading}
              className="rounded-full px-2 border dark:border-zinc-600 bg-white text-black hover:bg-gray-100 transition-transform duration-150"
            >
              {loading ? (
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
