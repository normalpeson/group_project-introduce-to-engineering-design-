import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";

import "./PostDetailPage.css"

function PostDetail() {

  const { id } = useParams();

  const [post, setPost] = useState(null);

  useEffect(() => {

    const fetchPost = async () => {

      const res = await fetch(
        `http://127.0.0.1:5000/posts/${id}`
      );

      const data = await res.json();

      setPost(data);
    };

    fetchPost();

  }, [id]);

  if (!post) return <div>로딩중...</div>;

 return (
    <Box className="detail-wrapper">

        <Paper className="detail-paper">

        {/* 1. 제목 */}
        <div className="detail-title">
            {post.title}
        </div>

        {/* 2. 상단 영역 (이미지 + 정보) */}
        <div className="detail-top">

            {/* 이미지 */}
            <div className="detail-image-box">

            <img
                src={post.image || "/default-image.png"}
                alt="post"
                className="detail-image"
            />

            </div>

            {/* 정보 테이블 */}
            <div className="detail-info">

            <div><b>습득 장소</b> {post.location}</div>
            <div><b>습득 날짜</b> {post.date}</div>
            <div><b>물품 분류</b> {post.category}</div>
            <div><b>보관 장소</b> {post.storage}</div>

            </div>

        </div>

        {/* 3. 상세 설명 */}
        <div className="detail-description">

            {post.description}

        </div>

        </Paper>

    </Box>
    );
}

export default PostDetail;