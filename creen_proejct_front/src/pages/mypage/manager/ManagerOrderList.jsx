import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ManagerOrderList.module.css";
import Swal from "sweetalert2";

const ManagerOrderList = () => {
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 사장님의 storeId를 가져옴 (로그인 로직에 맞게 수정 필요)
  const storeId = localStorage.getItem("storeId") || 1; // 임시 기본값 1

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

  // 🌟 [수정] 주문 상태 변경 함수 (deliveryType을 받아서 픽업/배달 분기 처리)
  const updateOrderStatus = (orderId, currentStatus, deliveryType) => {
    const nextStatus = currentStatus + 1;
    const isPickup = deliveryType === 1; // 1이면 픽업
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
            fetchStoreOrders(); // 상태 변경 후 목록 새로고침
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
              status: 9, // 취소 상태
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

  return (
    <div className={styles.page}>
      <div className={styles.headerArea}>
        <h2 className={styles.pageTitle}>📦 매장 주문 관리</h2>
        <button className={styles.refreshBtn} onClick={fetchStoreOrders}>
          새로고침 🔄
        </button>
      </div>

      <div className={styles.orderListWrap}>
        {isLoading ? (
          <p className={styles.loadingText}>주문을 불러오는 중입니다...</p>
        ) : sortedOrders.length > 0 ? (
          sortedOrders.map((order) => {
            const isCompleted = order.orderStatus === 5;
            const isCanceled = order.orderStatus === 9;
            const isNewOrder = order.orderStatus === 1;

            return (
              <div
                key={`store-order-${order.orderId}`}
                className={`${styles.orderCard} ${isNewOrder ? styles.newOrder : ""}`}
              >
                <div className={styles.orderHeader}>
                  <div className={styles.headerLeft}>
                    <span className={styles.orderNo}>
                      주문번호 #{order.orderId}
                    </span>
                    {isNewOrder && <span className={styles.newBadge}>NEW</span>}
                  </div>
                  <span className={styles.orderDate}>{order.orderDate}</span>
                </div>

                <div className={styles.orderBody}>
                  <div className={styles.menuInfo}>
                    <h3 className={styles.menuName}>
                      {order.menuName}{" "}
                      {order.extraCount > 0 && `외 ${order.extraCount}건`}
                    </h3>
                    <p className={styles.price}>
                      결제금액:{" "}
                      <strong>
                        {Number(order.totalPrice).toLocaleString()}원
                      </strong>
                    </p>
                  </div>

                  <div className={styles.deliveryInfo}>
                    <p>
                      <strong>배달 방식:</strong>{" "}
                      {order.deliveryType === 1
                        ? "픽업"
                        : order.deliveryType === 2
                          ? "도보/자전거"
                          : "오토바이"}
                    </p>
                    <p className={styles.address}>
                      <strong>주소:</strong>{" "}
                      {order.deliveryAddress || "주소 정보 없음"}
                    </p>
                  </div>
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.statusDisplay}>
                    상태:{" "}
                    <span
                      className={`${styles.statusBadge} ${styles[`status_${order.orderStatus}`]}`}
                    >
                      {/* 🌟 [수정] 상태 텍스트에 deliveryType 전달 */}
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
                          /* 🌟 [수정] 상태 변경 함수에 deliveryType 전달 */
                          updateOrderStatus(
                            order.orderId,
                            order.orderStatus,
                            order.deliveryType,
                          )
                        }
                      >
                        {/* 🌟 [수정] 버튼 텍스트에 deliveryType 전달 */}
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
    </div>
  );
};

export default ManagerOrderList;

// 🌟 [수정] 상태 맵핑: 픽업(1)일 경우 4번과 5번의 텍스트가 바뀜
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

// 🌟 [수정] 버튼 텍스트: 픽업(1)일 경우 다음 액션 텍스트가 바뀜
const getActionText = (status, deliveryType) => {
  const isPickup = deliveryType === 1;
  const map = {
    1: "주문 수락하기",
    2: "조리 시작하기",
    3: isPickup ? "픽업 준비 완료하기" : "배달 출발하기", // 조리중일 때 누를 버튼
    4: isPickup ? "픽업 완료처리" : "배달 완료처리", // 픽업대기/배달중일 때 누를 버튼
  };
  return map[status] || "";
};
