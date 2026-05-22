import { useState } from "react";

import "./App.css";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import BoardPage from "./CRUD/Board/BoardPage";
import CreatePage from "./CRUD/Create/CreatePage";
import PostDetail from "./CRUD/Post/PostDetailPage";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";

function LoginPage() {

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id,
            password,
          }),
        }
      );

      const data = await response.json();

      // 로그인 성공
      if (data.success) {

        // JWT 저장
        localStorage.setItem("token", data.token);

        setMessage("로그인 성공!");

        // 게시판 이동
        navigate("/board");

      } else {

        setMessage(data.message);

      }

    } catch (error) {

      setMessage("서버 오류");

    }
  };

  return (
    <Box className="background">

      <Container
        maxWidth="xs"
        className="container-wrapper"
      >

        <Paper elevation={3} className="login-card">

          <img
            src="/kw_logo.png"
            alt="KLAS Logo"
            className="logo"
          />

          <Typography
            align="center"
            className="subtitle-main"
          >
            종합정보서비스(KLAS)
          </Typography>

          <Typography
            align="center"
            className="subtitle-sub"
          >
            계정으로 로그인해주세요.
          </Typography>

          <Typography
            variant="h4"
            align="center"
            className="title"
          >
            LOGIN
          </Typography>

          {/* 아이디 */}
          <TextField
            fullWidth
            label="학번"
            margin="normal"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          {/* 비밀번호 */}
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="비밀번호"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">

                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                    >
                      {showPassword
                        ? <VisibilityOff />
                        : <Visibility />}
                    </IconButton>

                  </InputAdornment>
                ),
              },
            }}
          />

          {/* 로그인 버튼 */}
          <Button
            fullWidth
            variant="contained"
            className="login-button"
            onClick={handleLogin}
          >
            로그인
          </Button>

          {/* 메시지 */}
          <Typography
            align="center"
            className="message"
          >
            {message}
          </Typography>

        </Paper>

      </Container>

    </Box>
  );
}

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/board"
          element={<BoardPage />}
        />

        <Route
          path="/create"
          element={<CreatePage />}
        />

        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;