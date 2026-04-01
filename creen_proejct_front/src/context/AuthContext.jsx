import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);

  // 🌟 1. 로딩 상태 추가 (처음엔 무조건 true로 시작해서 문을 닫아둡니다)
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 새로고침 시 로컬스토리지 확인하여 상태 복구
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const name = localStorage.getItem("memberName");
    const grade = localStorage.getItem("memberGrade");
    const id = localStorage.getItem("memberId"); // 🚨 아까 추가했던 memberId도 여기서 꼭 꺼내야 합니다!

    if (token) {
      setIsLogin(true);
      setUser({
        memberId: id, // 🌟 DB 조회할 때 써야 하니 필수!
        memberName: name,
        memberGrade: Number(grade),
      });
    }

    // 🌟 2. 로컬스토리지 확인이 다 끝났으니 로딩을 끝냅니다 (문 개방!)
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.clear(); // 전체 삭제 혹은 특정 키만 삭제
    setIsLogin(false);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      // 🌟 3. isLoading을 밖에서 쓸 수 있게 넘겨줍니다
      value={{ isLogin, setIsLogin, user, setUser, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
