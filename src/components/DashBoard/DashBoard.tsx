import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminList from "./AdminList";
import AuthContext from "@/context/AuthContext";

const DashBoard = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="text-bold mx-auto flex h-full max-w-60 flex-col">
      <div>
        <h1 className="my-20 text-xl">관리자 페이지</h1>
        <AdminList to="/orders/orderlist" title="주문 현황" />
        <AdminList to="/orders/inventory" title="상품 조회/수정" />
        <AdminList to="/orders/create" title="상품 등록" />
      </div>
      <div className="mt-auto flex flex-col">
        <div className="mb-6 flex w-full cursor-pointer items-center justify-between">
          <Link to="/">홈</Link>
        </div>
        <div className="mb-20 flex w-full cursor-pointer items-center justify-between">
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
