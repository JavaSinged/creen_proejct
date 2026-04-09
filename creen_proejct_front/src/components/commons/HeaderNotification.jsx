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

  // 1. 토큰에서 내 아이디 가져오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setMemberId(decoded.memberId);
      } catch (error) {
        console.error("토큰 해독 실패:", error);
      }
    }
  }, []);

  // 2. 실시간 신호 대기
  useEffect(() => {
    if (!memberId) return;

    const eventSource = new EventSource(
      `${backHost}/api/notification/subscribe?memberId=${memberId}`,
    );

    eventSource.addEventListener("orderUpdate", (event) => {
      // 🌟 신호가 오면 숫자를 올리고, 메시지를 배열에 담음 (DB 대신 메모리 저장)
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        { message: event.data, time: new Date().toLocaleTimeString() },
        ...prev, // 최신순 정렬
      ]);
    });

    eventSource.onerror = () => eventSource.close();
    return () => eventSource.close();
  }, [memberId, backHost]);

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
    <div
      className={styles.cart_icon_wrap}
      style={{ position: "relative" }}
      ref={dropdownRef}
    >
      {/* 알림 종 아이콘 */}
      <NotificationsNoneIcon
        onClick={handleIconClick}
        style={{ cursor: "pointer", fontSize: "24px" }}
      />

      {/* 뱃지 숫자 */}
      {unreadCount > 0 && (
        <span className={styles.cart_badge}>{unreadCount}</span>
      )}

      {/* 🌟 알림 드롭다운 창 (Absolute) */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "35px",
            right: "0",
            width: "250px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            zIndex: 100,
            padding: "10px",
          }}
        >
          <p
            style={{
              margin: "0 0 10px 0",
              fontWeight: "bold",
              fontSize: "14px",
              borderBottom: "1px solid #eee",
              paddingBottom: "5px",
            }}
          >
            최근 알림
          </p>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {notifications.length > 0 ? (
              notifications.map((noti, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #f9f9f9",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "13px", color: "#333" }}>
                    {noti.message}
                  </p>
                  <span style={{ fontSize: "11px", color: "#999" }}>
                    {noti.time}
                  </span>
                </div>
              ))
            ) : (
              <p
                style={{
                  fontSize: "12px",
                  color: "#999",
                  textAlign: "center",
                  padding: "10px 0",
                }}
              >
                새로운 알림이 없습니다.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderNotification;
