import "./App.css";
import Header from "./components/commons/Header";
import Footer from "./components/commons/Footer";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/main/Home";
import StoreView from "./pages/main/StoreView";
import StoreDetail from "./pages/main/StoreDetail";

function App() {
  return (
    <div>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />}></Route>

          {/* login & regist */}

          {/* store */}
          <Route path="/storeView" element={<StoreView />}></Route>
          <Route path="/storeDetail" element={<StoreDetail />}></Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
