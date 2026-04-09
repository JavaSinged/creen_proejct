import React, { useState } from "react";
import styles from "./StoreInfoEdit.module.css";

export default function StoreInfoEdit() {
  // 영업시간 타입 상태 ('same' = 매일 같음, 'diff' = 요일별 다름)
  const [hoursType, setHoursType] = useState("same");
  const [activeCategory, setActiveCategory] = useState("food");

  const categories = [
    { value: "한식", label: "한식" },
    { value: "양식", label: "양식" },
    { value: "중식", label: "중식" },
    { value: "일식", label: "일식" },
    { value: "피자", label: "피자" },
    { value: "치킨", label: "치킨" },
    { value: "샐러드", label: "샐러드" },
    { value: "커피/디저트", label: "커피/디저트" },
  ];

  const restWeekMonthOpts = [
    { value: "week", label: "매주" },
    { value: "week2", label: "격주" },
    { value: "month", label: "매월" },
    { value: "week3", label: "매월 첫번째" },
    { value: "week4", label: "매월 두번째" },
  ];

  const restDayOpts = [
    { value: "mon", label: "월요일" },
    { value: "tue", label: "화요일" },
    { value: "wed", label: "수요일" },
    { value: "thu", label: "목요일" },
    { value: "fri", label: "금요일" },
    { value: "sat", label: "토요일" },
    { value: "sun", label: "일요일" },
  ];

  const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];

  // 시간 select 생성을 위한 헬퍼 함수
  const renderTimeOptions = (max, step = 1) => {
    const options = [];
    for (let i = 0; i <= max; i += step) {
      const value = i < 10 ? `0${i}` : `${i}`;
      options.push(
        <option key={value} value={value}>
          {value}
        </option>
      );
    }
    return options;
  };

  return (
    <div className={styles.container}>
      <form>
        {/* 기존 상단 정보 영역 (가게명 ~ 이미지 업로드 유지) */}
        <div className={styles.formRow}>
          <label className={styles.label}>가게명</label>
          <div className={styles.inputWrap}>
            <input type="text" className={styles.inputBase} maxLength="1000" />
          </div>
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>가게 소게</label>
          <div className={styles.inputWrap}>
            <textarea
              className={styles.textareaBase}
              placeholder="가게에 대한 간단한 소개글을 입력해주세요."
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>가게 전화번호</label>
          <div className={styles.inputWrap}>
            <input
              type="text"
              className={styles.inputBase}
              placeholder="02-0000-0000"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>가게 주소</label>
          <div className={styles.inputWrap}>
            <div className={styles.addressTopRow}>
              <input
                type="text"
                readOnly
                placeholder="우편번호"
                className={styles.inputBase}
              />
              <button type="button" className={styles.addressSearchBtn}>
                주소 찾기
              </button>
            </div>
            <input
              type="text"
              readOnly
              placeholder="주소"
              className={styles.inputBase}
            />
            <input
              type="text"
              placeholder="상세주소"
              className={styles.inputBase}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>사업자 번호</label>
          <div className={styles.inputWrap}>
            <input type="text" className={styles.inputBase} />
          </div>
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>카테고리</label>
          <div className={styles.inputWrap}>
            <div className={styles.categoryGroup}>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setActiveCategory(cat.value)}
                  className={`${styles.categoryBtn} ${
                    activeCategory === cat.value ? styles.categoryBtnActive : ""
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <label className={styles.label}>원산지 정보</label>
          <div className={styles.inputWrap}>
            <textarea
              className={styles.textareaBase}
              placeholder="원산지 정보를 입력해주세요."
              maxLength="1000"
            />
          </div>
        </div>

        {/* 🌟 새로 디자인된 영업시간 영역 🌟 */}
        <div className={styles.sectionDivider}>영업시간 및 휴무일 설정</div>

        <div className={styles.formRow}>
          <label className={styles.label}>영업시간</label>
          <div className={styles.inputWrap}>
            {/* 탭 버튼 영역 */}
            <div className={styles.hoursToggleGroup}>
              <button
                type="button"
                className={`${styles.hoursToggleBtn} ${
                  hoursType === "same" ? styles.hoursToggleBtnActive : ""
                }`}
                onClick={() => setHoursType("same")}
              >
                매일 같은 시간에 영업해요
                {hoursType === "same" && (
                  <span className={styles.checkIcon}>✓</span>
                )}
              </button>
              <button
                type="button"
                className={`${styles.hoursToggleBtn} ${
                  hoursType === "diff" ? styles.hoursToggleBtnActive : ""
                }`}
                onClick={() => setHoursType("diff")}
              >
                요일별로 다르게 영업해요
                {hoursType === "diff" && (
                  <span className={styles.checkIcon}>✓</span>
                )}
              </button>
            </div>

            {/* 조건부 렌더링: 매일 같은 시간 */}
            {hoursType === "same" && (
              <div className={styles.hoursContentBox}>
                <div className={styles.hoursHeaderRow}>
                  <div className={styles.checkboxWrap}>
                    <input type="checkbox" id="everyday" defaultChecked />
                    <label htmlFor="everyday">매일 영업일</label>
                  </div>
                  <div className={styles.checkboxWrap}>
                    <input type="checkbox" id="is24h" />
                    <label htmlFor="is24h">24시간</label>
                  </div>
                </div>

                <div className={styles.timeInputRow}>
                  <span className={styles.timeLabel}>시작</span>
                  <select className={styles.timeSelect}>
                    {renderTimeOptions(23)}
                  </select>{" "}
                  시
                  <select className={styles.timeSelect}>
                    {renderTimeOptions(50, 10)}
                  </select>{" "}
                  분
                </div>
                <div className={styles.timeInputRow}>
                  <span className={styles.timeLabel}>종료</span>
                  <select className={styles.timeSelect}>
                    {renderTimeOptions(23)}
                  </select>{" "}
                  시
                  <select className={styles.timeSelect}>
                    {renderTimeOptions(50, 10)}
                  </select>{" "}
                  분
                </div>
              </div>
            )}

            {/* 조건부 렌더링: 요일별 다름 */}
            {hoursType === "diff" && (
              <div className={styles.hoursContentBox}>
                {daysOfWeek.map((day, idx) => (
                  <div key={idx} className={styles.dayRow}>
                    <div className={styles.checkboxWrap}>
                      <input type="checkbox" id={`day_${idx}`} defaultChecked />
                      <label htmlFor={`day_${idx}`}>{day}요일</label>
                    </div>
                    <div className={styles.dayTimeGroup}>
                      <select className={styles.timeSelect}>
                        {renderTimeOptions(23)}
                      </select>{" "}
                      :
                      <select className={styles.timeSelect}>
                        {renderTimeOptions(50, 10)}
                      </select>
                      <span className={styles.tilde}>~</span>
                      <select className={styles.timeSelect}>
                        {renderTimeOptions(23)}
                      </select>{" "}
                      :
                      <select className={styles.timeSelect}>
                        {renderTimeOptions(50, 10)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 🌟 새로 디자인된 휴무일 영역 🌟 */}
        <div className={styles.formRow}>
          <label className={styles.label}>휴무일</label>
          <div className={styles.inputWrap}>
            <div className={styles.restDayBox}>
              {/* 휴무일 아이템 */}
              <div className={styles.restDayItem}>
                <div className={styles.restDaySelects}>
                  <select className={styles.inputBaseSelect}>
                    {restWeekMonthOpts.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <select className={styles.inputBaseSelect}>
                    {restDayOpts.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="button" className={styles.deleteTextBtn}>
                  삭제 🗑️
                </button>
              </div>

              {/* 추가 버튼 */}
              <button type="button" className={styles.addTextBtn}>
                + 정기 휴무일 추가
              </button>
              <p className={styles.infoHint}>
                * 입점 이후에도 사장님앱에서 언제든 수정이 가능해요.
              </p>
            </div>
          </div>
        </div>

        {/* 하단 저장 버튼 */}
        <div className={styles.submitWrap}>
          <button type="submit" className={styles.submitBtn}>
            정보 변경하기
          </button>
        </div>
      </form>
    </div>
  );
}
