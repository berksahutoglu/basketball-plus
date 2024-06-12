import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { makeRequest } from "../../axios";
import "./eventComments.scss";
import moment from "moment";
import { useState } from "react";

const EventComments = ({ event_id }) => {
  const [desc, setDesc] = useState("");

  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["eventComments"],
    queryFn: () =>
      makeRequest
        .get("/eventComments?event_id=" + event_id)
        .then((res) => res.data),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/eventComments", newComment),
    onSuccess: () => {
      queryClient.invalidateQueries(["eventComments"]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, event_id });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((eventComment) => (
            <div key={eventComment.id} className="comment">
              <p>{console.log(eventComment)}</p>

              <img src={"/upload/" + eventComment.profilePic} alt="" />
              <div className="info">
                <span>{eventComment.username}</span>
                <p>{eventComment.desc}</p>
              </div>
              <span className="date">
                {moment(eventComment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};
export default EventComments;
