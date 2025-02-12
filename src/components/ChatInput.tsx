"use client";
import { FormEvent, useState } from "react";
import { ImArrowUpRight2 } from "react-icons/im";

interface ChatInputProps {
  onSubmit: (query: string) => void;
  conversationOpen?: boolean;
}

const ChatInput = ({ onSubmit, conversationOpen = false }: ChatInputProps) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    onSubmit(prompt);
    setPrompt("");
    setLoading(false);
  };

  // Determine if the input has content
  const isActive = prompt.length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto pt-3">
      <form
        onSubmit={sendMessage}
        className={`bg-white/10 rounded-full flex items-center px-4 py-2.5 w-full transition-shadow duration-300
          ${isActive ? "ring-2 ring-indigo-500" : ""} 
          focus-within:ring-2 focus-within:ring-indigo-500`}
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask about DTU..."
          className="bg-transparent text-primary-foreground font-medium placeholder:text-primary-foreground/50 px-3 outline-none w-full"
          disabled={loading}
        />
        <button
          disabled={!prompt || loading}
          type="submit"
          className="p-2.5 rounded-full text-black flex items-center justify-center transition-transform duration-200 bg-white disabled:bg-white/30"
        >
          <div className="-rotate-45 text-sm text-primary/80">
            <ImArrowUpRight2 />
          </div>
        </button>
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
