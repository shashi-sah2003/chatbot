// "use client";
// import React, { useContext } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { FeedbackContext } from "./FeedbackContext";
// import { Button } from "./ui/button";
// import toast from "react-hot-toast";
// import { motion, AnimatePresence } from "framer-motion";

// const FeedbackDialog = () => {
//   const { feedbackData, closeFeedback } = useContext(FeedbackContext);
//   const { register, handleSubmit, reset } = useForm({
//     defaultValues: {
//       userQuery: feedbackData.userQuery,
//       aiResponse: feedbackData.aiResponse,
//       message: ""
//     }
//   });

//   const onSubmit = async (data) => {
//     try {
//       await axios.post("http://127.0.0.1:8000/feedback", data);
//       toast.success("Feedback submitted");
//       closeFeedback();
//       reset();
//     } catch (error) {
//       toast.error("Failed to submit feedback");
//     }
//   };

//   return (
//     <AnimatePresence>
//       {feedbackData.isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
//         >
//           <motion.div
//             initial={{ y: -50, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -50, opacity: 0 }}
//             className="bg-white rounded-lg p-4 max-w-md w-full max-h-[80vh] overflow-y-auto"
//           >
//             <h2 className="text-lg font-semibold mb-4">Feedback</h2>
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">User Query</label>
//                 <textarea
//                   {...register("userQuery")}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">AI Response</label>
//                 <textarea
//                   {...register("aiResponse")}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Optional Message</label>
//                 <textarea
//                   {...register("message")}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
//                   placeholder="Additional feedback (optional)"
//                 />
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <Button type="button" onClick={closeFeedback}>
//                   Close
//                 </Button>
//                 <Button type="submit">
//                   Submit
//                 </Button>
//               </div>
//             </form>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default FeedbackDialog;


"use client";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FeedbackContext } from "./FeedbackContext";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader";
import PageTransition from "@/components/PageTransition";

const FeedbackDialog = () => {
  const { feedbackData, closeFeedback } = useContext(FeedbackContext);
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      userQuery: "",
      aiResponse: "",
      message: ""
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (feedbackData.isOpen) {
      setValue("userQuery", feedbackData.userQuery);
      setValue("aiResponse", feedbackData.aiResponse);
      setValue("message", "");
    }
  }, [feedbackData, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await axios.post("http://127.0.0.1:8000/feedback", data);
      if (feedbackData.sentiment === "like") {
        toast.success("Feedback submitted with a like");
      } else if (feedbackData.sentiment === "dislike") {
        toast.success("Feedback submitted with a dislike");
      }
      closeFeedback();
      reset();
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <AnimatePresence>
        {feedbackData.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-[#2f2f2f] rounded-lg p-4 max-w-md w-full max-h-[80vh] overflow-y-auto relative"
            >
              <h2 className="text-lg font-semibold mb-4 text-white">Feedback</h2>

              {/* Sentiment Section */}
              <div
                className={`mb-4 p-2 rounded ${
                  feedbackData.sentiment === "like" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <p className="text-white font-semibold">
                  Sentiment: {feedbackData.sentiment === "like" ? "Positive" : "Negative"}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">User Query</label>
                  <textarea
                    {...register("userQuery")}
                    disabled
                    className="mt-1 block w-full rounded-md bg-[#2f2f2f] border border-gray-500 text-white p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">AI Response</label>
                  <textarea
                    {...register("aiResponse")}
                    disabled
                    className="mt-1 block w-full rounded-md bg-[#2f2f2f] border border-gray-500 text-white p-2 overflow-y-auto max-h-40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    {feedbackData.sentiment === "like" ? "Feedback" : "Complaint"}
                  </label>
                  <textarea
                    {...register("message", { required: true })}
                    className="mt-1 block w-full rounded-md bg-[#2f2f2f] border border-gray-500 text-white p-2"
                    placeholder={feedbackData.sentiment === "like" ? "feedback" : "complaint"}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" onClick={closeFeedback}>
                    Close
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    Submit
                  </Button>
                </div>
              </form>
              {isSubmitting && <Loader />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default FeedbackDialog;
