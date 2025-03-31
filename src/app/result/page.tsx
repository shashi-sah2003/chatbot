"use client";

import { useState, SyntheticEvent, ReactNode } from "react";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";

// Styled components
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: "#2d2d2d",
  color: "#f5f5f5",
  marginBottom: "16px",
  borderRadius: "10px",
  border: "1px solid #424242",
  transition: "all 0.3s ease",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: "#333333",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
  },
  "&:before": {
    display: "none",
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: "8px 16px",
  "& .MuiAccordionSummary-content": {
    margin: "12px 0",
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: "8px 16px 16px 16px",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  backgroundColor: "rgba(0, 0, 0, 0.1)",
}));

const StyledLink = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "10px 16px",
  marginTop: "12px",
  backgroundColor: "#444444",
  color: "#ffffff",
  borderRadius: "6px",
  fontWeight: "600",
  textDecoration: "none",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#666666",
    transform: "translateX(4px)",
  },
}));

// Type definition for result items
interface ResultItem {
  id: number;
  label: string;
  description: string;
  path: string;
}

// Data for each result item with enhanced descriptions
const resultItems: ResultItem[] = [
  {
    id: 1,
    label: "Result-26",
    description: "View detailed examination results for students in batch 2K26.",
    path: "/result_26",
  },
  {
    id: 2,
    label: "Result-27",
    description: "Access comprehensive result data for batch 2K27.",
    path: "/result_27",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function Result(): ReactNode {
  // State to track the expanded accordion
  const [expanded, setExpanded] = useState<string | false>(false);

  // Handle accordion change
  const handleChange = (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="min-h-screen w-full max-w-screen-sm px-5 mx-auto bg-[#212121] py-10">
      <div className="flex flex-col overflow-auto justify-center w-full">
        {/* Gradient title */}
        <h2 className="text-3xl sm:text-5xl font-semibold bg-gradient-to-r from-blue-500 to-red-400 bg-clip-text text-transparent text-center mb-8">
          Examination Results
        </h2>
        
        <motion.div 
          className="w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {resultItems.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <StyledAccordion 
                expanded={expanded === `panel${item.id}`} 
                onChange={handleChange(`panel${item.id}`)}
              >
                <StyledAccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#f5f5f5" }} />}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {item.description}
                  </Typography>
                  <StyledLink href={item.path}>
                    <span>View {item.label}</span>
                    <ArrowForwardIcon sx={{ ml: 1, fontSize: 18 }} />
                  </StyledLink>
                </StyledAccordionDetails>
              </StyledAccordion>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
