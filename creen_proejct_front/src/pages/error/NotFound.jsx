// src/pages/error/NotFound.jsx
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>요청하신 페이지를 찾을 수 없습니다. 😢</p>
      <p className={styles.sub_message}>
        입력하신 주소가 정확한지 다시 한번 확인해 주세요.
      </p>
      <button className={styles.home_btn} onClick={() => navigate("/")}>
        홈으로 돌아가기
      </button>
    </div>
  );
}
