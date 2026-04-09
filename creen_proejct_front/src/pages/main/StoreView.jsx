import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./StoreView.module.css";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star"; // 🌟 별점 아이콘 추가
import MenuModal from "../../components/layout/MenuModal";
import CartBar from "../../components/layout/ui/CartBar";
import useCartStore from "../../store/useCartStore";

export default function StoreView() {
  const backHost = import.meta.env.VITE_BACKSERVER;
  const location = useLocation();
  const storeId = location.state?.storeId || 1;

  // 🌟 리뷰 개수 상태 추가
  const [reviewCount, setReviewCount] = useState(0);

  // 1. 가게 정보 상태 (별점 포함)
  const [storeInfo, setStoreInfo] = useState({
    storeId: "",
    storeIntro: "",
    storeName: "",
    storeThumb: "",
    storeRating: 0,
  });

  // 2. 메뉴 정보 상태
  const [menuList, setMenuList] = useState([]);
  const [categories, setCategories] = useState(["전체"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");

  const setGlobalStoreName = useCartStore((state) => state.setStoreName);

  useEffect(() => {
    window.scrollTo(0, 0);

    // 🚀 [메뉴 로드]
    axios
      .get(`${backHost}/stores/${storeId}/menus`)
      .then((res) => {
        const activeMenus = res.data.filter((item) => item.menuStatus === 1);
        setMenuList(activeMenus);
        const uniqueCategories = [
          "전체",
          ...new Set(activeMenus.map((item) => item.menuCategory)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error("메뉴 로딩 실패:", err));

    // 🚀 [상점 정보 로드]
    axios
      .get(`${backHost}/stores/${storeId}`)
      .then((res) => {
        if (res.data.storeName) setGlobalStoreName(res.data.storeName);
        setStoreInfo({
          storeId: res.data.storeId,
          storeIntro: res.data.storeIntro,
          storeName: res.data.storeName,
          storeThumb: res.data.storeThumb,
          storeRating: res.data.storeRating || 0,
        });
      })
      .catch((err) => console.error("가게 로딩 실패:", err));

    // 🚀 [리뷰 개수 로드] 🌟 추가된 로직
    axios
      .get(`${backHost}/stores/reviews/${storeId}`)
      .then((res) => {
        setReviewCount(res.data.length); // 리뷰 리스트의 길이를 저장
      })
      .catch((err) => console.error("리뷰 로딩 실패:", err));
  }, [storeId, backHost, setGlobalStoreName]);

  const filteredMenu = menuList.filter((item) => {
    const isCategoryMatch =
      selectedCategory === "전체" || item.menuCategory === selectedCategory;
    const isSearchMatch = item.menuName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.page_container}>
      {/* 상단: 상점 대표 정보 영역 */}
      <div className={styles.store_info_section}>
        <div className={styles.store_image_wrap}>
          {storeInfo.storeThumb ? (
            <img
              src={`${backHost}/${storeInfo.storeThumb}`}
              alt={storeInfo.storeName}
              className={styles.store_main_img}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className={styles.image_placeholder}>
              <span style={{ color: "#999" }}>사진 준비 중 🥘</span>
            </div>
          )}
        </div>

        <div className={styles.store_text_wrap}>
          <div className={styles.title_row}>
            <h2 className={styles.store_name}>
              {storeInfo.storeName || "로딩 중..."}
            </h2>

            <div className={styles.store_rating_box}>
              <StarIcon className={styles.star_icon} />
              <span className={styles.rating_num}>
                {storeInfo.storeRating?.toFixed(1)}
              </span>

              {/* 🌟 별점 옆에 총 리뷰 개수 표시 */}
              <span className={styles.review_count_text}>
                ({reviewCount.toLocaleString()})
              </span>

              <Link
                to="/storeReviews"
                state={{ storeId: storeId }}
                className={styles.review_count_link}
              >
                리뷰 보기 {">"}
              </Link>
            </div>
          </div>

          <Link
            to="/storeDetail"
            state={{ storeId: storeId }}
            className={styles.store_link}
          >
            가게 정보, 원산지 정보 {">"}
          </Link>
          <p className={styles.store_desc}>{storeInfo.storeIntro}</p>
        </div>
      </div>

      <div className={styles.menu_section}>
        <div className={styles.menu_controls}>
          <div className={styles.search_wrap}>
            <input
              type="search"
              placeholder="메뉴 이름 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className={styles.search_icon} />
          </div>

          <div className={styles.filter_wrap}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filter_btn} ${selectedCategory === cat ? styles.active : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.menu_grid}>
          {filteredMenu.map((menu) => (
            <div
              key={menu.menuId}
              className={styles.menu_card}
              onClick={() => handleMenuClick(menu)}
            >
              <div className={styles.menu_image}>
                {menu.menuImage ? (
                  <img
                    src={`${backHost}${menu.menuImage}`}
                    alt={menu.menuName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                ) : (
                  <div className={styles.no_image_box}></div>
                )}
              </div>
              <div className={styles.menu_info}>
                <span className={styles.menu_title}>{menu.menuName}</span>
                <p className={styles.menu_price}>
                  {menu.menuPrice?.toLocaleString()}원
                </p>
                {menu.menuInfo && (
                  <p className={styles.menu_desc}>{menu.menuInfo}</p>
                )}
              </div>
            </div>
          ))}

          {filteredMenu.length === 0 && (
            <div className={styles.empty_menu}>
              현재 주문 가능한 메뉴가 없습니다.
            </div>
          )}
        </div>
      </div>

      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        menuData={selectedMenu}
      />
      <CartBar />
    </div>
  );
}
