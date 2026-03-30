import React, { useState } from "react";
import "./PaymentPage.css";
import {
  Bell,
  User,
  LogOut,
  TreePine,
  MapPin,
  MessageSquare,
  Gift,
  CreditCard,
  ChevronDown,
} from "lucide-react";

const PaymentPage = () => {
  const [storeRequest, setStoreRequest] = useState("");
  const [deliveryRequest, setDeliveryRequest] = useState("");
  const [ecoPoint, setEcoPoint] = useState("7000");
  const [selectedPayment, setSelectedPayment] = useState("card");

  return (
    <div className="payment-page">
      {/* 본문 */}
      <main className="payment-main">
        <div className="payment-top-text">
          <button className="back-btn">&lt; 장바구니로 돌아가기</button>
          <p>주문 정보를 확인하고 결제를 완료하세요</p>
        </div>

        <div className="payment-content">
          {/* 왼쪽 영역 */}
          <section className="payment-left">
            {/* 배송정보 */}
            <div className="info-card">
              <div className="card-title-row">
                <div className="card-title-left">
                  <MapPin size={20} />
                  <h2>배송정보</h2>
                </div>
                <button className="text-btn">주소 변경</button>
              </div>

              <div className="form-group">
                <label>배송 주소</label>
                <input
                  type="text"
                  value="서울시 종로구 대왕빌딩 301"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>연락처</label>
                <input type="text" value="010-0000-0000" readOnly />
              </div>
            </div>

            {/* 요청사항 */}
            <div className="info-card">
              <div className="card-title-row">
                <div className="card-title-left">
                  <MessageSquare size={20} />
                  <h2>요청사항</h2>
                </div>
                <button className="icon-btn">
                  <ChevronDown size={20} />
                </button>
              </div>

              <div className="form-group">
                <label>가게 요청사항</label>
                <input
                  type="text"
                  placeholder="요청사항을 선택해주세요"
                  value={storeRequest}
                  onChange={(e) => setStoreRequest(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>배달 요청사항</label>
                <div className="select-wrap">
                  <select
                    value={deliveryRequest}
                    onChange={(e) => setDeliveryRequest(e.target.value)}
                  >
                    <option value="">요청사항을 선택해주세요</option>
                    <option value="door">문 앞에 두고 가주세요</option>
                    <option value="call">도착 후 전화 주세요</option>
                    <option value="safe">경비실에 맡겨주세요</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 에코포인트 */}
            <div className="info-card">
              <div className="card-title-row">
                <div className="card-title-left">
                  <Gift size={20} />
                  <h2>에코 포인트 사용 및 적립</h2>
                </div>
              </div>

              <div className="form-group">
                <label>에코 포인트 사용</label>
                <div className="point-row">
                  <input
                    type="text"
                    value={ecoPoint}
                    onChange={(e) => setEcoPoint(e.target.value)}
                  />
                  <button className="point-cancel-btn">사용취소</button>
                </div>
                <p className="point-desc">보유 : 7,000 점(원)</p>
              </div>

              <div className="form-group">
                <label>이번 주문으로 받을 에코포인트</label>
                <input type="text" value="450" readOnly />
              </div>
            </div>
          </section>

          {/* 오른쪽 결제 정보 */}
          <aside className="payment-right">
            <div className="summary-card">
              <h2 className="summary-title">결제 정보</h2>

              <div className="price-list">
                <div className="price-row">
                  <span>상품합계</span>
                  <span>51,000원</span>
                </div>
                <div className="price-row">
                  <span>배달비</span>
                  <span>1,000원</span>
                </div>
                <div className="price-row">
                  <span>에코포인트 사용</span>
                  <span>-7,000원</span>
                </div>
              </div>

              <div className="total-row">
                <span>최종 결제 금액</span>
                <strong>45,000원</strong>
              </div>

              <div className="carbon-card">
                <p className="carbon-title">이 주문의 탄소 절감</p>
                <strong className="carbon-value">450g</strong>
                <p className="carbon-desc">
                  이번 주문으로 나무 가지 하나를 틔웠습니다!
                </p>
              </div>

              <div className="payment-method-section">
                <div className="payment-method-title">
                  <CreditCard size={18} />
                  <span>결제 수단</span>
                </div>

                <div className="payment-method-grid">
                  <button
                    className={`payment-method-btn ${
                      selectedPayment === "card" ? "active" : ""
                    }`}
                    onClick={() => setSelectedPayment("card")}
                  >
                    <span>신용카드</span>
                  </button>

                  <button
                    className={`payment-method-btn ${
                      selectedPayment === "toss" ? "active" : ""
                    }`}
                    onClick={() => setSelectedPayment("toss")}
                  >
                    <span>토스페이</span>
                  </button>

                  <button
                    className={`payment-method-btn ${
                      selectedPayment === "kakao" ? "active" : ""
                    }`}
                    onClick={() => setSelectedPayment("kakao")}
                  >
                    <span>카카오페이</span>
                  </button>

                  <button
                    className={`payment-method-btn ${
                      selectedPayment === "naver" ? "active" : ""
                    }`}
                    onClick={() => setSelectedPayment("naver")}
                  >
                    <span>네이버페이</span>
                  </button>
                </div>
              </div>

              <button className="pay-btn">45,000원 결제하기</button>

              <p className="pay-notice">
                결제 진행 시 주문이 확정되며
                <br />
                취소는 가게 승인 전까지 가능합니다.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
