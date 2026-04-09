import React, { useState, useEffect, useRef } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import styles from "./Header.module.css";
import { jwtDecode } from "jwt-decode";

const HeaderNotification = () => {
  const [unreadCount, setUnreadCount] = useState(0); // 뱃지 숫자
  const [notifications, setNotifications] = useState([]); // 알림 메시지 보관 배열
  const [isOpen, setIsOpen] = useState(false); // 창 열림 상태
  const [memberId, setMemberId] = useState(null);

  const backHost = import.meta.env.VITE_BACKSERVER;
  const dropdownRef = useRef(null);

  // 1. 아이디 가져오기
  useEffect(() => {
    const saved = localStorage.getItem("memberId");
    if (saved) {
      setMemberId(saved);
    }
  }, []);

  // 2. 아이디가 생기면 SSE 연결하기
  useEffect(() => {
    // 로그로 추적 시작
    console.log("SSE 연결 체크 시작 - memberId:", memberId);

    if (!memberId) {
      console.log("아이디가 없어서 연결 중단");
      return;
    }

    // 아이디가 있을 때만 이 아래가 실행됩니다.
    console.log("🚀 드디어 아이디 확인! 서버에 연결 시도합니다. ID:", memberId);

    const eventSource = new EventSource(
      `${backHost}/api/notification/subscribe?memberId=${memberId}`,
    );

    eventSource.onopen = () => {
      console.log("✅ SSE 연결 통로가 성공적으로 열렸습니다!");
    };

    eventSource.addEventListener("orderUpdate", (event) => {
      console.log("🔔 알림 도착!! :", event.data);
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        { message: event.data, time: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    });

    eventSource.onerror = (err) => {
      console.error("❌ SSE 연결 중 에러 발생:", err);
      eventSource.close();
    };

    return () => {
      console.log("🧹 연결 해제 (Clean-up)");
      eventSource.close();
    };
  }, [memberId]); // 👈 memberId가 바뀔 때마다 이 Effect가 다시 실행되어야 합니다!

  // 3. 종 클릭 시 숫자 지우고 창 토글
  const handleIconClick = () => {
    setUnreadCount(0); // 숫자 지우기
    setIsOpen(!isOpen); // 창 열기/닫기
  };

  // 4. 창 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.noti_icon_wrap} ref={dropdownRef}>
      {/* 알림 종 아이콘 */}
      <NotificationsNoneIcon
        onClick={handleIconClick}
        style={{ cursor: "pointer", fontSize: "24px" }}
      />

      {/* 장바구니 뱃지와 똑같은 뱃지 */}
      {unreadCount > 0 && (
        <span className={styles.noti_badge}>{unreadCount}</span>
      )}

      {/* 알림 드롭다운 창 */}
      {isOpen && (
        <div className={styles.noti_dropdown}>
          <span className={styles.noti_header}>최근 알림</span>
          <div className={styles.noti_list}>
            {notifications.length > 0 ? (
              notifications.map((noti, idx) => (
                <div key={idx} className={styles.noti_item}>
                  <p className={styles.noti_msg}>{noti.message}</p>
                  <span className={styles.noti_time}>{noti.time}</span>
                </div>
              ))
            ) : (
              <p className={styles.empty_msg}>새로운 알림이 없습니다. 🌿</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderNotification;
