import { useEffect, useRef, useState } from "react";
import styles from "./StoreDetail.module.css";

// db로 처리할 내용
const STORE_INFO = {
  name: "포시즌 파스타",
  address: "서울특별시 양천구 화곡로13길 19 2층 201호 (신월동)",
  hours: [
    { day: "화요일", time: "24시간 운영" },
    { day: "수요일", time: "24시간 운영" },
    { day: "목요일", time: "24시간 운영" },
  ],
  holiday: "연중무휴",
  phone: "050-6271-5057",
  lat: 37.497952,
  lng: 127.027619,
  description:
    "저희 매장은 직접 이태리 본사에서 공수받은 면으로 제조하여 더욱 풍미있고 식감이 좋은 완벽한 파스타를 추구합니다. 집에서도 레스토랑 같은 파스타를 즐기실 수 있도록 정성을 다하겠습니다.",
  business: {
    ceo: "박성신",
    bizName: "포시즌 파스타",
    bizAddress: "서울특별시 양천구 신월동 22-19 2층 201호(신월동)",
    bizNumber: "404-27-20812",
  },
  origin:
    "쌀(국내산), 파스타면(이탈리아), 마늘(국내산), 고춧가루(중국산), 꽃삼겹(칠레산:아그로수퍼), 오징어링(포클랜드)...",
};

export default function StoreDetail() {
  const mapElement = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const checkNaver = setInterval(() => {
      if (window.naver && window.naver.maps && mapElement.current) {
        setMapLoaded(true);
        clearInterval(checkNaver);
      }
    }, 100);
    return () => clearInterval(checkNaver);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapElement.current) return;
    const { naver } = window;
    const location = new naver.maps.LatLng(STORE_INFO.lat, STORE_INFO.lng);
    try {
      const map = new naver.maps.Map(mapElement.current, {
        center: location,
        zoom: 17,
        zoomControl: true,
        minZoom: 10,
      });
      new naver.maps.Marker({
        position: location,
        map,
        icon: {
          content: `<div style="
            background:#1a1a2e;
            color:#fff;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            width:40px; height:40px;
            display:flex; align-items:center; justify-content:center;
            font-size:18px; box-shadow:0 2px 8px rgba(0,0,0,0.3);
          "><span style="transform:rotate(45deg)">🍽️</span></div>`,
          size: new naver.maps.Size(40, 40),
          anchor: new naver.maps.Point(20, 40),
        },
      });
    } catch (e) {
      console.error("지도 생성 중 에러:", e);
    }
  }, [mapLoaded]);

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>매장정보</h2>

      {/* 지도 */}
      <div className={styles.mapWrapper}>
        {!mapLoaded && (
          <div className={styles.mapLoading}>지도를 불러오는 중입니다...</div>
        )}
        <div ref={mapElement} className={styles.map} />
      </div>

      {/* 매장 기본 정보 */}
      <section className={styles.section}>
        <h3 className={styles.storeName}>{STORE_INFO.name}</h3>
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <th>상호명</th>
              <td>{STORE_INFO.name}</td>
            </tr>
            <tr>
              <th>주소</th>
              <td>{STORE_INFO.address}</td>
            </tr>
            <tr>
              <th>운영시간</th>
              <td>
                {STORE_INFO.hours.map((h) => (
                  <div key={h.day}>
                    {h.day} - {h.time}
                  </div>
                ))}
              </td>
            </tr>
            <tr>
              <th>휴무일</th>
              <td>{STORE_INFO.holiday}</td>
            </tr>
            <tr>
              <th>전화번호</th>
              <td>{STORE_INFO.phone}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 매장 소개 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>매장 소개</h3>
        <p className={styles.description}>{STORE_INFO.description}</p>
      </section>

      {/* 사업자 정보 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>사업자 정보</h3>
        <table className={styles.infoTable}>
          <tbody>
            <tr>
              <th>대표자명</th>
              <td>{STORE_INFO.business.ceo}</td>
            </tr>
            <tr>
              <th>상호명</th>
              <td>{STORE_INFO.business.bizName}</td>
            </tr>
            <tr>
              <th>사업자 주소</th>
              <td>{STORE_INFO.business.bizAddress}</td>
            </tr>
            <tr>
              <th>사업자등록번호</th>
              <td>{STORE_INFO.business.bizNumber}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 원산지 표기 */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>원산지 표기</h3>
        <p className={styles.description}>{STORE_INFO.origin}</p>
      </section>
    </div>
  );
}
