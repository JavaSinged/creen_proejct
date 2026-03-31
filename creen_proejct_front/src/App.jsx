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

import { AuthProvider } from "./context/AuthContext";
import UserSignup from "./pages/signup/UserSignup";
import ManagerSignup from "./pages/signup/ManagerSignup";
import Signup from "./pages/signup/Signup";

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

          <Route element={<BasicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/storeView" element={<StoreView />} />
            <Route path="/storeDetail" element={<StoreDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
