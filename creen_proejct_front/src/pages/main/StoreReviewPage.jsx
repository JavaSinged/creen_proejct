import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./StoreReviewPage.module.css";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function StoreReviewPage() {
  const backHost = import.meta.env.VITE_BACKSERVER;
  const location = useLocation();
  const navigate = useNavigate();
  const storeId = location.state?.storeId; // StoreView에서 넘겨준 ID

  const [reviews, setReviews] = useState([]);
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    if (!storeId) {
      navigate(-1); // ID 없으면 뒤로가기
      return;
    }

    // 1. 매장 이름 가져오기 (헤더용)
    axios
      .get(`${backHost}/stores/${storeId}`)
      .then((res) => setStoreName(res.data.storeName));

    // 2. 리뷰 목록 가져오기
    axios
      .get(`${backHost}/stores/reviews/${storeId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("리뷰 로드 실패", err));
  }, [storeId, backHost, navigate]);

  return (
    <div className={styles.container}>
      {/* 상단 헤더: 뒤로가기 + 매장명 */}
      <div className={styles.header}>
        <ArrowBackIcon
          onClick={() => navigate(-1)}
          className={styles.back_btn}
        />
        <h2>
          {storeName} 리뷰 ({reviews.length})
        </h2>
      </div>

      <div className={styles.review_list}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.orderId} className={styles.review_card}>
              <div className={styles.card_top}>
                <div className={styles.user_info}>
                  <div className={styles.avatar}>
                    <img
                      src={
                        review.memberProfile
                          ? `${backHost}${review.memberProfile}`
                          : "/img/default-user.png"
                      }
                      alt="u"
                    />
                  </div>
                  <div className={styles.user_text}>
                    <span className={styles.user_id}>{review.memberId}</span>
                    <span className={styles.date}>{review.reviewDate}</span>
                  </div>
                </div>
                <div className={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={
                        i < review.reviewRating
                          ? styles.star_active
                          : styles.star_inactive
                      }
                    />
                  ))}
                </div>
              </div>

              <div className={styles.card_body}>
                <p className={styles.menu_name}>
                  🍴 주문메뉴: {review.menuName}
                </p>
                <div className={styles.content_wrap}>
                  {review.reviewThumb && (
                    <img
                      src={
                        review.reviewThumb
                          ? review.reviewThumb.startsWith("/")
                            ? `${backHost}${review.reviewThumb}`
                            : `${backHost}/uploads/review/${review.reviewThumb}`
                          : "/img/no-image.png"
                      }
                      alt="리뷰사진"
                      className={styles.review_img}
                      onError={(e) => {
                        e.target.src = "/img/no-image.png";
                      }}
                    />
                  )}
                  <p className={styles.text}>{review.reviewContent}</p>
                </div>
              </div>

              {/* 사장님 답글 영역 */}
              {review.reviewCommentContent && (
                <div className={styles.reply_box}>
                  <p className={styles.reply_owner}>👨‍🍳 사장님 답글</p>
                  <p className={styles.reply_text}>
                    {review.reviewCommentContent}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.empty}>아직 작성된 리뷰가 없습니다. 🌱</div>
        )}
      </div>
    </div>
  );
}
