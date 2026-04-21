import Chart from "react-apexcharts";
import styles from "./managerChart.module.css";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNavigate } from "react-router-dom";

const ReviewStatsChart = ({ data }) => {
  const navigate = useNavigate();

  if (!data || !data.series) {
    return <div className={styles.noData}>리뷰 데이터를 불러오는 중...</div>;
  }

  const options = {
    chart: { type: "donut" },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "평균 별점",
              formatter: () => (data.avgRating || 0).toFixed(1) + "점",
            },
          },
        },
      },
    },
    colors: ["#2ecc71", "#81c784", "#ffb300", "#ff8a65", "#e57373"],
    labels: ["5점", "4점", "3점", "2점", "1점"],
    legend: { show: false },
    tooltip: { y: { formatter: (val) => `${val}%` } },
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>리뷰 통계</h3>
        <button
          className={styles.viewMoreBtn}
          onClick={() => navigate("/mypage/manager/reviews")}
        >
          View more{" "}
          <OpenInNewIcon style={{ fontSize: "1rem", marginLeft: "4px" }} />
        </button>
      </div>

      <div className={styles.mainValue}>
        {(data.avgRating || 0).toFixed(1)}점
        <span className={styles.changePercent}>총 {data.totalCount}건</span>
        {data.changePercent > 0 && (
          <span className={styles.changePercent} style={{ marginLeft: "auto" }}>
            ↑ {data.changePercent}% 대비
          </span>
        )}
      </div>

      <Chart options={options} series={data.series} type="donut" height={220} />

      <div className={styles.legendContainer}>
        {options.labels.map((label, index) => (
          <div key={label} className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: options.colors[index] }}
            ></span>
            <span className={styles.legendLabel}>{label}</span>
            <span className={styles.legendValue}>
              {data.series[index] || 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewStatsChart;
