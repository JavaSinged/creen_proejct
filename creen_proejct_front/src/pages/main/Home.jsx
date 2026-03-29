import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import SearchIcon from "@mui/icons-material/Search";

// ✅ 임시 매장 데이터 (category는 categories의 name과 일치해야 함)
const STORE_DATA = [
  {
    id: 1,
    name: "한우마을",
    category: "한식",
    distance: "100m",
    time: "약 20분",
    rating: "98%",
    img: "/image/Rectangle 302.png",
  },
  {
    id: 2,
    name: "파스타하우스",
    category: "양식",
    distance: "200m",
    time: "약 25분",
    rating: "95%",
    img: "/image/Rectangle 302.png",
  },
  {
    id: 3,
    name: "차이나가든",
    category: "중식",
    distance: "350m",
    time: "약 30분",
    rating: "92%",
    img: "/image/Rectangle 302.png",
  },
  {
    id: 4,
    name: "스시로",
    category: "일식",
    distance: "150m",
    time: "약 20분",
    rating: "97%",
    img: "/image/Rectangle 302.png",
  },
  {
    id: 5,
    name: "피자피자",
    category: "피자",
    distance: "500m",
    time: "약 35분",
    rating: "90%",
    img: "/image/Rectangle 302.png",
  },
  {
    id: 6,
    name: "BBQ치킨",
    category: "치킨",
    distance: "250m",
    time: "약 25분",
    rating: "96%",
    img: "/image/Rectangle 302.png",
  },
  {
    id: 7,
    name: "그린샐러드",
    category: "샐러드",
    distance: "80m",
    time: "약 15분",
    rating: "94%",
    img: "/image/Rectangle 302.png",
  },
  {
    id: 8,
    name: "스타벅스",
    category: "커피/디저트",
    distance: "120m",
    time: "약 10분",
    rating: "93%",
    img: "/image/Rectangle 302.png",
  },
  {
    id: 9,
    name: "Noah's Bagels",
    category: "양식",
    distance: "300m",
    time: "약 30분",
    rating: "91%",
    img: "/image/Rectangle 302.png",
  },
  {
    id: 10,
    name: "명동칼국수",
    category: "한식",
    distance: "400m",
    time: "약 30분",
    rating: "89%",
    img: "/image/Rectangle 302.png",
  },
  {
    id: 11,
    name: "도미노피자",
    category: "피자",
    distance: "600m",
    time: "약 40분",
    rating: "88%",
    img: "/image/Rectangle 302.png",
  },
  {
    id: 12,
    name: "교촌치킨",
    category: "치킨",
    distance: "180m",
    time: "약 20분",
    rating: "97%",
    img: "/image/Rectangle 302.png",
  },
];

const banners = [
  {
    title: "같이 효율적으로 소비하는 플랫폼",
    img: "/image/banner/banner1.png",
  },
  { title: "example1", img: "/image/banner/banner2.png" },
];

const categories = [
  { name: "인기맛집", img: "/image/category/bestFood.png" },
  { name: "한식", img: "/image/category/Kfood.png" },
  { name: "양식", img: "/image/category/wsFood.png" },
  { name: "중식", img: "/image/category/chFood.png" },
  { name: "일식", img: "/image/category/susi.png" },
  { name: "피자", img: "/image/category/pizza.png" },
  { name: "치킨", img: "/image/category/chicken.png" },
  { name: "샐러드", img: "/image/category/salad.png" },
  { name: "커피/디저트", img: "/image/category/dessert.png" },
];

export default function Home() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("인기맛집");
  const [searchTerm, setSearchTerm] = useState("");

  // StoreView와 동일한 필터링 로직
  const filteredStores = STORE_DATA.filter((store) => {
    // "인기맛집" 선택 시 전체 표시
    const isCategoryMatch =
      selectedCategory === "인기맛집" || store.category === selectedCategory;

    const isSearchMatch = store.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return isCategoryMatch && isSearchMatch;
  });

  return (
    <div className={styles.page_container}>
      {/* 1. 배너 */}
      <div className={styles.banner_wrap}>
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{ delay: 10000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination, Navigation]}
          className={styles.mySwiper}
        >
          {banners.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div
                className={styles.banner_slide}
                style={{ backgroundImage: `url(${item.img})` }}
              >
                <div className={styles.banner_text_box}>
                  <h3 className={styles.banner_title}>{item.title}</h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={styles.content_wrap}>
        {/* 2. 카테고리 바 */}
        <div className={styles.category_wrap}>
          {categories.map((item) => (
            <div
              key={item.name}
              // ✅ 선택된 카테고리에 active 클래스 부여
              className={`${styles.category_item} ${
                selectedCategory === item.name ? styles.active : ""
              }`}
              onClick={() => setSelectedCategory(item.name)}
            >
              <div className={styles.category_img_circle}>
                <img
                  src={item.img}
                  alt={item.name}
                  className={styles.category_icon}
                />
              </div>
              <p>{item.name}</p>
            </div>
          ))}
        </div>

        {/* 3. 검색창 */}
        <div className={styles.search_container}>
          <div className={styles.search_wrap}>
            <input
              type="search"
              placeholder="매장 이름을 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className={styles.search_icon} />
          </div>
        </div>

        {/* 4. 카드 목록 */}
        <div className={styles.card_wrap}>
          {filteredStores.length > 0 ? (
            filteredStores.map((store) => (
              <div
                key={store.id}
                className={styles.card_item}
                onClick={() => navigate("/storeView")}
              >
                <div className={styles.image_wrap}>
                  <img src={store.img} alt={store.name} />
                  <div className={styles.card_badge}>{store.distance}</div>
                </div>
                <div className={styles.card_info}>
                  <h3 className={styles.store_name}>{store.name}</h3>
                  <div className={styles.store_tags}>
                    <span>{store.category}</span>
                    <span>{store.time}</span>
                  </div>
                  <div className={styles.store_rating}>
                    <span>😊 {store.rating}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // ✅ 검색 결과 없을 때
            <p className={styles.empty_msg}>검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
