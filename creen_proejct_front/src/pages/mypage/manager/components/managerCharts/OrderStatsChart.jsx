import Chart from "react-apexcharts";
import styles from "./managerChart.module.css";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNavigate } from "react-router-dom";

const OrderStatsChart = ({ data }) => {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return (
      <div className={styles.noData}>당월 주문 데이터가 존재하지 않습니다.</div>
    );
  }

  const series = data.map((item) => item.percent || 0);
  const labels = data.map((item) => {
    if (item.deliveryType === 1) return "포장";
    if (item.deliveryType === 2) return "도보 & 자전거";
    if (item.deliveryType === 3) return "오토바이";
    return "기타";
  });

  const chartColors = data.map((item) => {
    if (item.deliveryType === 1) return "#2ecc71"; // var(--color-brand) 대용
    if (item.deliveryType === 2) return "#3498db";
    return "#95a5a6";
  });

  const totalAmount = data.reduce(
    (sum, item) => sum + (item.seriesAmount || 0),
    0,
  );
  const totalOrderCount = data.reduce(
    (sum, item) => sum + (item.orderCount || 0),
    0,
  );

  const options = {
    chart: { type: "donut" },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "총 매출",
              formatter: () => totalAmount.toLocaleString() + "원",
            },
          },
        },
      },
    },
    colors: chartColors,
    labels: labels,
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (val, opts) => {
          const original = data[opts.seriesIndex];
          return `${(original.seriesAmount || 0).toLocaleString()}원 (${original.orderCount || 0}건)`;
        },
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>주문 통계</h3>
        <button
          className={styles.viewMoreBtn}
          onClick={() => navigate("/mypage/manager/orders")}
        >
          View more{" "}
          <OpenInNewIcon style={{ fontSize: "1rem", marginLeft: "4px" }} />
        </button>
      </div>

      <div className={styles.mainValue}>
        <span>{totalAmount.toLocaleString()}원</span>
        <span
          className={styles.changePercent}
          style={{ backgroundColor: "#f0f0f0", color: "#666" }}
        >
          총 {totalOrderCount}건
        </span>
      </div>

      <Chart options={options} series={series} type="donut" height={350} />
    </div>
  );
};

export default OrderStatsChart;
