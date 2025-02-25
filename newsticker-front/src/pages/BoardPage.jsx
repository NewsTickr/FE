import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import BoardFormModal from "../components/BoardDetailModal";
import "../styles/Page.css";
import profile from "../assets/icons/profile.png";
import api from "../api/axios.jsx";

function BoardPage() {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boardlist, setBoardlist] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  //메인페이지
  useEffect(() => {
    const fetchMyBoards = async () => {
      try {
        const response = await api.get("/news/", {
          withCredentials: true, // 쿠키 기반 JWT 사용
        });

        console.log("전체 게시글 조회:", response.data);
        setBoardlist(response.data);
      } catch (error) {
        console.error("게시글을 불러오는 데 실패했습니다.", error);
      }
    };

    fetchMyBoards();
  }, []);

  const handleDelete = (deletedId) => {
    setBoardlist((prev) => prev.filter((board) => board.id !== deletedId));
  };

  // 검색 기능
  useEffect(() => {
    if (query.trim() === "") return;
    setLoading(true);

    api
      .get(`/news/${query}`) // 게시글 제목 검색 API
      .then((response) => {
        setBoardlist(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("게시글 검색 오류:", error);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="board-page">
      <NavBar onNewsSearch={() => {}} onBoardSearch={setQuery} />
      <div className="list">
        <h2>게시글 목록</h2>
        {boardlist.length === 0 ? (
          <p>작성한 게시글이 없습니다.</p>
        ) : (
          boardlist.map((board) => (
            <div
              key={board.id}
              className="item"
              onClick={() => setSelectedBoard(board)}
            >
              <div className="boardContent">
                {/* 유저 */}
                <div className="userprofile">
                  <img src={profile} />
                  <span className="name">{board.userName.slice(0, 6)}</span>
                </div>
                {/* 타이틀 */}
                <div className="board-title">
                  <p>{board.title}</p>
                  {/* 날짜 */}
                  <p>{board.description}</p>
                  <p>{new Date(board.date).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {selectedBoard && (
        <BoardFormModal
          board={selectedBoard}
          onClose={() => setSelectedBoard(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default BoardPage;
