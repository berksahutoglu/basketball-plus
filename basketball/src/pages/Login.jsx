import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import baskett from "../photos/baskett.jpg"; // Basketx dosyasını içeri aktarıyoruz
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
const LoginScreen = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data) {
        setErr(err.response.data);
      } else {
        setErr("Wrong username or password!");
      }
      console.log(err);
    }
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
              name="username"
              onChange={handleChange}
              id="outlined-basic"
              label="username"
              InputLabelProps={{
                sx: {
                  color: "black",
                  "&.Mui-focused": { color: "black" }, // Change label color when focused
                },
              }}
              variant="outlined"
              sx={{
                width: "100%",
                backgroundColor: "rgba(230, 240, 250, 0.8)",
              }}
            />
            <TextField
              name="password"
              onChange={handleChange}
              type="password"
              id="password"
              label="Şifre"
              InputLabelProps={{
                sx: {
                  color: "black",
                  "&.Mui-focused": { color: "black" }, // Change label color when focused
                },
              }}
              variant="outlined"
              sx={{
                width: "100%",
                backgroundColor: "rgba(230, 240, 250, 0.8)",
              }}
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
              onClick={handleLogin}
              variant="contained"
              sx={{ width: "100%" }}
            >
              Giriş Yap
            </Button>
            {err && <p>{err}</p>}

            <Typography variant="body1" color={"white"}>
              YA DA
            </Typography>
          </Box>

          <Button
            variant="text"
            sx={{ color: "white" }}
            onClick={() => navigate("/signup")}
          >
            Hesabın yok mu? Kaydol
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default LoginScreen;
