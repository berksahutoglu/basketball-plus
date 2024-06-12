import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import baskett from "../photos/baskett.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);

      navigate("/login");
    } catch (err) {
      setErr(err.response.data);
    }
  };

  console.log(err);

  const inputStyles = {
    inputLabel: {
      color: "black",
      "&.Mui-focused": { color: "black" },
    },
    textField: {
      width: "100%",
      backgroundColor: "rgba(230, 240, 250, 0.8)",
    },
  };
  return (
    <>
      <Box
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden", // Ekran kaymasını engellemek için
        }}
      >
        <img
          src={baskett}
          alt="background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // Resmi "cover" olarak ayarlıyoruz
            position: "absolute",
            filter: "blur(3px)",
          }}
        />
        <Box
          sx={{
            width: "90%",
            maxWidth: 400,
            position: "relative", // İçerik kutusunun pozisyonunu ayarla
            zIndex: 1, // Blur efekti altında kalacak şekilde z-index'i ayarla
            backgroundColor: "rgba(230, 240, 250, 0.12)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "2px solid lightgrey",
            padding: "20px",
            marginTop: "50px",
            gap: 1,
          }}
        >
          <Box
            className="inputs"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
              alignItems: "center",
            }}
          >
            <TextField
              name="name"
              id="outlined-basic"
              label="İsim"
              InputLabelProps={{ sx: inputStyles.inputLabel }}
              sx={inputStyles.textField}
              onChange={handleChange}
            />
            <TextField
              name="username"
              id="outlined-basic"
              label="Kullanıcı Adı"
              InputLabelProps={{ sx: inputStyles.inputLabel }}
              sx={inputStyles.textField}
              onChange={handleChange}
            />
            <TextField
              name="email"
              id="outlined-basic"
              label="E-posta"
              InputLabelProps={{ sx: inputStyles.inputLabel }}
              sx={inputStyles.textField}
              onChange={handleChange}
            />
            <TextField
              name="password"
              type="password"
              id="password"
              label="Şifre"
              variant="outlined"
              InputLabelProps={{ sx: inputStyles.inputLabel }}
              sx={inputStyles.textField}
              onChange={handleChange}
            />
          </Box>
          <Box
            className="loginButtons"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
              marginBottom: 5,
              width: "100%",
            }}
          >
            <Button
              onClick={handleClick}
              variant="contained"
              sx={{ width: "100%" }}
            >
              Kayıt Ol
            </Button>
            {err && err}

            <Typography variant="body1" color={"white"}>
              YA DA
            </Typography>
            <Button
              startIcon={<GoogleIcon />}
              sx={{ width: "100%", color: "white" }}
            >
              Google ile giriş yap
            </Button>
          </Box>

          <Button
            variant="text"
            sx={{ color: "white" }}
            onClick={() => navigate("/login")}
          >
            Zaten hesabın var mı? Giriş yap
          </Button>
        </Box>
      </Box>
    </>
  );
};
export default SignUp;
