import React, { useState, useEffect } from "react";
import axios from "axios";
import JoinRequests from "./JoinRequests";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Badge, Button } from "@mui/material";

const NotificationComponent = ({ notificationCount, setNotificationCount }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [joinRequests, setJoinRequests] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/join-requests",
          { withCredentials: true }
        );
        const pendingRequests = response.data.filter(
          (request) => request.status === "pending"
        );
        setJoinRequests(response.data);
        setNotificationCount(pendingRequests.length); // Yalnızca "pending" olanları say
      } catch (error) {
        console.error("Error fetching join requests:", error);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5000); // Her 5 saniyede bir bildirimleri güncelle

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [setNotificationCount]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleResponse = async (response, requestId) => {
    try {
      const requestBody = {
        id: requestId,
        response,
      };
      const res = await axios.post(
        "http://localhost:8800/api/join-requests/respond",
        requestBody,
        {
          withCredentials: true,
        }
      );
      alert(res.data);

      // Update the status property for the request
      setJoinRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, status: response } : request
        )
      );

      // Yalnızca "pending" olanları yeniden say
      const updatedRequests = await axios.get(
        "http://localhost:8800/api/join-requests",
        { withCredentials: true }
      );
      const pendingRequests = updatedRequests.data.filter(
        (request) => request.status === "pending"
      );
      setNotificationCount(pendingRequests.length);
    } catch (err) {
      if (err.response) {
        alert(err.response.data);
      } else {
        alert("An error occurred");
      }
    }
  };

  return (
    <div>
      <div style={{ display: "inline-block", position: "relative" }}>
        <Badge badgeContent={notificationCount} color="error">
          <NotificationsActiveIcon
            sx={{ mt: 0.5 }}
            onClick={handleNotificationClick}
          />
        </Badge>

        {showNotifications && (
          <div
            className="notification-box"
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              width: "400px",
              padding: "10px",
              background: "white",
              color: "black",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxShadow: "0 0 5px rgba(0,0,0,0.3)",
              zIndex: 9999,
            }}
          >
            <h2 style={{ color: "black" }}>Bildirimler</h2>
            <ul>
              {joinRequests.map((request, index) => (
                <JoinRequests
                  key={index}
                  request={request}
                  onResponse={handleResponse}
                />
              ))}
            </ul>
            <Button onClick={() => setShowNotifications(false)}>Kapat</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationComponent;
