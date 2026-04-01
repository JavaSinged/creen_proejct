import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import styles from "./UserInfoEdit.module.css";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import Collapse from '@mui/material/Collapse';

export default function UserInfoEdit() {

  const [openPwSet, setopenPwSet] = useState(false);
  const [openAddSet, setopenAddSet] = useState(false);
  const togglePwSet = () => setopenPwSet(!openPwSet);
  const toggleAddSet = () => setopenAddSet(!openAddSet);
  // 상태값: 처음엔 가려져야 하니 false
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [pwData, setPwData] = useState({
    currentPw: "",
    newPw: "",
    confirmPw: ""
  });
  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwData({ ...pwData, [name]: value });
  }

  const userInfo = {
    email: "aaa@gmail.com",
    name: "김이름",
    phoneNumber: "010-0000-0000"
  };
  return (
    <div className={styles.right}>
      <section className={styles.right_main}>
        <div className={styles.icon_content}>
          <div className={styles.icon}>
            <AccountCircleSharpIcon />
          </div>
          <div className={styles.dashboard}>
            <p className={styles.dashboard_email}>{userInfo.email}</p>
            <p className={styles.dashboard_name}>{userInfo.name}</p>
            <p className={styles.dashboard_phoneNumber}>{userInfo.phoneNumber}</p>
          </div>
        </div>
        <div className={styles.set_icon}><BorderColorIcon /></div>
      </section>

      <section className={styles.mini_box}>
        {/*비밀번호 변경 칸*/}
        <div className={styles.Wrapper}>
          <div className={styles.pwSet} onClick={togglePwSet}>
            <p>비밀번호 변경</p>
            <div className={styles.pw_icon}>
              {openPwSet ? <KeyboardArrowDownIcon /> : <ArrowForwardIosIcon />}
            </div>
          </div>
          <Collapse in={openPwSet} timeout="auto" unmountOnExit>
            <div className={styles.pw_content_box}>
              {/* 여기에 비밀번호 변경 Input들을 넣으시면 됩니다 */}
              <div className={styles.pw_form_container}>
                {/* 현재 비밀번호 */}
                <div className={styles.pw_input_row}>
                  <label>현재 비밀번호</label>
                  <div className={styles.input_wrapper}>
                    <input
                      //입력창
                      type={showCurrentPw ? "text" : "password"}
                      name="currentPw"
                      value={pwData.currentPw}
                      onChange={handlePwChange}
                      placeholder="현재 비밀번호 입력"
                    />

                    <div className={styles.eye_icon}
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                    >
                      {showCurrentPw ? <Visibility /> : <VisibilityOff />}
                    </div>
                  </div>
                </div>

                {/* 새 비밀번호 */}
                <div className={styles.pw_input_row}>
                  <label>새 비밀번호</label>
                  <div className={styles.input_wrapper}>
                    <input
                      type={showNewPw ? "text" : "password"}
                      name="newPw"
                      value={pwData.newPw}
                      onChange={handlePwChange}
                      placeholder="새 비밀번호 입력"
                    />
                    <div className={styles.eye_icon} onClick={() => setShowNewPw(!showNewPw)}>
                      {showNewPw ? <Visibility /> : <VisibilityOff />}
                    </div>
                  </div>
                </div>

                {/* 새 비밀번호 확인 */}
                <div className={styles.pw_input_row}>
                  <label>새 비밀번호 확인</label>
                  <div className={styles.input_wrapper}>
                    <input
                      type={showConfirmPw ? "text" : "password"}
                      name="confirmPw"
                      value={pwData.confirmPw}
                      onChange={handlePwChange}
                      placeholder="새 비밀번호 재입력"
                    />
                    <div className={styles.eye_icon} onClick={() => setShowConfirmPw(!showConfirmPw)}>
                      {showConfirmPw ? <Visibility /> : <VisibilityOff />}
                    </div>
                  </div>
                </div>

                {/* [추가 팁] 변경 완료 버튼도 하나 필요하겠죠? */}
                <button className={styles.submit_btn}>변경하기</button>
              </div>
            </div>
          </Collapse>
        </div>

        {/*주소지 칸*/}
        <div className={styles.Wrapper}>
          <div className={styles.addSet} onClick={toggleAddSet}>
            <p>주소지 변경</p>
            <div className={styles.add_icon}>
              {openAddSet ? <KeyboardArrowDownIcon /> : <ArrowForwardIosIcon />}
            </div>
          </div>
          <Collapse in={openAddSet} timeout="auto" unmountOnExit>
            <div className={styles.add_content_box}>
              {/* 여기에 주소 변경 Input들을 넣으시면 됩니다 */}
              <p>주소 변경 양식이 들어갈 자리입니다.</p>
            </div>
          </Collapse>
        </div>
      </section>
      <div className={styles.deleteSet}>
        <div className={styles.delete_btn}>
          <span className={styles.text_hover}>정말 탈퇴하시겠어요? 😢</span>
          <span className={styles.text_default}>회원 탈퇴</span>
        </div>
      </div>
    </div>
  );
}
