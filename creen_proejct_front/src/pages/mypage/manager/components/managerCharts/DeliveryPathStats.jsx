import React from "react";
import styles from "./managerChart.module.css";

const DeliveryPathStats = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className={styles.noData}>데이터가 없습니다.</div>;
  }

  return (
    <div className={styles.pathWrap}>
      <div className={styles.list}>
        {data.map((item) => (
          <div className={styles.item} key={item.deliveryType}>
            <div className={styles.info}>
              <span className={styles.label}>
                {item.label}
                <span
                  style={{ fontSize: "12px", color: "#888", marginLeft: "5px" }}
                >
                  ({item.orderCount || 0}건)
                </span>
              </span>
              <span className={styles.percent}>{item.percent}%</span>
            </div>

            <div className={styles.barContainer}>
              <div className={styles.barBg}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${item.percent}%`,
                    backgroundColor:
                      item.deliveryType === 1
                        ? "#e67e22" // 포인트 컬러
                        : item.deliveryType === 2
                          ? "#2ecc71" // 브랜드 컬러
                          : "#3498db", // 정보 컬러
                  }}
                />
              </div>

              {/* 🌟 통합 툴팁 클래스 적용 */}
              <div className={styles.valueTooltip}>
                {(item.seriesAmount || 0).toLocaleString()}원 (
                {item.orderCount || 0}건)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPathStats;
