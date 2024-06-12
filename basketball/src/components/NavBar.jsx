import React, { useState, useContext } from "react";
import {
  Toolbar,
  styled,
  Typography,
  AppBar,
  InputBase,
  Avatar,
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Badge,
} from "@mui/material";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import { useNavigate } from "react-router-dom";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import NotificationComponent from "./NotificationComponent";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { makeRequest } from "../axios";

const StyledToolBar = styled(Toolbar)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: "white",
  padding: "0 10px",
  borderRadius: "10px",
  width: "40%",
  height: "5%",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

const Icons = styled(Box)(({ theme }) => ({
  display: "none",
  gap: 20,
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    display: "flex",
  },
}));

const UserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: 10,
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

const SearchResultItem = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1),
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
}));

const NavBar = () => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0); // Başlangıçta 0 bildirim var
  const { currentUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await makeRequest.post("/auth/logout"); // Assuming an endpoint for logout
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle error, maybe set error message
    }
  };

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/home">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Homepage" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href={`/profile/${currentUser.id}`}>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
        <ListItemButton>
          <ListItemIcon>
            <SportsBasketballIcon />
          </ListItemIcon>
          <ListItemText primary="Events" />
        </ListItemButton>
      </List>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton component="a" href="/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Account Settings" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </ListItem>
    </Box>
  );

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/users/search?query=${query}`
        );
        setSearchResults(res.data);
      } catch (err) {
        console.error("Failed to search users", err);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <AppBar position="fixed">
      <StyledToolBar display="flex">
        <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>
          Basketballife
        </Typography>
        <SportsBasketballIcon sx={{ display: { xs: "block", sm: "none" } }} />
        <Search>
          <InputBase
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchResults.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: "40px", // Burada top değerini artırdık
                backgroundColor: "white",
                width: "100%",
                maxHeight: "200px",
                overflowY: "auto",
                right: "0px",
                zIndex: 10,
                boxShadow: 3,
              }}
            >
              {searchResults.map((user) => (
                <SearchResultItem
                  key={user.id}
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  <Avatar
                    src={`/upload/${user.profilePic}`}
                    sx={{ marginRight: 2 }}
                  />
                  {user.username}
                </SearchResultItem>
              ))}
            </Box>
          )}
        </Search>
        <Icons>
          <NotificationComponent
            notificationCount={notificationCount}
            setNotificationCount={setNotificationCount}
          />
          <Avatar
            sx={{ width: 30, height: 30, cursor: "pointer" }}
            src={"/upload/" + currentUser.profilePic}
            onClick={toggleDrawer(true)}
          />
          <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </Icons>
        <UserBox>
          <Avatar
            sx={{
              width: 30,
              height: 30,
              cursor: "pointer",
              display: { xs: "block", sm: "none" },
            }}
            src={currentUser.profilePic}
            onClick={toggleDrawer(true)}
          />
          <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
          <Typography variant="span"></Typography>
        </UserBox>
      </StyledToolBar>
    </AppBar>
  );
};

export default NavBar;
