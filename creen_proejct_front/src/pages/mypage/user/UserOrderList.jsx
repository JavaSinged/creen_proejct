import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "./UserOrderList.module.css";
import ReviewModal from "../../../components/layout/ReviewModal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// 🌟 [수정 컴포넌트] 남은 시간 + 예상 도착 시각 표시
const OrderTimer = ({ order }) => {
  const [remainingText, setRemainingText] = useState("");
  const [targetTimeText, setTargetTimeText] = useState("");

  useEffect(() => {
    // 2: 주문수락, 3: 조리중, 4: 배달중/픽업대기 일 때만 작동
    const activeStatuses = [2, 3, 4];
    if (
      !activeStatuses.includes(order.orderStatus) ||
      !order.confirmDate ||
      !order.expectedTime
    ) {
      setRemainingText("");
      setTargetTimeText("");
      return;
    }

    // 1. 예상 도착 시각 계산 (수락 시각 + 예상 시간)
    const targetDate = new Date(order.confirmDate.replace(" ", "T"));
    targetDate.setMinutes(targetDate.getMinutes() + Number(order.expectedTime));

    const hh = String(targetDate.getHours()).padStart(2, "0");
    const mm = String(targetDate.getMinutes()).padStart(2, "0");
    setTargetTimeText(`${hh}:${mm}`); // 예: 14:30

    // 2. 카운트다운 타이머 실행
    const updateTimer = () => {
      const now = new Date();
      const diffMs = targetDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        setRemainingText(
          order.deliveryType === 1 ? "도착 완료! 🏃‍♂️" : "곧 도착합니다! 🛵",
        );
        return;
      }

      const diffMins = Math.floor(diffMs / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      setRemainingText(`${diffMins}분 ${diffSecs}초 남음`);
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [order]);

  if (!targetTimeText && order.orderStatus !== 5) return null;

  return (
    <div className={styles.timerContainer}>
      {/* 진행 중일 때: 예상 도착 시각 + 남은 시간 */}
      {[2, 3, 4].includes(order.orderStatus) && (
        <>
          <div className={styles.targetTimeLabel}>
            {order.deliveryType === 1 ? "픽업 예정 " : "도착 예정 "}
            <strong>{targetTimeText}</strong>
          </div>
          <div className={styles.timerBadge}>
            <span className={styles.timerDot}></span>
            {remainingText}
          </div>
        </>
      )}

      {/* 완료 되었을 때: 실제 완료 시각 */}
      {order.orderStatus === 5 && order.completeDate && (
        <div className={styles.completeTimeLabel}>
          {order.deliveryType === 1 ? "픽업 완료 " : "배달 완료 "}
          <strong>{order.completeDate.split(" ")[1]}</strong>
        </div>
      )}
    </div>
  );
};

const UserOrderListPage = () => {
  const backHost = import.meta.env.VITE_BACKSERVER;
  const navigate = useNavigate();
  const [orderList, setOrderList] = useState([]);
  const memberId = localStorage.getItem("memberId");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const todayStr = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .split("T")[0];

  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [pageGroup, setPageGroup] = useState(0);
  const pageLimit = 5;

  const filteredList = useMemo(() => {
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
    if (searchKeyword) {
      filtered = filtered.filter((item) =>
        item.storeName?.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
    }
    return filtered;
  }, [orderList, startDate, endDate, searchKeyword]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const sortedList = useMemo(() => {
    return [...filteredList].sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
    );
  }, [filteredList]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedList.slice(indexOfFirstItem, indexOfLastItem);

  const startPage = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
  const endPage = Math.min(startPage + pageLimit - 1, totalPages);

  const handlePrevGroup = () => {
    if (pageGroup > 0) {
      setPageGroup(pageGroup - 1);
      setCurrentPage((pageGroup - 1) * pageLimit + 1);
    }
  };
  const handleNextGroup = () => {
    const maxGroup = Math.floor((totalPages - 1) / pageLimit);
    if (pageGroup < maxGroup) {
      setPageGroup(pageGroup + 1);
      setCurrentPage((pageGroup + 1) * pageLimit + 1);
    }
  };

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
    const intervalId = setInterval(fetchOrders, 5000);
    return () => clearInterval(intervalId);
  }, [memberId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    setPageGroup(0);
  }, [startDate, endDate, searchKeyword]);

  const cancelOrder = (orderId) => {
    Swal.fire({
      title: "주문 취소",
      text: "정말 주문을 취소하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "취소 확정",
      cancelButtonText: "돌아가기",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `${import.meta.env.VITE_BACKSERVER}/stores/order/${orderId}/status`,
            { status: 9 },
          )
          .then(() => {
            Swal.fire(
              "취소 완료",
              "주문이 정상적으로 취소되었습니다.",
              "success",
            );
            fetchOrders();
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("오류", "주문 취소에 실패했습니다.", "error");
          });
      }
    });
  };

  const totalRecentCarbon = useMemo(() => {
    return filteredList
      .slice(0, 5)
      .reduce((sum, order) => sum + Number(order.getPoint ?? 0), 0);
  }, [filteredList]);

  const openReviewModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const resetFilter = () => {
    setStartDate("");
    setEndDate("");
    setSearchKeyword("");
    setCurrentPage(1);
    setPageGroup(0);
  };

  const goToCheckoutPage = (order) => {
    const tossStyleOrderId = `ORDER_${order.orderId}_${new Date(order.orderDate).getTime()}`;
    const amount = order.totalPrice || 0;
    navigate(`/checkoutPage?orderId=${tossStyleOrderId}&amount=${amount}`);
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
            max={todayStr}
          />
          <span className={styles.dateSeparator}>~</span>
          <input
            type="date"
            className={styles.dateInput}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            max={todayStr}
          />
        </div>
        <button className={styles.resetBtn} onClick={resetFilter}>
          초기화
        </button>
      </div>

      <div className={styles.orderListWrap}>
        {currentOrders.length > 0 ? (
          currentOrders.map((order, index) => {
            const isCompleted = order.orderStatus === 5;
            const isCanceled = order.orderStatus === 9;
            const isNotReviewed = Number(order.reviewStatus) === 0;
            const isAlreadyReviewed = Number(order.reviewStatus) === 1;
            const orderDateObj = new Date(order.orderDate);
            const now = new Date();
            const diffDays =
              (now.getTime() - orderDateObj.getTime()) / (1000 * 60 * 60 * 24);
            const isWithin3Days = diffDays <= 3;
            const itemKey = order.orderId
              ? `order-${order.orderId}`
              : `idx-${index}`;

            return (
              <div
                key={itemKey}
                className={`${styles.orderCard} ${isCanceled ? styles.canceledCard : ""}`}
                onClick={() => goToCheckoutPage(order)}
                style={{ cursor: "pointer" }}
              >
                {isCanceled && (
                  <div className={styles.canceledWatermark}>취소된 주문</div>
                )}

                <div className={styles.orderTop}>
                  <div className={styles.leftInfo}>
                    <img
                      src={
                        order.storeThumb
                          ? `${backHost}/${order.storeThumb}`
                          : "/img/no-image.png"
                      }
                      alt={order.menuName || "메뉴"}
                      className={`${styles.menuThumb} ${isCanceled ? styles.canceledImg : ""}`}
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
                    {/* 🌟 [시간 타이머 및 시각 정보 표시] */}
                    <OrderTimer order={order} />

                    <span
                      className={`${styles.statusBadge} ${isCanceled ? styles.canceledBadge : ""}`}
                    >
                      {getOrderStatusText(
                        order.orderStatus,
                        order.deliveryType,
                      )}
                    </span>

                    {(order.orderStatus === 0 || order.orderStatus === 1) && (
                      <button
                        className={styles.cancelBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelOrder(order.orderId);
                        }}
                      >
                        주문 취소
                      </button>
                    )}

                    {isCompleted &&
                      (isAlreadyReviewed ? (
                        <button className={styles.reviewBtnDisabled} disabled>
                          작성 완료
                        </button>
                      ) : isNotReviewed && isWithin3Days ? (
                        <button
                          className={styles.reviewBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            openReviewModal(order);
                          }}
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
                    <p className={isCanceled ? styles.strikeThrough : ""}>
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
                    <p className={styles.infoTitle}>
                      {order.deliveryType === 1 ? "수령 방식" : "배달 주소"}
                    </p>
                    <p className={styles.addressText}>
                      {order.deliveryType === 1
                        ? "매장 방문 픽업"
                        : order.deliveryAddress}
                    </p>
                  </div>
                </div>

                <div className={styles.carbonBox}>
                  <div className={styles.carbonText}>
                    <p className={styles.carbonLabel}>
                      이 주문으로 절감한 탄소량
                    </p>
                    <p className={styles.carbonDesc}>
                      친환경 포장재 및 로컬 배송/픽업
                    </p>
                  </div>
                  <div className={styles.carbonValueWrap}>
                    <strong
                      className={`${styles.carbonValue} ${isCanceled ? styles.strikeThrough : ""}`}
                    >
                      {isCanceled
                        ? "0.0"
                        : Number(order.getPoint ?? 0).toFixed(1)}{" "}
                      g
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

      <div className={styles.pagination}>
        <button
          className={styles.page_btn_nav}
          onClick={handlePrevGroup}
          disabled={pageGroup === 0}
        >
          <ChevronLeftIcon fontSize="small" /> 이전
        </button>
        <div className={styles.page_numbers}>
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i,
          ).map((num) => (
            <div
              key={num}
              className={`${styles.page_num} ${currentPage === num ? styles.active : ""}`}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </div>
          ))}
        </div>
        <button
          className={styles.page_btn_nav}
          onClick={handleNextGroup}
          disabled={endPage === totalPages || totalPages === 0}
        >
          다음 <ChevronRightIcon fontSize="small" />
        </button>
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

const getOrderStatusText = (status, deliveryType) => {
  const isPickup = deliveryType === 1;
  const statusMap = {
    0: "결제대기",
    1: "접수대기",
    2: "주문접수",
    3: "조리중",
    4: isPickup ? "픽업대기" : "배달중",
    5: isPickup ? "픽업완료" : "배달완료",
    9: "주문취소",
  };
  return statusMap[status] || "확인중";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
