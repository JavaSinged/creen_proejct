import React, { useState, useEffect } from "react";
import api from "../../../utils/accessToken";
import styles from "./UserReviewList.module.css";
import Swal from "sweetalert2";

const UserReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🌟 1. 서버에서 리뷰 목록 가져오는 함수
  const getMyReviews = async () => {
    try {
      // 로그인된 사용자 아이디 가져오기
      const memberId = localStorage.getItem("memberId");

      // 백엔드 컨트롤러에 작성할 주소로 요청 (아래 백엔드 섹션 참고)
      const res = await api.get(`/member/myReviewList/${memberId}`);

      setReviews(res.data); // 받아온 데이터를 상태에 저장
    } catch (err) {
      console.error("리뷰 로드 실패:", err);
      // Swal.fire("에러", "리뷰를 불러오는데 실패했습니다.", "error");
    }
  };

  // 🌟 2. 컴포넌트 마운트 시 실행
  useEffect(() => {
    getMyReviews();
  }, []);

  // 리뷰 삭제 함수 (구현 추가)
  const deleteReview = (orderId) => {
    Swal.fire({
      title: "리뷰를 삭제하시겠습니까?",
      text: "삭제된 리뷰는 복구할 수 없으며 에코 포인트가 차감될 수 있습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#246337",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api.delete(`/member/deleteReview/${orderId}`);
          if (res.data === "SUCCESS") {
            Swal.fire(
              "삭제 성공",
              "리뷰가 정상적으로 삭제되었습니다.",
              "success",
            );
            getMyReviews(); // 목록 새로고침
          }
        } catch (err) {
          Swal.fire("에러", "리뷰 삭제 중 오류가 발생했습니다.", "error");
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      {/* ... 상단 날짜 필터 생략 ... */}

      <div className={styles.review_list}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.orderId} className={styles.review_card}>
              {/* ... 카드 헤더 및 바디 생략 ... */}
              {/* ⚠️ totalPrice.toLocaleString() 에러 방지를 위해 review.totalPrice 가 있을때만 호출 */}
              🍴 {review.menuName} | 💰{" "}
              {review.totalPrice?.toLocaleString() || 0}원
              {/* ... 나머지는 동일 ... */}
            </div>
          ))
        ) : (
          <p className={styles.no_data}>작성한 리뷰가 없습니다. 🌱</p>
        )}
      </div>
    </div>
  );
};

export default UserReviewList;
