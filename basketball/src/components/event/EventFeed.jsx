import Box from "@mui/material/Box";
import Events from "./Events.jsx";

const EventFeed = () => {
  return (
    <Box
      flex={4}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      bgcolor={"background.default"}
      color={"text.primary"}
    >
      <Events />
    </Box>
  );
};

export default EventFeed;
