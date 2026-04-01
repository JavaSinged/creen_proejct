import "./App.css";
import Header from "./components/commons/Header";
import Footer from "./components/commons/Footer";
import { Route, Routes, Outlet } from "react-router-dom";
import Home from "./pages/main/Home";
import StoreView from "./pages/main/StoreView";
import StoreDetail from "./pages/main/StoreDetail";
import NotFound from "./pages/error/NotFound";

import OrderPage from "./pages/order/OrderPage";

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
import ProtectedRoute from "./context/ProtectedRoute";

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
    <AuthProvider>
      <div>
        <Routes>
          {/* 1. 헤더/푸터가 없는 퍼블릭 화면 */}
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userSignup" element={<UserSignup />} />
          <Route path="/managerSignup" element={<ManagerSignup />} />

          {/* 2. 헤더/푸터가 무조건 붙어야 하는 화면들 */}
          <Route element={<BasicLayout />}>
            {/* 누구나 볼 수 있는 페이지 */}
            <Route path="/" element={<Home />} />
            <Route path="/storeView" element={<StoreView />} />
            <Route path="/storeDetail" element={<StoreDetail />} />

            {/* 🛡️ 일반 유저(Grade 1) 전용 마이페이지 구역 */}
            <Route element={<ProtectedRoute requireUser={true} />}>
              <Route path="/mypage/user" element={<UserLayout />}>
                <Route index element={<UserProfile />} />
                <Route path="userInfoEdit" element={<UserInfoEdit />} />
                {/* <Route path="orders" element={<UserOrders />} /> */}
              </Route>
            </Route>

            {/* 🛡️ 사업자(Grade 2) 전용 마이페이지 구역 (주석 풀고 사용하세요) */}
            {/* <Route element={<ProtectedRoute requireManager={true} />}>
              <Route path="/mypage/manager" element={<ManagerLayout />}>
                <Route index element={<ManagerDashboard />} />
                <Route path="menus" element={<ManagerMenus />} />
              </Route>
            </Route> 
            */}

            {/* 🛡️ 관리자(Grade 0) 전용 마이페이지 구역 (주석 풀고 사용하세요) */}
            {/* <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/mypage/admin" element={<AdminLayout />}>
                <Route index element={<AdminMembers />} />
                <Route path="stores" element={<AdminStores />} />
              </Route>
            </Route> 
            */}

            {/* 404 에러 페이지는 가장 마지막에! */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
