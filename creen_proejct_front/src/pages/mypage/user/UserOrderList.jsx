import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "./UserOrderList.module.css";
import ReviewModal from "../../../components/layout/ReviewModal";

const UserOrderListPage = () => {
  const [orderList, setOrderList] = useState([]);
  const memberId = localStorage.getItem("memberId");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 날짜 필터링 상태 (기본값: 빈 문자열)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchOrders = () => {
    if (!memberId) return;
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/stores/orders/${memberId}`)
      .then((res) => {
        setOrderList(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("주문 내역 불러오기 실패:", err);
        setOrderList([]);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [memberId]);

  // 날짜 필터링 + 최신순 정렬
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orderList];

    if (startDate) {
      filtered = filtered.filter(
        (order) => new Date(order.orderDate) >= new Date(startDate),
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((order) => new Date(order.orderDate) <= end);
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
    );
  }, [orderList, startDate, endDate]);

  const totalRecentCarbon = useMemo(() => {
    return filteredAndSortedOrders
      .slice(0, 5)
      .reduce((sum, order) => sum + Number(order.getPoint ?? 0), 0);
  }, [filteredAndSortedOrders]);

  const openReviewModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const resetFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.topSummary}>
        <p className={styles.summaryLabel}>총 탄소 절감량</p>
        <h2 className={styles.summaryValue}>
          {totalRecentCarbon.toFixed(1)} g CO2
        </h2>
        <p className={styles.summaryDesc}>
          목록 상단 5건의 주문으로 절감한 탄소량 입니다 🌱
        </p>
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.dateInputs}>
          <input
            type="date"
            className={styles.dateInput}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className={styles.dateSeparator}>~</span>
          <input
            type="date"
            className={styles.dateInput}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button className={styles.resetBtn} onClick={resetFilter}>
          초기화
        </button>
      </div>

      <div className={styles.orderListWrap}>
        {filteredAndSortedOrders.length > 0 ? (
          filteredAndSortedOrders.map((order, index) => {
            const isDelivered = order.orderStatus === 5;
            const isNotReviewed = Number(order.reviewStatus) === 0;
            const isAlreadyReviewed = Number(order.reviewStatus) === 1;

            // 🌟 [추가] 3일 이내 작성 여부 계산 로직
            const orderDateObj = new Date(order.orderDate);
            const now = new Date();
            // 시간 차이를 일(day) 단위로 변환
            const diffDays =
              (now.getTime() - orderDateObj.getTime()) / (1000 * 60 * 60 * 24);
            const isWithin3Days = diffDays <= 3;

            const itemKey = order.orderId
              ? `order-${order.orderId}`
              : `idx-${index}`;

            return (
              <div key={itemKey} className={styles.orderCard}>
                <div className={styles.orderTop}>
                  <div className={styles.leftInfo}>
                    <img
                      src={order.menuImage || "/img/no-image.png"}
                      alt={order.menuName || "메뉴"}
                      className={styles.menuThumb}
                    />
                    <div className={styles.mainInfo}>
                      <h3 className={styles.storeName}>{order.storeName}</h3>
                      <p className={styles.menuName}>{order.menuName}</p>
                      <p className={styles.orderNo}>
                        주문 번호 {order.orderId}
                      </p>
                    </div>
                  </div>

                  <div className={styles.rightInfo}>
                    <span className={styles.statusBadge}>
                      {getOrderStatusText(order.orderStatus)}
                    </span>

                    {/* 🌟 [수정] 배달완료 + 3일 이내 조건 적용 */}
                    {isDelivered &&
                      (isAlreadyReviewed ? (
                        <button className={styles.reviewBtnDisabled} disabled>
                          작성 완료
                        </button>
                      ) : isNotReviewed && isWithin3Days ? (
                        <button
                          className={styles.reviewBtn}
                          onClick={() => openReviewModal(order)}
                        >
                          리뷰 작성 (3일 이내)
                        </button>
                      ) : (
                        <button className={styles.reviewBtnDisabled} disabled>
                          작성 기한 만료
                        </button>
                      ))}
                  </div>
                </div>

                <div className={styles.orderMiddle}>
                  <div className={styles.infoBlock}>
                    <p className={styles.infoTitle}>주문 정보</p>
                    <p>
                      {order.totalCount}개 |{" "}
                      {Number(order.totalPrice ?? 0).toLocaleString()}원
                    </p>
                  </div>
                  <div className={styles.infoBlock}>
                    <p className={styles.infoTitle}>주문 날짜</p>
                    <p>{formatDate(order.orderDate)}</p>
                  </div>
                  <div className={styles.infoBlock}>
                    <p className={styles.infoTitle}>매장 위치</p>
                    <p className={styles.addressText}>
                      {order.storeAddress || "정보 없음"}
                    </p>
                  </div>
                  <div className={styles.infoBlock}>
                    <p className={styles.infoTitle}>배달 주소</p>
                    <p className={styles.addressText}>
                      {order.deliveryAddress}
                    </p>
                  </div>
                </div>

                <div className={styles.carbonBox}>
                  <div className={styles.carbonText}>
                    <p className={styles.carbonLabel}>
                      이 주문으로 절감한 탄소량
                    </p>
                    <p className={styles.carbonDesc}>
                      친환경 포장재 및 로컬 배송
                    </p>
                  </div>
                  <div className={styles.carbonValueWrap}>
                    <strong className={styles.carbonValue}>
                      {Number(order.getPoint ?? 0).toFixed(1)} g
                    </strong>
                    <span>CO2</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyMsg}>
            해당 기간에 주문 내역이 없습니다.
          </div>
        )}
      </div>

      {isModalOpen && selectedOrder && (
        <ReviewModal
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
};

export default UserOrderListPage;

const getOrderStatusText = (status) => {
  const statusMap = {
    0: "결제대기",
    1: "접수대기",
    2: "주문접수",
    3: "조리중",
    4: "배달중",
    5: "배달완료",
    9: "주문취소",
  };
  return statusMap[status] || "확인중";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
