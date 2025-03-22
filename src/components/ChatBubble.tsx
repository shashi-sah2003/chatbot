"use client";
import React, { useState, useContext, useEffect } from "react";
import { Bot } from "lucide-react";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import { FeedbackContext } from "./FeedbackContext";
import { motion, AnimatePresence } from "framer-motion";
import AILoading from "./AILoading";
import { useStreaming } from "./StreamingContext";
import MarkdownRenderer from './react-renderer';

interface ChatBubbleProps {
  sender: "user" | "ai";
  message: React.ReactNode;
  fullText?: React.ReactNode;
  isLoading?: boolean;
  stream?: boolean;
  associatedUserQuery?: string;
  showFeedbackIcons?: boolean;
}

const ChatBubble = ({
  sender,
  message,
  fullText,
  isLoading = false,
  stream = false,
  associatedUserQuery,
  showFeedbackIcons = false,
}: ChatBubbleProps) => {
  const isUser = sender === "user";
  const {isStreamingComplete } =useStreaming();
  const { openFeedback } = useContext(FeedbackContext);
  const [feedback, setFeedback] = useState<"none" | "like" | "dislike">("none");
  const [feedbackDisabled, setFeedbackDisabled] = useState(false);

  const handleLikeClick = () => {
    if (feedbackDisabled) return;
    setFeedback("like");
    setFeedbackDisabled(true);
    openFeedback(
      associatedUserQuery || "",
      typeof message === "string" ? message : "",
      "like"
    );
  };

  const handleDislikeClick = () => {
    if (feedbackDisabled) return;
    setFeedback("dislike");
    setFeedbackDisabled(true);
    openFeedback(
      associatedUserQuery || "",
      typeof message === "string" ? message : "",
      "dislike"
    );
  };


  
  const isFullHTML =
    typeof fullText === "string" &&
    (fullText.trim().startsWith("<!DOCTYPE") ||
      fullText.trim().startsWith("<html"));

  // Ensure displayText is a string for plain text streaming
  const displayText =
    typeof fullText === "string"
      ? fullText
      : typeof message === "string" || typeof message === "number"
      ? String(message)
      : "";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="chat-bubble bg-[#2f2f2f] text-white text-sm p-2 rounded-xl max-w-[80%]">
          {message}
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-start w-full"
      >
        <div className="flex items-start w-full">
          <div className="flex items-center justify-center w-8 h-8 text-white">
            <Bot size={18} />
          </div>
          <div className="ml-2 flex-1">
            <div className="chat-bubble bg-[#212121] w-full">
              {!isFullHTML && displayText && (
               <MarkdownRenderer content={displayText} speed={3}/>
              )}
              {isLoading && <AILoading />}
            </div>
          </div>
        </div>
        {showFeedbackIcons && isStreamingComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-1 mx-10"
          >
            <button
              onClick={handleLikeClick}
              disabled={feedbackDisabled}
              className={`focus:outline-none ${
                feedbackDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              {feedback === "like" ? (
                <AiFillLike size={14} className="text-white" />
              ) : (
                <AiOutlineLike size={14} className="text-white opacity-70" />
              )}
            </button>
            <button
              onClick={handleDislikeClick}
              disabled={feedbackDisabled}
              className={`focus:outline-none ${
                feedbackDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              {feedback === "dislike" ? (
                <AiFillDislike size={14} className="text-white" />
              ) : (
                <AiOutlineDislike size={14} className="text-white opacity-70" />
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatBubble;
