import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import MailIcon from "@mui/icons-material/Mail";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ProfileTabChanger from "./ProfileTabChanger";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/authContext";
import UpdateProfileModal from "./UpdateProfileModal";

const Profile = ({ username }) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const user_id = parseInt(useLocation().pathname.split("/")[2]);

  const { currentUser } = useContext(AuthContext);

  const { isLoading, data } = useQuery({
    queryKey: ["user", user_id],
    queryFn: () =>
      makeRequest.get("/users/find/" + user_id).then((res) => res.data),
  });

  const { isLoading: rIsLoading, data: relationshipData } = useQuery({
    queryKey: ["relationship", user_id],
    queryFn: () =>
      makeRequest
        .get("/relationships?followed_user_id=" + user_id)
        .then((res) => res.data),
  });

  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: (following) => {
      if (following) {
        return makeRequest.delete("/relationships?user_id=" + user_id);
      }
      return makeRequest.post("/relationships", { user_id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["relationship", user_id]);
    },
  });

  const handleFollow = () => {
    followMutation.mutate(relationshipData.includes(currentUser.id));
  };

  const updateMutation = useMutation({
    mutationFn: (updatedData) => {
      return makeRequest.put("/users/" + user_id, updatedData, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", user_id]);
      setOpenUpdate(false);
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
  });

  const handleSave = async (updatedData) => {
    let coverUrl;
    let profileUrl;

    if (updatedData.coverPic) {
      const coverFormData = new FormData();
      coverFormData.append("file", updatedData.coverPic);
      const coverRes = await makeRequest.post("/upload", coverFormData);
      coverUrl = coverRes.data;
    } else {
      coverUrl = data.coverPic;
    }

    if (updatedData.profilePic) {
      const profileFormData = new FormData();
      profileFormData.append("file", updatedData.profilePic);
      const profileRes = await makeRequest.post("/upload", profileFormData);
      profileUrl = profileRes.data;
    } else {
      profileUrl = data.profilePic;
    }

    updateMutation.mutate({
      ...updatedData,
      coverPic: coverUrl,
      profilePic: profileUrl,
    });
  };

  return (
    <Box flex={5} height={"100vh"}>
      {isLoading ? (
        "loading"
      ) : (
        <>
          <Box
            name={"upperProfile"}
            height={"25vh"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"flex-end"}
            sx={{
              backgroundImage: `url(${"/upload/" + data?.coverPic})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <Box
              display={"flex"}
              gap={2}
              position={"relative"}
              marginLeft={6}
              bottom={15}
            >
              <Avatar
                alt="Remy Sharp"
                src={"/upload/" + data?.profilePic}
                sx={{ width: 150, height: 150, borderRadius: 4 }}
                variant="square"
              />
              <Stack color={"white"}>
                <Typography variant="h5">{data?.username}</Typography>
                <Typography variant="h7">{data?.city}</Typography>
              </Stack>
            </Box>

            <Stack>
              <Box name={"buttons"} display={{ xs: "none", sm: "flex" }}>
                {rIsLoading ? (
                  "loading"
                ) : user_id === currentUser.id ? (
                  <Button
                    onClick={() => setOpenUpdate(true)}
                    variant="contained"
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    startIcon={<PersonAddIcon />}
                    variant="contained"
                    sx={{ color: "white" }}
                    onClick={handleFollow}
                  >
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </Button>
                )}
              </Box>

              <Box name={"buttons-xs"} display={{ xs: "flex", sm: "none" }}>
                <Button variant="outlined">
                  <PersonAddIcon />
                </Button>
                <Button variant="outlined">
                  <MailIcon />
                </Button>
              </Box>
            </Stack>
          </Box>
          <Box name={"bottomProfile"} flexGrow={1} minHeight={"75vh"}>
            <Box display={"flex"} alignItems={"center"}>
              <ProfileTabChanger />
            </Box>
          </Box>
        </>
      )}
      {openUpdate && (
        <UpdateProfileModal
          open={openUpdate}
          onClose={() => setOpenUpdate(false)}
          user={data}
          onSave={handleSave}
        />
      )}
    </Box>
  );
};

export default Profile;
