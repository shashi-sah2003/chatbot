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
  const [submitting, setSubmitting] = useState(false);

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
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setShowModal(false);
      reset();
      setShowSuggestions(false);
      // Removed re-enable of body scrolling on modal close
    }
  }, [isModalOpen, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setSubmitting(true);
    
    try {
      // Append additional field before sending
      data.randomData = "randomString";

      // Create FormData object for file upload
      const formData = new FormData();
      
      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'pdfFile') {
          if (value[0]) {
            formData.append(key, value[0]);
          }
        } else {
          formData.append(key, value as string);
        }
      });

      // Replace YOUR_BACKEND_ENDPOINT_HERE with your actual API endpoint.
      const response = await axios.post("YOUR_BACKEND_ENDPOINT_HERE", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      
      // Show success notification or handle success case
      alert("Question paper uploaded successfully!");
    } catch (error) {
      // Show error notification
      alert("Failed to upload question paper. Please try again.");
    } finally {
      setSubmitting(false);
      setIsModalOpen(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);
  
  const monthOptions = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const examTypeOptions = ["Mid Semester", "End Semester", "Suppliment", "Quiz"];

  return (
    <>
      <div className="mt-6 text-center">
        <button
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-md shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center mx-auto group"
          onClick={() => setIsModalOpen(true)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 group-hover:translate-y-[-2px] transition-transform duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          Upload Question Paper
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4 md:p-0"
            onClick={() => !submitting && setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              // Added mx-4 for extra horizontal margin on smaller screens
              className="bg-[#2f2f2f] rounded-lg p-5 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Upload Question Paper
                </h2>
                <button 
                  onClick={() => !submitting && setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  disabled={submitting}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Subject Field with Filterable Dropdown */}
                <div className="relative" ref={subjectWrapperRef}>
                  <label className="block text-sm font-medium text-white mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Type to search..."
                    className="w-full border rounded p-2 text-white bg-[#2f2f2f] border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                    {...register("subject", { required: "Subject is required" })}
                    onFocus={() => setShowSuggestions(true)}
                    disabled={submitting}
                  />
                  {showSuggestions && subjectQuery && (
                    <div className="absolute z-50 mt-1 w-full bg-[#2f2f2f] border border-gray-600 rounded max-h-40 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                      {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subject, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setValue("subject", subject);
                              setShowSuggestions(false);
                            }}
                            className="cursor-pointer px-3 py-2 hover:bg-gray-700 text-white text-sm transition-colors"
                          >
                            {subject}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-white text-sm">
                          No subjects found
                        </div>
                      )}
                    </div>
                  )}
                  {errors.subject && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.subject.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Branch
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science and Engineering"
                    className="w-full border rounded p-2 text-white bg-[#2f2f2f] border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                    {...register("course", { required: "Branch is required" })}
                    disabled={submitting}
                  />
                  {errors.course && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.course.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS101"
                    className="w-full border rounded p-2 text-white bg-[#2f2f2f] border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                    {...register("courseCode", { required: "Course Code is required" })}
                    disabled={submitting}
                  />
                  {errors.courseCode && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.courseCode.message}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Month
                    </label>
                    <select
                      defaultValue=""
                      className="w-full border rounded p-2 text-white bg-[#2f2f2f] border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                      {...register("month", { required: "Month is required" })}
                      disabled={submitting}
                    >
                      <option value="" disabled>Select month</option>
                      {monthOptions.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    {errors.month && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {errors.month.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Year
                    </label>
                    <select
                      defaultValue=""
                      className="w-full border rounded p-2 text-white bg-[#2f2f2f] border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                      {...register("year", { required: "Year is required" })}
                      disabled={submitting}
                    >
                      <option value="" disabled>Select year</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    {errors.year && (
                      <span className="text-red-500 text-xs mt-1 block">
                        {errors.year.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Exam Type
                  </label>
                  <select
                    defaultValue=""
                    className="w-full border rounded p-2 text-white bg-[#2f2f2f] border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                    {...register("examType", { required: "Exam Type is required" })}
                    disabled={submitting}
                  >
                    <option value="" disabled>Select exam type</option>
                    {examTypeOptions.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.examType && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.examType.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    PDF Upload
                  </label>
                  <div className="border border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-500 transition-colors">
                    <input
                      type="file"
                      accept="application/pdf"
                      id="pdfFile"
                      className="hidden"
                      {...register("pdfFile", { required: "PDF file is required" })}
                      disabled={submitting}
                    />
                    <label htmlFor="pdfFile" className="cursor-pointer flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm text-gray-300">
                        Click to select PDF file
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        {watch("pdfFile")?.[0]?.name || "PDF files only"}
                      </span>
                    </label>
                  </div>
                  {errors.pdfFile && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.pdfFile.message}
                    </span>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => !submitting && setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-70 flex items-center justify-center"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      "Submit"
                    )}
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
