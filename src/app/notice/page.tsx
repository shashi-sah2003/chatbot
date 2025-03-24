"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: "#2d2d2d",
  color: "#f5f5f5",
  marginBottom: "8px",
  borderRadius: "8px",
  border: "1px solid #424242",
  transition: "all 0.3s ease",
  '&:hover': {
    backgroundColor: "#333333",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
  },
}));

export default function Notice() {
  // Dummy notification data (10 items)
  const dummyData = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: `Notification Title ${i + 1}`,
    summary: `This is the summary for notification ${i + 1}. It contains additional details about the notification.`,
    link: `https://example.com/notification/${i + 1}`,
    timestamp: "10 minutes ago",
  }));

  // State to store notifications. Initially set to dummyData.
  const [notifications, setNotifications] = useState(dummyData);
  // State to control which accordion panel is expanded.
  const [expanded, setExpanded] = useState<string | false>(false);
  // State for tracking read status: mapping from notification id to boolean.
  const [readStatus, setReadStatus] = useState<Record<number, boolean>>({});

  // Update readStatus state whenever notifications change
  useEffect(() => {
    const initialStatus = notifications.reduce((acc, notification) => {
      acc[notification.id] = false;
      return acc;
    }, {} as Record<number, boolean>);
    setReadStatus(initialStatus);
  }, [notifications]);

  // Fetch notifications from the backend. Fallback to dummyData on error.
  useEffect(() => {
    const fetchNotifications = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      try {
        const response = await axios.get(`${baseUrl}/information`);
        // If the response is an array, use it; otherwise, fallback.
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

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);

    // Extract notification ID from panel ID (assumes panel id is in the format 'panel{id}')
    const notificationId = parseInt(panel.replace('panel', ''));
    // Mark as read when expanded
    if (isExpanded && !readStatus[notificationId]) {
      setReadStatus(prev => ({
        ...prev,
        [notificationId]: true
      }));
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-screen-md mx-auto bg-[#212121] overflow-y-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h6" sx={{ color: "#f5f5f5" }}>
          Notifications
        </Typography>
      </div>
      
      {notifications.map((notification) => {
        const panelId = `panel${notification.id}`;
        const isRead = readStatus[notification.id];
        
        return (
          <StyledAccordion 
            key={panelId} 
            expanded={expanded === panelId} 
            onChange={handleChange(panelId)}
            sx={{
              opacity: isRead ? 0.8 : 1,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#f5f5f5" }} />}
              aria-controls={`${panelId}-content`}
              id={`${panelId}-header`}
              sx={{ 
                minHeight: '64px',
                padding: '0 16px',
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
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
            <AccordionDetails sx={{ padding: '8px 16px 16px 16px' }}>
              <Typography variant="body2" sx={{ marginBottom: 2, lineHeight: 1.6 }}>
                {notification.summary}
              </Typography>
              <Link 
                href={notification.link} 
                target="_blank" 
                rel="noopener noreferrer"
                underline="hover"
              >
                View Details
              </Link>
            </AccordionDetails>
          </StyledAccordion>
        );
      })}
      
      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
          <Typography variant="body1">No notifications</Typography>
        </div>
      )}
    </div>
  );
}
