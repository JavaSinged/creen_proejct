import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const login = () => {
  // 탭 상태 관리 (개인 이용자 vs 사업자)
  const [activeTab, setActiveTab] = useState("personal");

  // 체크박스 및 입력 폼 상태 관리
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberId, setRememberId] = useState(true);

  const validateForm = () => {
    // 1. 아이디: 영문자 + 숫자 포함, 8자 이상
    const idRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    // 2. 비밀번호: 영문자 + 숫자 포함, 10자 이상
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/;

    if (!idRegex.test(userId)) {
      alert("아이디는 영문자와 숫자를 포함하여 8자 이상이어야 합니다.");
      return false;
    }

    if (!pwRegex.test(password)) {
      alert("비밀번호는 영문자와 숫자를 포함하여 10자 이상이어야 합니다.");
      return false;
    }

    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // 🌟 로그인 전 검증 실시
    if (!validateForm()) return;

    console.log("로그인 성공 시도:", {
      tab: activeTab,
      id: userId,
      pw: password,
      save: rememberId,
    });

    // axios 연동 등 실제 로그인 로직 진행
    alert("로그인 형식이 올바릅니다!");
  };

  return (
    <div className="screen-container">
      {/* 🌟 헤더 태그 없이 로고 텍스트만 단독으로 중앙 배치 🌟 */}
      <h1
        className="logo"
        style={{
          textAlign: "center",
          padding: "30px 0",
          margin: 0,
          fontSize: "2.2rem",
          fontWeight: 700,
        }}
      >
        {/* ✨ 2. Link 태그로 글씨 감싸기 */}
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          GreenCarry
        </Link>
      </h1>

      {/* 메인 콘텐츠 구역 */}
      <div className="main-content">
        {/* 좌측 정보 섹션 */}
        <section className="info-section">
          <div className="eco-brand">
            <span className="eco-icon">E</span>
            <span className="eco-text">Eco-Delivery</span>
          </div>
          <h2 className="main-title">
            탄소 발자국을 줄이는
            <br />
            맛있는 한 끼
          </h2>
          <div className="stats">
            <div className="stat-item leaf">
              🌿 오늘 우리가 함께 아낀 탄소{" "}
              <span className="stat-value">1,245kg</span>
            </div>
            <div className="stat-item tree">
              🌳 식재된 나무 효과 <span className="stat-value">156그루</span>
            </div>
          </div>
        </section>

        {/* 중앙 로그인 폼 카드 */}
        <section className="login-card">
          <h3 className="card-title">반가워요, 에코 히어로!</h3>
          <p className="card-description">
            로그인하여 친환경 배달을 시작하세요
          </p>

          {/* 탭 버튼 */}
          <div className="tabs">
            <button
              type="button"
              className={`tab-button ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              개인 이용자
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === "business" ? "active" : ""}`}
              onClick={() => setActiveTab("business")}
            >
              사업자
            </button>
          </div>

          {/* 로그인 폼 */}
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="아이디(영문+숫자 8자 이상)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="비밀번호(영문+숫자 10자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="remember-me">
              <input
                type="checkbox"
                id="remember_check"
                checked={rememberId}
                onChange={(e) => setRememberId(e.target.checked)}
              />
              <label htmlFor="remember_check">아이디 저장</label>
            </div>

            <button type="submit" className="login-button">
              로그인
            </button>
          </form>

          {/* 하단 링크 */}
          <div className="card-footer">
            <a href="#signup">회원가입</a>
            <a href="/account">아이디/비밀번호 찾기</a>
          </div>
        </section>

        {/* 우측 일러스트 섹션 */}
        <section className="illustration-section">
          <div className="speech-bubble">
            <p>현재 456명이 환경을 지키고 있어요!</p>
          </div>
          <div className="character-illustration">
            <img src="/image/logo.png" alt="GreenCarry Logo" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default login;
