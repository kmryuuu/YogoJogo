import { createBrowserRouter } from "react-router-dom";
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
import OrderList from "@/pages/Admin/OrderList";
import Inventory from "@/pages/Admin/Inventory";
import CreateProduct from "@/pages/Admin/CreateProduct";
import Error from "@/pages/Common/Error";
import Layout from "@/layout/Layout";
import ProtectedRoutes from "@/router/ProtectedRoutes";

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
      { path: "category", element: <ProductList /> },
      { path: "product", element: <ProductDetail /> },
      {
        path: "cart",
        element: (
          <ProtectedRoutes>
            <Cart />
          </ProtectedRoutes>
        ),
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
        path: "orders",
        element: (
          <ProtectedRoutes adminOnly>
            <Orders />
          </ProtectedRoutes>
        ),
        children: [
          { path: "orderlist", element: <OrderList /> },
          { path: "inventory", element: <Inventory /> },
          { path: "create", element: <CreateProduct /> },
          { path: "edit/:id", element: <CreateProduct /> },
        ],
      },
    ],
  },
]);

export default routes;
