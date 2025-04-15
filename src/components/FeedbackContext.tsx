"use client";
import React, { createContext, ReactNode, useState, useCallback } from "react";

// Define the shape of the feedback data
export interface FeedbackData {
  isOpen: boolean;
  userQuery: string;
  aiResponse: string;
  sentiment: "like" | "dislike";
}

// Define the context type with the data and available methods
export interface FeedbackContextType {
  feedbackData: FeedbackData;
  openFeedback: (userQuery: string, aiResponse: string, sentiment: "like" | "dislike") => void;
  closeFeedback: () => void;
}

// Create the FeedbackContext with a default value of undefined. Consumers must ensure it's provided.
export const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

interface FeedbackProviderProps {
  children: ReactNode;
}

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    isOpen: false,
    userQuery: "",
    aiResponse: "",
    sentiment: "like", // default sentiment (can be "like" or "dislike")
  });

  const openFeedback = useCallback(
    (userQuery: string, aiResponse: string, sentiment: "like" | "dislike") => {
      setFeedbackData({
        isOpen: true,
        userQuery,
        aiResponse,
        sentiment,
      });
    },
    []
  );

  const closeFeedback = useCallback(() => {
    setFeedbackData((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <FeedbackContext.Provider value={{ feedbackData, openFeedback, closeFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};
