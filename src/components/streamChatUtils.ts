// // streamChatUtils.ts
// "use client";

// /**
//  * Streams the fullText by invoking onUpdate with an increasing slice of the text.
//  * @param fullText - The complete string to stream.
//  * @param onUpdate - Callback to update the displayed text.
//  * @param speed - Interval (in milliseconds) between each character update.
//  * @returns The interval ID.
//  */
// export const streamChat = (
//   fullText: string,
//   onUpdate: (partialText: string) => void,
//   speed: number = 50
// ): NodeJS.Timeout => {
//   let index = 0;
//   const intervalId = setInterval(() => {
//     index++;
//     onUpdate(fullText.slice(0, index));
//     if (index >= fullText.length) {
//       clearInterval(intervalId);
//     }
//   }, speed);
//   return intervalId;
// };




"use client";

/**
 * Streams the fullText by invoking onUpdate with an increasing slice of the text.
 * @param fullText - The complete string to stream.
 * @param onUpdate - Callback to update the displayed text.
 * @param speed - Interval (in milliseconds) between each character update.
 * @param onComplete - Optional callback to invoke when streaming is complete.
 * @returns The interval ID.
 */
export const streamChat = (
  fullText: string,
  onUpdate: (partialText: string) => void,
  speed: number = 30,
  onComplete?: () => void
): NodeJS.Timeout => {
  let index = 0;
  const intervalId = setInterval(() => {
    index++;
    onUpdate(fullText.slice(0, index));
    if (index >= fullText.length) {
      clearInterval(intervalId);
      if (onComplete) onComplete();
    }
  }, speed);
  return intervalId;
};
