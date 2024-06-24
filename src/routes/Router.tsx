import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Common/Home";
import Login from "@/pages/Common/Login";
import SignUp from "@/pages/Common/SignUp";
import ProductList from "@/pages/Common/ProductList";
import ProductDetail from "@/pages/Common/ProductDetail";
import Cart from "@/pages/Common/Cart";
import MyPage from "@/pages/User/MyPage";
import ProfileEdit from "@/pages/User/ProfileEdit";
import OrderHistory from "@/pages/User/OrderHistory";
import CancelHistory from "@/pages/User/CancelHistory";
import Orders from "@/pages/Admin/Orders";
import Inventory from "@/pages/Admin/Inventory";
import CreateProduct from "@/pages/Admin/CreateProduct";
import Error from "@/pages/Common/Error";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/category" element={<ProductList />} />
        <Route path="/product" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/profile" element={<ProfileEdit />} />
        <Route path="/history" element={<OrderHistory />} />
        <Route path="/cancel" element={<CancelHistory />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/create" element={<CreateProduct />} />
        <Route path="/cancel" element={<CancelHistory />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
