import styles from "./ManagerDashboard.module.css";
import { useState, useEffect } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  // [데이터 연동 포인트] 나중에 DB에서 가져올 데이터를 담을 상태
  // useEffect(() => {
  //   axios.get('/api/manager/dashboard')
  //     .then(res => setDashboardData(res.data))
  //     .catch(err => console.error("데이터 로딩 실패:", err));
  // }, []);

  // 1. 상단 요약 수치 (금액, 건수)
  const [totalStats, setTotalStats] = useState({
    sales: "1,178,909",
    reviews: 140,
  });
  // 2. 배달 방식에 따른 매출액(원) + 배달방식 비중(%)
  const [salesData, setSalesData] = useState([
    { name: "포장", value: 20, amount: "235,781", fill: "#FFBB28" },
    { name: "도보 & 자전거", value: 55, amount: "648,400", fill: "#2E7D32" },
    { name: "오토바이", value: 25, amount: "294,728", fill: "#0088FE" },
  ]);

  // 3. 별점에 따른 리뷰개수(건) + 비중(%)
  const [reviewData, setReviewData] = useState([
    { name: "1점", value: 5, count: 7, fill: "#E0E0E0" },
    { name: "2점", value: 5, count: 7, fill: "#FFBB28" },
    { name: "3점", value: 20, count: 28, fill: "#0088FE" },
    { name: "4점", value: 30, count: 42, fill: "#2E7D32" },
    { name: "5점", value: 40, count: 56, fill: "#cf5610" },
  ]);

  return (
    <div className={styles.managerContainer}>
      {/* 상단 탭 메뉴: 대시보드 / 회원 문의 내역 */}
      <div className={styles.tabWrapper}>
        <div className={styles.tabContainer}>
          <div
            className={`${styles.slideIndicator} ${activeTab === "inquiry" ? styles.right : styles.left}`}
          ></div>
          <button
            className={`${styles.tabButton} ${activeTab === "dashboard" ? styles.activeText : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <span className={styles.tabIcon}></span> 대시보드
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "inquiry" ? styles.activeText : ""}`}
            onClick={() => setActiveTab("inquiry")}
          >
            <span className={styles.tabIcon}></span> 회원 문의 내역
          </button>
        </div>
      </div>

      {activeTab === "dashboard" ? (
        /* --- 대시보드 뷰 --- */
        <div className={styles.contentGrid}>
          {/* 1. 주문 통계 카드 */}
          <section className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <span>주문 통계</span>
              <button className={styles.viewMore}>View more ↗</button>
            </div>
            <div className={styles.mainValue}>1,178,909원</div>

            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={salesData}
                    innerRadius={65} // 기존 도넛 형태 유지를 위해 숫자 그대로 사용
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  ></Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.chartCenterLabel}>
                <p>당월 주문 금액</p>
                <strong>1,178,909원</strong>
              </div>
            </div>

            <div className={styles.deliveryProgressSection}>
              <p className={styles.sectionTitle}>배달 경로</p>
              {salesData.map((item) => (
                <div key={item.name} className={styles.progressRow}>
                  <span className={styles.label}>{item.name}</span>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.fill,
                      }}
                    ></div>
                  </div>
                  <span className={styles.percent}>{item.value}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* 2. 리뷰 통계 카드 */}
          <section className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <span>리뷰 통계</span>
              <button className={styles.viewMore}>View more ↗</button>
            </div>
            <div className={styles.mainValue}>140건</div>
            <p className={styles.trendText}>▲ 4.5% 지난 주보다</p>

            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={200} minHeight={200}>
                <PieChart>
                  <Pie
                    data={reviewData}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius="70%"
                    outerRadius="100%"
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  ></Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className={styles.reviewCenterLabel}>
                <p>리뷰 개수</p>
                <strong>140건</strong>
              </div>
            </div>

            <div className={styles.legendGrid}>
              {reviewData.map((item) => (
                <div key={item.name} className={styles.legendItem}>
                  <span
                    className={styles.statusDot}
                    style={{ backgroundColor: item.fill }}
                  ></span>
                  <span className={styles.legendName}>{item.name}</span>
                  <span className={styles.legendPercent}>{item.value}%</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* --- 회원 문의 내역 뷰 --- */
        <div className={styles.inquiryWrapper}>
          <h2 className={styles.inquiryTitle}>회원 문의 내역</h2>
          {/* [데이터 연동 포인트] axios로 가져온 문의 리스트 매핑 영역 */}
          <div className={styles.emptyState}>
            <p>현재 등록된 문의 내역이 없습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}
