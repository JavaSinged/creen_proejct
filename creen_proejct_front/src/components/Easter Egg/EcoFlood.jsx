import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "./EcoFlood.css";

const EcoFlood = () => {
  const [isActive, setIsActive] = useState(false);
  const [waterHeight, setWaterHeight] = useState(0); // 0% ~ 100%
  const floatingElementsRef = useRef([]); // 물 위에 떠 있는 요소들의 데이터 저장

  // 1. 'flood' 타이핑 감지
  useEffect(() => {
    let keys = [];
    const secretWord = "flood";

    const handleKeyDown = (e) => {
      keys.push(e.key.toLowerCase());
      keys = keys.slice(-5);
      if (keys.join("") === secretWord) {
        startFlood();
        keys = [];
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startFlood = () => {
    if (isActive) return;
    setIsActive(true);
    setWaterHeight(0);
    floatingElementsRef.current = [];

    Swal.fire({
      title: "🌍 경고: 지구 온난화 진행 중",
      text: "해수면이 상승하기 시작합니다.",
      icon: "warning",
      timer: 2000,
      showConfirmButton: false,
      background: "#fff3cd",
      color: "#856404",
    });
  };

  // 2. 물이 차오르는 애니메이션 및 부력 효과 적용
  useEffect(() => {
    if (!isActive) return;

    // 타겟 요소들: 이미지, 제목, 본문, 버튼, 카드 등
    const targets = document.querySelectorAll(
      "img, button, h2, h3, p, span, .card-item",
    );
    const targetData = Array.from(targets).map((el) => ({
      el,
      rect: el.getBoundingClientRect(),
      isFloating: false,
      initialTop: el.getBoundingClientRect().top + window.scrollY,
      originalStyle: {
        position: el.style.position,
        top: el.style.top,
        left: el.style.left,
        transition: el.style.transition,
        zIndex: el.style.zIndex,
        width: el.style.width,
        pointerEvents: el.style.pointerEvents,
      },
    }));

    let currentHeight = 0;
    const floodInterval = setInterval(() => {
      currentHeight += 0.5; // 물 차오르는 속도
      setWaterHeight(currentHeight);

      const viewH = window.innerHeight;
      const waterTopViewportY = viewH * (1 - currentHeight / 100); // 현재 물의 상단 좌표

      targetData.forEach((data, i) => {
        if (data.isFloating) return;

        // 요소의 바닥 좌표가 물에 닿았는지 확인
        const targetBottomViewportY = data.rect.bottom;

        if (waterTopViewportY <= targetBottomViewportY) {
          // 🌟 부력 발생: 요소를 제자리에서 뜯어내어 물 위에 띄움
          data.isFloating = true;
          const el = data.el;

          // 레이아웃이 무너지지 않도록 원본 크기 고정 후 absolute로 변경
          el.style.width = `${data.rect.width}px`;
          el.style.position = "absolute";
          el.style.left = `${data.rect.left + window.scrollX}px`;
          el.style.top = `${data.initialTop}px`;
          el.style.zIndex = "1000";
          el.style.pointerEvents = "none"; // 클릭 방지
          el.classList.add("eco-floating-element"); // 둥둥 떠다니는 애니메이션 추가

          // 물 위에 떠 있는 데이터 배열에 추가
          floatingElementsRef.current.push({
            el,
            initialTop: data.initialTop,
            buoyancyOffset: Math.random() * 20 - 10, // 요소마다 약간 다른 높이
            rotOffset: (Math.random() - 0.5) * 10, // 약간 기운 각도
          });
        }
      });

      // 3. 물 위에 떠 있는 요소들을 물 높이에 맞춰 같이 상승시키기
      floatingElementsRef.current.forEach((data) => {
        const el = data.el;
        // 물 높이에 따른 목표 Y 좌표 계산
        const targetY =
          waterTopViewportY -
          el.offsetHeight / 2 +
          window.scrollY +
          data.buoyancyOffset;

        // 자연스럽게 물 위로 떠오르도록 Y좌표 업데이트
        el.style.top = `${targetY}px`;
        el.style.transform = `rotate(${data.rotOffset}deg)`;
      });

      // 4. 홍수 완료 및 종료 메시지
      if (currentHeight >= 100) {
        clearInterval(floodInterval);
        setTimeout(() => {
          Swal.fire({
            title: "지구 온도가 1.5도 상승하면<br/>일어날 일입니다.",
            html: "<b style='color:#2e7d32;'>그린캐리</b>와 함께 이 비극을 막아주세요.",
            icon: "info",
            confirmButtonText: "현실로 돌아가기",
            confirmButtonColor: "#2e7d32",
            allowOutsideClick: false,
          }).then(() => {
            resetFlood(targetData);
          });
        }, 1500);
      }
    }, 50); // 50ms마다 업데이트

    return () => clearInterval(floodInterval);
  }, [isActive]);

  const resetFlood = (targetData) => {
    setIsActive(false);
    setWaterHeight(0);
    floatingElementsRef.current = [];

    // 🌟 모든 요소 원상복구
    targetData.forEach((data) => {
      const el = data.el;
      el.classList.remove("eco-floating-element");
      el.style.position = data.originalStyle.position;
      el.style.top = data.originalStyle.top;
      el.style.left = data.originalStyle.left;
      el.style.transition = data.originalStyle.transition;
      el.style.zIndex = data.originalStyle.zIndex;
      el.style.width = data.originalStyle.width;
      el.style.pointerEvents = data.originalStyle.pointerEvents;
      el.style.transform = "none";
    });
  };

  if (!isActive) return null;

  return (
    <div className="eco-flood-overlay">
      {/* 🌊 차오르는 바닷물 (CSS 파도 효과) */}
      <div className="eco-water-level" style={{ height: `${waterHeight}vh` }}>
        <div className="eco-wave eco-wave1"></div>
        <div className="eco-wave eco-wave2"></div>
      </div>
    </div>
  );
};

export default EcoFlood;
