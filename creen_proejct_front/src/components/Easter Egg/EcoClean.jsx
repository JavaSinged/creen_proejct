import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "./EcoClean.css";

const EcoClean = () => {
  const [isActive, setIsActive] = useState(false);
  const trashNodesRef = useRef([]);
  const trashDataRef = useRef([]);
  const requestRef = useRef();

  // 🌟 1. 'clean' 타이핑 감지하여 게임 시작
  useEffect(() => {
    let keys = [];
    const secretWord = "clean";

    const handleKeyDown = (e) => {
      keys.push(e.key.toLowerCase());
      keys = keys.slice(-5);
      if (keys.join("") === secretWord) {
        startGame();
        keys = [];
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startGame = () => {
    if (isActive) return;
    setIsActive(true);

    const emojis = ["🥤", "🧃", "🥡", "🗑️", "🗞️", "🥫", "🚬", "🛍️"];
    const screenW = window.innerWidth;

    // 🌟 쓰레기 초기 데이터 셋업
    trashDataRef.current = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * (screenW - 100) + 50,
      y: -100 - Math.random() * 500, // 하늘에서 떨어지도록
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * 5 + 5,
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 15,
      isDragging: false,
      active: true, // true면 화면에 존재함
      lastX: 0,
      lastY: 0,
      lastTime: 0,
    }));

    startPhysicsLoop();
  };

  // 🌟 2. 물리 엔진 루프 (60fps)
  const startPhysicsLoop = () => {
    let lastFrameTime = performance.now();

    const update = (time) => {
      const dt = (time - lastFrameTime) / 16; // 60fps 기준 정규화
      lastFrameTime = time;

      let activeCount = 0;
      const screenW = window.innerWidth;
      const floor = window.innerHeight - 80;

      trashDataRef.current.forEach((t, i) => {
        if (!t.active) return;
        activeCount++;

        if (!t.isDragging) {
          // 중력 및 이동 적용
          t.vy += 0.6 * dt; // 중력 (떨어지는 속도 증가)
          t.x += t.vx * dt;
          t.y += t.vy * dt;
          t.rot += t.vRot * dt;

          // 바닥 충돌 (화면 안에 있을 때만 바닥에서 튕김)
          if (t.y > floor && t.x > -50 && t.x < screenW + 50) {
            t.y = floor;
            t.vy *= -0.5; // 튕기는 탄성
            t.vx *= 0.8; // 바닥 마찰력
            t.vRot *= 0.8;
          }

          // 화면 밖으로 던져지면(청소 완료) 비활성화
          if (
            t.y > window.innerHeight + 200 || // 화면 아래로 떨어짐 (화면 밖)
            t.y < -300 || // 위로 휙 던짐
            t.x < -150 || // 왼쪽으로 던짐
            t.x > screenW + 150 // 오른쪽으로 던짐
          ) {
            t.active = false;
          }
        }

        // 실제 DOM 요소 움직이기 (React state 대신 직접 조작하여 버벅임 방지)
        const node = trashNodesRef.current[i];
        if (node) {
          if (t.active) {
            node.style.transform = `translate(${t.x}px, ${t.y}px) rotate(${t.rot}deg)`;
          } else {
            node.style.display = "none";
          }
        }
      });

      // 🌟 승리 조건: 모든 쓰레기가 화면 밖으로 던져짐
      if (activeCount === 0 && trashDataRef.current.length > 0) {
        cancelAnimationFrame(requestRef.current);
        setIsActive(false);
        Swal.fire({
          title: "지구가 숨을 쉽니다! 🌸",
          text: "플라스틱을 모두 치워주셔서 감사합니다.",
          iconHtml: "🌿",
          confirmButtonColor: "#2e7d32",
        });
        return;
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
  };

  // 🌟 3. 던지기 마우스/터치 이벤트
  const handlePointerDown = (e, i) => {
    const t = trashDataRef.current[i];
    t.isDragging = true;
    t.lastX = e.clientX;
    t.lastY = e.clientY;
    t.lastTime = performance.now();
    t.vx = 0;
    t.vy = 0;
    e.target.setPointerCapture(e.pointerId); // 마우스가 빠르게 움직여도 놓치지 않음
  };

  const handlePointerMove = (e, i) => {
    const t = trashDataRef.current[i];
    if (!t.isDragging) return;

    const now = performance.now();
    const dt = Math.max(1, now - t.lastTime); // 0 나누기 방지

    // 마우스가 이동한 거리와 시간을 계산하여 '순간 가속도(던지는 힘)' 부여
    t.vx = ((e.clientX - t.lastX) / dt) * 6;
    t.vy = ((e.clientY - t.lastY) / dt) * 6;

    t.x += e.clientX - t.lastX;
    t.y += e.clientY - t.lastY;

    t.lastX = e.clientX;
    t.lastY = e.clientY;
    t.lastTime = now;
  };

  const handlePointerUp = (e, i) => {
    const t = trashDataRef.current[i];
    t.isDragging = false;
    t.vRot = t.vx * 0.5; // 던지는 방향으로 회전력 부여
    e.target.releasePointerCapture(e.pointerId);
  };

  if (!isActive) return null;

  return (
    <div className="eco-clean-overlay">
      {/* 화면 중앙 안내 문구 */}
      <div className="eco-clean-instruction">
        마우스로 플라스틱을 집어서
        <br />
        화면 밖으로 휙! 던져보세요
      </div>

      {/* 쓰레기 요소들 렌더링 */}
      {trashDataRef.current.map((t, i) => (
        <div
          key={t.id}
          ref={(el) => (trashNodesRef.current[i] = el)}
          className="eco-trash-item"
          onPointerDown={(e) => handlePointerDown(e, i)}
          onPointerMove={(e) => handlePointerMove(e, i)}
          onPointerUp={(e) => handlePointerUp(e, i)}
          onPointerCancel={(e) => handlePointerUp(e, i)}
        >
          {t.emoji}
        </div>
      ))}
    </div>
  );
};

export default EcoClean;
