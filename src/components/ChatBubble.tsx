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
import AnimatedText from "@/components/AnimatedText";

interface ChatBubbleProps {
  sender: "user" | "ai";
  message: string;
  fullText?: string;
  isLoading?: boolean;
  stream?: boolean;
  associatedUserQuery?: string;
  showFeedbackIcons?: boolean;
  onStreamComplete?: () => void;
}

const ChatBubble = ({
  sender,
  message,
  fullText,
  isLoading = false,
  stream = false,
  associatedUserQuery,
  showFeedbackIcons = false,
  onStreamComplete,
}: ChatBubbleProps) => {
  const isUser = sender === "user";
  const { openFeedback } = useContext(FeedbackContext);

  const [feedback, setFeedback] = useState<"none" | "like" | "dislike">("none");
  const [feedbackDisabled, setFeedbackDisabled] = useState(false);
  const [displayedText, setDisplayedText] = useState<string>(
    sender === "ai" ? "" : message
  );

  useEffect(() => {
    if (sender === "ai" && stream && fullText) {
      // In a real scenario, update displayedText gradually; here we set fullText immediately.
      setDisplayedText(fullText);
      if (onStreamComplete) onStreamComplete();
    } else {
      setDisplayedText(message);
    }
  }, [sender, stream, fullText, message, onStreamComplete]);

  const handleLikeClick = () => {
    if (feedbackDisabled) return;
    setFeedback("like");
    setFeedbackDisabled(true);
    openFeedback(associatedUserQuery || "", displayedText, "like");
  };

  const handleDislikeClick = () => {
    if (feedbackDisabled) return;
    setFeedback("dislike");
    setFeedbackDisabled(true);
    openFeedback(associatedUserQuery || "", displayedText, "dislike");
  };

  const bubbleClasses = isUser
    ? "chat-bubble bg-[#2f2f2f] text-white text-sm p-2 rounded-xl max-w-[80%]"
    : "chat-bubble bg-[#212121] text-white text-sm p-2 rounded-xl max-w-[80%]";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className={bubbleClasses}>{message}</div>
      </div>
    );
  }

  // Only show feedback icons if not loading and either not streaming or full text is displayed
  const showFeedback =
    showFeedbackIcons && !isLoading && (!stream || displayedText === fullText);

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
          <div className={bubbleClasses}>
            {isLoading && stream && displayedText !== fullText ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                className="flex items-center text-xs text-gray-400 mt-1"
              >
                {"Responding_back_from_server".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  className="inline-block ml-1"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  ...
                </motion.span>
              </motion.div>
            ) : (
              <AnimatedText text={displayedText} />
            )}
          </div>
        </div>
        {showFeedback && (
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
