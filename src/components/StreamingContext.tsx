// StreamingContext.tsx
"use client";

import { createContext, useContext } from "react";

export interface StreamingContextValue {
  isStreaming: boolean;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  isStreamingComplete: boolean;
  setIsStreamingComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StreamingContext = createContext<StreamingContextValue>({
  isStreaming: false,
  setIsStreaming: () => {},
  isStreamingComplete: true,
  setIsStreamingComplete: () => {},
});

export const useStreaming = () => useContext(StreamingContext);
