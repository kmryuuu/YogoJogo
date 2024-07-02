import DashBoard from "@/components/Admin/DashBoard";
import { Outlet } from "react-router-dom";

const Orders = () => {
  return (
    <div className="flex h-[calc(100vh-80px)] min-h-screen">
      <div className="h-full w-1/4 bg-slate-50">
        <DashBoard />
      </div>
      <div className="h-full w-3/4 px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Orders;
