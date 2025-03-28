"use client";
import { useState, FormEvent, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface UploadQuestionPaperProps {}

export default function UploadQuestionPaper({}: UploadQuestionPaperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // State for subject search/filter
  const [subjectQuery, setSubjectQuery] = useState("");
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

  // Filter subjects based on subjectQuery (case insensitive)
  const filteredSubjects = subjects.filter((subject) =>
    subject.toLowerCase().includes(subjectQuery.toLowerCase())
  );

  // Ref for handling outside clicks
  const subjectWrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestion list if clicked outside
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

  // When isModalOpen becomes true, delay showing the modal content
  useEffect(() => {
    if (isModalOpen) {
      // Delay to allow transition classes to animate
      setTimeout(() => setShowModal(true), 10);
    } else {
      setShowModal(false);
      // Reset subject field when modal closes (optional)
      setSubjectQuery("");
      setShowSuggestions(false);
    }
  }, [isModalOpen]);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Create an object from the form data entries.
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Append a random string field. Replace this later as needed.
    data.randomData = "randomString";
    console.log(data);

    try {
      // Replace YOUR_BACKEND_ENDPOINT_HERE with your API endpoint.
      const response = await axios.post("YOUR_BACKEND_ENDPOINT_HERE", data);
      console.log("Response from backend:", response.data);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    } finally {
      // Close modal after submission
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
          click me to upload question paper
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
              onClick={(e) => e.stopPropagation()} // Prevent closing modal on inner click
              className="bg-[#2f2f2f] rounded-lg p-6 max-w-md w-full relative"
            >
              <h2 className="text-xl font-semibold mb-4 text-white">
                Upload Question Paper
              </h2>
              <form onSubmit={handleFormSubmit}>
                {/* Subject Field with Filterable Dropdown */}
                <div className="mb-2 relative" ref={subjectWrapperRef}>
                  <label className="block text-sm font-medium text-white">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={subjectQuery}
                    onChange={(e) => {
                      setSubjectQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full border rounded p-1 text-white bg-[#2f2f2f] border-gray-600"
                    placeholder="Type to search..."
                    required
                    autoComplete="off"
                  />
                  {showSuggestions && subjectQuery && (
                    <div className="absolute z-50 mt-1 w-full bg-[#2f2f2f] border border-gray-600 rounded max-h-60 overflow-auto">
                      {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subject, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSubjectQuery(subject);
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
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-white">
                    Course
                  </label>
                  <input
                    type="text"
                    name="course"
                    className="w-full border rounded p-1 text-white bg-[#2f2f2f] border-gray-600"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-white">
                    Course Code
                  </label>
                  <input
                    type="text"
                    name="courseCode"
                    className="w-full border rounded p-1 text-white bg-[#2f2f2f] border-gray-600"
                    required
                  />
                </div>
                <div className="mb-2 flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-white">
                      Month
                    </label>
                    <input
                      type="text"
                      name="month"
                      className="w-full border rounded p-1 text-white bg-[#2f2f2f] border-gray-600"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-white">
                      Year
                    </label>
                    <input
                      type="text"
                      name="year"
                      className="w-full border rounded p-1 text-white bg-[#2f2f2f] border-gray-600"
                      required
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-white">
                    Exam Type
                  </label>
                  <input
                    type="text"
                    placeholder="Mid/End sem"
                    name="examType"
                    className="w-full border rounded p-1 text-white bg-[#2f2f2f] border-gray-600"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white">
                    PDF Upload
                  </label>
                  <input
                    type="file"
                    name="pdfFile"
                    accept="application/pdf"
                    className="w-full text-white bg-[#2f2f2f] border border-gray-600 rounded p-1"
                    required
                  />
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
