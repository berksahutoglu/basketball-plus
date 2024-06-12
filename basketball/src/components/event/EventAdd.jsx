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
import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

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

const Add = () => {
  const { currentUser } = useContext(AuthContext);
  const [desc, setDesc] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newEvent) => makeRequest.post("/events", newEvent),

    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        desc: desc,
        place: place,
        user_id: currentUser.id,
        date: date.toISOString().split("T")[0],
        time: time.toISOString().split("T")[1].split(".")[0],
      };
      console.log(time);
      await mutation.mutate(eventData); // Mutasyonu gerçekleştir
      handleClose();

      // State'leri sıfırla
      setDesc("");
      setPlace("");
      setDate(null);
      setTime(null);
    } catch (error) {
      console.error("Mutasyon hatası:", error);
      // Hata durumunda kullanıcıya uygun bir geri bildirim göster
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip
        onClick={() => setOpen(true)}
        title="New Event"
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
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: 600,
            maxHeight: 700,
            bgcolor: "background.default",
            color: "text.primary",
            p: 3,
            borderRadius: 5,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: 20,
              alignSelf: "flex-end",
              cursor: "pointer",
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </Box>
          <Typography variant="h6" color="gray" textAlign="center">
            Etkinlik Oluştur
          </Typography>
          <Stack
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            className="inputs"
          >
            <TextField
              name="name"
              id="outlined-basic"
              label="Yer"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              sx={{ width: "100%" }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Tarih"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                sx={{ width: "100%" }}
              />
              <TimePicker
                label="Saat"
                value={time}
                onChange={(newValue) => setTime(newValue)}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>
          </Stack>
          <Box className="bottom">
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
              placeholder="Bize etkinliğinden bahset"
              variant="standard"
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </Box>
          <ButtonGroup
            variant="contained"
            aria-label="Basic button group"
            fullWidth
          >
            <Button onClick={handleClick}>Oluştur</Button>
          </ButtonGroup>
        </Box>
      </StyledModal>
    </>
  );
};

export default Add;
