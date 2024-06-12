import Event from "./Event";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Events = ({ user_id }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["events"],
    queryFn: () =>
      makeRequest
        .get("/events?user_id=" + (user_id || ""))
        .then((res) => res.data),
  });

  return (
    <div className="event">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((event, index) => <Event event={event} key={index} />)}
    </div>
  );
};

export default Events;
