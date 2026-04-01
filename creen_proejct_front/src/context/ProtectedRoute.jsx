import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ requireAdmin, requireBusiness }) => {
  // 🌟 1. AuthContext에서 isLoading 꺼내오기
  const { isLogin, user, isLoading } = useContext(AuthContext);

  // 🌟 2. [핵심] 로그인 정보를 확인하는 찰나의 순간에는 아무것도 렌더링하지 않음!
  if (isLoading) {
    return null; // 하얀 화면이 싫다면 <div>로딩 중...</div> 등으로 바꿔도 좋습니다.
  }

  // 1. 로그인을 안 한 경우
  if (!isLogin) {
    Swal.fire({
      icon: "warning",
      title: "로그인 필요",
      text: "로그인 후 이용할 수 있는 페이지입니다.",
    });
    // 로그인 페이지로 강제 추방 (replace: 뒤로가기 방지)
    return <Navigate to="/login" replace />;
  }

  // 2. 관리자 전용 페이지인데 관리자(0)가 아닌 경우
  if (requireAdmin && user?.memberGrade !== 0) {
    Swal.fire({
      icon: "error",
      title: "접근 불가",
      text: "관리자만 접근할 수 있습니다.",
    });
    return <Navigate to="/" replace />; // 메인으로 추방
  }

  // 3. 사업자 전용 페이지인데 사업자(2)가 아닌 경우
  if (requireBusiness && user?.memberGrade !== 2) {
    Swal.fire({
      icon: "error",
      title: "접근 불가",
      text: "사업자 파트너만 접근할 수 있습니다.",
    });
    return <Navigate to="/" replace />; // 메인으로 추방
  }

  // 검문을 무사히 통과하면 원래 가려던 페이지(<Outlet />)를 보여줌!
  return <Outlet />;
};

export default ProtectedRoute;
