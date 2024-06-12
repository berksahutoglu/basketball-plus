import { Box, Button, Stack, TextField } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import RightBar from "../components/RightBar";
import { AuthContext } from "../context/authContext";

const Settings = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSaveChanges = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8800/api/users/update/${currentUser.id}`,
        {
          email,
          password,
          newPassword,
          newPasswordRepeat,
        },
        { withCredentials: true } // Token'ın cookies'ten gönderilmesi için
      );
      alert(res.data);

      setPassword("");
      setNewPassword("");
      setNewPasswordRepeat("");
    } catch (err) {
      console.error(err);
      alert("An error occurred while updating credentials.");
    }
  };

  return (
    <Box
      bgcolor={"background.default"}
      color={"text.primary"}
      style={{ height: "100vh" }}
      mt={7}
    >
      <NavBar />
      <Stack direction="row" justifyContent="space-between">
        <SideBar />
        <Box
          sx={{
            height: "100%",
            minHeight: 809,
            width: 800,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            bgcolor: "#f0fbfc",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
            mt={10}
          >
            <TextField
              name="email"
              id="email"
              label="Email"
              InputLabelProps={{
                sx: {
                  color: "black",
                  "&.Mui-focused": { color: "black" },
                },
              }}
              variant="outlined"
              sx={{
                width: "60%",
                backgroundColor: "white",
                borderRadius: 3,
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              name="password"
              type="password"
              id="password"
              label="Mevcut Şifre"
              InputLabelProps={{
                sx: {
                  color: "black",
                  "&.Mui-focused": { color: "black" },
                },
              }}
              variant="outlined"
              sx={{
                width: "60%",
                backgroundColor: "white",
                borderRadius: 3,
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              name="newPassword"
              type="password"
              id="newPassword"
              label="Yeni Şifre"
              InputLabelProps={{
                sx: {
                  color: "black",
                  "&.Mui-focused": { color: "black" },
                },
              }}
              variant="outlined"
              sx={{
                width: "60%",
                backgroundColor: "white",
                borderRadius: 3,
              }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              name="newPasswordRepeat"
              type="password"
              id="newPasswordRepeat"
              label="Yeni Şifre Tekrar"
              InputLabelProps={{
                sx: {
                  color: "black",
                  "&.Mui-focused": { color: "black" },
                },
              }}
              variant="outlined"
              sx={{
                width: "60%",
                backgroundColor: "white",
                borderRadius: 3,
              }}
              value={newPasswordRepeat}
              onChange={(e) => setNewPasswordRepeat(e.target.value)}
            />
          </Box>
          <Button
            variant="contained"
            color="success"
            sx={{ width: "100%", height: 50, borderRadius: 5 }}
            onClick={handleSaveChanges}
          >
            Değişiklikleri Kaydet
          </Button>
        </Box>
        <RightBar />
      </Stack>
    </Box>
  );
};

export default Settings;
