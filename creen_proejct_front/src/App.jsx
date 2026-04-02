import "./App.css";
import Header from "./components/commons/Header";
import Footer from "./components/commons/Footer";
import { Route, Routes, Outlet } from "react-router-dom";
import Home from "./pages/main/Home";
import StoreView from "./pages/main/StoreView";
import StoreDetail from "./pages/main/StoreDetail";
import NotFound from "./pages/error/NotFound";

import OrderPage from "./pages/order/OrderPage";
import PaymentPage from "./pages/order/PaymentPage";
import CheckoutPage from "./pages/order/CheckoutPage";

import Login from "./pages/login/login";
import Account from "./pages/login/FindAccount";
import UserLayout from "./components/layout/mypageSidebar/UserLayout";
import ManagerLayout from "./components/layout/mypageSidebar/ManagerLayout";
import AdminLayout from "./components/layout/mypageSidebar/AdminLayout";
import UserProfile from "./pages/mypage/user/UserProfile";
import UserInfoEdit from "./pages/mypage/user/UserInfoEdit";

import { AuthProvider } from "./context/AuthContext";
import UserSignup from "./pages/signup/UserSignup";
import ManagerSignup from "./pages/signup/ManagerSignup";
import Signup from "./pages/signup/Signup";
import UserCS from "./pages/mypage/user/UserCS";

import ManagerInfoEdit from "./pages/mypage/manager/ManagerInfoEdit"

import AdminDashboard from "./pages/mypage/admin/AdminDashboard";
import AdminUserManagement from "./pages/mypage/admin/AdminUserManagement";
import AdminStoreManagement from "./pages/mypage/admin/AdminStoreManagement";
import AdminReviewManagement from "./pages/mypage/admin/AdminReviewManagement";
import AdminContainerManagement from "./pages/mypage/admin/AdminContainerManagement";



const BasicLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    // 🌟 전체를 AuthProvider로 감쌉니다.
    <AuthProvider>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userSignup" element={<UserSignup />} />
          <Route path="/managerSignup" element={<ManagerSignup />} />

          {/* 2. 헤더/푸터가 무조건 붙어야 하는 화면들 (BasicLayout 안에 넣기) */}
          <Route element={<BasicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/storeView" element={<StoreView />} />
            <Route path="/storeDetail" element={<StoreDetail />} />

            {/* store */}
            <Route path="/storeView" element={<StoreView />}></Route>
            <Route path="/storeDetail" element={<StoreDetail />}></Route>
            <Route path="/orderPage" element={<OrderPage />}></Route>
            <Route path="/paymentPage" element={<PaymentPage />}></Route>
            <Route path="/checkoutPage" element={<CheckoutPage />}></Route>

            {/* 🧑 일반 유저 마이페이지 */}
            <Route path="/mypage/user" element={<UserLayout />}>
              <Route index element={<UserProfile />} />
              <Route path="profile" element={<UserInfoEdit />} />
              <Route path="userCS" element={<UserCS />} />
              {/* 기본 화면: 개인정보 수정 */}
              {/* <Route path="orders" element={<UserOrders />} /> */}
              {/* /mypage/user/orders */}
              {/* 필요한 메뉴만큼 Route를 추가하세요 */}
            </Route>

            {/* 👨‍🍳 점주 마이페이지 */}
            <Route path="/mypage/manager" element={<ManagerLayout />}>
              {/* <Route index element={<ManagerDashboard />} />{' '} */}
              {/* 기본 화면: 통계 메인 */}
              <Route path="profile" element={<ManagerInfoEdit />} />
            </Route>

            {/* 👮 관리자 마이페이지 */}
            <Route path="/mypage/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              {/* 기본 화면: 회원 관리 */}
              <Route path="members" element={<AdminUserManagement />} />
              <Route path="stores" element={<AdminStoreManagement />} />
              <Route path="reviews" element={<AdminReviewManagement />} />
              <Route path="containers" element={<AdminContainerManagement />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* 없는 페이지 라우트 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
