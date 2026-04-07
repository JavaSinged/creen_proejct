import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../../utils/accessToken";
import styles from "./ManagerReviewComment.module.css";
import axios from "axios";

const ManagerReviewComment = () => {
  const [reviews, setReviews] = useState([]);

  const [replyInputs, setReplyInputs] = useState({});

  const storeId = localStorage.getItem("storeId");
  const memberId = localStorage.getItem("memberId");

  const fetchReviews = async () => {
    try {
      const backHost = import.meta.env.VITE_BACKSERVER;
      console.log(
        `🚀 백엔드로 요청 보냄: ${backHost}/stores/reviews/${storeId}`,
      );

      const res = await axios.get(`${backHost}/stores/reviews/${storeId}`);

      console.log("✅ 백엔드에서 받아온 데이터:", res.data);
      setReviews(res.data ?? []);
    } catch (err) {
      console.error("❌ 리뷰 목록 로드 실패!");
      console.dir(err);
    }
  };

  useEffect(() => {
    console.log("🚀 현재 로컬스토리지의 storeId:", storeId);

    if (storeId) fetchReviews();
  }, [storeId]);

  const handleInputChange = (orderId, text) => {
    setReplyInputs((prev) => ({ ...prev, [orderId]: text }));
  };

  const submitReply = async (orderId) => {
    const content = replyInputs[orderId];

    if (!content || content.trim().length < 5) {
      return Swal.fire("알림", "답글을 5자 이상 작성해주세요.", "warning");
    }

    try {
      const payload = {
        orderId: Number(orderId),
        storeId: Number(storeId),
        memberId: memberId,
        reviewCommentContent: content,
      };

      const res = await api.post("/stores/review/comment", payload);

      if (res.data === "SUCCESS") {
        Swal.fire("성공", "사장님 답글이 등록되었습니다! 🌱", "success");
        setReplyInputs((prev) => ({ ...prev, [orderId]: "" }));
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("실패", "답글 등록 중 서버 오류가 발생했습니다.", "error");
    }
  };
  const deleteReview = (orderId) => {
    Swal.fire({
      title: "리뷰를 삭제하시겠습니까?",
      text: "삭제된 리뷰는 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#ccc",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api.delete(`/member/deleteReview/${orderId}`);
          if (res.data === "SUCCESS") {
            Swal.fire("성공", "리뷰가 삭제되었습니다.", "success");
            fetchReviews();
          }
        } catch (err) {
          console.error(err);
          Swal.fire("에러", "리뷰 삭제 중 오류가 발생했습니다.", "error");
        }
      }
    });
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>고객 리뷰 관리 📝</h2>
      <p className={styles.pageDesc}>
        고객님의 소중한 리뷰에 따뜻한 답글을 남겨주세요.
      </p>

      <div className={styles.reviewList}>
        {reviews.length === 0 ? (
          <p className={styles.noData}>아직 등록된 리뷰가 없습니다.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.orderId}
              className={styles.reviewCard}
              style={{ position: "relative" }}
            >
              <button
                className={styles.deleteBtn}
                onClick={() => deleteReview(review.orderId)}
                title="리뷰 삭제"
              >
                삭제
              </button>
              {/* 고객 리뷰 영역 */}
              <div className={styles.customerSection}>
                {/* 🌟 고객 프로필 헤더 추가 */}
                <div className={styles.userInfo}>
                  <img
                    src={
                      review.memberProfile
                        ? `${import.meta.env.VITE_BACKSERVER}${review.memberProfile}`
                        : "/img/default-user.png" // 기본 프로필 이미지
                    }
                    alt="profile"
                    className={styles.userAvatar}
                  />
                  <div className={styles.userNameArea}>
                    <span className={styles.userName}>
                      {review.memberId} 고객님
                    </span>
                    <div className={styles.stars}>
                      {"★".repeat(review.reviewRating)}
                      {"☆".repeat(5 - review.reviewRating)}
                    </div>
                  </div>
                  <span className={styles.date}>{review.reviewDate}</span>
                </div>

                <p className={styles.menuName}>주문 메뉴: {review.menuName}</p>
                <p className={styles.content}>{review.reviewContent}</p>

                {review.reviewThumb && (
                  <img
                    src={
                      review.reviewThumb.startsWith("/")
                        ? `${import.meta.env.VITE_BACKSERVER}${review.reviewThumb}`
                        : `${import.meta.env.VITE_BACKSERVER}/uploads/review/${review.reviewThumb}`
                    }
                    alt="리뷰사진"
                    className={styles.reviewImg}
                    onError={(e) => {
                      e.target.src = "/img/no-image.png";
                    }}
                  />
                )}
              </div>

              {/* 사장님 답글 영역 */}
              <div className={styles.bossSection}>
                {review.reviewCommentContent ? (
                  <div className={styles.replyCompleted}>
                    <p className={styles.bossTitle}>↳ 사장님 답글</p>
                    <p className={styles.replyContent}>
                      {review.reviewCommentContent}
                    </p>
                    <span className={styles.replyDate}>
                      {review.reviewCommentDate}
                    </span>
                  </div>
                ) : (
                  <div className={styles.replyForm}>
                    <p className={styles.bossTitle}>↳ 답글 작성</p>
                    <div className={styles.inputWrap}>
                      <textarea
                        className={styles.textarea}
                        placeholder="고객님께 감사 인사를 남겨주세요. (최소 5자)"
                        value={replyInputs[review.orderId] || ""}
                        onChange={(e) =>
                          handleInputChange(review.orderId, e.target.value)
                        }
                      />
                      <button
                        className={styles.submitBtn}
                        onClick={() => submitReply(review.orderId)}
                      >
                        등록
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagerReviewComment;
