"use client";
import React, { useState, useMemo, useCallback } from "react";
import Loader from "@/components/Loader";
import { AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Link,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  InputAdornment,
  TextField,
} from "@mui/material";
import useSWR from "swr";
import { styled, alpha } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CircleIcon from "@mui/icons-material/Circle";
import { Box } from "@mui/material";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from "@/utils/axiosConfig";

// Enhanced styled components
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: alpha("#2d2d2d", 0.8),
  color: "#f5f5f5",
  marginBottom: "12px",
  borderRadius: "10px !important",
  border: "1px solid #424242",
  transition: "all 0.2s ease",
  overflow: "hidden",
  "&:before": {
    display: "none", // Remove the default MUI divider
  },
  "&:hover": {
    backgroundColor: "#333333",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
  },
  "&.Mui-expanded": {
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
  },
}));

const NotificationDot = styled(CircleIcon)({
  fontSize: 12,
  marginRight: 8,
});

const SearchField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: alpha("#1a1a1a", 0.7),
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "#424242",
    },
    "&:hover fieldset": {
      borderColor: "#666",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#03a9f4",
    },
  },
  "& .MuiInputBase-input": {
    color: "#f5f5f5",
    padding: "12px 14px",
  },
  "& .MuiInputAdornment-root": {
    color: "#999",
  },
});

const FilterRadioGroup = styled(RadioGroup)({
  flexWrap: "wrap",
  "& .MuiFormControlLabel-root": {
    marginRight: 4,
  },
  "& .MuiFormControlLabel-label": {
    fontSize: "0.85rem",
  },
});

const EmptyStateContainer = styled(Paper)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "200px",
  backgroundColor: alpha("#1a1a1a", 0.5),
  borderRadius: "10px",
  border: "1px dashed #424242",
});

interface Notification {
  title: string;
  content: string;
  timestamp: string;
  category: string;
  url: string;
}

// A simple debounce hook to delay search input updates
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Fetcher function for SWR
const fetchNotifications = async () => {
  const response = await api.get("/api/chat/information", {
    headers: {
      "x-vercel-secret": process.env.NEXT_PUBLIC_VERCEL_SECRET,
    }
  });

  if (response.data.response && Array.isArray(response.data.response)) {
    return response.data.response;
  } else {
    throw new Error("Invalid data format received from server");
  }
};

