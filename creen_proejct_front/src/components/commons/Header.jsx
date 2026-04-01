import React, { useContext } from "react";
import styles from "./Header.module.css";
import Swal from "sweetalert2";

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

  // 🎨 GreenCarry 전용 Swal 출력 함수 (내부 전용)
  const fireStyledSwal = (icon, title, text) => {
    return Swal.fire({
      icon: icon,
      title: title,
      text: text,
      customClass: {
        popup: "greencarry-swal-popup",
        title: "greencarry-swal-title",
        confirmButton: "greencarry-swal-confirm-button",
      },
      buttonsStyling: false,
      confirmButtonText: "확인",
      showConfirmButton: icon === "warning", // 경고일 때만 확인 버튼 보여줌
      timer: icon === "success" ? 1500 : undefined, // 성공 시에는 1.5초 뒤 자동 닫힘
    });
  };

  // 🌟 마이페이지 클릭 시 실행될 함수
  const handleMyPageClick = () => {
    if (isLogin) {
      // 권한별 목적지 설정
      let targetPath = "/mypage/user"; // 기본값 (개인)
      let roleText = "에코 히어로";

      // 등급을 숫자로 확실하게 변환해서 비교
      const grade = Number(user?.memberGrade);

      if (grade === 0) {
        targetPath = "/mypage/admin";
        roleText = "관리자";
      } else if (grade === 2) {
        targetPath = "/mypage/manager";
        roleText = "파트너";
      }

      fireStyledSwal(
        "success",
        "마이페이지 이동",
        `${roleText}님의 공간으로 이동합니다.`,
      ).then(() => {
        navigate(targetPath);
      });
    } else {
      // 로그인이 필요한 경우
      fireStyledSwal(
        "warning",
        "로그인 필요",
        "로그인 후 이용할 수 있습니다. 로그인 페이지로 이동할까요?",
      ).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
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
        {isLoading ? null : (
          <>
            {isLogin && user && (
              <span className={styles.user_info}>
                <b>{user.memberName}</b>님 (
                {Number(user.memberGrade) === 0
                  ? "관리자"
                  : Number(user.memberGrade) === 1
                    ? "개인"
                    : "사업자"}
                )
              </span>
            )}

            <NotificationsNoneIcon style={{ cursor: "pointer" }} />

            {/* 🌟 마이페이지 아이콘: 클릭 시 커스텀 Swal 실행 */}
            <div
              onClick={handleMyPageClick}
              style={{ cursor: "pointer", display: "flex" }}
            >
              <PersonIcon titleAccess="마이페이지" />
            </div>

            {/* 로그인/로그아웃 토글 버튼 */}
            {isLogin ? (
              <div
                onClick={() => logout()} // 수동 로그아웃 실행
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
