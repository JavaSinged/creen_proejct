import React, { createContext, useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logoutTimerRef = useRef(null);

  // 🎨 GreenCarry 전용 Swal 스타일
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
    });
  };

  // 🌟 로그아웃 함수
  const logout = (isExpired = false) => {
    // 1. 타이머 즉시 제거
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    // 2. 만료로 인한 로그아웃일 때
    if (isExpired) {
      // 🚨 [핵심 중의 핵심] 로컬스토리지에 토큰이 없으면 이미 수동 로그아웃된 것임!
      // 토큰이 있을 때만 팝업을 띄우고 지웁니다.
      if (localStorage.getItem("accessToken")) {
        localStorage.clear();
        setIsLogin(false);
        setUser(null);

        fireStyledSwal(
          "warning",
          "세션 만료",
          "로그인 유지 시간이 만료되어 자동 로그아웃 되었습니다.",
        ).then(() => {
          window.location.replace("/");
        });
      }
    } else {
      // 3. 수동 로그아웃일 때 (즉시 비우고 이동)
      localStorage.clear();
      setIsLogin(false);
      setUser(null);
      window.location.replace("/");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const name = localStorage.getItem("memberName");
    const grade = localStorage.getItem("memberGrade");
    const id = localStorage.getItem("memberId");

    if (token) {
      try {
        const payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payload));
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedPayload.exp && decodedPayload.exp < currentTime) {
          logout(true);
        } else {
          setIsLogin(true);
          setUser({
            memberId: id,
            memberName: name,
            memberGrade: Number(grade),
          });

          const remainingTime = (decodedPayload.exp - currentTime) * 1000;

          if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

          // ⏲️ 자동 로그아웃 예약
          logoutTimerRef.current = setTimeout(() => {
            // 실행되는 시점에 토큰이 있는지 '한 번 더' 체크하는 logout(true) 호출
            logout(true);
          }, remainingTime);
        }
      } catch (error) {
        console.error("토큰 검증 에러:", error);
        localStorage.clear();
      }
    }

    setIsLoading(false);

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLogin, setIsLogin, user, setUser, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
