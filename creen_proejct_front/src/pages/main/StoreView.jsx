import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // ✅ 상점 ID를 받기 위해 추가
import axios from 'axios';
import styles from './StoreView.module.css';
import SearchIcon from '@mui/icons-material/Search';
import MenuModal from '../../components/layout/MenuModal';
import CartBar from '../../components/layout/ui/CartBar';

export default function StoreView() {
  const location = useLocation();
  // 이전 페이지(Home)에서 넘겨준 storeId를 받습니다. (없으면 기본값 1)
  const storeId = location.state?.storeId || 1;

  // ✅ 서버에서 받아올 전체 메뉴 리스트 State
  const [menuList, setMenuList] = useState([]);
  // ✅ 동적 카테고리 버튼을 위한 State (기본값 '전체')
  const [categories, setCategories] = useState(['전체']);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');

  // 🚀 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/stores/${storeId}/menus`)
      .then((res) => {
        console.log('메뉴 데이터 응답:', res.data);
        setMenuList(res.data);

        // 💡 꿀팁: 서버 데이터에서 존재하는 카테고리만 뽑아서 버튼으로 만듭니다.
        // Set을 이용해 중복 제거 ('메인', '메인', '사이드' -> '메인', '사이드')
        const uniqueCategories = [
          '전체',
          ...new Set(res.data.map((item) => item.menuCategory)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((err) => {
        console.error('메뉴 로딩 실패:', err);
      });
  }, [storeId]);

  // ✅ 필터링 로직 (DTO 변수명인 menuCategory, menuName으로 변경)
  const filteredMenu = menuList.filter((item) => {
    const isCategoryMatch =
      selectedCategory === '전체' || item.menuCategory === selectedCategory;
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
      {/* 상점 정보 영역 (추후 상점 단건 조회 API로 대체 가능) */}
      <div className={styles.store_info_section}>
        <div className={styles.store_image_wrap}>
          <div className={styles.image_placeholder}></div>
        </div>
        <div className={styles.store_text_wrap}>
          <h2 className={styles.store_name}>지웅이네 김치찜</h2>
          <Link to="/storeDetail" className={styles.store_link}>
            가게 정보, 원산지 정보
          </Link>
          <p className={styles.store_desc}>
            정성을 다해 끓인 김치찜 전문점입니다.
          </p>
        </div>
      </div>

      {/* 메뉴 리스트 영역 */}
      <div className={styles.menu_section}>
        <div className={styles.menu_controls}>
          <div className={styles.search_wrap}>
            <input
              type="search"
              placeholder="메뉴 이름"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className={styles.search_icon} />
          </div>

          <div className={styles.filter_wrap}>
            {/* ✅ 하드코딩된 CATEGORIES 대신 상태값 categories 사용 */}
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filter_btn} ${
                  selectedCategory === cat ? styles.active : ''
                }`}
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
              key={menu.menuId} // id -> menuId
              className={styles.menu_card}
              onClick={() => handleMenuClick(menu)}
            >
              <div className={styles.menu_image}>
                {/* 이미지가 있다면 보여주고, 없다면 빈 박스 */}
                {menu.menuImage && (
                  <img
                    src={menu.menuImage}
                    alt={menu.menuName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </div>
              <div className={styles.menu_info}>
                <span className={styles.menu_title}>{menu.menuName}</span>{' '}
                {/* name -> menuName */}
                <p className={styles.menu_price}>
                  {menu.menuPrice.toLocaleString()}원{' '}
                  {/* basePrice -> menuPrice */}
                </p>
                {/* 간단한 설명 추가 (선택사항) */}
                {menu.menuInfo && (
                  <p
                    className={styles.menu_desc}
                    style={{ fontSize: '12px', color: '#666', margin: '4px 0' }}
                  >
                    {menu.menuInfo}
                  </p>
                )}
              </div>
            </div>
          ))}
          {filteredMenu.length === 0 && (
            <p
              style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}
            >
              해당 메뉴가 없습니다.
            </p>
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
