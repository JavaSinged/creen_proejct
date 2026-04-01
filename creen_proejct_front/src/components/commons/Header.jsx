import React, { useContext } from "react";
import styles from "./Header.module.css";
import Swal from "sweetalert2"; // 🌟 Swal 추가

// Icons
import ParkIcon from "@mui/icons-material/Park";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();

  // isLoading 상태 꺼내오기
  const { isLogin, user, logout, isLoading } = useContext(AuthContext);

  // 🌟 마이페이지 클릭 시 실행될 함수
  const handleMyPageClick = () => {
    if (isLogin) {
      // 권한별 목적지 설정
      let targetPath = "/mypage/user"; // 기본값 (개인)
      let roleText = "에코 히어로";

      if (user?.memberGrade === 0) {
        targetPath = "/mypage/admin";
        roleText = "관리자";
      } else if (user?.memberGrade === 2) {
        targetPath = "/mypage/manager";
        roleText = "파트너";
      }

      Swal.fire({
        icon: "success",
        title: "마이페이지",
        text: `${roleText}님의 공간으로 이동합니다.`,
        showConfirmButton: false,
        timer: 1500, // 1.5초 뒤 자동 이동
      }).then(() => {
        navigate(targetPath);
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "로그인 필요",
        text: "로그인 페이지로 이동합니다.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/login");
      });
    }
  };

  return (
    <header className={styles.header}>
      {/* 1. 로고 영역 */}
      <div
        className={styles.logo_wrap}
        onClick={() => {
          navigate("/");
        }}
        style={{ cursor: "pointer" }}
      >
        <img src="/image/logo.png" alt="GreenCarry Logo" />
        <h5 className={styles.logo_text}>GreenCarry</h5>
      </div>

      {/* 2. 중앙 나무 통계 영역 */}
      <div className={styles.center_wrap}>
        <ParkIcon />
        <h5>
          지금까지 함께 심은 나무, 총 <span className={styles.badge}>41</span>{" "}
          그루
        </h5>
      </div>

      {/* 3. 버튼 및 유저 상태 영역 */}
      <div className={styles.button_wrap}>
        {/* 로딩 중일 때는 깜빡임을 막기 위해 빈 공간 처리 */}
        {isLoading ? null : (
          <>
            {isLogin && user && (
              <span className={styles.user_info}>
                <b>{user.memberName}</b>님 (
                {user.memberGrade === 0
                  ? "관리자"
                  : user.memberGrade === 1
                    ? "개인"
                    : "사업자"}
                )
              </span>
            )}

            <NotificationsNoneIcon style={{ cursor: "pointer" }} />

            {/* 🌟 마이페이지 아이콘: Link 대신 onClick 이벤트 연결 */}
            <div
              onClick={handleMyPageClick}
              style={{ cursor: "pointer", display: "flex" }}
            >
              <PersonIcon titleAccess="마이페이지" />
            </div>

            {/* 로그인/로그아웃 토글 버튼 */}
            {isLogin ? (
              <div
                onClick={logout}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LogoutIcon titleAccess="로그아웃" />
              </div>
            ) : (
              <Link to="/login">
                <LoginIcon titleAccess="로그인" />
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}
