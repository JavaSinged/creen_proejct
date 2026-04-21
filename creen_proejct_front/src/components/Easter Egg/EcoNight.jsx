import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "./EcoNight.css";

const EcoNight = () => {
  const [isActive, setIsActive] = useState(false);
  const [isFullyDark, setIsFullyDark] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🌟 중복 요청 방지
  const [couponPosition, setCouponPosition] = useState({
    top: "50%",
    left: "50%",
  });
  const overlayRef = useRef(null);

  // 1. "night" 타이핑 감지 로직
  useEffect(() => {
    let keys = [];
    const handleKeyDown = (e) => {
      keys.push(e.key.toLowerCase());
      keys = keys.slice(-5);
      if (keys.join("") === "night") {
        triggerBlackout();
        keys = [];
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive]); // isActive 상태를 의존성에 넣어 중복 실행 방지

  // 2. 랜덤 위치 생성
  const generateRandomPosition = () => {
    const randomTop = Math.floor(Math.random() * 60) + 20; // 너무 가장자리 안 가게 조절
    const randomLeft = Math.floor(Math.random() * 60) + 20;
    setCouponPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
  };

  // 3. 암전 트리거
  const triggerBlackout = () => {
    if (isActive) return;
    generateRandomPosition();
    setIsActive(true);
    setIsFullyDark(false);

    // 1초 뒤에 손전등 효과와 쿠폰 활성화
    setTimeout(() => {
      setIsFullyDark(true);
    }, 1000);

    const handleMouseMove = (e) => {
      if (overlayRef.current) {
        overlayRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
        overlayRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  };

  // 4. 🌟 쿠폰 클릭 시 포인트 지급 (DB 연동)
  const handleCouponClick = async () => {
    if (isSubmitting) return;

    const memberId = localStorage.getItem("memberId");

    if (!memberId) {
      Swal.fire({
        title: "로그인이 필요합니다!",
        text: "포인트를 받으려면 먼저 로그인해 주세요.",
        icon: "warning",
        background: "#111",
        color: "#fff",
        confirmButtonColor: "#2ecc71",
      }).then(() => resetState());
      return;
    }

    try {
      setIsSubmitting(true);

      // 백엔드 전용 테이블(easter_egg_history)에 기록을 남기는 API 호출
      await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/member/Addpoint/${memberId}`,
        { event_code: "NIGHT_COUPON" },
      );

      Swal.fire({
        title: "올빼미족 인증!",
        html: `어둠 속에서 쿠폰을 발견하셨군요!<br/><b>[2000P 지급 완료!]</b>`,
        icon: "success",
        background: "#000",
        color: "#fff",
        confirmButtonColor: "#2ecc71",
      }).then(() => resetState());
    } catch (error) {
      console.error("포인트 지급 실패:", error);
      const errorMsg =
        error.response?.status === 409
          ? "이미 이 쿠폰의 보상을 받으셨습니다!"
          : "시스템 오류가 발생했습니다.";

      Swal.fire({
        title: "앗!",
        text: errorMsg,
        icon: "error",
        background: "#111",
        color: "#ff4757",
        confirmButtonColor: "#ff4757",
      }).then(() => resetState());
    } finally {
      setIsSubmitting(false);
    }
  };

  // 상태 초기화 로직
  const resetState = () => {
    setIsActive(false);
    setIsFullyDark(false);
  };

  if (!isActive) return null;

  return (
    <>
      {/* 마우스 따라다니는 손전등 레이어 */}
      <div
        className={`blackout-overlay ${isFullyDark ? "active" : ""}`}
        ref={overlayRef}
        style={{ "--mouse-x": "50%", "--mouse-y": "50%" }}
      />

      {isFullyDark && (
        <div
          className="secret-coupon"
          onClick={handleCouponClick}
          style={couponPosition}
        >
          🍕 깜짝 쿠폰!
          <span className="click-me">클릭해서 포인트 받기</span>
        </div>
      )}
    </>
  );
};

export default EcoNight;
