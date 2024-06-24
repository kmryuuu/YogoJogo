import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import Layout from "@/layout/Layout";

const router = createBrowserRouter([
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
      { path: "cart", element: <Cart /> },
      {
        path: "mypage",
        element: <MyPage />,
        children: [
          { path: "profile", element: <ProfileEdit /> },
          { path: "history", element: <OrderHistory /> },
          { path: "cancel", element: <CancelHistory /> },
        ],
      },
      {
        path: "orders",
        element: <Orders />,
        children: [
          { path: "inventory", element: <Inventory /> },
          { path: "create", element: <CreateProduct /> },
        ],
      },
    ],
  },
]);
const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
