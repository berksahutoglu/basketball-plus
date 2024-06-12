import React from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { Box, Stack } from "@mui/material";
import Profile from "../components/Profile";

const ProfilePage = () => {
  return (
    <Box
      bgcolor={"background.default"}
      color={"text.primary"}
      style={{ height: "100vh" }}
      mt={7}
    >
      <NavBar />

      <Stack direction="row" justifyContent="space-between ">
        <SideBar />
        <Profile />
      </Stack>
    </Box>
  );
};

export default ProfilePage;
