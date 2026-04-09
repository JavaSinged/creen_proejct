import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MenuModal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import useCartStore from "../../store/useCartStore";
import Swal from "sweetalert2";

export default function MenuModal({
  isOpen,
  onClose,
  menuData,
  currentStoreId, // 👈 부모(StoreView)에서 넘겨준 현재 매장 ID
  currentStoreName, // 👈 부모(StoreView)에서 넘겨준 현재 매장 이름
}) {
  const backHost = import.meta.env.VITE_BACKSERVER;

  // 🌟 Zustand 상태 및 액션
  const {
    cart,
    storeId: cartStoreId, // 장바구니에 이미 저장된 매장 ID
    addToCart,
    clearCart,
    setStoreId,
    setStoreName,
  } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [optionList, setOptionList] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [reusable, setReusable] = useState(false);
  const [ecoCheck, setEcoCheck] = useState({ 5: false, 6: false });

  const ecoCount = Object.values(ecoCheck).filter(Boolean).length;

  // 탄소 절감량 계산
  const carbonSaved = reusable
    ? quantity * 15 + (ecoCount === 0 ? 0 : ecoCount === 1 ? 20 : 40)
    : ecoCount === 0
      ? 0
      : ecoCount === 1
        ? 20
        : 40;

  // 모달 열릴 때 초기화 및 옵션 조회
  useEffect(() => {
    if (isOpen && menuData?.menuId) {
      setQuantity(1);
      setSelectedOptions([]);
      setReusable(false);
      setEcoCheck({ 5: false, 6: false });

      axios
        .get(`${backHost}/stores/${menuData.menuId}/options`)
        .then((res) => {
          setOptionList(res.data);
          const defaultSize = res.data.find((o) => o.optionType === 1);
          if (defaultSize) {
            setSelectedOptions([defaultSize]);
          }
        })
        .catch((err) => console.error("옵션 로딩 실패:", err));
    }
  }, [isOpen, menuData, backHost]);

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen || !menuData) return null;

  // 옵션 토글 핸들러
  const handleOptionToggle = (option) => {
    if (option.optionType === 1) {
      const filtered = selectedOptions.filter((o) => o.optionType !== 1);
      setSelectedOptions([...filtered, option]);
    } else {
      const isExist = selectedOptions.find(
        (o) => o.optionNo === option.optionNo,
      );
      if (isExist) {
        setSelectedOptions(
          selectedOptions.filter((o) => o.optionNo !== option.optionNo),
        );
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    }
  };

  const optionsPriceSum = selectedOptions.reduce(
    (sum, opt) => sum + opt.optionPrice,
    0,
  );
  const unitPrice = menuData.menuPrice + optionsPriceSum;
  const totalPrice = unitPrice * quantity;
  const baseCarbonG = menuData.carbonPer100g ?? 100;
  const carbonTotal =
    (reusable
      ? Math.max(0, baseCarbonG - 15) * quantity
      : baseCarbonG * quantity) -
    (ecoCount === 0 ? 0 : ecoCount === 1 ? 20 : 40);

  // 🌟 [핵심] 장바구니 담기 메인 로직
  const handleAddToCart = () => {
    const currentId = Number(currentStoreId); // 현재 매장 (숫자로 변환)
    const savedId = Number(cartStoreId); // 장바구니 매장 (숫자로 변환)

    // 디버깅 로그 (문제가 생기면 F12 콘솔 확인용)
    console.log("--- 매장 일치 체크 ---");
    console.log(
      "장바구니 상태:",
      cart.length > 0 ? "비어있지 않음" : "비어있음",
    );
    console.log("장바구니 매장 ID:", savedId);
    console.log("현재 매장 ID:", currentId);

    // 1. 다른 매장의 메뉴가 이미 담겨있는지 확인
    // (장바구니에 물건이 있고, 저장된 ID가 0이 아닌데, 현재 접속한 매장 ID와 다를 때)
    if (cart.length > 0 && savedId !== 0 && savedId !== currentId) {
      Swal.fire({
        title: "장바구니에는 한 곳의 매장만 담을 수 있습니다.",
        text: "현재 담긴 메뉴를 삭제하고 이 매장의 메뉴를 담으시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#22c55e", // 그린 색상 (프로젝트 테마에 맞춰 수정)
        cancelButtonColor: "#ccc",
        confirmButtonText: "담기",
        cancelButtonText: "취소",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          clearCart(); // 🔄 기존 장바구니 싹 비우기
          executeAdd(); // 🆕 새로 담기
        }
      });
    } else {
      // 2. 장바구니가 비어있거나 같은 매장이면 바로 담기
      executeAdd();
    }
  };

  // 🌟 [실제 담기 실행 함수]
  const executeAdd = () => {
    const cartItem = {
      id: Date.now(),
      menuId: menuData.menuId,
      name: menuData.menuName,
      quantity,
      totalPrice,
      unitPrice,
      carbonSaved: carbonSaved,
      options: selectedOptions,
      menuImage: menuData.menuImage,
    };

    addToCart(cartItem);

    // 🌟 중요: 담는 순간 이 장바구니의 "주인 매장" 정보를 업데이트함
    setStoreId(Number(currentStoreId));
    setStoreName(currentStoreName);

    onClose();

    Swal.fire({
      title: "장바구니에 담겼습니다!",
      icon: "success",
      timer: 800,
      showConfirmButton: false,
    });
  };

  // 옵션 분류
  const sizeOptions = optionList.filter((o) => o.optionType === 1);
  const addOnOptions = optionList.filter((o) => o.optionType === 2);
  const ecoOptions = optionList.filter((o) => o.optionType === 3);

  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>메뉴 상세</h2>
          <CloseIcon className={styles.close_btn} onClick={onClose} />
        </div>

        <div className={styles.body}>
          <div className={styles.image_placeholder}>
            {menuData?.menuImage ? (
              <img
                src={`${backHost}${menuData.menuImage}`}
                alt={menuData.menuName}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#f0f0f0",
                }}
              ></div>
            )}
          </div>

          <div className={styles.menu_info}>
            <h3>{menuData.menuName}</h3>
            <p className={styles.desc}>{menuData.menuInfo}</p>
            <p className={styles.price}>
              {menuData.menuPrice.toLocaleString()}원
            </p>
          </div>

          <hr className={styles.divider} />

          {/* 옵션 렌더링 영역 */}
          <div className={styles.scroll_area}>
            {sizeOptions.length > 0 && (
              <div className={styles.option_section}>
                <h4>사이즈 선택</h4>
                {sizeOptions.map((opt) => (
                  <label
                    key={opt.optionNo}
                    className={`${styles.option_row} ${selectedOptions.find((o) => o.optionNo === opt.optionNo) ? styles.selected : ""}`}
                  >
                    <input
                      type="radio"
                      name="size"
                      checked={
                        !!selectedOptions.find(
                          (o) => o.optionNo === opt.optionNo,
                        )
                      }
                      onChange={() => handleOptionToggle(opt)}
                    />
                    <span>{opt.optionName}</span>
                    <span className={styles.price_diff}>
                      {opt.optionPrice > 0
                        ? `+${opt.optionPrice.toLocaleString()}원`
                        : opt.optionPrice < 0
                          ? `${opt.optionPrice.toLocaleString()}원`
                          : "기본"}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {addOnOptions.length > 0 && (
              <div className={styles.option_section}>
                <h4>추가 선택</h4>
                {addOnOptions.map((opt) => (
                  <label
                    key={opt.optionNo}
                    className={`${styles.option_row} ${selectedOptions.find((o) => o.optionNo === opt.optionNo) ? styles.selected : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={
                        !!selectedOptions.find(
                          (o) => o.optionNo === opt.optionNo,
                        )
                      }
                      onChange={() => handleOptionToggle(opt)}
                    />
                    <span>{opt.optionName}</span>
                    <span className={styles.price_diff}>
                      +{opt.optionPrice.toLocaleString()}원
                    </span>
                  </label>
                ))}
              </div>
            )}

            {ecoOptions.length > 0 && (
              <div className={styles.option_section}>
                <h4>오늘도 그린하게 🌱</h4>
                {ecoOptions.map((opt) => (
                  <label
                    key={opt.optionNo}
                    className={`${styles.option_row} ${selectedOptions.find((o) => o.optionNo === opt.optionNo) ? styles.selected : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={
                        !!selectedOptions.find(
                          (o) => o.optionNo === opt.optionNo,
                        )
                      }
                      onChange={() => {
                        handleOptionToggle(opt);
                        setEcoCheck({
                          ...ecoCheck,
                          [opt.optionNo]: !ecoCheck[opt.optionNo],
                        });
                      }}
                    />
                    <span>{opt.optionName}</span>
                    <span
                      className={
                        opt.optionName.includes("다회용")
                          ? styles.price_diff
                          : styles.eco_point
                      }
                    >
                      {opt.optionPrice > 0
                        ? `+${opt.optionPrice.toLocaleString()}원`
                        : "+20P"}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 다회용기 토글 */}
        <div
          className={`${styles.reusable_card} ${reusable ? styles.reusable_active : ""}`}
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

        {/* 푸터 (수량 및 담기 버튼) */}
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
