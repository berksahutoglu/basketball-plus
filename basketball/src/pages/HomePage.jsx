import { Box, Stack, ThemeProvider, createTheme } from "@mui/material";
import NavBar from "../components/NavBar";
import RightBar from "../components/RightBar";
import SideBar from "../components/SideBar";
import Feed from "../components/Feed";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Add from "../components/Add";

const HomePage = () => {
  const [mode, setMode] = useState("light");

  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Box
          bgcolor={"background.default"}
          color={"text.primary"}
          style={{ height: "100vh" }}
          marginTop={7}
        >
          <NavBar />
          <Stack direction="row" justifyContent="space-between ">
            <SideBar setMode={setMode} mode={mode} />
            <Feed />
            <Outlet />
            <RightBar />
          </Stack>
          <Add />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default HomePage;
