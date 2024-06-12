import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const UpdateProfileModal = ({ open, onClose, user, onSave }) => {
  const [profilePic, setProfilePic] = useState(user.profilePic);
  const [coverPic, setCoverPic] = useState(user.coverPic);
  const [username, setUsername] = useState(user.username);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [coverPicFile, setCoverPicFile] = useState(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      setProfilePicFile(file);
    }
  };

  const handleCoverPicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPic(URL.createObjectURL(file));
      setCoverPicFile(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const updatedData = {
      username,
      profilePic: profilePicFile,
      coverPic: coverPicFile,
    };

    await onSave(updatedData);

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Profile</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Box
            width="100%"
            height="150px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              backgroundImage: `url(${
                coverPic ? coverPic : "/upload/" + user.coverPic
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 1,
            }}
          >
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="cover-pic"
              type="file"
              onChange={handleCoverPicChange}
            />
            <label htmlFor="cover-pic">
              <Button
                component="span"
                variant="contained"
                color="primary"
                sx={{ mt: 1, mb: 1 }}
              >
                Change Cover Photo
              </Button>
            </label>
          </Box>
          <Avatar
            alt="Profile Picture"
            src={profilePic ? profilePic : "/upload/" + user.profilePic}
            sx={{ width: 100, height: 100 }}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="profile-pic"
            type="file"
            onChange={handleProfilePicChange}
          />
          <label htmlFor="profile-pic">
            <Button component="span" variant="contained" color="primary">
              Change Profile Photo
            </Button>
          </label>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProfileModal;
