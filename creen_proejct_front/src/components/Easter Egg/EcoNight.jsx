import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios"; // 🌟 API 통신을 위해 axios 추가
import "./EcoNight.css";

const EcoNight = () => {
  const [isActive, setIsActive] = useState(false);
  const [isFullyDark, setIsFullyDark] = useState(false);
  const [couponPosition, setCouponPosition] = useState({
    top: "50%",
    left: "50%",
  });
  const overlayRef = useRef(null);

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
  }, []);

  const generateRandomPosition = () => {
    const randomTop = Math.floor(Math.random() * 70) + 15;
    const randomLeft = Math.floor(Math.random() * 70) + 15;
    setCouponPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
  };

  const triggerBlackout = () => {
    if (isActive) return;

    generateRandomPosition();
    setIsActive(true);
    setIsFullyDark(false);

    // 깜빡거리는 애니메이션(1초)이 완전히 끝난 후 쿠폰 스폰
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

  // 🌟 핵심: DB 연동 포인트 지급 로직
  const handleCouponClick = async () => {
    // 1. 로컬 스토리지에서 member_id 가져오기
    const memberId = localStorage.getItem("memberId");

    // 2. 비로그인 유저 예외 처리
    if (!memberId) {
      Swal.fire({
        title: "로그인이 필요합니다!",
        text: "포인트를 받으려면 먼저 로그인해 주세요.",
        icon: "warning",
        background: "#000",
        color: "#fff",
        confirmButtonColor: "#fff",
      }).then(() => {
        setIsActive(false);
        setIsFullyDark(false);
      });
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/member/Addpoint/${memberId}`,
        {
          member_id: memberId,
          event_code: "NIGHT_COUPON",
        },
      );

      Swal.fire({
        title: "올빼미족 인증!",
        html: `어둠 속에서 쿠폰을 발견하셨군요!<br/><b>[2000P 지급 완료!]</b>`,
        icon: "success",
        background: "#000",
        color: "#fff",
        confirmButtonColor: "#fff",
      }).then(() => {
        setIsActive(false);
        setIsFullyDark(false);
      });
    } catch (error) {
      // 4. 이미 포인트를 받았거나 서버 에러가 났을 때의 처리
      console.error("포인트 지급 실패:", error);

      Swal.fire({
        title: "앗!",
        text: "이미 발견한 쿠폰이거나, 포인트 지급 중 오류가 발생했습니다.",
        icon: "error",
        background: "#000",
        color: "#ff0044", // 에러는 붉은색으로
        confirmButtonColor: "#ff0044",
      }).then(() => {
        setIsActive(false);
        setIsFullyDark(false);
      });
    }
  };

  if (!isActive) return null;

  return (
    <>
      <div
        className="blackout-overlay"
        ref={overlayRef}
        style={{ "--mouse-x": "50%", "--mouse-y": "50%" }}
      ></div>

      {isFullyDark && (
        <div
          className="secret-coupon"
          onClick={handleCouponClick}
          style={couponPosition}
        >
          🍕 깜짝 쿠폰!
        </div>
      )}
    </>
  );
};

export default EcoNight;
