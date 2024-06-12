import Box from "@mui/material/Box";
import Posts from "./posts/Post.jsx";

const Feed = () => {
  return (
    <Box
      flex={4}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      bgcolor={"background.default"}
      color={"text.primary"}
    >
      <Posts />
    </Box>
  );
};

export default Feed;
