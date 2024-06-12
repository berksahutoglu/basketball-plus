import React, { useState, useEffect } from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
} from "@mui/material";
import { makeRequest } from "../axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const ApprovedRequests = ({ eventId, handleGetPerformanceReview }) => {
  const [approvedUsers, setApprovedUsers] = useState([]);

  const { isLoading, data } = useQuery({
    queryKey: ["join_requests"],
    queryFn: () =>
      makeRequest
        .get(`/join-requests/approved/${eventId}`)
        .then((res) => res.data),
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setApprovedUsers(data);
    }
  }, [data]);
  console.log("data: " + data);
  console.log("response: ", data);

  return (
    <>
      {approvedUsers.map((user, index) =>
        isLoading ? (
          "loading"
        ) : (
          <ListItem
            key={index}
            onClick={() => handleGetPerformanceReview(user.id, user.username)}
          >
            <Link
              to={`/profile/${user?.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box sx={{ display: "flex" }}>
                <ListItemAvatar>
                  {" "}
                  <Avatar
                    sx={{ width: 30, height: 30 }}
                    src={"/upload/" + user.profilePic}
                  />
                </ListItemAvatar>
                <ListItemText primary={user.username} />
              </Box>
            </Link>
          </ListItem>
        )
      )}
    </>
  );
};

export default ApprovedRequests;
