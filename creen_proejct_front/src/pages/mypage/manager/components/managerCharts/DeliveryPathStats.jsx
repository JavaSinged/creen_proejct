import React from "react";
import styles from "./managerChart.module.css";

const DeliveryPathStats = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className={styles.noData}>데이터가 존재하지 않습니다.</div>;
  }

  return (
    <div className={styles.deliveryPathStatsContainer}>
      {/* 타이틀 영역 */}
      <div className={styles.centeredSubTitleGroup}>
        <h3 className={styles.sectionSubTitle}>배달 경로</h3>
      </div>

      <div className={styles.deliveryPathList}>
        {data.map((item) => (
          <div className={styles.deliveryPathItem} key={item.deliveryType}>
            <div className={styles.pathInfo}>
              <span className={styles.pathLabel}>{item.label}</span>
              <span className={styles.pathPercent}>{item.percent}%</span>
            </div>

            {/* 프로그레스 바 (Progress Bar) 영역 */}
            <div className={styles.progressBarBg}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: `${item.percent}%`,
                  backgroundColor:
                    item.deliveryType === 1
                      ? "#ffb300"
                      : item.deliveryType === 2
                        ? "#2e8147"
                        : "#c0e0b0",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryPathStats;
