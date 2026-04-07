import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ManagerOrderList.module.css";
import Swal from "sweetalert2";

const ManagerOrderList = () => {
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 [추가] 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지에 보여줄 주문 개수

  const storeId = localStorage.getItem("storeId") || 1;

  const fetchStoreOrders = () => {
    if (!storeId) return;
    setIsLoading(true);

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/stores/owner/orders/${storeId}`)
      .then((res) => {
        setOrderList(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("주문 내역 불러오기 실패:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchStoreOrders();
  }, [storeId]);

  const updateOrderStatus = (orderId, currentStatus, deliveryType) => {
    const nextStatus = currentStatus + 1;
    const isPickup = deliveryType === 1;
    let confirmMsg = "";

    if (currentStatus === 1) confirmMsg = "주문을 접수하시겠습니까?";
    else if (currentStatus === 2) confirmMsg = "조리를 시작하시겠습니까?";
    else if (currentStatus === 3) {
      confirmMsg = isPickup
        ? "조리를 완료하고 픽업 대기 상태로 변경하시겠습니까?"
        : "배달을 출발시키겠습니까?";
    } else if (currentStatus === 4) {
      confirmMsg = isPickup
        ? "고객이 상품을 수령하여 픽업 완료 처리하시겠습니까?"
        : "배달 완료 처리하시겠습니까?";
    } else return;

    Swal.fire({
      title: "상태 변경",
      text: confirmMsg,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `${import.meta.env.VITE_BACKSERVER}/stores/order/${orderId}/status`,
            {
              status: nextStatus,
            },
          )
          .then(() => {
            Swal.fire("완료", "주문 상태가 변경되었습니다.", "success");
            fetchStoreOrders();
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("오류", "상태 변경에 실패했습니다.", "error");
          });
      }
    });
  };

  const cancelOrder = (orderId) => {
    Swal.fire({
      title: "주문 취소",
      text: "정말 이 주문을 취소(거절)하시겠습니까?",
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
            {
              status: 9,
            },
          )
          .then(() => {
            Swal.fire("취소 완료", "주문이 취소되었습니다.", "success");
            fetchStoreOrders();
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("오류", "주문 취소에 실패했습니다.", "error");
          });
      }
    });
  };

  const sortedOrders = [...orderList].sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
  );

  // 🌟 [추가] 현재 페이지 주문 계산 로직
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const currentOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className={styles.page}>
      <div className={styles.headerArea}>
        <h2 className={styles.pageTitle}>📦 매장 주문 관리</h2>
        <button
          className={styles.refreshBtn}
          onClick={() => {
            fetchStoreOrders();
            setCurrentPage(1); // 새로고침 시 1페이지로
          }}
        >
          새로고침 🔄
        </button>
      </div>

      <div className={styles.orderListWrap}>
        {isLoading ? (
          <p className={styles.loadingText}>주문을 불러오는 중입니다...</p>
        ) : currentOrders.length > 0 ? (
          currentOrders.map((order) => {
            const isCompleted = order.orderStatus === 5;
            const isCanceled = order.orderStatus === 9;
            const isNewOrder = order.orderStatus === 1;

            return (
              <div
                key={`store-order-${order.orderId}`}
                className={`${styles.orderCard} ${isNewOrder ? styles.newOrder : ""} ${isCanceled ? styles.canceledCard : ""}`}
              >
                {isCanceled && (
                  <div className={styles.canceledWatermark}>취소된 주문</div>
                )}

                <div className={styles.orderHeader}>
                  <div className={styles.headerLeft}>
                    <span
                      className={`${styles.orderNo} ${isCanceled ? styles.strikeThrough : ""}`}
                    >
                      주문번호 #{order.orderId}
                    </span>
                    {isNewOrder && !isCanceled && (
                      <span className={styles.newBadge}>NEW</span>
                    )}
                  </div>
                  <span className={styles.orderDate}>{order.orderDate}</span>
                </div>

                <div className={styles.orderBody}>
                  <div className={styles.menuInfo}>
                    <h3
                      className={`${styles.menuName} ${isCanceled ? styles.strikeThrough : ""}`}
                    >
                      {order.menuName}{" "}
                      {order.extraCount > 0 && `외 ${order.extraCount}건`}
                    </h3>
                    <p className={styles.price}>
                      결제금액:{" "}
                      <strong
                        className={isCanceled ? styles.strikeThrough : ""}
                      >
                        {isCanceled
                          ? "0"
                          : Number(order.totalPrice).toLocaleString()}
                        원
                      </strong>
                    </p>
                  </div>

                  <div className={styles.deliveryInfo}>
                    <p className={isCanceled ? styles.strikeThrough : ""}>
                      <strong>배달 방식:</strong>{" "}
                      {order.deliveryType === 1
                        ? "픽업"
                        : order.deliveryType === 2
                          ? "도보/자전거"
                          : "오토바이"}
                    </p>
                    <p
                      className={`${styles.address} ${isCanceled ? styles.strikeThrough : ""}`}
                    >
                      <strong>주소:</strong>{" "}
                      {order.deliveryAddress || "주소 정보 없음"}
                    </p>
                  </div>
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.statusDisplay}>
                    상태:{" "}
                    <span
                      className={`${styles.statusBadge} ${isCanceled ? styles.canceledBadge : styles[`status_${order.orderStatus}`]}`}
                    >
                      {getOrderStatusText(
                        order.orderStatus,
                        order.deliveryType,
                      )}
                    </span>
                  </div>

                  <div className={styles.actionButtons}>
                    {order.orderStatus >= 1 && order.orderStatus < 5 && (
                      <button
                        className={styles.nextStepBtn}
                        onClick={() =>
                          updateOrderStatus(
                            order.orderId,
                            order.orderStatus,
                            order.deliveryType,
                          )
                        }
                      >
                        {getActionText(order.orderStatus, order.deliveryType)}
                      </button>
                    )}

                    {order.orderStatus === 1 && (
                      <button
                        className={styles.cancelBtn}
                        onClick={() => cancelOrder(order.orderId)}
                      >
                        주문 거절
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyMsg}>현재 들어온 주문이 없습니다.</div>
        )}
      </div>

      {/* 🌟 [추가] 페이지네이션 UI */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={styles.pageBtn}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerOrderList;

const getOrderStatusText = (status, deliveryType) => {
  const isPickup = deliveryType === 1;
  const map = {
    0: "결제대기",
    1: "접수대기",
    2: "주문접수",
    3: "조리중",
    4: isPickup ? "픽업대기" : "배달중",
    5: isPickup ? "픽업완료" : "배달완료",
    9: "주문취소",
  };
  return map[status] || "확인중";
};

const getActionText = (status, deliveryType) => {
  const isPickup = deliveryType === 1;
  const map = {
    1: "주문 수락하기",
    2: "조리 시작하기",
    3: isPickup ? "픽업 준비 완료하기" : "배달 출발하기",
    4: isPickup ? "픽업 완료처리" : "배달 완료처리",
  };
  return map[status] || "";
};
