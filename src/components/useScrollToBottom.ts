import { useEffect, useRef, RefObject, useCallback } from "react";

export interface UseScrollToBottomOptions {
  behavior?: ScrollBehavior; // "smooth" or "auto"
  observerOptions?: MutationObserverInit;
  debounce?: number; // debounce delay in milliseconds
}

export function useScrollToBottom<T extends HTMLElement>(
  options: UseScrollToBottomOptions = {}
): [
  RefObject<T | null>,
  RefObject<T | null>,
  () => void
] {
  const {
    behavior = "smooth",
    observerOptions = {
      childList: true,
      subtree: true,
      // You can enable these if you need to observe more mutations:
      attributes: false,
      characterData: false,
    },
    debounce = 100,
  } = options;

  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);
  const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);

  const scrollToBottom = useCallback(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior, block: "end" });
    }
  }, [behavior]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current as number);
      }
      timeoutRef.current = setTimeout(() => {
        scrollToBottom();
      }, debounce);
    });

    observer.observe(container, observerOptions);

    // Initial scroll in case content is already loaded.
    scrollToBottom();

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current as number);
      }
    };
  }, [observerOptions, scrollToBottom, debounce]);

  return [containerRef, endRef, scrollToBottom];
}
