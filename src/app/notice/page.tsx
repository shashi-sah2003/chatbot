"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
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

export default function notices() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | false>(false);
  const [readStatus, setReadStatus] = useState<Record<number, boolean>>({});
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const initialStatus = notifications.reduce((acc, _, index) => {
      acc[index] = false;
      return acc;
    }, {} as Record<number, boolean>);
    setReadStatus(initialStatus);
  }, [notifications]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.get(
          `http://35.238.33.197:5000/chat/information`
        );
        if (response.data.response && Array.isArray(response.data.response)) {
          setNotifications(response.data.response);
          setError("");
        } else {
          setNotifications([]);
          setError("Error fetching notifications: invalid response data.");
        }
      } catch (err) {
        setNotifications([]);
        setError("Error fetching notifications. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };

    fetchNotifications();
  }, []);

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "notices":
        return "#4dabf5";
      case "news":
        return "#66bb6a";
      case "events":
        return "#ba68c8";
      case "forthcoming_events":
        return "#ffa260";
      default:
        return "#4dabf5";
    }
  };

  const getRadioColor = (value: string) => {
    switch (value) {
      case "notices":
        return "#4dabf5";
      case "news":
        return "#66bb6a";
      case "events":
        return "#ba68c8";
      case "forthcoming_events":
        return "#ffa260";
      default:
        return "#3a3a3a";
    }
  };

  const filteredNotifications = notifications
    .map((notification, index) => ({ notification, index }))
    .filter(
      ({ notification }) => filter === "All" || notification.category === filter
    );

  if (loading) {
    return <Loader />; // Show the loader while loading
  }

  return (
    <div className="flex flex-col h-screen w-full max-w-screen-md mx-auto bg-[#212121] overflow-y-auto p-4 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <Typography
          variant="h6"
          sx={{ color: "#f5f5f5", marginBottom: { xs: 1, sm: 0 } }}
        >
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
              value="notices"
              control={
                <Radio
                  sx={{
                    color: getRadioColor("notices"),
                    "&.Mui-checked": {
                      color: getRadioColor("notices"),
                    },
                  }}
                />
              }
              label="notices"
              sx={{ color: "#f5f5f5" }}
            />
            <FormControlLabel
              value="news"
              control={
                <Radio
                  sx={{
                    color: getRadioColor("news"),
                    "&.Mui-checked": {
                      color: getRadioColor("news"),
                    },
                  }}
                />
              }
              label="news"
              sx={{ color: "#f5f5f5" }}
            />
            <FormControlLabel
              value="events"
              control={
                <Radio
                  sx={{
                    color: getRadioColor("events"),
                    "&.Mui-checked": {
                      color: getRadioColor("events"),
                    },
                  }}
                />
              }
              label="events"
              sx={{ color: "#f5f5f5" }}
            />
             <FormControlLabel
              value="forthcoming_events"
              control={
                <Radio
                  sx={{
                    color: getRadioColor("forthcoming_events"),
                    "&.Mui-checked": {
                      color: getRadioColor("forthcoming_events"),
                    },
                  }}
                />
              }
              label="forthcoming_events"
              sx={{ color: "#f5f5f5" }}
            />
          </RadioGroup>
        </FormControl>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center h-40 text-red-500">
          <Typography variant="body1">{error}</Typography>
        </div>
      ) : filteredNotifications.length > 0 ? (
        filteredNotifications.map(({ notification, index }) => {
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
                        color: notification.category
                          ? getTypeColor(notification.category)
                          : "#03a9f4",
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
                  {notification.content}
                </Typography>
                <Link
                  href={notification.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  View Details
                </Link>
              </AccordionDetails>
            </StyledAccordion>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
          <Typography variant="body1">No notifications</Typography>
        </div>
      )}
    </div>
  );
}
