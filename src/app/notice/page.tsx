"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import CircleIcon from "@mui/icons-material/Circle";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: "#2d2d2d",
  color: "#f5f5f5",
  marginBottom: "8px",
  borderRadius: "8px",
  border: "1px solid #424242",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#333333",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
}));

const NotificationDot = styled(CircleIcon)({
  fontSize: 12,
  color: "#03a9f4",
  marginRight: 8,
});

export default function Notice() {
  // Dummy notification data (5 items) using one template without an id.
  const dummyData = Array.from({ length: 5 }, (_, i) => ({
    title: `Notification Title ${i + 1}`,
    summary: `This is the summary for notification ${i + 1}. It contains additional details about the notification.`,
    link: `https://example.com/notification/${i + 1}`,
    timestamp: "10 minutes ago",
    type: ["Notice", "News", "ForthcomingEvent"][i % 3],
  }));

  // State to store notifications. Initially set to dummyData.
  const [notifications, setNotifications] = useState(dummyData);
  // State to control which accordion panel is expanded.
  const [expanded, setExpanded] = useState<string | false>(false);
  // State for tracking read status: mapping from notification index to boolean.
  const [readStatus, setReadStatus] = useState<Record<number, boolean>>({});
  // State for the notification type filter. Default is "All".
  const [filter, setFilter] = useState("All");

  // Initialize readStatus when notifications change.
  useEffect(() => {
    const initialStatus = notifications.reduce((acc, _, index) => {
      acc[index] = false;
      return acc;
    }, {} as Record<number, boolean>);
    setReadStatus(initialStatus);
  }, [notifications]);

  // Fetch notifications from the backend, fallback to dummyData on error.
  useEffect(() => {
    const fetchNotifications = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      try {
        const response = await axios.get(`${baseUrl}/information`);
        if (response.data && Array.isArray(response.data)) {
          setNotifications(response.data);
        } else {
          setNotifications(dummyData);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications(dummyData);
      }
    };

    fetchNotifications();
  }, []);

  // Handle accordion expansion; use index as unique key.
  const handleChange = (panelIndex: number) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    const panelId = `panel${panelIndex}`;
    setExpanded(isExpanded ? panelId : false);
    if (isExpanded && !readStatus[panelIndex]) {
      setReadStatus((prev) => ({
        ...prev,
        [panelIndex]: true,
      }));
    }
  };
// Return color based on notification type
const getTypeColor = (type: string) => {
  switch (type) {
    case "Notice":
      return "#4dabf5"; 
    case "News":
      return "#66bb6a"; 
    case "ForthcomingEvent":
      return "#ba68c8"; 
    default:
      return "#4dabf5"; 
  }
};

// Return radio button color based on its value
const getRadioColor = (value: string) => {
  switch (value) {
    case "Notice":
      return "#4dabf5";
    case "News":
      return "#66bb6a"; 
    case "ForthcomingEvent":
      return "#ba68c8";
    default:
      return "#3a3a3a";  
  }
};

  // Filter notifications based on the selected type.
  const filteredNotifications = notifications
    .map((notification, index) => ({ notification, index }))
    .filter(({ notification }) => filter === "All" || notification.type === filter);

  return (
    <div className="flex flex-col h-screen w-full max-w-screen-md mx-auto bg-[#212121] overflow-y-auto p-4 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <Typography variant="h6" sx={{ color: "#f5f5f5", marginBottom: { xs: 1, sm: 0 } }}>
          Notifications
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup row value={filter} onChange={(e) => setFilter(e.target.value)}>
            <FormControlLabel
              value="All"
              control={
                <Radio
                  sx={{
                    color: getRadioColor("All"),
                    "&.Mui-checked": {
                      color: getRadioColor("All"),
                    },
                  }}
                />
              }
              label="All"
              sx={{ color: "#f5f5f5" }}
            />
            <FormControlLabel
              value="Notice"
              control={
                <Radio
                  sx={{
                    color: getRadioColor("Notice"),
                    "&.Mui-checked": {
                      color: getRadioColor("Notice"),
                    },
                  }}
                />
              }
              label="Notice"
              sx={{ color: "#f5f5f5" }}
            />
            <FormControlLabel
              value="News"
              control={
                <Radio
                  sx={{
                    color: getRadioColor("News"),
                    "&.Mui-checked": {
                      color: getRadioColor("News"),
                    },
                  }}
                />
              }
              label="News"
              sx={{ color: "#f5f5f5" }}
            />
            <FormControlLabel
              value="ForthcomingEvent"
              control={
                <Radio
                  sx={{
                    color: getRadioColor("ForthcomingEvent"),
                    "&.Mui-checked": {
                      color: getRadioColor("ForthcomingEvent"),
                    },
                  }}
                />
              }
              label="ForthcomingEvent"
              sx={{ color: "#f5f5f5" }}
            />
          </RadioGroup>
        </FormControl>
      </div>

      {filteredNotifications.map(({ notification, index }) => {
        const panelId = `panel${index}`;
        const isRead = readStatus[index];

        return (
          <StyledAccordion
            key={panelId}
            expanded={expanded === panelId}
            onChange={handleChange(index)}
            sx={{ opacity: isRead ? 0.8 : 1 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#f5f5f5" }} />}
              aria-controls={`${panelId}-content`}
              id={`${panelId}-header`}
              sx={{ minHeight: "64px", padding: "0 16px" }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <NotificationDot
                    sx={{
                      color: notification.type ? getTypeColor(notification.type) : "#03a9f4",
                    }}
                  />
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {notification.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#aaa" }}>
                      {notification.timestamp}
                    </Typography>
                  </div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "8px 16px 16px 16px" }}>
              <Typography variant="body2" sx={{ marginBottom: 2, lineHeight: 1.6 }}>
                {notification.summary}
              </Typography>
              <Link href={notification.link} target="_blank" rel="noopener noreferrer" underline="hover">
                View Details
              </Link>
            </AccordionDetails>
          </StyledAccordion>
        );
      })}

      {filteredNotifications.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
          <Typography variant="body1">No notifications</Typography>
        </div>
      )}
    </div>
  );
}
