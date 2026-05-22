from flask import Flask, request, jsonify
from flask_cors import CORS

from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)

app = Flask(__name__)

CORS(app)

# JWT 설정
app.config["JWT_SECRET_KEY"] = "my-secret-key"

jwt = JWTManager(app)

# =========================
# JWT 블랙리스트
# =========================
blacklist = set()

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):

    return jwt_payload["jti"] in blacklist

# =========================
# 테스트 계정
# =========================
USER_DATA = {
    "id": "admin",
    "password": "1234"
}

# =========================
# 게시물 저장소 (딕셔너리)
# =========================
posts = {}

post_id = 1

# =========================
# 로그인
# =========================
@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    user_id = data.get("id")
    password = data.get("password")

    if (
        user_id == USER_DATA["id"]
        and password == USER_DATA["password"]
    ):

        access_token = create_access_token(
            identity=user_id
        )

        return jsonify({
            "success": True,
            "token": access_token,
            "message": "로그인 성공"
        })

    return jsonify({
        "success": False,
        "message": "아이디 또는 비밀번호 오류"
    }), 401

# =========================
# 로그아웃
# =========================
@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():

    jti = get_jwt()["jti"]

    blacklist.add(jti)

    return jsonify({
        "message": "로그아웃 완료"
    })

# =========================
# 로그인 사용자 확인
# =========================
@app.route("/profile", methods=["GET"])
@jwt_required()
def profile():

    current_user = get_jwt_identity()

    return jsonify({
        "login_user": current_user
    })

# =========================
# 게시물 등록
# =========================
@app.route("/posts", methods=["POST"])
@jwt_required()
def create_post():

    global post_id

    data = request.get_json()

    current_user = get_jwt_identity()

    posts[post_id] = {

        "id": post_id,

        "title": data.get("title"),

        "location": data.get("location"),

        "date": data.get("date"),

        "category": data.get("category"),

        "storage": data.get("storage"),

        "description": data.get("description"),

        "image": data.get("image"),

        "writer": current_user,
    }

    post_id += 1

    return jsonify({
        "message": "게시물 등록 완료"
    })

# =========================
# 게시물 조회
# =========================
@app.route("/posts", methods=["GET"])
@jwt_required()
def get_posts():

    return jsonify(list(posts.values()))

# =========================
# 게시물 삭제
# =========================
@app.route("/posts/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_post(id):

    if id in posts:

        del posts[id]

        return jsonify({
            "message": "삭제 완료"
        })

    return jsonify({
        "message": "게시물을 찾을 수 없음"
    }), 404

@app.route("/posts/<int:post_id>", methods=["GET"])
def get_post(post_id):

    post = posts.get(post_id)

    if not post:
        return jsonify({"error": "not found"}), 404

    return jsonify(post)

if __name__ == "__main__":
    app.run(debug=True)