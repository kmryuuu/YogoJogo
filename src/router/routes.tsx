import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Common/Home";
import Login from "@/pages/Common/Login";
import SignUp from "@/pages/Common/SignUp";
import ProductList from "@/pages/Admin/ProductList";
import ProductDetail from "@/pages/Common/ProductDetail";
import Cart from "@/pages/Common/Cart";
import MyPage from "@/pages/User/MyPage";
import ProfileEdit from "@/pages/User/ProfileEdit";
import OrderHistory from "@/pages/User/OrderHistory";
import CancelHistory from "@/pages/User/CancelHistory";
import Orders from "@/pages/Admin/Orders";
import OrderList from "@/pages/Admin/OrderList";
import CreateProduct from "@/pages/Admin/CreateProduct";
import Error from "@/pages/Common/Error";
import Layout from "@/layout/Layout";
import ProtectedRoutes from "@/router/ProtectedRoutes";
import Category from "@/pages/Common/Category";
import Checkout from "@/pages/Common/Checkout";
import PaymentSuccess from "@/pages/Common/PaymentSuccess";
import PaymentFail from "@/pages/Common/PaymentFail";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "category/:category", element: <Category /> },
      { path: "product/:id", element: <ProductDetail /> },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "orders",
        element: (
          <ProtectedRoutes>
            <Checkout />
          </ProtectedRoutes>
        ),
        children: [
          { path: "success", element: <PaymentSuccess /> },
          { path: "fail", element: <PaymentFail /> },
        ],
      },
      {
        path: "mypage",
        element: (
          <ProtectedRoutes>
            <MyPage />
          </ProtectedRoutes>
        ),
        children: [
          { path: "profile", element: <ProfileEdit /> },
          { path: "history", element: <OrderHistory /> },
          { path: "cancel", element: <CancelHistory /> },
        ],
      },
      {
        path: "admin",
        element: (
          <ProtectedRoutes adminOnly>
            <Orders />
          </ProtectedRoutes>
        ),
        children: [
          { path: "orderlist", element: <OrderList /> },
          { path: "inventory", element: <ProductList /> },
          { path: "create", element: <CreateProduct /> },
          { path: "edit/:id", element: <CreateProduct /> },
        ],
      },
    ],
  },
]);

export default routes;
