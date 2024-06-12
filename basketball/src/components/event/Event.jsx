import React, { useState } from "react";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import SettingsIcon from "@mui/icons-material/Settings";
import EventComments from "../comments/EventComments.jsx";
import "./event.scss";
import moment from "moment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js";
import { Modal, Box, List, Typography } from "@mui/material";
import ApprovedRequests from "../ApprovedRequests.jsx";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Event = ({ event }) => {
  const [commentOpen, setCommentOpen] = useState({});
  const [peopleOpen, setPeopleOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [performanceReview, setPerformanceReview] = useState("");
  const queryClient = useQueryClient();

  const handleToggleComments = (eventId) => {
    setCommentOpen((prev) => {
      return { [eventId]: !prev[eventId] };
    });
  };

  const handleTogglePeople = () => {
    setPeopleOpen((prev) => !prev);
  };

  const mutation = useMutation({
    mutationFn: (newRequest) => makeRequest.post("/join-requests", newRequest),
    onSuccess: () => {
      queryClient.invalidateQueries(["join_requests"]);
      setErrorMessage(""); // Clear the error message on success
    },
    onError: (error) => {
      if (
        error.response &&
        error.response.data === "You've already sent a request."
      ) {
        setErrorMessage("You've already sent a request.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    },
  });

  const handleJoinRequest = async () => {
    try {
      await mutation.mutateAsync({
        event_id: event.id,
      });
      console.log("Join request sent successfully.");
    } catch (error) {
      console.error("Error sending join request:", error.message);
    }
  };

  const handleGetPerformanceReview = async (userId, userName) => {
    try {
      const response = await makeRequest.post(
        "/eventComments/getPerformanceReview",
        { user_id: userId, username: userName }
      );
      setPerformanceReview(response.data.review); // Only set the review text
    } catch (error) {
      console.error("Error getting performance review:", error.message);
      setPerformanceReview("An error occurred. Please try again.");
    }
  };

  return (
    <div className="event">
      <div className="card">
        <div className="card-header">
          <img
            className="avatar"
            src={"/upload/" + event.profilePic}
            alt="User Avatar"
          />
          <div className="header-info">
            <span className="title">{event.username}</span>
            <span className="subheader">
              {moment(event.createdAt).fromNow()}
            </span>
          </div>
        </div>
        <div className="card-content">
          <div className="info">
            <span className="place">{event.place}</span>
            <span className="date"> {event.date}</span>
            <span className="hour">{event.time}</span>
          </div>
          <p className="desc">{event.desc}</p>
        </div>
        <div className="card-actions">
          <div className="info">
            <div
              className="item"
              onClick={() => handleToggleComments(event.id)}
            >
              <span className="icon">💬</span>
              <span className="text">Yorumlar</span>
            </div>
            <div className="item" onClick={handleJoinRequest}>
              <span className="icon">👋</span>
              <span className="text">Katıl</span>
            </div>
            <div className="item">
              <span className="icon">↗️</span>
              <span className="text">Paylaş</span>
            </div>
            <div className="item" onClick={handleTogglePeople}>
              <span className="icon">
                <SportsKabaddiIcon />
              </span>
              <span className="text">Katılımcılar</span>
            </div>
          </div>
        </div>
        {commentOpen[event.id] && <EventComments event_id={event.id} />}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>

      {/* People Modal */}
      <Modal
        open={peopleOpen}
        onClose={handleTogglePeople}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Katılımcılar
          </Typography>
          <List sx={{ display: "flex" }}>
            <ApprovedRequests eventId={event.id} />
            <SettingsIcon
              sx={{ mt: 1.4 }}
              onClick={() =>
                handleGetPerformanceReview(event.user_id, event.username)
              }
            />
          </List>
        </Box>
      </Modal>

      {/* Performance Review Modal */}
      <Modal
        open={performanceReview !== ""}
        onClose={() => setPerformanceReview("")}
        aria-labelledby="review-modal-title"
        aria-describedby="review-modal-description"
      >
        <Box sx={style}>
          <Typography id="review-modal-title" variant="h6" component="h2">
            Performance Review
          </Typography>
          <Typography id="review-modal-description">
            {performanceReview}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Event;
