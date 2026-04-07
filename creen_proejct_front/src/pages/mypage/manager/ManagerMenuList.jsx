import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ManagerMenuList.module.css';
import Pagination from '../../../components/commons/Pagination'; // 분리하신 컴포넌트 임포트

// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

const ManagerMenuList = () => {
  const [menus, setMenus] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6; // 한 페이지에 보여줄 개수 (이미지상 6개)
  const [storeId, setStoreId] = useState('');

  // 1. 가게 정보 가져오기 (마운트 시 1회)
  useEffect(() => {
    const memberId = localStorage.getItem('memberId');
    if (!memberId) return;

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/stores/${memberId}`)
      .then((res) => {
        if (res.data && res.data.storeId) {
          setStoreId(res.data.storeId);
        }
      })
      .catch((err) => console.error('가게 정보 조회 실패:', err));
  }, []);

  // 2. 메뉴 정보 가져오기 (storeId가 생기거나 변경될 때만!)
  useEffect(() => {
    // 🌟 이 부분이 핵심입니다: storeId가 없으면 아예 axios 요청을 보내지 않음
    if (!storeId) return;

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/stores/${storeId}/menus`)
      .then((res) => {
        console.log('🚀 fetchMenus ~ res:', res.data);
        setMenus(res.data); // 메뉴 상태에 저장 (그래야 화면에 나옵니다)
      })
      .catch((err) => {
        console.error('메뉴 로딩 실패:', err);
      });
  }, [storeId]); // storeId가 업데이트될 때만 감시해서 실행

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // 페이지 변경 시 상단으로 이동
  };

  return (
    <div className={styles.container}>
      {/* 상단 검색바 */}
      <div className={styles.header}>
        <div className={styles.search_box}>
          <input
            type="text"
            placeholder="메뉴 이름"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <SearchIcon className={styles.search_icon} />
        </div>
      </div>

      {/* 메뉴 리스트 (Grid) */}
      <div className={styles.grid_container}>
        {menus.map((menu) => (
          <div key={menu.menuId} className={styles.menu_card}>
            <div className={styles.image_placeholder}>
              <ImageOutlinedIcon sx={{ fontSize: 60, color: '#bdbdbd' }} />
            </div>
            <div className={styles.menu_info}>
              <p className={styles.menu_name}>{menu.menuName}</p>
              <p className={styles.menu_price}>
                {menu.menuPrice.toLocaleString()}원
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 컴포넌트 호출 */}
      <div className={styles.pagination_wrapper}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ManagerMenuList;
