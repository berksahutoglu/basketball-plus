import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Fab,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const UserBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Add = () => {
  const { currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log("Uploading file:", file); // Debug: log file info
      const res = await makeRequest.post("/upload", formData);
      console.log("Upload response:", res.data); // Debug: log response data
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const mutation = useMutation({
    mutationFn: (newPost) => makeRequest.post("/posts", newPost),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    console.log("Image URL:", imgUrl); // Debug: log image URL
    mutation.mutate({ desc, img: imgUrl });
    handleClose();
    setDesc("");
    setFile(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip
        onClick={() => setOpen(true)}
        title="New Post"
        sx={{
          position: "fixed",
          bottom: 20,
          left: { xs: "calc(50% - 25px)", md: 30 },
        }}
      >
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Tooltip>
      <StyledModal
        open={open}
        onClose={(e) => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: "100%",
            typography: "body1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              width: 194,
            }}
          ></Box>
          <Box
            width={400}
            maxHeight={500}
            bgcolor={"background.default"}
            color={"text.primary"}
            p={3}
            borderRadius={5}
          >
            <Box width={20} onClick={handleClose}>
              <CloseIcon />
            </Box>
            <Typography variant="h6" color={"gray"} textAlign={"center"}>
              Create Post
            </Typography>
            <UserBox>
              <Avatar
                sx={{ width: 30, height: 30 }}
                src={"/upload/" + currentUser.profilePic}
              />
              <Typography fontWeight={500} variant="span">
                {currentUser.name}
              </Typography>
            </UserBox>
            <TextField
              sx={{ width: "100%" }}
              id="standard-multiline-static"
              multiline
              rows={3}
              placeholder="What's on your mind?"
              variant="standard"
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
            <div className="img">
              {file && (
                <img
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                  }}
                  className="file"
                  alt=""
                  src={URL.createObjectURL(file)}
                />
              )}
            </div>
            <Stack direction="row" gap={1} mt={2} mb={3}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<ImageIcon />}
              >
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                Select Image
              </Button>
            </Stack>
            <ButtonGroup
              variant="contained"
              aria-label="Basic button group"
              fullWidth
            >
              <Button onClick={handleClick}>Post</Button>
            </ButtonGroup>
          </Box>
        </Box>
      </StyledModal>
    </>
  );
};

export default Add;
