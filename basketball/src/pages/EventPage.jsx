import { Box, Stack } from "@mui/material";
import React from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import RightBar from "../components/RightBar";
import EventFeed from "../components/event/EventFeed";
import EventAdd from "../components/event/EventAdd";

const EventPage = () => {
  return (
    <>
      <Box
        bgcolor={"background.default"}
        color={"text.primary"}
        style={{ height: "100vh" }}
        marginTop={7}
      >
        <NavBar />
        <Stack direction="row" justifyContent="space-between ">
          <SideBar />
          <EventFeed />
          <Outlet />
          <RightBar />
        </Stack>
        <EventAdd />
      </Box>
    </>
  );
};

export default EventPage;
