"use client";
import { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  subject: string;
  course: string;
  courseCode: string;
  month: string;
  year: string;
  examType: string;
  pdfFile: FileList;
  // Additional field appended before sending to backend
  randomData?: string;
}

export default function UploadQuestionPaper() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // List of all subjects
  const subjects = [
    "Basic Econometrics",
    "Engineering Economics",
    "Fundamentals Of Management",
    "Advanced Computer Organization And Architecture",
    "Advanced Database Management System",
    "Advanced Spoken Skills",
    "Air Pollution And Control",
    "Algorithm Analysis And Design",
    "Algorithm Design And Analysis Incomplete",
    "Artificial Intelligence",
    "Big Data Analytics",
    "Cloud Computing",
    "Compiler Design",
    "Computer Communication And Electronics Switching",
    "Computer Graphics",
    "Computer Networks",
    "Computer Organization And Architecture",
    "Computer Vision",
    "Control Engineering",
    "Creative Writing Skills",
    "Cyber Forensics",
    "Data Warehousing And Data Mining",
    "Database Management System",
    "Deep Learning",
    "Digital Electronics",
    "Digital Image Processing",
    "Digital Signal Processing",
    "Discrete Mathematics And Design Of Algorihms",
    "Distributed Computing Systems",
    "Empirical Software Engineering",
    "Entrepreneurship Development",
    "Ethical Hacking",
    "Fault Tolerant Systems",
    "Financial And Cost Management",
    "Fundamentals Of Information Technology",
    "High Speed Networks",
    "Indian Economy",
    "Infomation Security",
    "Information Network Security",
    "Information Theory Coding",
    "Intellectual Property Rights And Cyber Law",
    "Intrusion Detection And Information Warfare",
    "Java Programming",
    "Language And Social Media",
    "Machine Learning",
    "Macroeconomics",
    "Malware Analysis",
    "Mathematical Economics",
    "Microeconomics",
    "Microprocessors And Interfacing Old",
    "Microprocessors And Its Applications",
    "Microwave And Satellite Communication",
    "Mobile Communation",
    "Mobile Computing",
    "Money Banking And Finance",
    "Multimedia Technology And Application",
    "Natural Language Processing",
    "Neural Network",
    "Nomadic Computing",
    "Object Oriented Software Engineering",
    "Operating System Design",
    "Operating Systems",
    "Parallel Algorithm",
    "Parallel Computer Architecture",
    "Pattern Recognition",
    "Probability And Statistics",
    "Real Time Systems",
    "Reinforcement Learning",
    "Rf Engineering",
    "Rhetoric And Public Speaking",
    "Soft Computing",
    "Software Engineering",
    "Software Project Management",
    "Software Quality And Metrics",
    "Software Quality And Testing",
    "Software Testing",
    "Swarm And Evolutionary Computing",
    "Theory Of Computation",
    "Water Engineering",
    "Web Technology",
    "Wireless Mobile Computing"
  ];

  // useForm hook with our typed form data.
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormData>();

  // Watch the subject field for filtering suggestions
  const subjectQuery = watch("subject", "");

  // Filter subjects based on subjectQuery (case insensitive)
  const filteredSubjects = subjects.filter((subject) =>
    subject.toLowerCase().includes(subjectQuery.toLowerCase())
  );

  // Ref for handling outside clicks for the subject suggestions
  const subjectWrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        subjectWrapperRef.current &&
        !subjectWrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Modal animation effects
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => setShowModal(true), 10);
    } else {
      setShowModal(false);
      reset();
      setShowSuggestions(false);
    }
  }, [isModalOpen, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Append additional field before sending
    data.randomData = "randomString";
    console.log(data);

    try {
      // Replace YOUR_BACKEND_ENDPOINT_HERE with your actual API endpoint.
      const response = await axios.post("YOUR_BACKEND_ENDPOINT_HERE", data);
      console.log("Response from backend:", response.data);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="mt-4 text-center">
        <button
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Click me to upload question paper
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#2f2f2f] rounded-lg p-6 max-w-md w-full relative"
            >
              <h2 className="text-xl font-semibold mb-4 text-white">
                Upload Question Paper
              </h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Subject Field with Filterable Dropdown */}
                <div className="mb-2 relative" ref={subjectWrapperRef}>
                  <label className="block text-sm font-medium text-white">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Type to search..."
                    className="w-full border rounded p-1 text-white bg-[#2f2f2f] border-gray-600"
                    {...register("subject", { required: true })}
                    onFocus={() => setShowSuggestions(true)}
                  />
                  {showSuggestions && subjectQuery && (
                    <div className="absolute z-50 mt-1 w-full bg-[#2f2f2f] border border-gray-600 rounded max-h-60 overflow-auto">
                      {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subject, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setValue("subject", subject);
                              setShowSuggestions(false);
                            }}
                            className="cursor-pointer px-2 py-1 hover:bg-gray-700 text-white"
                          >
                            {subject}
                          </div>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-white">
                          No subjects found
                        </div>
                      )}
                    </div>
                  )}
                  {errors.subject && (
                    <span className="text-red-500 text-xs">
                      Subject is required.
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-white">
                    Course
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded p-1 text-white bg-[#2f2f2f] border-gray-600"
                    {...register("course", { required: true })}
                  />
                  {errors.course && (
                    <span className="text-red-500 text-xs">
                      Course is required.
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-white">
                    Course Code
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded p-1 text-white bg-[#2f2f2f] border-gray-600"
                    {...register("courseCode", { required: true })}
                  />
                  {errors.courseCode && (
                    <span className="text-red-500 text-xs">
                      Course Code is required.
                    </span>
                  )}
                </div>

                <div className="mb-2 flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-white">
                      Month
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded p-1 text-white bg-[#2f2f2f] border-gray-600"
                      {...register("month", { required: true })}
                    />
                    {errors.month && (
                      <span className="text-red-500 text-xs">
                        Month is required.
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-white">
                      Year
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded p-1 text-white bg-[#2f2f2f] border-gray-600"
                      {...register("year", { required: true })}
                    />
                    {errors.year && (
                      <span className="text-red-500 text-xs">
                        Year is required.
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-white">
                    Exam Type
                  </label>
                  <input
                    type="text"
                    placeholder="Mid/End sem"
                    className="w-full border rounded p-1 text-white bg-[#2f2f2f] border-gray-600"
                    {...register("examType", { required: true })}
                  />
                  {errors.examType && (
                    <span className="text-red-500 text-xs">
                      Exam Type is required.
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-white">
                    PDF Upload
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="w-full text-white bg-[#2f2f2f] border border-gray-600 rounded p-1"
                    {...register("pdfFile", { required: true })}
                  />
                  {errors.pdfFile && (
                    <span className="text-red-500 text-xs">
                      PDF file is required.
                    </span>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1 border rounded text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
