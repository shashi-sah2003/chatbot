"use client";
import React, { createContext, useState, useCallback } from "react";

export const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [feedbackData, setFeedbackData] = useState({
    isOpen: false,
    userQuery: "",
    aiResponse: "",
    sentiment: "like", // default sentiment (can be "like" or "dislike")
  });

  const openFeedback = useCallback((userQuery, aiResponse, sentiment) => {
    setFeedbackData({
      isOpen: true,
      userQuery,
      aiResponse,
      sentiment,
    });
  }, []);

  const closeFeedback = useCallback(() => {
    setFeedbackData((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <FeedbackContext.Provider value={{ feedbackData, openFeedback, closeFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};
