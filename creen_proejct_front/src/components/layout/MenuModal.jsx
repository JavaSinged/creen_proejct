import { useState, useEffect } from "react";
import styles from "./MenuModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import useCartStore from "../../store/useCartStore";
import { useNavigate } from "react-router-dom";

// ✅ axios 제거 - props로 받은 menuData를 바로 사용
export default function MenuModal({ isOpen, onClose, menuData }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const [size, setSize] = useState("regular");
  const [ecoSide, setEcoSide] = useState(false);
  const [ecoDisposable, setEcoDisposable] = useState(false);
  const [reusable, setReusable] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  // ✅ 모달이 열릴 때마다 옵션 초기화
  useEffect(() => {
    if (isOpen) {
      setSize("regular");
      setEcoSide(false);
      setEcoDisposable(false);
      setReusable(false);
      setQuantity(1);
    }
  }, [isOpen]);

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ✅ menuData가 없으면 렌더링 안 함 (null 체크)
  if (!isOpen || !menuData) return null;

  // 가격 계산
  const SIZE_PRICE = { small: -2000, regular: 0, large: 3000 };
  const unitPrice = menuData.basePrice + SIZE_PRICE[size];
  const totalPrice = unitPrice * quantity;

  // 탄소 계산 (다회용 용기 사용 시 15g 감소)
  const baseCarbonG = menuData.carbonPer100g ?? 100;
  const carbonTotal =
    (reusable
      ? Math.max(0, baseCarbonG - 15) * quantity
      : baseCarbonG * quantity) -
    (ecoSide ? 10 : 0) -
    (ecoDisposable ? 10 : 0);

  const handleAddToCart = () => {
    const cartItem = {
      id: Date.now(),
      menuId: menuData.id,
      name: menuData.name,
      size,
      ecoSide,
      ecoDisposable,
      reusable,
      quantity,
      totalPrice,
      unitPrice,
      carbonSaved:
        (reusable ? 15 * quantity : 0) +
        (ecoSide ? 10 : 0) +
        (ecoDisposable ? 10 : 0),
    };
    addToCart(cartItem);

    onClose();
  };

  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className={styles.header}>
          <h2>메뉴 상세</h2>
          <CloseIcon className={styles.close_btn} onClick={onClose} />
        </div>

        {/* 본문 */}
        <div className={styles.body}>
          <div className={styles.image_placeholder}>
            <img src="" alt="메뉴 이미지" />
          </div>

          <div className={styles.menu_info}>
            <h3>{menuData.name}</h3>
            {/* ✅ description도 props에서 바로 사용 */}
            <p className={styles.desc}>{menuData.description}</p>
            <p className={styles.price}>
              {menuData.basePrice.toLocaleString()}원
            </p>
          </div>

          <hr className={styles.divider} />

          {/* 사이즈 선택 */}
          <div className={styles.option_section}>
            <h4>사이즈 선택</h4>
            {[
              { value: "small", label: "작은 사이즈", diff: "-2,000원" },
              { value: "regular", label: "보통 사이즈", diff: "기본" },
              { value: "large", label: "큰 사이즈", diff: "+3,000원" },
            ].map(({ value, label, diff }) => (
              <label
                key={value}
                className={`${styles.option_row} ${
                  size === value ? styles.selected : ""
                }`}
              >
                <input
                  type="radio"
                  name="size"
                  checked={size === value}
                  onChange={() => setSize(value)}
                />
                <span>{label}</span>
                <span className={styles.price_diff}>{diff}</span>
              </label>
            ))}
          </div>

          {/* 에코 옵션 */}
          <div className={styles.option_section}>
            <h4>오늘도 그린하게 🌱</h4>
            <label
              className={`${styles.option_row} ${
                ecoSide ? styles.selected : ""
              }`}
            >
              <input
                type="checkbox"
                checked={ecoSide}
                onChange={() => setEcoSide(!ecoSide)}
              />
              <span>기본 반찬 안받기</span>
              <span className={styles.eco_point}>+20P</span>
            </label>
            <label
              className={`${styles.option_row} ${
                ecoDisposable ? styles.selected : ""
              }`}
            >
              <input
                type="checkbox"
                checked={ecoDisposable}
                onChange={() => setEcoDisposable(!ecoDisposable)}
              />
              <span>일회용품 안받기</span>
              <span className={styles.eco_point}>+20P</span>
            </label>
          </div>

          {/* 다회용 용기 */}
          <div
            className={`${styles.reusable_card} ${
              reusable ? styles.reusable_active : ""
            }`}
          >
            <div className={styles.reusable_info}>
              <div className={styles.reusable_title}>
                <span>🍃 다회용 용기 사용</span>
                <span className={styles.badge}>+에코 포인트</span>
              </div>
              <p>탄소 배출량 15g 감소</p>
            </div>
            <label className={styles.toggle_switch}>
              <input
                type="checkbox"
                checked={reusable}
                onChange={() => setReusable(!reusable)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        {/* 푸터 */}
        <div className={styles.footer}>
          <div className={styles.summary_row}>
            <span className={styles.summary_label}>수량</span>
            <div className={styles.quantity_control}>
              <RemoveIcon
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={styles.q_btn}
              />
              <span>{quantity}</span>
              <AddIcon
                onClick={() => setQuantity(quantity + 1)}
                className={styles.q_btn}
              />
            </div>
          </div>
          <div className={styles.summary_row}>
            <span className={styles.summary_label}>총 예상 탄소 배출</span>
            {/* ✅ 동적으로 계산된 탄소량 표시 */}
            <span className={styles.carbon_total}>{carbonTotal}g CO2e</span>
          </div>
          <button className={styles.submit_btn} onClick={handleAddToCart}>
            {totalPrice.toLocaleString()}원 담기
          </button>
        </div>
      </div>
    </div>
  );
}

// ## 데이터 흐름 한눈에 보기
// MENU_DATA (StoreView 상수)
//     ↓ handleMenuClick(menu) 으로 객체 전달
// MenuModal props.menuData
//     ↓ handleAddToCart() → addToCart(cartItem)
// useCartStore.cart[]
//     ↓ cart.reduce()로 합산
// CartBar (총 수량 / 총 가격 / 탄소 절감량 표시)
