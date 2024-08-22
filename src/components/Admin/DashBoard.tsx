import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenuitems from "./AdminMenuitems";
import AuthContext from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const DashBoard = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleHome = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex h-full w-full flex-col p-8">
      <div>
        <h1 className="my-12 px-4 text-xl">관리자 페이지</h1>
        <AdminMenuitems to="/admin/orderlist" title="주문 현황" />
        <AdminMenuitems to="/admin/inventory" title="상품 조회/수정" />
        <AdminMenuitems to="/admin/create" title="상품 등록" />
      </div>
      <div className="mt-auto flex flex-col">
        <Button
          variant="ghost"
          onClick={handleHome}
          className="mb-4 flex w-full cursor-pointer items-center justify-between text-base"
        >
          홈
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="mb-12 flex w-full cursor-pointer items-center justify-between text-base"
        >
          로그아웃
        </Button>
      </div>
    </div>
  );
};

export default DashBoard;
