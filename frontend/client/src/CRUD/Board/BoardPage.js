import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./BoardPage.css";

function BoardPage() {

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  // =========================
  // 로그인 보호
  // =========================
  useEffect(() => {

    const verifyUser = async () => {

      const token = localStorage.getItem("token");

      if (!token) {

        navigate("/");
        return;
      }

      try {

        const response = await fetch(
          "http://127.0.0.1:5000/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {

          localStorage.removeItem("token");
          navigate("/");
        }

      } catch (error) {

        localStorage.removeItem("token");
        navigate("/");
      }
    };

    verifyUser();

  }, [navigate]);

  // =========================
  // 게시물 가져오기
  // =========================
  useEffect(() => {

    const fetchPosts = async () => {

      const token = localStorage.getItem("token");

      if (!token) return;

      try {

        const response = await fetch(
          "http://127.0.0.1:5000/posts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setPosts(data);

      } catch (error) {

        console.log(error);
      }
    };

    fetchPosts();

  }, []);

  // =========================
  // 로그아웃
  // =========================
  const handleLogout = async () => {

    const token = localStorage.getItem("token");

    try {

      if (token) {

        await fetch(
          "http://127.0.0.1:5000/logout",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

    } catch (error) {

      console.log(error);
    }

    // 프론트 토큰 삭제
    localStorage.removeItem("token");

    // 로그인 페이지 이동
    navigate("/");
  };

  return (
    <>
      {/* =========================
          NAVBAR (CSS 그대로 유지)
      ========================= */}
      <AppBar position="static" className="navbar">
        <Toolbar className="navbar-toolbar">

          <img
            src="/kw_logo.png"
            className="navbar-logo"
            alt="logo"
          />

          <Box className="nav-buttons">

            <Button
              className="nav-button"
              onClick={() => navigate("/search")}
            >
              검색
            </Button>
            
            
            <Button
              className="nav-button"
              onClick={() => navigate("/create")}
            >
              게시물 등록
            </Button>

            <Button
              className="nav-button"
              onClick={handleLogout}
            >
              로그아웃
            </Button>

          </Box>

        </Toolbar>
      </AppBar>

      {/* =========================
          HEADER
      ========================= */}
      <Box className="board-header">

        <Typography
          variant="h3"
          className="board-title"
        >
          유실물 게시판
        </Typography>

      </Box>

      {/* =========================
          POST GRID
      ========================= */}
      <div className="card-grid">

        {posts.map((post) => (

          <Paper
            key={post.id}
            className="post-card"
            onClick={() => navigate(`/post/${post.id}`)}
          >

            <img
            src={post.image || "waiting2.png"}
            alt="post"
            className="post-image"

            onError={(e) => {
              e.target.src = "/waiting2.png";
            }}
          />

            <div className="post-title-box">

              <Typography className="post-title">
                {post.title}
              </Typography>

            </div>

          </Paper>

        ))}

      </div>
    </>
  );
}

export default BoardPage;