import styles from "./UserCS.module.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";

//icon
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const UserCS = () => {
  const { isLogin, user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("faq"); // 기본: faq활성화
  return (
    <section className={styles.cs_container}>
      <div className={styles.top_section}>
        <div className={styles.title_wrap}>
          <h3 className={styles.title}>고객센터</h3>
          <p className={styles.title_sub}>
            {user?.memberName} 님, 무엇을 도와드릴까요?
          </p>
        </div>
        {/*검색바 */}
        <div className={styles.search_bar}>
          <input
            type="text"
            className={styles.search_input}
            placeholder="궁금한 점을 검색해보세요."
          />
          <span className={styles.search_icon}>
            <SearchIcon />
          </span>
        </div>
        {/*탭 버튼 영역 */}
        <div className={styles.tabs_nav}>
          <div className={styles.tabs_nav_faq}>
            <button
              className={`${styles.tab_item} ${activeTab === "faq" ? styles.active : ""}`}
              onClick={() => {
                setActiveTab("faq");
              }}
            >
              자주 묻는 질문
            </button>
          </div>
          <div className={styles.tabs_nav_qna}>
            <button
              className={`${styles.tab_item} ${activeTab === "qna" ? styles.active : ""}`}
              onClick={() => {
                setActiveTab("qna");
              }}
            >
              1 : 1 문의하기
            </button>
          </div>
        </div>
      </div>
      {/*컨텐츠 랜더링영역 */}
      <div className={styles.content_area}>
        {activeTab === "faq" ? <FAQSection /> : <QnASection />}
      </div>
    </section>
  );
};
const FAQSection = () => {
  const categories = ["결제", "배달", "에코 포인트", "서비스 이용"];
  const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    <div className={styles.faq_wrap}>
      <div className={styles.category_group}>
        {categories.map((cat) => {
          return (
            <button
              key={`key:${cat}`} // 키값 나중에 수정하기
              className={`${styles.cat_btn} ${selectedCategory === cat ? styles.cat_active : ""}`}
              onClick={() => {
                setSelectedCategory(cat);
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className={styles.faq_list}>
        {/* 반복될 질문 아이템 (실제로는 데이터를 map 돌리면 됩니다) */}
        {[1, 2, 3, 4, 5].map((item) => (
          <details key={item} className={styles.faq_item}>
            <summary className={styles.faq_header}>
              <span className={styles.q_no}>{item + ". "}</span>
              <span className={styles.q_text}>
                에코포인트는 어떻게 사용하나요?
              </span>
              <span className={styles.arrow}>
                <KeyboardArrowDownIcon />
              </span>
            </summary>
            <div className={styles.faq_answer}>
              모아두신 에코포인트는 주문 결제 시 현금처럼 사용하여 할인 혜택을
              받으실 수 있습니다.
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

const QnASection = () => {
  return (
    <div className={styles.qna_wrap}>
      <div className={styles.qna_guide}>
        <h4 className={styles.qna_title}>1 : 1 문의하기</h4>
        <p className={styles.qna_desc}>
          "GreenCarry 서비스 이용 중 불편한 점이 있으신가요?
          <br /> 고객님의 소중한 의견을 1:1 문의로 남겨주시면 빠르게
          도와드릴게요."
        </p>
      </div>
      <div className={styles.qna_form}>
        <div className={styles.input_group}>
          <label>문의 제목</label>
          <input
            type="text"
            className={styles.form_input}
            placeholder="제목을 입력해주세요."
          />
        </div>
        <div className={styles.input_group}>
          <label>문의 내용</label>
          <textarea
            className={styles.form_textarea}
            placeholder="내용을 입력해주세요."
          ></textarea>
        </div>
        <button className={styles.submit_btn}>문의 등록</button>
      </div>
    </div>
  );
};
export default UserCS;
