<<<<<<< Updated upstream
import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../utils/accessToken"; // 경로는 프로젝트에 맞게 확인해주세요
// import styles from "./ManagerInfoEdit.module.css";
import styles from "../user/UserInfoEdit.module.css"; // UserInfoEdit 스타일 재사용
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
=======
import styles from "./ManagerInfoEdit.module.css";
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Collapse from '@mui/material/Collapse';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import api from "../../../utils/accessToken";
>>>>>>> Stashed changes

// MUI Icons
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Collapse from "@mui/material/Collapse";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

<<<<<<< Updated upstream
export default function ManagerInfoEdit() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const backHost = import.meta.env.VITE_BACKSERVER;

  const [managerInfo, setManagerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🌟 프로필 수정용 상태 추가
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    memberName: "",
    memberPhone: "",
    memberGrade: 1,
  });
  const [profileImg, setProfileImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const fileInputRef = useRef(null);

  const [openPwSet, setopenPwSet] = useState(false);
  const togglePwSet = () => setopenPwSet(!openPwSet);

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [pwData, setPwData] = useState({
    currentPw: "",
    newPw: "",
    confirmPw: "",
  });

  // 🌟 관리자(사용자) 정보 불러오기
  useEffect(() => {
    if (user && user.memberId) {
      api
        .get(`/member/getMemberInfo`, { params: { memberId: user.memberId } })
        .then((res) => {
          setManagerInfo(res.data);
          setProfileData({
            memberName: res.data.memberName || "",
            memberPhone: res.data.memberPhone || "",
            memberGrade: res.data.memberGrade || 1,
          });
          if (res.data.memberThumb) setPreviewImg(res.data.memberThumb);
          setLoading(false);
        })
        .catch((err) => {
          console.error("데이터 로드 실패:", err);
          setLoading(false);
        });
    }
  }, [user]);

  // 🌟 프로필 정보 변경 핸들러
  const handleProfileDataChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async () => {
    if (!profileData.memberName || !profileData.memberPhone) {
      return Swal.fire(
        "알림",
        "이름과 전화번호를 모두 입력해주세요.",
        "warning"
      );
    }

    const formData = new FormData();
    formData.append("memberId", user.memberId);
    formData.append("memberName", profileData.memberName);
    formData.append("memberPhone", profileData.memberPhone);
    formData.append("memberGrade", profileData.memberGrade);
    if (profileImg) {
      formData.append("uploadFile", profileImg);
    }

    try {
      const response = await api.post("/member/updateProfile", formData);

      if (response.data !== "UPDATE_FAIL") {
        Swal.fire("성공", "기본 정보가 수정되었습니다.", "success");

        const serverPath = response.data;
        const finalPath =
          serverPath === "SUCCESS_NO_IMAGE" ? previewImg : serverPath;

        localStorage.setItem("memberThumb", finalPath);

        setUser({
          ...user,
          memberThumb: finalPath,
        });

        setPreviewImg(finalPath);
        setManagerInfo((prev) => ({
          ...prev,
          memberName: profileData.memberName,
          memberPhone: profileData.memberPhone,
        }));
        setIsEditingProfile(false);
      }
    } catch (err) {
      Swal.fire("에러", "수정 중 오류 발생", err);
    }
  };

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwData({ ...pwData, [name]: value });
  };

  const handleDeleteClick = () => {
    navigate("/mypage/manager/deleteMember");
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className={styles.right}>
      {/* 🌟 수정된 프로필 편집 섹션 */}
      <section
        className={`${styles.right_main} ${
          isEditingProfile
            ? styles.right_main_editing
            : styles.right_main_default
        }`}
      >
        <div
          className={`${styles.icon_content} ${
            isEditingProfile
              ? styles.icon_content_editing
              : styles.icon_content_default
          }`}
        >
          {/* 이미지 래퍼 */}
          <div
            className={`${styles.icon_wrapper} ${
              isEditingProfile ? styles.icon_wrapper_editable : ""
            }`}
            onClick={() => isEditingProfile && fileInputRef.current.click()}
          >
            {previewImg ? (
              <img
                src={
                  previewImg.startsWith("blob:")
                    ? previewImg
                    : `${backHost}${previewImg}`
                }
                alt="profile"
                className={styles.profile_image}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <AccountCircleSharpIcon
                className={styles.icon_inside}
                style={{ fontSize: "60px" }}
              />
            )}

            {isEditingProfile && (
              <div className={styles.camera_overlay}>
                <PhotoCameraIcon fontSize="small" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className={styles.hidden_input}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          <div className={styles.dashboard}>
            <p className={styles.dashboard_email}>{managerInfo?.memberEmail}</p>

            {isEditingProfile ? (
              <div className={styles.edit_form_container}>
                <input
                  type="text"
                  name="memberName"
                  value={profileData.memberName}
                  onChange={handleProfileDataChange}
                  className={styles.edit_input}
                  placeholder="이름"
                />
                <input
                  type="text"
                  name="memberPhone"
                  value={profileData.memberPhone}
                  onChange={handleProfileDataChange}
                  className={styles.edit_input}
                  placeholder="전화번호"
                />
                <div className={styles.edit_btn_group}>
                  <button
                    onClick={handleProfileSubmit}
                    className={styles.save_btn}
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingProfile(false);
                      setPreviewImg(managerInfo?.memberThumb);
                      setProfileData({
                        memberName: managerInfo?.memberName || "",
                        memberPhone: managerInfo?.memberPhone || "",
                      });
                    }}
                    className={styles.cancel_btn}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className={styles.dashboard_name}>
                  {managerInfo?.memberName} 님
                </p>
                <p className={styles.dashboard_phoneNumber}>
                  {managerInfo?.memberPhone}
                </p>
              </div>
            )}
          </div>
        </div>

        {!isEditingProfile && (
          <div
            className={styles.set_icon}
            onClick={() => setIsEditingProfile(true)}
            style={{ cursor: "pointer" }}
          >
            <BorderColorIcon />
          </div>
        )}
      </section>

      <section className={styles.mini_box}>
        {/* 비밀번호 변경 칸 (기존 유지) */}
        <div className={styles.Wrapper}>
          <div className={styles.pwSet} onClick={togglePwSet}>
            <p>비밀번호 변경</p>
            <div className={styles.pw_icon}>
              {openPwSet ? <KeyboardArrowDownIcon /> : <ArrowForwardIosIcon />}
            </div>
          </div>
          <Collapse in={openPwSet} timeout="auto" unmountOnExit>
            <div className={styles.pw_content_box}>
              <div className={styles.pw_form_container}>
                {/* 현재 비밀번호 */}
                <div className={styles.pw_input_row}>
                  <label>현재 비밀번호</label>
                  <div className={styles.input_wrapper}>
                    <input
                      type={showCurrentPw ? "text" : "password"}
                      name="currentPw"
                      value={pwData.currentPw}
                      onChange={handlePwChange}
                      placeholder="현재 비밀번호 입력"
                    />
                    <div
                      className={styles.eye_icon}
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
                    <div
                      className={styles.eye_icon}
                      onClick={() => setShowNewPw(!showNewPw)}
                    >
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
                    <div
                      className={styles.eye_icon}
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                    >
                      {showConfirmPw ? <Visibility /> : <VisibilityOff />}
                    </div>
                  </div>
                </div>
                <div className={styles.pw_input_row}>
                  <label></label>
                  <button className={styles.submit_btn}>변경하기</button>
                </div>
              </div>
            </div>
          </Collapse>
        </div>
      </section>

      <div className={styles.deleteSet}>
        <div className={styles.delete_btn} onClick={handleDeleteClick}>
          <span className={styles.text_hover}>정말 탈퇴하시겠어요? 😢</span>
          <span className={styles.text_default}>회원 탈퇴</span>
        </div>
      </div>
    </div>
  );
}
=======
    const [pwData, setPwData] = useState({
        currentPw: "",
        newPw: "",
        confirmPw: ""
    });

    // 매니저 더미 데이터 (oderInfo -> managerInfo로 의미에 맞게 변경)
    const managerInfo = {
        email: "manager@gmail.com",
        name: "김매니저",
        phoneNumber: "010-1234-5678"
    };

    const handlePwChange = (e) => {
        const { name, value } = e.target;
        setPwData({ ...pwData, [name]: value });
    }
    const handleDeleteClick = () => {
        navigate("/mypage/manager/deleteMember");
    };

    // 프로필 수정용 상태 (매니저 정보 기준으로 변수명 수정)
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        managerName: managerInfo.name,
        managerPhone: managerInfo.phoneNumber,
    });
    const [profileImg, setProfileImg] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const fileInputRef = useRef(null);

    // 프로필 정보 변경 핸들러
    const handleProfileDataChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImg(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handleProfileSubmit = async () => {
        // 1. memberName -> managerName, memberPhone -> managerPhone 으로 이름 맞춤
        if (!profileData.managerName || !profileData.managerPhone) {
            return Swal.fire(
                "알림",
                "이름과 전화번호를 모두 입력해주세요.",
                "warning"
            );
        }

        const formData = new FormData();
        // 백엔드에서 요구하는 파라미터 이름에 맞춰서 데이터를 담습니다.
        // formData.append("managerId", 접속한_매니저_아이디); // (필요하다면 주석 해제 후 사용)
        formData.append("managerName", profileData.managerName);
        formData.append("managerPhone", profileData.managerPhone);
        if (profileImg) {
            formData.append("uploadFile", profileImg);
        }

        try {
            // API 경로 확인 필요 (백엔드 매니저 수정 URL)
            const response = await api.post("/member/updateProfile", formData);

            if (response.data !== "UPDATE_FAIL") {
                Swal.fire("성공", "매니저 정보가 수정되었습니다.", "success");

                const serverPath = response.data;
                const finalPath =
                    serverPath === "SUCCESS_NO_IMAGE" ? previewImg : serverPath;

                // 스토리지 이름도 managerThumb 등으로 관리
                localStorage.setItem("managerThumb", finalPath);

                // 현재 파일에 setUser가 없으므로 전역 상태 관리를 쓰지 않는다면 지워야 에러가 안 납니다.
                // 전역 상태가 있다면 Context API 등을 통해 가져와서 업데이트 해주세요.
                // setUser({ ...user, memberThumb: finalPath }); 

                setPreviewImg(finalPath);
                setIsEditingProfile(false);
            }
        } catch (err) {
            console.error(err);
            // 에러 객체(err) 대신 "error" 문자열을 넣어야 알림창이 깨지지 않습니다.
            Swal.fire("에러", "수정 중 오류 발생", "error");
        }
    };

    return (
        <div className={styles.right}>
            <section className={`${styles.right_main} ${isEditingProfile ? styles.right_main_editing : styles.right_main_default}`}>
                {isEditingProfile ? (
                    <div className={`${styles.icon_content} ${styles.icon_content_editing}`}>
                        <div className={`${styles.icon_wrapper} ${styles.icon_wrapper_editable}`} onClick={() => fileInputRef.current.click()}>
                            {previewImg ? (
                                <img src={previewImg} alt="Profile Preview" className={styles.profile_image} />
                            ) : (
                                <AccountCircleSharpIcon className={styles.icon_inside} />
                            )}
                            <div className={styles.camera_overlay}>
                                📷
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className={styles.hidden_input}
                                accept="image/*"
                            />
                        </div>
                        <div className={styles.edit_form_container}>
                            <p className={styles.dashboard_email}>{managerInfo.email}</p>
                            <input
                                type="text"
                                name="managerName"
                                value={profileData.managerName}
                                onChange={handleProfileDataChange}
                                placeholder="매니저 이름 입력"
                                className={styles.edit_input}
                            />
                            <input
                                type="text"
                                name="managerPhone"
                                value={profileData.managerPhone}
                                onChange={handleProfileDataChange}
                                placeholder="매니저 전화번호 입력"
                                className={styles.edit_input}
                            />
                            <div className={styles.edit_btn_group}>
                                <button onClick={handleProfileSubmit} className={styles.save_btn}>저장</button>
                                <button onClick={() => setIsEditingProfile(false)} className={styles.cancel_btn}>취소</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={`${styles.icon_content} ${styles.icon_content_default}`}>
                            <div className={styles.icon_wrapper}>
                                {previewImg ? (
                                    <img src={previewImg} alt="Profile" className={styles.profile_image} />
                                ) : (
                                    <AccountCircleSharpIcon className={styles.icon_inside} />
                                )}
                            </div>
                            <div className={styles.dashboard}>
                                <p className={styles.dashboard_email}>{managerInfo.email}</p>
                                <p className={styles.dashboard_name}>{managerInfo.name}</p>
                                <p className={styles.dashboard_phoneNumber}>{managerInfo.phoneNumber}</p>
                            </div>
                        </div>
                        {!isEditingProfile && (
                            <div
                                className={styles.set_icon}
                                onClick={() => setIsEditingProfile(true)}
                            >
                                <BorderColorIcon />
                            </div>
                        )}
                    </>
                )}
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
                                            //아이콘
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
                                <div className={styles.pw_input_row}>
                                    <label></label>
                                    <button className={styles.submit_btn}>
                                        변경하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </div>
            </section>
            <div className={styles.deleteSet}>
                <div className={styles.delete_btn} onClick={handleDeleteClick}>
                    <span className={styles.text_hover}>정말 탈퇴하시겠어요? 😢</span>
                    <span className={styles.text_default}>회원 탈퇴</span>
                </div>
            </div>
        </div>
    );
}
>>>>>>> Stashed changes