export default function Notices() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Debounced search term to reduce filtering frequency
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // SWR hook to fetch notifications
  const { data: notifications = [], error, isLoading } = useSWR<Notification[]>(
    '/api/chat/information',
    fetchNotifications,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      dedupingInterval: 180000, // 3 minutes expiry
    }
  );

  const handleChange = useCallback(
    (panelIndex: number) =>
      (event: React.SyntheticEvent, isExpanded: boolean) => {
        const panelId = `panel${panelIndex}`;
        setExpanded(isExpanded ? panelId : false);
      },
    []
  );

  const getCategoryColor = useCallback((type: string) => {
    switch (type) {
      case "notices":
        return "#4dabf5";
      case "news":
        return "#66bb6a";
      case "forthcoming_events":
        return "#ffa260";
      default:
        return "#4dabf5";
    }
  }, []);

  const getCategoryLabel = useCallback((type: string) => {
    switch (type) {
      case "notices":
        return "Notice";
      case "news":
        return "News";
      case "forthcoming_events":
        return "Event";
      default:
        return "Other";
    }
  }, []);

  // Memoize filtering to only recalculate when notifications, filter, or debouncedSearchTerm change
  const filteredNotifications = useMemo(() => {
    return notifications
      .map((notification, index) => ({ notification, index }))
      .filter(
        ({ notification }) =>
          (filter === "All" || notification.category === filter) &&
          notification.title
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      );
  }, [notifications, filter, debouncedSearchTerm]);

  return (
    <div className="flex flex-col h-[89vh] w-full max-w-screen-md pb-4 mx-auto bg-[#212121] px-4">
      <div className="bg-[#212121] pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl sm:text-4xl font-semibold bg-gradient-to-r from-blue-500 to-red-400 bg-clip-text text-transparent text-center mb-2">
            Notifications
          </h2>
        </div>

        <SearchField
          fullWidth
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          className="mb-3"
        />

        <FormControl component="fieldset" fullWidth className="mb-2">
          <FilterRadioGroup
            row
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="gap-2 mt-2"
          >
            <FormControlLabel
              value="All"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#999",
                    "&.Mui-checked": {
                      color: "#03a9f4",
                    },
                  }}
                />
              }
              label="All"
              sx={{ color: "#f5f5f5" }}
            />
            <FormControlLabel
              value="notices"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#999",
                    "&.Mui-checked": {
                      color: "#4dabf5",
                    },
                  }}
                />
              }
              label="Notices"
              sx={{ color: "#f5f5f5" }}
            />
            <FormControlLabel
              value="news"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#999",
                    "&.Mui-checked": {
                      color: "#66bb6a",
                    },
                  }}
                />
              }
              label="News"
              sx={{ color: "#f5f5f5" }}
            />
            <FormControlLabel
              value="forthcoming_events"
              control={
                <Radio
                  size="small"
                  sx={{
                    color: "#999",
                    "&.Mui-checked": {
                      color: "#ffa260",
                    },
                  }}
                />
              }
              label="Events"
              sx={{ color: "#f5f5f5" }}
            />
          </FilterRadioGroup>
        </FormControl>
      </div>

      {error ? (
        <EmptyStateContainer elevation={0}>
          <ErrorOutlineIcon sx={{ color: "#f44336", fontSize: 40, mb: 2 }} />
          <Typography variant="body1" sx={{ color: "#f44336" }}>
            {error.message || "Failed to load notifications. Please try again."}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#999", mt: 1, textAlign: "center", px: 3 }}
          >
            There was a problem fetching your notifications.
            <br />
            Please try again later.
          </Typography>
        </EmptyStateContainer>
      ) : isLoading ? (
        <div className="items-center justify-center">
          {/* Loader Overlay */}
          <AnimatePresence>
            {isLoading && <Loader />}
          </AnimatePresence>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="overflow-y-auto" style={{ flex: 1 }}>
          {filteredNotifications.map(({ notification, index }) => {
            const panelId = `panel${index}`;
            const categoryColor = getCategoryColor(notification.category);
            const categoryLabel = getCategoryLabel(notification.category);
            return (
              <StyledAccordion
                key={panelId}
                expanded={expanded === panelId}
                onChange={handleChange(index)}
                sx={{
                  borderLeft: `4px solid ${categoryColor}`,
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        color: "#f5f5f5",
                        transition: "transform 0.3s",
                        transform:
                          expanded === panelId ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  }
                  aria-controls={`${panelId}-content`}
                  id={`${panelId}-header`}
                  sx={{
                    padding: "8px 16px",
                    minHeight: { xs: "auto", sm: "64px" },
                    "& .MuiAccordionSummary-content": {
                      margin: 0,
                      display: "flex",
                      flexDirection: "column", // stacked layout
                      gap: "4px", // optional: controls space between box and title
                    },
                  }}
                >
                  {/* left chunk */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      minWidth: 0,
                      pr: 2,
                    }}
                  >
                    <NotificationDot sx={{ color: categoryColor }} />
                    <Typography
                      variant="caption"
                      sx={{
                        color: categoryColor,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        ml: 1,
                      }}
                    >
                      {categoryLabel}
                    </Typography>
                  </Box>

                  {/* title */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#f5f5f5",
                      fontWeight: 500,
                      fontSize: { xs: "0.875rem", sm: "0.95rem" },
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                      mt: 0, // removed margin
                    }}
                  >
                    {notification.title}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    padding: "8px 16px 16px 16px",
                    backgroundColor: alpha("#1a1a1a", 0.3),
                  }}
                >
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{
                      marginBottom: 2,
                      lineHeight: 1.6,
                      color: "#e0e0e0",
                      fontSize: { xs: "0.8rem", sm: "0.85rem" },
                    }}
                    className="whitespace-pre-wrap break-words"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {notification.content}
                    </ReactMarkdown>
                  </Typography>
                  <Link
                    href={notification.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      color: categoryColor,
                      fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      fontWeight: 500,
                      transition: "opacity 0.2s",
                      "&:hover": {
                        opacity: 0.8,
                      },
                    }}
                  >
                    View Details
                    <OpenInNewIcon sx={{ fontSize: 16, ml: 0.5 }} />
                  </Link>
                </AccordionDetails>
              </StyledAccordion>
            );
          })}
        </div>
      ) : (
        !isLoading && (
          <EmptyStateContainer elevation={0}>
            <ErrorOutlineIcon sx={{ color: "#666", fontSize: 40, mb: 2 }} />
            <Typography variant="body1" sx={{ color: "#f5f5f5" }}>
              No notifications found
            </Typography>
            <Typography variant="body2" sx={{ color: "#999", mt: 1 }}>
              {searchTerm
                ? "Try changing your search or filters"
                : "You're all caught up!"}
            </Typography>
          </EmptyStateContainer>
        )
      )}
    </div>
  );
}