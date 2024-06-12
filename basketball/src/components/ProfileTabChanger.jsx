import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { Button, Modal, Rating, Stack, Tabs, Typography } from "@mui/material";
import Posts from "./posts/Post.jsx";
import { useLocation } from "react-router-dom";

import Events from "./event/Events.jsx";

const ProfileTabChanger = () => {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [value, setValue] = React.useState("1");
  const [pas, setPas] = React.useState(0);
  const [shoot, setShoot] = React.useState(0);
  const [def, setDef] = React.useState(0);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user_id = parseInt(useLocation().pathname.split("/")[2]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label="secondary tabs example"
          >
            <Tab value="1" label="Posts" />
            <Tab value="2" label="Events" />
            <Tab value="3" label="Rating" />
          </Tabs>
        </Box>
        <Stack alignItems={"center"}>
          <TabPanel value="1" sx={{ maxWidth: "70%" }}>
            <Stack spacing={2}>
              <Posts user_id={user_id} />
            </Stack>
          </TabPanel>
          <TabPanel value="2">
            <Events user_id={user_id} />
          </TabPanel>

          <TabPanel value="3">
            <Box
              sx={{
                "& > legend": { mt: 2 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography component="legend">Passing</Typography>
              <Rating size="large" name="read-only" value={pas} readOnly />
              <Typography component="legend">Shooting</Typography>
              <Rating size="large" name="read-only" value={shoot} readOnly />
              <Typography component="legend">Defence</Typography>
              <Rating size="large" name="read-only" value={def} readOnly />

              <Box name={"Rating"}>
                <Button variant="contained" onClick={handleOpen}>
                  Rate!
                </Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box
                    sx={style}
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                  >
                    <Typography component="legend">Passing</Typography>
                    <Rating
                      name="simple-controlled"
                      value={pas}
                      onChange={(event, newValue) => {
                        setPas(newValue);
                      }}
                    />
                    <Typography component="legend">Shooting</Typography>
                    <Rating
                      name="simple-controlled"
                      value={shoot}
                      onChange={(event, newValue) => {
                        setShoot(newValue);
                      }}
                    />
                    <Typography component="legend">Defence</Typography>
                    <Rating
                      name="simple-controlled"
                      value={def}
                      onChange={(event, newValue) => {
                        setDef(newValue);
                      }}
                    />
                  </Box>
                </Modal>
              </Box>
            </Box>
          </TabPanel>
        </Stack>
      </TabContext>
    </Box>
  );
};

export default ProfileTabChanger;
