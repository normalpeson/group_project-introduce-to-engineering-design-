import { useState, useEffect } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  MenuItem,
  Autocomplete,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import "./CreatePage.css";

function CreatePage() {

  const navigate = useNavigate();

  // =========================
  // 로그인 보호
  // =========================
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }

  }, [navigate]);

  // =========================
  // state
  // =========================
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [storage, setStorage] = useState("");
  const [description, setDescription] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {

  const token = localStorage.getItem("token");

  const defaultImage = "/waiting.png";

  try {

    await fetch("http://127.0.0.1:5000/posts", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({

        title,
        location,
        date,

        category:
          category === "기타"
            ? customCategory
            : category,

        storage,
        description,

        // 🔥 핵심 부분
        image: image || defaultImage,
      }),
    });

    navigate("/board");

  } catch (error) {

    console.log(error);
  }
};


  return (
    <Box className="create-wrapper">

      {/* ================= NAVBAR ================= */}
      <AppBar position="static" className="create-navbar">
        <Toolbar className="create-navbar-toolbar">

          <img
            src="/kw_logo.png"
            className="navbar-logo"
            alt="logo"
          />

        </Toolbar>
      </AppBar>

      {/* ================= HEADER ================= */}
      <Box className="create-header">

        <Typography variant="h4" className="create-title">
          유실물 등록
        </Typography>

        <Typography className="create-subtitle">
          유실물 정보를 입력해주세요
        </Typography>

      </Box>

      {/* ================= FORM ================= */}
      <Container maxWidth="md" className="create-container">

        <Paper className="create-paper" elevation={3}>

          <Button
            variant="contained"
            component="label"
            className="upload-button"
          >

            이미지 업로드

            <input
              type="file"
              accept="image/*"
              hidden

              onChange={(e) => {

                const file = e.target.files[0];

                if (!file) return;

                setImage(
                  URL.createObjectURL(file)
                );
              }}
            />

          </Button>

          {/* 제목 */}
          <TextField
            fullWidth
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* 습득 장소 */}
          <TextField
             fullWidth
              select
              label="습득 장소"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
          >
            <MenuItem value="화도관">화도관</MenuItem>
            <MenuItem value="비마관">비마관</MenuItem>
            <MenuItem value="새빛관">새빛관</MenuItem>
            <MenuItem value="참빛관">참빛관</MenuItem>
            <MenuItem value="복지관">복지관</MenuItem>
            <MenuItem value="한울관">한울관</MenuItem>
            <MenuItem value="연구관">연구관</MenuItem>
            <MenuItem value="문화관">문화관</MenuItem>
            <MenuItem value="누리관">누리관</MenuItem>
            <MenuItem value="비마관">80주년 기념관</MenuItem>
            <MenuItem value="옥의관">옥의관</MenuItem>
          </TextField>

          {/* 습득 일자 */}
          <TextField
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* 물품 분류 */}
          <TextField
            fullWidth
            select
            label="물품 분류"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="노트북">노트북</MenuItem>
            <MenuItem value="태블릿">태블릿</MenuItem>
            <MenuItem value="휴대폰">휴대폰</MenuItem>
            <MenuItem value="학생증">학생증</MenuItem>
            <MenuItem value="지갑">지갑</MenuItem>
            <MenuItem value="가방">가방</MenuItem>
            <MenuItem value="기타">기타</MenuItem>
          </TextField>
        
          {category === "기타" && (

            <TextField
              fullWidth
              label="직접 입력"
              value={customCategory}
              onChange={(e) =>
                setCustomCategory(e.target.value)
              }
            />

          )}

          <Autocomplete

            options={[
              "화도관 경비실",
              "비마관 경비실",
              "새빛관 경비실",
              "참빛관 경비실",
              "복지관 경비실",
              "한울관 경비실",
              "연구관 경비실",
              "문화관 경비실",
              "누리관 경비실",
              "80주년 기념관 경비실",
              "옥의관 경비실",
            ]}

            value={storage}

            onChange={(event, newValue) =>
              setStorage(newValue)
            }

            ListboxProps={{
              style: {
                maxHeight: 250,
              },
            }}

            

            renderInput={(params) => (

              <TextField
                {...params}
                label="보관 장소"
                fullWidth
              />

            )}
          />

          {/* 상세 정보 */}
          <TextField
            fullWidth
            multiline
            rows={5}
            label="상세 정보"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* 버튼 */}
          <Button
            fullWidth
            variant="contained"
            className="submit-button"
            onClick={handleSubmit}
          >
            게시물 등록
          </Button>

        </Paper>

      </Container>

    </Box>
  );
}

export default CreatePage;